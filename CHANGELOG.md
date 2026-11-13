# Changelog

All notable changes to aero-design-system. Versions follow [semver](https://semver.org): a
change that makes an app edit its code (a prop renamed, a component removed, a token removed or
renamed) bumps the major version once we reach 1.0.0; until then it bumps the minor version
(0.1.x to 0.2.0) and is listed under "Breaking".

## 0.2.0

Made for hangarvisitplan, the second app on the system (a planning timeline that starts dark).
Nothing an existing app uses changed: no component, recipe or existing token moved, and every
guide preview matches its 0.1.0 baseline, light and dark.

### Added

- `ThemeProvider` takes `defaultTheme` (`'light'` by default, or `'dark'`) and
  `getThemeInitScript(storageKey, { defaultTheme })` takes the same option, so an app can start
  dark for someone who has not chosen a theme and still offer the switch. With the default
  left out, the script is byte for byte what 0.1.0 wrote. New types `DefaultTheme` and
  `ThemeInitOptions`.
- A data palette, `color-data-1` … `color-data-8` (blue, teal, violet, orange, magenta, green,
  brown, slate), light and dark, in `theme.css`, `tokens.css` and `tokens.json`: categorical
  hues for charts and timelines whose categories are not status. Rules in the guide (Colour):
  one hue per category from a lookup table, every mark labelled, text on them in `on-solid`,
  never status, text or controls. Tests check on-solid text at 4.5:1 on each hue, each hue at
  3:1 on surface, canvas, subtle, subtle-2 and the status and info fills, and at least 20
  (CIE76) between any two hues, in both themes.

## 0.1.0

First release, extracted from AeroMetric-Control (`components/ui`, `app/globals.css`,
`eslint-rules/design-system.mjs`, `design-system/`). The components look exactly as they did
there: all 43 guide previews match the app's baselines, light and dark.

### Added

- `theme.css`: the Tailwind v4 entry (tokens, dark theme, density, print, base rules, the
  `comfortable:` and `dark:` variants), scanning the kit's own files, so an app needs one import.
- `tokens.css` and `tokens.json`, generated from `theme.css`, for apps without Tailwind.
- The UI kit (`import { Button, … } from 'aero-design-system'`) and its recipes
  (`aero-design-system/styles`), compiled to ESM with types, `'use client'` kept.
- `cn`, `formatDate`, `toIsoDate`, `DensityProvider` / `useDensity`, `ThemeProvider` /
  `useTheme`, `getThemeInitScript`, and the readiness-strip helpers (`countReadiness`,
  `readinessSentence`, `worstReadinessState`, `READINESS_LABELS`) moved from the app's `lib/`.
- `ReadinessStatus` and `PersonnelAuthorisationStatus` types, so StatusBadge and statusTones no
  longer import app types.
- `aero-design-system/eslint`: the three `ds/` rules as a shareable flat config with per-app
  options, and a `kitImport` option that names the import in messages.
- The design guide (`design-system/`), its build and preview check, the light and dark baselines.
- `scripts/vendor.mjs`: copy a release into an app's `vendor/` folder.

### Changed (compared with AeroMetric-Control's kit)

- `DensityProvider` and `ThemeProvider` no longer read the app's auth: they take `userId`
  and `storageKey` props. AeroMetric-Control passes its old keys (`aerometric_density_v1`,
  `aerometric_theme_v1`) so people keep their settings.
- `themeInitScript` (a string) is now `getThemeInitScript(storageKey)` (a function).
- `theme.css` drops the app-only `.row-hover-group .inline-action` rule.
- `Field`, `NavItem` and `Tabs` now start with `'use client'` (they use hooks), so a server
  component can import the index even when the package is linked from `vendor/`.
