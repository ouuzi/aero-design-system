/*
 * Builds dist/ from src/ with the TypeScript compiler: one ESM .js file and one .d.ts per
 * source file (modules preserved), 'use client' kept as each client file's first line.
 *
 *   node scripts/build.mjs           rebuild dist/ (commit it: consumers install without building)
 *   node scripts/build.mjs --check   fail if dist/ is not what src/ builds to (CI)
 *
 * After compiling it verifies the output: every file whose source starts with 'use client'
 * still starts with it, and every relative import names its .js file (Next and Vite resolve
 * ESM packages fully specified).
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function compile(outDir) {
  rmSync(outDir, { recursive: true, force: true });
  execFileSync(process.execPath, [join(root, 'node_modules/typescript/bin/tsc'), '-p', join(root, 'tsconfig.json'), '--outDir', outDir], {
    stdio: 'inherit',
  });
}

const CLIENT = /^(['"])use client\1;?/;

function verify(outDir) {
  const problems = [];
  let clientFiles = 0;
  for (const src of walk(join(root, 'src')).filter((f) => /\.tsx?$/.test(f) && !f.endsWith('.d.ts'))) {
    const rel = relative(join(root, 'src'), src).replace(/\.tsx?$/, '.js');
    const out = readFileSync(join(outDir, rel), 'utf8');
    if (CLIENT.test(readFileSync(src, 'utf8'))) {
      clientFiles++;
      if (!CLIENT.test(out)) problems.push(`${rel}: lost its 'use client' directive`);
    }
  }
  for (const file of walk(outDir).filter((f) => /\.(js|d\.ts)$/.test(f))) {
    const text = readFileSync(file, 'utf8');
    for (const m of text.matchAll(/(?:from|import)\s*\(?\s*['"](\.{1,2}\/[^'"]+)['"]/g)) {
      if (!m[1].endsWith('.js')) problems.push(`${relative(outDir, file)}: relative import '${m[1]}' has no .js extension`);
    }
  }
  if (problems.length) {
    console.error('dist/ is not usable:\n' + problems.map((p) => `  - ${p}`).join('\n'));
    process.exit(1);
  }
  return clientFiles;
}

if (checkOnly) {
  const tmp = mkdtempSync(join(tmpdir(), 'aero-ds-dist-'));
  compile(tmp);
  verify(tmp);
  const list = (dir) => walk(dir).map((f) => relative(dir, f)).sort();
  const want = list(tmp);
  const have = list(join(root, 'dist'));
  const stale = [
    ...want.filter((f) => !have.includes(f)).map((f) => `missing ${f}`),
    ...have.filter((f) => !want.includes(f)).map((f) => `extra ${f}`),
    ...want.filter((f) => have.includes(f) && readFileSync(join(tmp, f), 'utf8') !== readFileSync(join(root, 'dist', f), 'utf8')).map((f) => `changed ${f}`),
  ];
  rmSync(tmp, { recursive: true, force: true });
  if (stale.length) {
    console.error(`dist/ is stale (${stale.length} file(s)):\n${stale.slice(0, 20).map((s) => `  - ${s}`).join('\n')}`);
    console.error('\nRun `npm run build` and commit dist/.');
    process.exit(1);
  }
  console.log(`dist/ is up to date with src/ (${want.length} files).`);
} else {
  const out = join(root, 'dist');
  compile(out);
  const clientFiles = verify(out);
  console.log(`Built dist/: ${walk(out).length} files, ${clientFiles} with 'use client' kept.`);
}
