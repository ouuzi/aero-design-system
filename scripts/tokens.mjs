/*
 * Generates tokens.css and tokens.json from theme.css (the one source of truth).
 *
 *   node scripts/tokens.mjs           write tokens.css and tokens.json
 *   node scripts/tokens.mjs --check   fail if they are out of date (CI, npm test)
 *
 * theme.css is the Tailwind v4 entry; tokens.css is the same tokens as plain CSS custom
 * properties (light on :root, dark under data-theme="dark", the light pin, comfortable
 * density), usable with no build tool. tokens.json holds every token's light and dark value
 * (aliases resolved) for tools that do not read CSS.
 *
 * Radii and the spacing unit are Tailwind's defaults (theme.css does not change them); they are
 * copied from the installed tailwindcss so plain-CSS apps get the same values.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const checkOnly = process.argv.includes('--check');

/** The body of the first block that starts with `selector {` (no nested braces inside). */
export function cssBlock(css, selector) {
  const i = css.indexOf(`${selector} {`);
  if (i < 0) return '';
  return css.slice(i + selector.length + 2, css.indexOf('}', i));
}

/** `--name: value; /* comment *\/` declarations of a block, in order. Values of `initial` are skipped. */
export function declarations(block) {
  const out = [];
  for (const m of block.matchAll(/^\s*--([a-z0-9-]+):\s*([^;]+);(?:[ \t]*\/\*\s*([\s\S]*?)\s*\*\/)?/gm)) {
    if (m[2].trim() === 'initial') continue;
    out.push({ name: m[1], value: m[2].trim(), comment: m[3]?.replace(/\s+/g, ' ') });
  }
  return out;
}

/** The token sets of theme.css. */
export function readTheme(css = readFileSync(join(root, 'theme.css'), 'utf8')) {
  const themeBlock = cssBlock(css, '@theme');
  const inline = cssBlock(css, '@theme inline');
  const rootBlock = cssBlock(css, ':root');
  const comfortable = cssBlock(css, '[data-density="comfortable"]');
  const dark = cssBlock(css, ':root[data-theme="dark"]');
  const lightPin = cssBlock(css, '[data-theme="light"]');
  const colorScheme = (block) => /color-scheme:\s*([a-z]+)/.exec(block)?.[1];
  return {
    light: [...declarations(themeBlock), ...declarations(rootBlock), ...declarations(inline)],
    comfortable: declarations(comfortable),
    dark: declarations(dark),
    lightPin: declarations(lightPin),
    scheme: { light: colorScheme(rootBlock), dark: colorScheme(dark), lightPin: colorScheme(lightPin) },
  };
}

/** Radii and the spacing unit from Tailwind's own defaults. */
function tailwindDefaults() {
  const css = readFileSync(join(dirname(require.resolve('tailwindcss/package.json')), 'theme.css'), 'utf8');
  return declarations(cssBlock(css, '@theme default')).filter((d) => /^radius-/.test(d.name) || d.name === 'spacing');
}

const decl = (d, pad = '  ') => `${pad}--${d.name}: ${d.value};`;

export function buildTokensCss(t, defaults) {
  return [
    '/*',
    ' * aero-design-system/tokens.css: the design tokens as plain CSS custom properties, for pages',
    ' * built without Tailwind. GENERATED from theme.css by scripts/tokens.mjs: do not edit.',
    ' *',
    ' *   <link rel="stylesheet" href="tokens.css">',
    ' *   .panel { background: var(--color-surface); color: var(--color-ink); box-shadow: var(--shadow-xs); }',
    ' *',
    ' * Dark: data-theme="dark" on <html> (screen only; print stays light). Light pin:',
    ' * data-theme="light" on an element. Comfortable density: data-density="comfortable".',
    ' * --font-sans reads --font-inter: define it where Inter is loaded, e.g.',
    ' * :root { --font-inter: "Inter"; }',
    ' */',
    ':root {',
    `  color-scheme: ${t.scheme.light};`,
    ...t.light.map((d) => decl(d)),
    '  /* Tailwind defaults the system uses as they are */',
    ...defaults.map((d) => decl(d)),
    '}',
    '[data-density="comfortable"] {',
    ...t.comfortable.map((d) => decl(d)),
    '}',
    '@media screen {',
    '  :root[data-theme="dark"] {',
    `    color-scheme: ${t.scheme.dark};`,
    ...t.dark.map((d) => decl(d, '    ')),
    '  }',
    '}',
    '[data-theme="light"] {',
    `  color-scheme: ${t.scheme.lightPin};`,
    ...t.lightPin.map((d) => decl(d)),
    '}',
    '',
  ].join('\n');
}

/** Resolves var(--x) against a map of values, recursively. */
function resolveValue(value, values, depth = 0) {
  if (depth > 10) return value;
  return value.replace(/var\(--([a-z0-9-]+)\)/g, (whole, name) => (values.has(name) ? resolveValue(values.get(name), values, depth + 1) : whole));
}

export function buildTokensJson(t, defaults) {
  const light = new Map([...t.light, ...defaults].map((d) => [d.name, d.value]));
  const dark = new Map(light);
  for (const d of t.dark) dark.set(d.name, d.value);
  const comfortable = new Map(t.comfortable.map((d) => [d.name, d.value]));
  const darkNames = new Set(t.dark.map((d) => d.name));
  const tokens = {};
  for (const d of [...t.light, ...defaults]) {
    const entry = {};
    const alias = /^var\(--([a-z0-9-]+)\)$/.exec(d.value)?.[1];
    if (alias) entry.alias = alias;
    const l = resolveValue(d.value, light);
    const k = resolveValue(dark.get(d.name), dark);
    if (l !== k || darkNames.has(d.name)) entry.value = { light: l, dark: k };
    else entry.value = l;
    if (comfortable.has(d.name)) entry.comfortable = comfortable.get(d.name);
    if (d.comment) entry.usage = d.comment;
    tokens[d.name] = entry;
  }
  return (
    JSON.stringify(
      {
        name: 'aero-design-system',
        generated: 'GENERATED from theme.css by scripts/tokens.mjs: do not edit.',
        themes: ['light', 'dark'],
        selectors: { dark: ':root[data-theme="dark"] (screen only)', lightPin: '[data-theme="light"]', comfortable: '[data-density="comfortable"]' },
        tokens,
      },
      null,
      2,
    ) + '\n'
  );
}

function main() {
  const t = readTheme();
  const defaults = tailwindDefaults();
  const outputs = { 'tokens.css': buildTokensCss(t, defaults), 'tokens.json': buildTokensJson(t, defaults) };
  const stale = [];
  for (const [file, text] of Object.entries(outputs)) {
    let current = '';
    try {
      current = readFileSync(join(root, file), 'utf8');
    } catch {
      // missing: stale
    }
    if (current !== text) stale.push(file);
    if (!checkOnly && current !== text) writeFileSync(join(root, file), text);
  }
  if (checkOnly) {
    if (stale.length) {
      console.error(`${stale.join(' and ')} out of date with theme.css. Run \`npm run tokens\` and commit.`);
      process.exit(1);
    }
    console.log(`tokens.css and tokens.json match theme.css (${Object.keys(JSON.parse(outputs['tokens.json']).tokens).length} tokens).`);
    return;
  }
  console.log(stale.length ? `Wrote ${stale.join(', ')}.` : 'tokens.css and tokens.json already up to date.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
