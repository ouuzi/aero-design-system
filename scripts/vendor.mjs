#!/usr/bin/env node
/*
 * Copies a release of aero-design-system into an app, as vendor/aero-design-system, for builds
 * that cannot fetch a private git dependency. Run it from a clone of this repository:
 *
 *   node scripts/vendor.mjs ../my-app                 the working tree as it is
 *   node scripts/vendor.mjs ../my-app --ref v0.1.0    a tagged release (recommended)
 *   node scripts/vendor.mjs ../my-app --ref v0.1.0 --dir third_party/aero-design-system
 *
 * It copies exactly what `npm pack` would publish (package.json "files", plus package.json),
 * replacing the folder, and writes VENDORED.json with the ref and commit it came from. Then, in
 * the app:
 *
 *   npm install ./vendor/aero-design-system     (adds "aero-design-system": "file:vendor/aero-design-system")
 *
 * and commit the vendor folder with the app.
 */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const option = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const app = args.find((a, i) => !a.startsWith('--') && !['--ref', '--dir'].includes(args[i - 1]));
const ref = option('--ref');
const dir = option('--dir') ?? 'vendor/aero-design-system';

if (!app || !existsSync(join(app, 'package.json'))) {
  console.error('Usage: node scripts/vendor.mjs <path to the app> [--ref vX.Y.Z] [--dir vendor/aero-design-system]');
  console.error('The app folder must hold a package.json.');
  process.exit(1);
}

const git = (...a) => execFileSync('git', ['-C', repo, ...a], { encoding: 'utf8' }).trim();

let source = repo;
let tmp;
let commit = 'working tree';
if (ref) {
  commit = git('rev-parse', `${ref}^{commit}`);
  tmp = mkdtempSync(join(tmpdir(), 'aero-ds-vendor-'));
  // git archive | tar -x: the files of that commit, nothing from the working tree.
  const archive = execFileSync('git', ['-C', repo, 'archive', '--format=tar', commit], { maxBuffer: 512 * 1024 * 1024 });
  execFileSync('tar', ['-x', '-C', tmp], { input: archive });
  source = tmp;
} else {
  const dirty = git('status', '--porcelain');
  if (dirty) console.warn('Warning: the working tree has uncommitted changes; they are copied too. Use --ref for a release.');
  try {
    commit = git('rev-parse', 'HEAD');
  } catch {
    // no commits yet
  }
}

const pkg = JSON.parse(readFileSync(join(source, 'package.json'), 'utf8'));
const target = resolve(app, dir);
rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
let copied = 0;
for (const entry of ['package.json', ...pkg.files]) {
  const from = join(source, entry);
  if (!existsSync(from)) {
    console.error(`${entry} is listed in package.json "files" but missing at ${ref ?? 'the working tree'}. Was dist/ built and committed?`);
    process.exit(1);
  }
  mkdirSync(dirname(join(target, entry)), { recursive: true });
  cpSync(from, join(target, entry), { recursive: true });
  copied++;
}
// npm links a file: dependency and would install its devDependencies (TypeScript, ESLint,
// Tailwind…) into the app. The copy needs none of them, nor this repository's scripts.
const vendoredPkg = { ...pkg };
delete vendoredPkg.devDependencies;
delete vendoredPkg.scripts;
writeFileSync(join(target, 'package.json'), JSON.stringify(vendoredPkg, null, 2) + '\n');
writeFileSync(join(target, 'VENDORED.json'), JSON.stringify({ name: pkg.name, version: pkg.version, ref: ref ?? null, commit }, null, 2) + '\n');
if (tmp) rmSync(tmp, { recursive: true, force: true });

console.log(`Copied ${pkg.name}@${pkg.version} (${ref ?? 'working tree'}, ${commit.slice(0, 12)}) into ${target} (${copied} entries).`);
console.log(`Next, in ${resolve(app)}:\n  npm install ./${dir.replace(/\\/g, '/')}\n  git add ${dir} package.json package-lock.json`);
