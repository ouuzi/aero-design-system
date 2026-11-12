/*
 * The package itself: one source of truth for the tokens, the shipped files and the entry
 * points, and the shareable lint config. Runs on the compiled tests (npm test).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const read = (file: string) => readFileSync(join(root, file), 'utf8');
const importEsm = new Function('specifier', 'return import(specifier)') as (specifier: string) => Promise<any>;
const pkg = JSON.parse(read('package.json'));

test('tokens: tokens.css and tokens.json are generated from theme.css and have not drifted', () => {
  // Throws (exit 1) when either generated file differs from what theme.css gives.
  execFileSync(process.execPath, [join(root, 'scripts/tokens.mjs'), '--check'], { stdio: 'pipe' });
  const css = read('tokens.css');
  const json = JSON.parse(read('tokens.json'));
  assert.match(css, /GENERATED from theme\.css/);
  assert.match(css, /:root \{[^}]*--color-ink: #16202e;/);
  assert.match(css, /:root\[data-theme="dark"\] \{[^}]*--color-ink: #e6e9ee;/);
  assert.match(css, /\[data-density="comfortable"\] \{[^}]*--control-md: 44px;/);
  assert.deepEqual(json.tokens['color-ink'].value, { light: '#16202e', dark: '#e6e9ee' });
  assert.deepEqual(json.tokens['color-subtle'].value, { light: '#f4f6f8', dark: '#18202c' });
  assert.equal(json.tokens['control-md'].comfortable, '44px');
  // tokens.css needs no build tool: no Tailwind at-rules.
  assert.doesNotMatch(css, /@(?:theme|source|custom-variant|import|apply)\b/);
});

test('theme.css: one import for an app, scanning the shipped kit', () => {
  const css = read('theme.css');
  assert.doesNotMatch(css, /^@import "tailwindcss"/m, 'the app imports tailwindcss itself, before theme.css');
  assert.match(css, /@source "\.\/dist";/);
  assert.match(css, /@import "tw-animate-css"/);
  // Nothing of one app's own: no screen-only helpers.
  assert.doesNotMatch(css, /row-hover-group|inline-action/);
});

test('package.json: entry points, shipped files and side effects', () => {
  for (const entry of ['.', './styles', './theme.css', './tokens.css', './tokens.json', './eslint']) {
    assert.ok(pkg.exports[entry], `exports ${entry}`);
  }
  const targets = Object.values(pkg.exports).flatMap((t: any) => (typeof t === 'string' ? [t] : Object.values(t))) as string[];
  for (const t of targets) assert.ok(existsSync(join(root, t)), `${t} exists`);
  for (const t of targets) {
    const top = t.replace(/^\.\//, '').split('/')[0];
    assert.ok(top === 'package.json' || pkg.files.some((f: string) => f === top || f.startsWith(`${top}/`) || t.endsWith(f)), `${t} is in files`);
  }
  assert.deepEqual(pkg.sideEffects, ['*.css']);
  assert.match(pkg.peerDependencies.react, />=19/);
  assert.match(pkg.peerDependencies.tailwindcss, /\^4/);
});

test('dist: every client module keeps its directive, every relative import its .js', () => {
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]));
  let client = 0;
  for (const src of walk(join(root, 'src')).filter((f) => /\.tsx?$/.test(f))) {
    const out = src.replace(`${join(root, 'src')}`, join(root, 'dist')).replace(/\.tsx?$/, '.js');
    assert.ok(existsSync(out), out);
    if (/^'use client'/.test(readFileSync(src, 'utf8'))) {
      client++;
      assert.match(readFileSync(out, 'utf8'), /^'use client';/, out);
    }
  }
  assert.ok(client >= 20, `${client} client modules`);
  // A module that calls hooks or creates a context is client code: without the directive, a
  // server component that imports the index fails in Next when the package is not under
  // node_modules (a vendored copy is a symlink to vendor/, compiled as app code).
  for (const src of walk(join(root, 'src')).filter((f) => /\.tsx?$/.test(f))) {
    const text = readFileSync(src, 'utf8');
    if (/\b(?:React\.)?(?:use(?:State|Effect|LayoutEffect|Ref|Id|Context|Callback|Memo|SyncExternalStore|Reducer)\(|createContext\()/.test(text)) {
      assert.match(text, /^'use client';/, `${src} uses hooks: it needs 'use client'`);
    }
  }
  // The entry points a server component imports carry no directive.
  for (const file of ['dist/index.js', 'dist/components/styles.js', 'dist/lib/themeScript.js', 'dist/lib/utils.js']) {
    assert.doesNotMatch(read(file), /^['"]use client['"]/, file);
  }
  // No Next-only imports: the kit runs in Vite apps too.
  for (const file of walk(join(root, 'dist')).filter((f) => f.endsWith('.js'))) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /from ['"]next\//, file);
  }
});

test('eslint: the shareable config carries the three rules and the per-app options', async () => {
  const mod = await importEsm(pathToFileURL(join(root, 'eslint/index.mjs')).href);
  const configs = mod.designSystem({
    files: ['app/**/*.tsx'],
    ignores: ['app/api/**'],
    rawButtonFiles: ['app/error.tsx'],
    whiteBlackFiles: ['viewer.tsx', 'card.tsx'],
    printFormFiles: ['card.tsx'],
  });
  assert.deepEqual(Object.keys(configs[0].rules).sort(), ['ds/no-off-system-classes', 'ds/no-retired-classes', 'ds/prefer-kit-components']);
  assert.deepEqual(configs[0].ignores, ['app/api/**']);
  const forFile = (file: string) => configs.find((c: { files?: string[] }) => c.files?.length === 1 && c.files[0] === file);
  assert.deepEqual(forFile('card.tsx').rules['ds/no-off-system-classes'][1], { allowAlpha: mod.ALLOWED_ALPHA, allowPrintSizes: true, allowWhiteBlack: true });
  assert.equal(forFile('card.tsx').rules['ds/prefer-kit-components'], 'off');
  assert.deepEqual(forFile('viewer.tsx').rules['ds/no-off-system-classes'][1], { allowAlpha: mod.ALLOWED_ALPHA, allowWhiteBlack: true });
  assert.equal(forFile('app/error.tsx').rules['ds/prefer-kit-components'][1].allowRawButton, true);

  // Run it: bg-white and a raw <button> fail, naming the package as the place to import from.
  const { Linter } = await importEsm('eslint');
  const tsParser = (await importEsm('typescript-eslint')).parser;
  const linter = new Linter({ configType: 'flat' });
  const messages = linter.verify(
    'export const X = () => <div className="bg-white"><button onClick={go}>Go</button></div>;',
    [{ files: ['**/*.tsx'], languageOptions: { parser: tsParser, parserOptions: { ecmaFeatures: { jsx: true } } } }, ...mod.designSystem({ files: ['**/*.tsx'] })],
    'screen.tsx',
  );
  assert.equal(messages.length, 2, JSON.stringify(messages));
  assert.match(messages.find((m: any) => m.ruleId === 'ds/no-off-system-classes').message, /"bg-white" is white.*bg-surface/);
  assert.match(messages.find((m: any) => m.ruleId === 'ds/prefer-kit-components').message, /Hand-built <button>\. Use <Button> from 'aero-design-system'/);
  // A deep import into the package is a kit file imported by path.
  const deep = linter.verify("import { Button } from 'aero-design-system/dist/components/Button.js';", mod.recommended, 'a.ts');
  assert.match(deep[0]?.message ?? '', /Import it from 'aero-design-system'/);
});
