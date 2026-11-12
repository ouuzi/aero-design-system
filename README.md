# aero-design-system

The design system of AeroCompetence Hub, as one package that every Aero app installs: the
colours, type, spacing and shadows (the **tokens**), the React **components** built from them,
and the **lint rules** that keep screens on them. The design guide (a Claude artifact,
https://claude.ai/artifact/XTxgkVMxQs6MwcnngcSETc) is built from this repository.

It is private. Apps install it straight from GitHub (or from a copy in their own repository),
never from the npm registry.

## Contents

- [The two layers](#the-two-layers)
- [Install](#install) (Next.js, Vite, plain HTML)
- [Fonts](#fonts)
- [Dark theme](#dark-theme)
- [Density](#density)
- [Lint](#lint)
- [Updating an app to a new version](#updating-an-app-to-a-new-version)
- [Changing the design system and releasing](#changing-the-design-system-and-releasing)
- [What is in this repository](#what-is-in-this-repository)

## The two layers

| Layer | Files | Needs | Used by |
|---|---|---|---|
| **Tokens** | `theme.css` (Tailwind v4), `tokens.css` (plain CSS variables), `tokens.json` | nothing (Tailwind v4 for `theme.css`) | every app, including ones without React or Tailwind |
| **Components** | `import { Button, … } from 'aero-design-system'`, recipes from `aero-design-system/styles` | React 19 and Tailwind v4 | React apps |

`theme.css` is the **one source of truth** for the tokens. `tokens.css` and `tokens.json` are
generated from it (`npm run tokens`), and the tests fail if they drift.

Entry points:

| Import | What it is |
|---|---|
| `aero-design-system` | every component, `cn`, `DensityProvider`, `ThemeProvider`, `getThemeInitScript`, `formatDate`… |
| `aero-design-system/styles` | the class recipes (`pageShell`, `focusRing`, `buttonClass`…); safe in a server component |
| `aero-design-system/theme.css` | the Tailwind v4 theme: import it once, after `tailwindcss` |
| `aero-design-system/tokens.css` | the same tokens as plain CSS custom properties |
| `aero-design-system/tokens.json` | every token's light and dark value, for tools |
| `aero-design-system/eslint` | the lint rules as a flat config |

## Install

There are two ways to get the package into an app. Pick one per app.

### Route A: a git dependency (recommended when the build can reach GitHub)

```bash
npm install github:ouuzi/aero-design-system#v0.1.0
```

This writes `"aero-design-system": "github:ouuzi/aero-design-system#v0.1.0"` in `package.json`.
The compiled files (`dist/`) are committed in this repository, so nothing is built on install.

Because the repository is private, the machine that runs `npm install` needs read access:

- **Your laptop:** works if `git clone https://github.com/ouuzi/aero-design-system` works.
- **GitHub Actions:** the default `GITHUB_TOKEN` cannot read another private repository. Create a
  fine-grained token (read-only, "Contents" on `ouuzi/aero-design-system`), save it as the secret
  `AERO_DS_TOKEN` in the app's repository, and add this step before `npm ci`:

  ```yaml
  - run: git config --global url."https://x-access-token:${{ secrets.AERO_DS_TOKEN }}@github.com/".insteadOf "https://github.com/"
  ```
- **Firebase App Hosting:** its build runs `npm ci` on Google Cloud Build, which has no GitHub
  credentials for a private dependency. Use route B for apps deployed there, unless you set up
  credentials in the build yourself.

### Route B: a vendored copy (works everywhere)

Copy a release into the app's repository and install it from there:

```bash
git clone https://github.com/ouuzi/aero-design-system ../aero-design-system   # once
node ../aero-design-system/scripts/vendor.mjs . --ref v0.1.0
npm install ./vendor/aero-design-system
git add vendor/aero-design-system package.json package-lock.json
```

`package.json` then says `"aero-design-system": "file:vendor/aero-design-system"`.

| | Route A: git dependency | Route B: vendored copy |
|---|---|---|
| Build needs GitHub access | yes (a token in CI) | no |
| Firebase App Hosting | needs extra setup | works as is |
| Update | change the tag, `npm install` | rerun `vendor.mjs` with the new tag |
| Repository size | unchanged | about 0.5 MB more per app |
| Risk | a deleted tag breaks installs | someone may edit the copy by hand (don't: `VENDORED.json` says where it came from) |

### Next.js (15 or 16)

1. Install (route A or B above), then the peer dependencies if the app lacks them:

   ```bash
   npm install react@^19 react-dom@^19 tailwindcss@^4 @tailwindcss/postcss@^4
   ```
2. In `app/globals.css`, at the top:

   ```css
   @import "tailwindcss";
   @import "aero-design-system/theme.css";
   ```
   That is the only CSS import. It brings the tokens, the dark theme, density, the animations
   (`tw-animate-css`) and tells Tailwind to scan the kit's own files.
3. Fonts: see [Fonts](#fonts) (`next/font` with `variable: '--font-inter'`).
4. Use it:

   ```tsx
   import { Button, Card, StatusBadge } from 'aero-design-system';
   ```
   Components that need the browser carry `'use client'` themselves, so a server page can render
   them. For recipes in a server component, import from `aero-design-system/styles`.
5. Mount the providers once (a client component around the app), as needed:
   `TooltipProvider` (needed for tooltips), `ToastProvider` (for `useToast`), `ThemeProvider` and
   `DensityProvider` (below).

### Vite + React 19

1. Install the package (route A or B), then:

   ```bash
   npm install react@^19 react-dom@^19 tailwindcss@^4 @tailwindcss/vite@^4
   ```
2. `vite.config.ts`:

   ```ts
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';
   import tailwindcss from '@tailwindcss/vite';

   export default defineConfig({ plugins: [react(), tailwindcss()] });
   ```
3. `src/index.css` (imported once from `main.tsx`):

   ```css
   @import "tailwindcss";
   @import "aero-design-system/theme.css";
   ```
4. Fonts: see [Fonts](#fonts). `'use client'` lines in the kit are ignored by Vite.

### Plain HTML (no build tool, no Tailwind)

For an app like procurement-planner: copy `tokens.css` next to your pages (from
`node_modules/aero-design-system/tokens.css`, or from a release:
`https://github.com/ouuzi/aero-design-system/blob/v0.1.0/tokens.css`) and link it:

```html
<link rel="stylesheet" href="/static/tokens.css">
<style>
  :root { --font-inter: "Inter"; }
  body { font-family: var(--font-sans); background: var(--color-canvas); color: var(--color-ink); }
  .panel { background: var(--color-surface); border: 1px solid var(--color-line); border-radius: var(--radius-xl); box-shadow: var(--shadow-xs); }
</style>
```

Every token is a variable with the same name as in `theme.css`: `--color-ink`, `--color-surface`,
`--text-13`, `--shadow-popover`, `--control-md`, `--radius-lg`… `tokens.json` lists them with
their light and dark values and what each is for.

## Fonts

The type is Inter. `theme.css` sets `--font-sans: var(--font-inter), -apple-system, …`, so the
app must define `--font-inter`. **If it does not, the font family is invalid and text falls
back to the browser's default font**, so this step is not optional.

Next.js (`app/layout.tsx`):

```tsx
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
// <html className={inter.variable}> … <body className="font-sans bg-canvas text-ink antialiased">
```

Vite or plain HTML: load Inter yourself and name it. With the npm package `@fontsource-variable/inter`:

```bash
npm install @fontsource-variable/inter
```

```ts
// main.tsx
import '@fontsource-variable/inter';
```

```css
/* index.css, after the two imports */
:root { --font-inter: "Inter Variable"; }
```

Or with a self-hosted file (as aerobalancepro does):

```css
@font-face { font-family: "Inter"; src: url("./fonts/Inter-latin.woff2") format("woff2"); font-weight: 100 900; font-display: swap; }
:root { --font-inter: "Inter"; }
```

## Dark theme

Dark is the same tokens with other values, switched by `data-theme="dark"` on `<html>`. Nothing
else changes: write `bg-surface`, `text-ink`, `text-on-solid` and the components follow. It never
follows the operating system, and print is always light.

To give people a switch, wrap the app in `ThemeProvider` and add the no-flash script to `<head>`:

```tsx
import { ThemeProvider, useTheme, getThemeInitScript } from 'aero-design-system';

// <head>: applies the last-used theme before the first paint
<script dangerouslySetInnerHTML={{ __html: getThemeInitScript('myapp_theme_v1') }} />

// around the app (a client component); userId undefined while sign-in is still loading
<ThemeProvider userId={user?.uid} storageKey="myapp_theme_v1">{children}</ThemeProvider>

// anywhere below it
const { theme, setTheme } = useTheme();
```

In Next, add `suppressHydrationWarning` to `<html>` (the script may set `data-theme` before React
hydrates). In plain HTML, set the attribute yourself:
`document.documentElement.dataset.theme = 'dark'`.

`storageKey` is the localStorage prefix: the choice is stored as `${storageKey}_${userId}`, and
the last one used in this browser as `${storageKey}_last`. Use one key per app, and never change
it once people have chosen (they would lose their setting). Default: `aero_theme_v1`.

A subtree that must stay light (paper shown on screen) takes `data-theme="light"`.

## Density

Two densities: the dense desktop default, and comfortable for tablets and gloved hands
(controls 36 to 48px, 15px body text). It is `data-density="comfortable"` on `<html>`:

```tsx
import { DensityProvider, useDensity } from 'aero-design-system';

<DensityProvider userId={user?.uid} storageKey="myapp_density_v1">{children}</DensityProvider>

const { density, setDensity } = useDensity(); // 'default' | 'comfortable'
```

Without a stored choice, touch screens start comfortable. Key: `${storageKey}_${userId ?? 'anonymous'}`;
default prefix `aero_density_v1`.

## Lint

The rules catch colours, sizes and shadows outside the system, white and black (use `surface`
and `on-solid`), the spacing scale, retired classes, and hand-built controls where a kit
component exists (a raw `<button>`, `<select>`, `<table>`, `window.confirm`…). In
`eslint.config.mjs`, after your framework config (it sets the parser):

```js
import next from 'eslint-config-next';
import { designSystem, ALLOWED_ALPHA } from 'aero-design-system/eslint';

export default [
  ...next,
  ...designSystem({
    files: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
    ignores: ['app/api/**'],
    // optional, per app:
    rawButtonFiles: ['app/error.tsx', 'app/global-error.tsx'],      // may keep a raw <button>
    whiteBlackFiles: ['components/PdfViewer.tsx'],                   // may use white and black
    printFormFiles: ['components/PrintedCard.tsx'],                  // paper replicas: print sizes, no kit required
    allowAlpha: [...ALLOWED_ALPHA],                                  // token/opacity pairs allowed
    kitImport: 'aero-design-system',                                 // the import named in messages
  }),
];
```

```bash
npx eslint .
```

Silence one line only with a reason:
`// eslint-disable-next-line ds/prefer-kit-components -- why`. A new app that is not on the
system yet will show many errors: see [MIGRATING.md](MIGRATING.md).

## Updating an app to a new version

Read [CHANGELOG.md](CHANGELOG.md) for the version first ("Breaking" lists what an app must change).

Route A:

```bash
npm install github:ouuzi/aero-design-system#v0.2.0
npm run build && npx eslint .
```

Route B:

```bash
git -C ../aero-design-system fetch --tags
node ../aero-design-system/scripts/vendor.mjs . --ref v0.2.0
npm install ./vendor/aero-design-system
npm run build && npx eslint .
```

## Changing the design system and releasing

All changes happen in this repository, never in an app's copy.

```bash
git clone https://github.com/ouuzi/aero-design-system && cd aero-design-system
npm ci
```

1. Change what you need:
   - a colour or other token: `theme.css` (then `npm run tokens` regenerates `tokens.css` and `tokens.json`);
   - a component: `src/components/` (export it from `src/index.ts`);
   - its page in the guide: `design-system/components/<Name>/` (see `design-system/PUBLISHING.md`).
2. Check everything:

   ```bash
   npm run tokens          # tokens.css and tokens.json from theme.css
   npm run build           # dist/ from src/
   npm run typecheck
   npm run lint
   npm test
   npm run guide:build && npm run guide:previews   # the previews in a Claude session (needs Playwright)
   ```
   If a preview changed on purpose, look at it, then accept it with
   `node scripts/design-system/check-previews.cjs --update` and commit the new baselines.
3. Bump the version in `package.json` (`0.1.0` to `0.1.1` for a fix, `0.2.0` for anything an app
   must change), add a section to `CHANGELOG.md`, commit **including `dist/`**, tag and push:

   ```bash
   npm version 0.2.0 --no-git-tag-version
   npm run build
   git add -A && git commit -m "Release 0.2.0"
   git tag v0.2.0
   git push origin main v0.2.0
   ```
4. Publish the guide from a Claude session (`design-system/PUBLISHING.md`).
5. Update each app (above).

CI (`.github/workflows/ci.yml`) fails when `dist/` was not rebuilt after a change to `src/`, when
`tokens.css` / `tokens.json` drift from `theme.css`, when the guide's token list or component
pages fall behind, and when a tag does not match `package.json`'s version.

## What is in this repository

```
theme.css            the tokens (source of truth) and Tailwind setup
tokens.css           generated: plain CSS variables
tokens.json          generated: values for tools
src/                 the kit (components/), its helpers (lib/), the index
dist/                generated, committed: what apps import
eslint/              the lint plugin (plugin.mjs) and shareable config (index.mjs)
design-system/       the design guide: text, previews, baselines, tokens.json with usage notes
scripts/             build, tokens, vendor, and the guide's build and preview check
tests/               token contrast (both themes), lint rules, kit and package checks
```

React 18 and Tailwind 3 apps (studio) cannot use the components or `theme.css` yet; they can
use `tokens.css`. See MIGRATING.md.
