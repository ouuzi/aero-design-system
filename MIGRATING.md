# Moving an app onto aero-design-system

This is the checklist for an app adopting the package: first the general steps, then the rules
the lint will start enforcing (taken from the design audit of AeroMetric-Control), then what
each Aero app needs, and last the exact change for AeroMetric-Control, the first consumer.

## 1. General steps

1. Install the package (README, "Install": route A or B) and set up the CSS and the font:

   ```css
   @import "tailwindcss";
   @import "aero-design-system/theme.css";
   ```
   and define `--font-inter` (README, "Fonts").
2. Remove what the package now provides: your own copy of the tokens (`@theme` colours, the
   type scale, shadows), a copy of the kit, `tw-animate-css` imports, a copied `cn()`.
3. Turn the lint on (README, "Lint") and run it once to see the size of the job:

   ```bash
   npx eslint . -f unix | wc -l
   ```
4. Fix screen by screen, using the rules below. Commit in small steps; `npm run build` after each.
5. Turn dark on only after every screen uses role tokens (`surface`, `on-solid`, `canvas`…).

**The colour lock.** `theme.css` removes Tailwind's default palette (`--color-*: initial`), so
`bg-gray-100`, `text-blue-600` and friends stop compiling the moment you import it: those
elements lose their colour (they do not error). The lint lists every one. If an app needs time,
it can define the colours it still uses in its own `@theme` block **after** the import and
remove them screen by screen; never edit `theme.css` itself.

## 2. The rules (what the lint asks for, and what to write instead)

| Instead of | Write | Why |
|---|---|---|
| `bg-white` on a panel, card, input or popover | `bg-surface` | white stays white in dark; surface turns navy-grey |
| `text-white` on a solid fill (primary button, avatar, count) | `text-on-solid` | on-solid turns near-black in dark, where solid fills turn pale |
| `bg-black/40` behind a dialog | `bg-scrim` (or use `ModalShell`) | the backdrop is a token, darker in dark |
| `text-gray-500`, `bg-slate-50`, `border-gray-200` | `text-muted`, `bg-subtle` / `bg-canvas`, `border-line` | the default palette is removed |
| `text-[#001e40]`, `bg-[#f5f5f5]` | a token (`text-brand`, `bg-subtle`) | no arbitrary colours |
| `text-xs`, `text-sm`, `text-lg`, `text-[9px]` | `text-12`, `text-13`, `text-18` (the scale: 11, 12, 13, 14, 15, 16, 18, 22, 32) | one type scale |
| `font-bold`, `font-light` | `font-semibold`, `font-normal`, `font-medium` | three weights |
| `shadow`, `shadow-sm`, `shadow-lg` | `shadow-xs` (cards, controls), `shadow-popover`, `shadow-modal` | three elevations |
| `border-line/60`, `bg-ink/5` | the token at full strength, or its `-bg` / `-line` partner | no faded shades |
| `p-3.5`, `gap-7`, `mt-[18px]` | a step of the spacing scale: 0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24 | one spacing scale |
| `duration-150`, `ease-in-out` | `duration-fast` / `base` / `slow`, `ease-standard` (or nothing: transitions default to fast) | motion tokens |
| `text-faint` | `text-muted` | faint was merged into muted |
| `uppercase` labels | sentence case words (`StatusBadge kind` sentence-cases a stored status) | no capitals |
| a raw `<button>` | `Button`, `IconButton`, `LinkButton`, `NavItem`, `MenuItem`, `Chip`, `ToggleChip`, `Card onClick`, `Pagination`… (the message names one) | one look, focus ring, 24px target and name |
| `<select>`, `<textarea>`, `<input>` | `Select` / `FilterSelect` / `StatusSelect`, `Textarea`, `Input`, inside a `Field` | one field frame and label |
| `<input type="checkbox" | "radio" | "date">` | `Checkbox`, `RadioGroup` + `Radio`, `DatePicker` | |
| `<table>`, `<th>` | `Table` + `THead` / `Th` / `Td`, or `DataTable` | one table frame |
| `div` with `bg-white border rounded-xl` | `Card` | one card |
| hand-written tabs (`role="tab"`) | `Tabs` or `SegmentedControl` | |
| a status coloured by hand (green "Valid", red "Expired") | `StatusBadge tone=…` or `kind=…` | the symbol (check, triangle, cross) comes with it |
| `window.confirm()` | `ConfirmDialog` / `useConfirmDialog` | |
| `animate-spin`, `animate-pulse`, `Loader2` | `Spinner`, `LoadingState`, `Button loading`, `Skeleton` | |
| `title=` on a button | `Tooltip`, or IconButton `tooltip` | keyboard and touch |
| a kit file by path | the index: `'aero-design-system'` (recipes: `'aero-design-system/styles'`) | |

Allowed exceptions are per file, in the lint options: an error boundary may keep one raw
`<button>` (`rawButtonFiles`), an always-dark viewer or a paper replica may use white and black
(`whiteBlackFiles`), and a paper-form replica may use print sizes (`printFormFiles`). Silence a
single line only with a reason: `// eslint-disable-next-line ds/prefer-kit-components -- why`.

Bordered controls (inputs, selects, unchecked checkboxes) sit only on `surface`, `canvas` /
`subtle`, `success-bg` or `warning-bg`; inside an info, danger or violet panel, put them on a
`bg-surface` inner panel. Solid amber marks use `bg-warning-fill`, never `bg-warning`.

## 3. Per app

| App | Stack | What it can use now | Notes |
|---|---|---|---|
| AeroMetric-Control | Next 15, React 19, TW4 | everything | drop-in: section 4 |
| hangarvisitplan | Next 16, React 19, TW4 | everything (0.2.0: `defaultTheme`, data palette) | moved in 0.2.0: starts dark (`defaultTheme`), phases coloured with the data palette; the app's `docs/design-system.md` lists what stays local. Before the move: its `@theme` defines Material-style colours (`surface-container-*`, `on-surface`, `error`…) that clash with the system's names (`surface` especially): remove them as screens move; it uses `@tailwindcss/forms`, which restyles native inputs (the kit hides its native select; check Checkbox and Radio visually) |
| station-license | Next 15, React 19, TW4 | everything | its tokens are plain `:root` variables (`--surface`, `--on-surface`) with a dark default (`color-scheme: dark`); also has a `tailwind.config.js` (TW3 style, ignored by TW4 unless `@config` is used) |
| aerobalancepro | Vite, React 19, TW4 | everything | already carries a copied, older `@theme` and `eslint-rules/design-system.mjs` (from commit 22282e0): delete both and import the package; its Inter `@font-face` already defines `--font-inter`; its old allowed alphas (`brand/40`, `accent/15`, `danger/15`, `ink/5`) are no longer in the system |
| project-progress-dashboard | Vite, React 19, TW4 | everything | `lucide-react` 0.546 in the app and 0.553 in the package: both get installed (icons tree-shake, so only a little extra) |
| procurement-planner | Python + static HTML/CSS | `tokens.css` only | copy `tokens.css` into `static/` and replace its `:root` variables (`--navy`, `--blue`, `--line`, `--muted`…) with the system's (`--color-brand`, `--color-accent`, `--color-line`, `--color-muted`) |
| studio | Next 15, **React 18**, **TW3**, shadcn | `tokens.css` only, for now | blocked for the components by two things. Tailwind 4: `theme.css` is v4 CSS (`@theme`, `@custom-variant`, `@source`) and the kit's classes rely on its tokens, so a TW3 app gets unstyled components; this is the real blocker (`npx @tailwindcss/upgrade` first). React 18: the package declares `react >=19` as a peer, so npm refuses to install it next to React 18; the kit's code itself only uses APIs React 18 has (`forwardRef`, `useId`, `useSyncExternalStore`), so widening the peer range is possible but untested. shadcn's own components then need the white→surface work above. Not attempted in 0.1.0 |

## 4. AeroMetric-Control: adopting 0.1.0

Tried end to end on a copy of AeroMetric-Control (main, commit 2890c94), both with the packed
0.1.0 installed into `node_modules` (as route A installs it) and with a vendored copy (route B):
`npm run typecheck`, `npm run lint` (the same effective `ds/` options on every file as before),
`npm run test:design-system` (3 app tests) and `next build` all pass. Every class the kit uses
is in the built CSS as before; the home page's first-load JS is 638 to 640 kB (638 kB before).

### What changes

| File | Change |
|---|---|
| `package.json` | add `aero-design-system`; remove `@radix-ui/react-popover`, `@radix-ui/react-tooltip`, `cmdk`, `tailwind-merge`, `tw-animate-css` (now the package's); remove scripts `design-system:build`, `design-system:check`; point `test:design-system` and `test:training` at `tests/designSystemApp.test.js` |
| `components/ui/*.tsx`, and every `.ts` there but `index.ts` and `styles.ts` (46 files) | **deleted** |
| `components/ui/index.ts` | `export * from 'aero-design-system';` |
| `components/ui/styles.ts` | `export * from 'aero-design-system/styles';` (29 screens import recipes from it) |
| `components/ui/README.md` | a short pointer to the package |
| `lib/utils.ts` | `export { cn } from 'aero-design-system';` |
| `lib/density.tsx`, `lib/theme.tsx` | thin adapters that pass the user and the old storage keys (below) |
| `lib/readinessStrip.ts` | keeps `getPersonReadinessGroups` and `readinessExpiryNote`; re-exports the types, labels and counts from the package |
| `lib/dateFormat.ts` | **unchanged** (server-side reports and the CommonJS test build use it; the package has the same `formatDate` / `toIsoDate` for the kit) |
| `types/aerometric.ts`, `lib/complianceOverview.ts` | unchanged: their `PersonnelAuthorisationStatus` and `ReadinessStatus` are the same strings as the package's types |
| `app/globals.css` | 382 lines become 9: the two imports and the app-only `.row-hover-group .inline-action` rule |
| `app/layout.tsx` | the script becomes `getThemeInitScript('aerometric_theme_v1')` from the package |
| `eslint.config.mjs` | the plugin import and four rule blocks become one `designSystem({...})` call |
| `eslint-rules/` | **deleted** |
| `tests/designSystem.test.ts` | **deleted** (ported to the package); `tests/designSystemApp.test.ts` added with the app-specific checks; `tsconfig.training-tests.json` lists the new file |
| `scripts/design-system/` | **deleted** |
| `design-system/` (178 files: guide text, previews, baselines) | **deleted**: the guide now builds from the package |
| `.github/workflows/ci.yml` | drop the "Design guide in step with the code" step (the package's CI runs it); keep "Design system tests"; add the token step if using route A |

In numbers: about 243 files changed, 134 lines added, 15,600 removed.

### The new files, in full

`components/ui/index.ts`:

```ts
/*
 * The UI kit now lives in the aero-design-system package. This index re-exports it so screens
 * keep importing from '@/components/ui'.
 */
export * from 'aero-design-system';
```

`components/ui/styles.ts`:

```ts
/* The kit's class recipes, from the aero-design-system package. Safe in server components. */
export * from 'aero-design-system/styles';
```

`lib/utils.ts`:

```ts
export { cn } from 'aero-design-system';
```

`lib/density.tsx`:

```tsx
'use client';

import React from 'react';
import { DensityProvider as KitDensityProvider } from 'aero-design-system';
import { useAuth } from '@/lib/AuthContext';

export { useDensity, type Density } from 'aero-design-system';

/** Display density per user, under the keys people already have (aerometric_density_v1_<uid>). */
export function DensityProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return (
    <KitDensityProvider userId={user?.uid} storageKey="aerometric_density_v1">
      {children}
    </KitDensityProvider>
  );
}
```

`lib/theme.tsx`:

```tsx
'use client';

import React from 'react';
import { ThemeProvider as KitThemeProvider } from 'aero-design-system';
import { useAuth } from '@/lib/AuthContext';

export { useTheme, type Theme } from 'aero-design-system';

/** The storage key prefix people's choices already live under (aerometric_theme_v1_<uid>, _last). */
export const THEME_STORAGE_KEY = 'aerometric_theme_v1';

/** Light or dark per user; while auth is still restoring the session, the last-used theme stays. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  return (
    <KitThemeProvider userId={loading ? undefined : user?.uid} storageKey={THEME_STORAGE_KEY}>
      {children}
    </KitThemeProvider>
  );
}
```

`lib/readinessStrip.ts`: delete `ReadinessState`, `ReadinessCell`, `ReadinessGroup`,
`READINESS_LABELS`, `ReadinessCounts`, `countReadiness`, `worstReadinessState` and
`readinessSentence`, and add after the imports:

```ts
import type { ReadinessCell, ReadinessGroup, ReadinessState } from 'aero-design-system';
// The cell shapes, labels and counts are the kit's (aero-design-system); this file builds the cells.
export { READINESS_LABELS, countReadiness, readinessSentence, worstReadinessState } from 'aero-design-system';
export type { ReadinessCell, ReadinessCounts, ReadinessGroup, ReadinessState } from 'aero-design-system';
```

`app/globals.css`:

```css
@import "tailwindcss";
/* The design system: tokens, dark theme, density, print, base rules, and the kit's classes. */
@import "aero-design-system/theme.css";

/* This app only: an inline row action shown on hover. */
.row-hover-group:hover .inline-action {
  opacity: 1 !important;
  visibility: visible !important;
}
```

`app/layout.tsx`: replace `import { themeInitScript } from '@/lib/theme';` with
`import { getThemeInitScript } from 'aero-design-system';` and the script with
`<script dangerouslySetInnerHTML={{ __html: getThemeInitScript('aerometric_theme_v1') }} />`
(the same string as before, byte for byte; a test in the package checks it).

`eslint.config.mjs`: replace `import designSystem from "./eslint-rules/design-system.mjs";` with
`import { designSystem, ALLOWED_ALPHA } from "aero-design-system/eslint";`, drop the local
`ALLOWED_ALPHA`, keep `PRINT_FORMS` and `WHITE_BLACK_FILES`, and replace the six design-system
blocks (screens, `components/ui/**`, error boundaries, print forms, white/black files, viewer) with:

```js
  ...designSystem({
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
    ignores: ["app/api/**"],
    allowAlpha: ALLOWED_ALPHA,
    kitImport: "@/components/ui",
    rawButtonFiles: ["app/error.tsx", "app/global-error.tsx"],
    printFormFiles: PRINT_FORMS,
    whiteBlackFiles: WHITE_BLACK_FILES,
  }),
```

`kitImport: "@/components/ui"` keeps every lint message naming the import screens use.

`tests/designSystemApp.test.ts` (the checks that read this app's code; the package's tests cover
the rest):

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { EXPIRY_WINDOW_DAYS, expiringLabel, isWithinExpiryWindow } from '../lib/expiryWindow';
import { FINAL_DECISION_OPTIONS } from '../lib/competencyCatalog';

// The package is ESM; this test build is CommonJS, so load it with a real import().
const importEsm = new Function('specifier', 'return import(specifier)') as (specifier: string) => Promise<any>;
const read = (file: string) => readFileSync(join(process.cwd(), file), 'utf8');

test('status tables know every status this app stores', async () => {
  const kit = await importEsm('aero-design-system');
  for (const [, issue] of read('lib/complianceOverview.ts').matchAll(/issue: '([^']+)'/g)) {
    assert.ok(Object.prototype.hasOwnProperty.call(kit.FINDING_ISSUE_STATUS, issue), `finding issue "${issue}" has a status entry`);
  }
  for (const decision of FINAL_DECISION_OPTIONS) assert.ok(kit.ASSESSMENT_OUTCOME_STATUS[decision], decision);
});

test('expiry window: one 60-day rule, written once', () => {
  assert.equal(EXPIRY_WINDOW_DAYS, 60);
  assert.equal(expiringLabel(), 'Expiring within 60 days');
  assert.ok(isWithinExpiryWindow(0) && isWithinExpiryWindow(60));
  assert.ok(!isWithinExpiryWindow(61) && !isWithinExpiryWindow(-1) && !isWithinExpiryWindow(undefined));
  for (const file of ['complianceOverview.ts', 'readinessStrip.ts', 'departmentReadiness.ts']) {
    const source = read(join('lib', file));
    assert.match(source, /from '\.\/expiryWindow'/, file);
    assert.doesNotMatch(source, /(?:<=|=)\s*60\b|\?\? 61\b/, `${file} writes the window by hand`);
  }
});

test('providers, theme keys and the no-flash script', () => {
  const providers = read('components/Providers.tsx');
  for (const p of ['<TooltipProvider>', '<ThemeProvider>', '<DensityProvider>', '<ToastProvider>']) assert.ok(providers.includes(p), p);
  assert.match(read('lib/theme.tsx'), /aerometric_theme_v1/);
  assert.match(read('lib/density.tsx'), /aerometric_density_v1/);
  const layout = read('app/layout.tsx');
  assert.match(layout, /getThemeInitScript\('aerometric_theme_v1'\)/);
  assert.match(layout, /<html[^>]*suppressHydrationWarning/);
  assert.match(read('components/modals/SettingsModal.tsx'), /<ThemeSetting \/>/);
  assert.match(read('app/globals.css'), /@import "aero-design-system\/theme\.css";/);
});
```

### Steps

```bash
cd AeroMetric-Control
git switch -c design-system-package
# route A (needs the AERO_DS_TOKEN step in CI and a plan for App Hosting), or route B:
node ../aero-design-system/scripts/vendor.mjs . --ref v0.1.0
npm install ./vendor/aero-design-system
npm uninstall @radix-ui/react-popover @radix-ui/react-tooltip cmdk tailwind-merge tw-animate-css
git rm -r design-system scripts/design-system eslint-rules tests/designSystem.test.ts
git rm components/ui/*.tsx $(ls components/ui/*.ts | grep -v -e index.ts -e styles.ts)
# write the files above, then:
npm run typecheck && npm run lint && npm run test:design-system && npm run build
```

Then look at the app in both themes (Settings, Theme) and both densities: nothing should move.
People's theme and density settings stay, because the keys are the same.

### Behaviour that changed

- None on screen. `DensityProvider` / `ThemeProvider` now take the user from the adapter instead
  of calling `useAuth()` themselves; the same-tab change events are renamed
  (`aerometric-*-change` to `aero-*-change`), which nothing outside those files listened to.
- `@/components/ui` now also exports the package's helpers (`cn`, `ThemeProvider`,
  `DensityProvider`, `formatDate`…). Screens keep importing the providers from `@/lib/theme` and
  `@/lib/density` (the adapters), so they get the right keys; importing the bare providers from
  `@/components/ui` would use the package's default keys.
- `@/components/ui/statusTones`, `pageWindow`, `selectOptions`, `useListbox`, `useFocusTrap` no
  longer exist as files. Nothing outside the kit and the old test imported them; the public
  names (`READINESS_TONE`, `sentenceCase`, …) still come from `@/components/ui`.
