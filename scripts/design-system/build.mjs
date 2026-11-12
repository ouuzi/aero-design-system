/*
 * Builds the design guide from the code.
 *
 * The guide (a Claude artifact) is a published copy of this repository's design system.
 * Its source lives here:
 *
 *   theme.css                    the tokens (@theme, and the dark theme's overrides)
 *   src/components               the components (the bundle is built from src/, not dist/)
 *   design-system/               the guide's own text: README, Audit, reports, one README and
 *                                one preview.html per component, tokens.json (usage notes)
 *
 * `npm run guide:build` writes everything the guide needs into
 * `.design-system-dist/project/`, ready to publish:
 *
 *   tokens.json                  values refreshed from theme.css
 *   components/bundle.js         the kit, React and the preview icons as one script
 *   components/bundle.css        Tailwind output for the kit and the previews
 *   every text file from design-system/
 *
 * `npm run guide:check` (CI) fails when design-system/tokens.json and
 * theme.css disagree (in either theme), or when a kit component has no page in the guide.
 *
 * Publishing is not done here: it needs a Claude session (the Artifact tool). See
 * design-system/PUBLISHING.md.
 */
import { build } from 'esbuild';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const src = join(root, 'design-system');
const out = join(root, '.design-system-dist', 'project');
const NAMESPACE = 'AeroCompetenceHub';
const checkOnly = process.argv.includes('--check');

/* ------------------------------------------------------------------ tokens */

/** The text of the CSS block that starts at `selector {`, up to its closing brace. */
function cssBlock(css, selector) {
  const i = css.indexOf(`${selector} {`);
  if (i < 0) return '';
  return css.slice(i, css.indexOf('}', i));
}

/**
 * The tokens of theme.css, per theme. Light: the @theme block and :root (the elevation
 * values the shadows read, the control heights). Dark: light, overridden by the
 * `:root[data-theme="dark"]` block. A shadow (`var(--elevation-xs)`) is replaced by the value
 * it reads in that theme, so tokens.json holds real shadows.
 */
function readCssTokens() {
  const css = readFileSync(join(root, 'theme.css'), 'utf8');
  const read = (block, into, rename = (n) => n) => {
    for (const m of block.matchAll(/^\s*--([a-z0-9-]+):\s*([^;]+);(?:\s*\/\*\s*([^*]*?)\s*\*\/)?/gm)) {
      if (m[2].trim() === 'initial') continue;
      into.set(rename(m[1]), { value: m[2].trim(), comment: m[3] ?? into.get(rename(m[1]))?.comment });
    }
    return into;
  };
  const light = new Map();
  read(cssBlock(css, '@theme'), light);
  read(cssBlock(css, ':root'), light);
  read(cssBlock(css, '[data-density="comfortable"]'), light, (n) => `${n}-comfortable`);
  const dark = read(cssBlock(css, ':root[data-theme="dark"]'), new Map([...light].map(([k, v]) => [k, { ...v }])));
  for (const theme of [light, dark]) {
    for (const [name, token] of theme) {
      const alias = /^var\(--(elevation-[a-z]+)\)$/.exec(token.value);
      if (name.startsWith('shadow-') && alias && theme.has(alias[1])) token.value = theme.get(alias[1]).value;
    }
  }
  return { light, dark };
}

/** A CSS value in the form tokens.json stores: aliases as {name}, rgb(r g b / a) as rgba(). */
function toJsonValue(value) {
  const alias = /^var\(--([a-z0-9-]+)\)$/.exec(value);
  if (alias) return `{${alias[1]}}`;
  return value
    .replace(/var\(--([a-z0-9-]+)\)/g, '{$1}')
    .replace(/rgb\((\d+) (\d+) (\d+) \/ ([\d.]+)\)/g, 'rgba($1, $2, $3, $4)')
    .toLowerCase();
}

const norm = (v) => String(v).toLowerCase().replace(/\s+/g, '');

/** The themes tokens.json describes: light (the @theme values) and dark (data-theme="dark"). */
const THEMES = [
  { id: 'light', name: 'Light' },
  { id: 'dark', name: 'Dark' },
];

/**
 * Compares design-system/tokens.json with theme.css, for both themes. Colours and
 * shadows hold one value per theme ({ light, dark }); the other families have one value.
 * Returns the list of differences and, unless checking, the refreshed tokens object. Only
 * tokens the CSS defines are compared: spacing steps, radii and the type scale are
 * Tailwind's or prose, kept as written.
 */
function syncTokens() {
  const css = readCssTokens();
  const tokens = JSON.parse(readFileSync(join(src, 'tokens.json'), 'utf8'));
  const problems = [];
  const seen = new Set();
  const themed = (family) => family === 'color' || family === 'shadow';
  const wanted = (name) => Object.fromEntries(THEMES.map((t) => [t.id, toJsonValue(css[t.id].get(name).value)]));
  for (const family of ['color', 'shadow']) {
    const have = (tokens[family].themes ?? []).map((t) => t.id).join(',');
    if (have !== THEMES.map((t) => t.id).join(',')) {
      problems.push(`${family}.themes: tokens.json lists [${have}], theme.css has [${THEMES.map((t) => t.id).join(',')}]`);
      tokens[family].themes = THEMES;
    }
  }
  for (const [family, group] of Object.entries(tokens)) {
    if (!group || !Array.isArray(group.tokens)) continue;
    for (const token of group.tokens) {
      const cssToken = css.light.get(token.name);
      if (!cssToken) {
        if (themed(family)) problems.push(`${token.name}: in tokens.json but not in theme.css`);
        continue;
      }
      seen.add(token.name);
      if (themed(family)) {
        const want = wanted(token.name);
        const current = typeof token.value === 'object' && token.value ? token.value : { light: token.value };
        for (const { id } of THEMES) {
          if (norm(current[id]) !== norm(want[id])) problems.push(`${token.name} (${id}): tokens.json has ${current[id]}, theme.css has ${want[id]}`);
        }
        token.value = want;
        continue;
      }
      const want = toJsonValue(cssToken.value);
      if (norm(token.value) !== norm(want)) {
        problems.push(`${token.name}: tokens.json has ${token.value}, theme.css has ${cssToken.value}`);
        token.value = want;
      }
    }
  }
  // A colour or shadow the CSS defines and the guide does not list yet.
  for (const [name, cssToken] of css.light) {
    if (seen.has(name)) continue;
    const family = name.startsWith('color-') ? 'color' : name.startsWith('shadow-') ? 'shadow' : null;
    if (!family) continue;
    problems.push(`${name}: in theme.css but not in tokens.json`);
    tokens[family].tokens.push({ name, value: wanted(name), usage: cssToken.comment ?? 'Add a usage note.' });
  }
  return { tokens, problems };
}

/* -------------------------------------------------------------- components */

/** Folders under design-system/components: each is one page of the guide. */
function guideComponents() {
  return readdirSync(join(src, 'components'), { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== 'Cover')
    .map((d) => d.name)
    .sort();
}

/** Component files of the kit (src/components/*.tsx) with no page in the guide. */
function undocumentedKitFiles(documented) {
  // Kit files that are parts of another component's page, or not components.
  const PART_OF = { Command: 'Combobox', Popover: 'Combobox', StatusSymbol: 'StatusBadge', BrandMark: 'README (Iconography)' };
  const pages = new Set(documented);
  return readdirSync(join(root, 'src/components'))
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => f.replace(/\.tsx$/, ''))
    .filter((name) => !pages.has(name) && !PART_OF[name]);
}

/** Icons the previews use: `I.Name` or `ic('Name')`. */
function previewIcons(components) {
  const names = new Set(['Send', 'Info']);
  for (const name of [...components, 'Cover']) {
    const file = join(src, 'components', name, 'preview.html');
    if (!existsSync(file)) continue;
    const html = readFileSync(file, 'utf8');
    for (const m of html.matchAll(/\bI\.([A-Z][A-Za-z0-9]+)|\bic\('([A-Za-z0-9]+)'\)/g)) names.add(m[1] ?? m[2]);
  }
  return [...names].sort();
}

async function buildBundle(components) {
  const lucide = await import('lucide-react');
  const icons = previewIcons(components).filter((name) => {
    if (lucide[name]) return true;
    console.warn(`  icon ${name} is not in lucide-react: previews that use it draw nothing for it`);
    return false;
  });
  const entry = join(root, '.design-system-dist', 'entry.tsx');
  writeFileSync(
    entry,
    [
      "import * as React from 'react';",
      "import * as ReactDOM from 'react-dom';",
      "import * as ReactDOMClient from 'react-dom/client';",
      `import * as kit from ${JSON.stringify(join(root, 'src/index.ts'))};`,
      `import { ${icons.join(', ')} } from 'lucide-react';`,
      'const w = window as unknown as Record<string, unknown>;',
      'w.React = React;',
      'w.ReactDOM = { ...ReactDOM, ...ReactDOMClient };',
      `w.${NAMESPACE} = { ...kit, icons: { ${icons.join(', ')} } };`,
      '',
    ].join('\n'),
  );
  const header = `/* @ds-bundle: ${JSON.stringify({ format: 4, namespace: NAMESPACE, components: components.map((name) => ({ name })) })} */`;
  const result = await build({
    entryPoints: [entry],
    bundle: true,
    format: 'iife',
    minify: true,
    write: false,
    jsx: 'automatic',
    target: 'es2020',
    tsconfig: join(root, 'tsconfig.json'),
    define: { 'process.env.NODE_ENV': '"production"' },
    logLevel: 'warning',
  });
  let code = result.outputFiles[0].text;
  // The page inlines the script: these two sequences would end or comment out its tag.
  code = code.replaceAll('</script', '<\\/script').replaceAll('<!--', '<\\!--');
  writeFileSync(join(out, 'components/bundle.js'), `${header}\n${code}`);
  rmSync(entry);
  return { icons, bytes: code.length };
}

async function buildCss() {
  const input = [
    '@import "tailwindcss";',
    `@import "${join(root, 'theme.css')}";`,
    `@source "${join(root, 'src/components')}";`,
    `@source "${join(src, 'components')}";`,
    '',
  ].join('\n');
  // `base` is where Tailwind looks for classes by itself: point it at the guide so the
  // screens' classes stay out; the kit comes in through @source.
  const result = await postcss([tailwind({ base: src, optimize: { minify: false } })]).process(input, {
    from: join(root, 'design-system-bundle.css'),
  });
  const banner =
    '/* AeroCompetence Hub UI kit: Tailwind output of theme.css for src/components and the previews. Built by scripts/design-system/build.mjs. */\n';
  writeFileSync(join(out, 'components/bundle.css'), banner + result.css);
  return result.css.length;
}

/* -------------------------------------------------------------------- main */

const { tokens, problems } = syncTokens();
const components = guideComponents();
const undocumented = undocumentedKitFiles(components);

if (checkOnly) {
  const failures = [
    ...problems.map((p) => `token ${p}`),
    ...undocumented.map((name) => `src/components/${name}.tsx has no page: add design-system/components/${name}/README.md and preview.html`),
  ];
  if (failures.length) {
    console.error('The design guide is out of step with the code:\n' + failures.map((f) => `  - ${f}`).join('\n'));
    console.error('\nRun `npm run guide:build`, commit design-system/tokens.json, and publish (design-system/PUBLISHING.md).');
    process.exit(1);
  }
  console.log(`Design guide in step with the code: ${components.length} component pages, tokens match theme.css.`);
  process.exit(0);
}

rmSync(join(root, '.design-system-dist'), { recursive: true, force: true });
mkdirSync(join(out, 'components'), { recursive: true });
cpSync(src, out, { recursive: true, filter: (file) => !file.endsWith('PUBLISHING.md') && !file.includes(`${join(src, 'baselines')}`) });

if (problems.length) {
  console.log('tokens.json refreshed from theme.css:');
  for (const p of problems) console.log(`  - ${p}`);
  writeFileSync(join(src, 'tokens.json'), JSON.stringify(tokens, null, 2) + '\n');
}
writeFileSync(join(out, 'tokens.json'), JSON.stringify(tokens, null, 2) + '\n');

const bundle = await buildBundle(components);
const cssBytes = await buildCss();
console.log(
  `Built .design-system-dist/project: ${components.length} component pages, bundle.js ${Math.round(bundle.bytes / 1024)} KB ` +
    `(${bundle.icons.length} icons), bundle.css ${Math.round(cssBytes / 1024)} KB.`,
);
if (undocumented.length) console.log(`No page yet for: ${undocumented.join(', ')}`);
