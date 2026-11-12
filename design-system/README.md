AeroCompetence Hub is a records tool for aviation maintenance organisations: personnel, authorisations, training and evidence, read by compliance officers before an audit. The interface is quiet and dense. Navy carries the brand, greys carry the structure, and green, amber and red are kept for status alone, so a status reads at a glance.

The tokens live in `theme.css` (a Tailwind v4 `@theme` block), the class recipes in `src/components/styles.ts`, and the components built from them in `src/components`. Screens use the components (see Components).

## Content

- Write in plain sentence case: page titles, buttons, tabs, table headers and badges. No all-caps labels.
- Name the thing, then the state: "Licence expired", "3 authorisations due". Keep regulator codes exactly as issued (`B1.1`, `AES-CM-07`, `TRN-002`) and set them in `code-chip`.
- Empty states say what is missing, why, and the next step if the person can take it ("No training records yet. Assign a course to start the history.").
- A confirmation asks a question and names its action: "Delete course TRN-002?", then "Delete course", never "Yes" or "OK".
- No emoji, no sparkles, no exclamation marks.

## Colour

- Text: `color-ink` for primary text, `color-ink-2` for labels and table headers, `color-muted` for meta lines, hints, placeholders and icons. Muted reads at least 4.5:1 on every fill in both themes (surface, canvas, subtle, subtle-2 and the status and info fills), so there is no lighter grey for text; `color-disabled` is for disabled text only.
- Surfaces: the app sits on `color-canvas`; cards, inputs, dialogs, popovers, menus and toasts are `color-surface`. `color-subtle` fills table headers and disabled controls (in light it is the canvas grey, an alias; in dark it is its own step); `color-subtle-2` is the hover fill, the segmented track and skeleton placeholders. The backdrop behind dialogs is `color-scrim`.
- Name the role, never white: a panel or control is `bg-surface`, text or an icon on a solid brand, brand-2, accent, danger or success fill is `text-on-solid` (and the check in a checked box, the dot in a chosen radio). Both are white in light; in dark the surface turns navy-grey and on-solid turns near-black, because the solid fills turn pale. `white` and `black` stay only for `print:` rules, paper replicas and the always-dark document viewer; lint (`ds/no-off-system-classes`) rejects them everywhere else and names the token to use.
- Borders: `color-line` for card edges and dividers. A control's own boundary (an input, a select, a date field, a filter box, an unchecked checkbox or radio, a secondary button, an outline icon button) uses `color-line-strong`, which meets 3:1 on surface, canvas, success-bg and warning-bg in both themes. Bordered controls never sit on subtle-2, info-bg or danger-bg; inside such a panel, put them on a surface inner panel.
- Brand: `color-brand` fills primary buttons, checked boxes, the active segmented option and selected chips; `color-brand-2` is their hover and the active tab underline. `color-accent` is for links, focus rings and info icons, never for fills.
- Status is green, amber, red: `color-success`, `color-warning`, `color-danger`, each with its `-bg` fill and `-line` ring. Use them only for status, and always with the word and its symbol (a check, a triangle, a cross): success and danger have nearly the same lightness (1.12:1) and are told apart by hue. `StatusBadge` and `StatusSelect` add the symbol themselves.
- A solid amber mark (a readiness cell, a progress bar, a status dot) uses `color-warning-fill`, the brighter amber made for fills. `color-warning` is the text colour: as a block it looks brown and is only 1.08:1 from the success green.
- Categories that are not status use `info` (filled, `color-info` is an alias of accent), `violet` (outlined: surface fill, violet text and ring), `neutral` or `brand` chips.
- The PDF viewer is dark in both themes. Its chrome uses the fixed `color-viewer-*` tokens (its primary and danger buttons `color-viewer-primary` and `color-viewer-danger`, because accent and danger turn pale in the dark theme); status on dark uses `color-success-on-dark`, `color-warning-on-dark`, `color-danger-on-dark`; accent on dark, focus rings included, uses `color-accent-soft`. None of these change with the theme.

## Themes: light and dark

- Two themes over one set of tokens. Light is the default and lives in `@theme`. Dark is the same variables with other values, in `:root[data-theme="dark"]` in `theme.css`; every utility reads `var(--color-…)`, so nothing else changes. Its palette is navy-tinted to match the viewer: canvas `#0d1218`, surface `#141b24`, subtle `#18202c`, subtle-2 `#202a3a`, line `#2e3a4d`, ink `#e6e9ee`. Brand and accent turn light blue (`#8db7f5`), so a primary button or a selected chip is pale with near-black `on-solid` text. The values and their contrast are in tokens.json (each colour and shadow holds `{ light, dark }`).
- How an app turns dark on: set `data-theme="dark"` on `<html>`. In AeroCompetence Hub it is a per-user choice in Settings (Theme: Light / Dark), held by the package's `ThemeProvider` (`src/lib/theme.tsx`, given the user and the app's storage key) beside the density provider and stored per user in the browser; it never follows the operating system. A two-line script from `getThemeInitScript(storageKey)` in the root layout applies the last theme used in that browser before the first paint, so a dark user sees no light flash; until the user is known (the sign-in screen) that last-used theme shows.
- `dark:` is redefined to follow the attribute, not the OS. Prefer the tokens: they already flip.
- Print is always light: the dark block applies on screen only, and PDFs are generated with their own colours (`lib/pdf/styles.ts`).
- The light pin: `data-theme="light"` on an element keeps its subtree on the light palette while the app is dark. Use it only for paper shown on screen (the authorisation card replica, the page in the document viewer) and for the navy brand banner on the sign-in card.
- The same rules hold in both themes, checked by tests/designSystem.test.ts against `theme.css`: text 4.5:1 on every surface, control edges and solid marks 3:1, status text 4.5:1 on its own fill, on-solid 4.5:1 on every solid fill, the accent focus ring 3:1 everywhere, and the amber fill at least 1.6:1 from green and red in lightness (lighter than both in light, darker than both in dark; missing cells are also hatched).
- Shadows are black and stronger in dark, and a dialog adds a line-coloured hairline. Each shadow utility reads an `--elevation-*` variable, because Tailwind writes a shadow's value into its utility.

## Type

- One family: Inter (Google Fonts, through `next/font`), with `cv11` and `ss01` on. Figures use `tabular-nums`. No mono or serif.
- Three weights: 400, 500, 600. `font-bold` and every other weight class compile to nothing.
- The scale is fixed: 11, 12, 13, 14, 15, 16, 18, 22, 32px (`text-11` … `text-32`); `text-10` exists only for the printed authorisation card. Tailwind's `text-xs`, `text-sm`, `text-lg` and friends do not exist here.
- `page-title` once per page, `section-title` once per card, `modal-title` in a dialog header, `body` (13px) for everything else, `label` above fields, `meta` under a row's main text.

## Layout and shape

- Pages use `pageShell`: a 24px gutter (32px from `lg`), 1440px max width, 24px between sections.
- Control heights are four tokens on one scale: `control-xs` 28px (toggle chips, small segmented items), `control-sm` 32px (small buttons, icon buttons, controls in table cells, menu rows), `control-md` 36px (buttons, and everything in a toolbar: search, selects, filters), `control-lg` 40px (form inputs, selects, comboboxes and date fields, and buttons in a form footer beside them).
- Radii: `radius-md` for chips, tooltips and option rows, `radius-lg` for controls, `radius-xl` for cards, tiles and popovers, `radius-2xl` for centred dialogs, `radius-full` for status pills, radios and dots.
- Elevation, three steps (tinted from ink in light, black in dark): cards and controls sit on `shadow-xs`; menus, popovers, list popups and tooltips float on `shadow-popover`; dialogs and sheets on `shadow-modal`. Nothing else compiles. Stat tiles never use coloured borders or tinted backgrounds: status shows in the icon and the figure.
- Focus is one recipe (`focusRing` in `styles.ts`): a solid 2px `color-accent` ring 2px outside the control on keyboard focus, drawn as an outline so it survives Windows high-contrast mode. Where an outer ring would be clipped (tabs, sortable table headers, scroll regions) `focusRingInset` draws it just inside. Text fields, selects, comboboxes and date fields turn their border `color-accent` and add a full-strength 2px accent ring (`focusField`); invalid ones do the same in `color-danger`. No component writes its own focus classes.
- Keyboard: tab bars and segmented controls are one tab stop; arrow keys move and select, Home and End jump to the ends. Comboboxes and the status select open on Enter, Space or the arrow keys, filter or jump as you type, and close on Escape without closing the dialog. Radio groups move with the arrow keys.
- Targets: anything clickable is at least `target-min` (24×24px), even when its glyph is smaller: sort headers, checkbox and radio boxes (a 16px box in a 24px target), link buttons, the status-select pill, readiness cells that are buttons.
- Tables that scroll keep the focused row clear of their sticky header, carry a screen-reader caption, and announce their sort order and their loading state (`DataTable` does all of it).

## Pages

- Every page starts with `PageHeader`: title, one line of description, at most three actions with the primary last. Sections of a page are `Tabs` under it.
- Switching views: `Tabs` for sections of a page or of a record; `SegmentedControl` only for two to four filters or modes of one list, never as page navigation. One job, one control.
- A table fits at 1280 to 1440px and its actions column is pinned (`pin="end"`), so the row action is always in view.
- Never clip: a panel never cuts its content mid-item. Show the first few and a "View all (n)" link (`AlertList limit`), or scroll inside a region with a visible edge that takes keyboard focus (`scrollRegion`).
- Alerts in a card are an `AlertList`: surface rows, colour on the icon only, the person first and the problem in plain words.
- "Expiring" always means 60 days (`EXPIRY_WINDOW_DAYS` in `lib/expiryWindow.ts`); write it with `expiringLabel()`, never as a number in a screen.
- A count shown in two places comes from one function (`buildAlertSummary` in `lib/alertCounts.ts` feeds the sidebar badge, the dashboard alerts and the notifications).
- No slash labels ("Lapsed / Grounded"): pick one plain name.

## Dialogs

- Every `ModalShell` opens as a right-hand side sheet: full height, on surface, a ruled header, a scrolling body and a pinned footer, over the `color-scrim` backdrop (ink 40% in light, black 60% in dark) without blur, so the page stays in view. On phones it is full width.
- Four widths: `sm` 480px (a short form), `md` 640px (the default: an ordinary form or record), `lg` 896px (two-column forms, a form with a table), `xl` up to 1280px (large working forms such as the AES-CM-07 assessment, printable cards).
- A dialog opened from another stacks as its own sheet above it, no wider than its parent, with the parent dimmed. Focus moves in, Tab stays inside and focus returns to what opened it.
- `ConfirmDialog` is the named exception: the small centred dialog (480px, `radius-2xl`) that asks before a step that cannot be taken back. It replaces `window.confirm`; `tone="danger"` gives the red button and starts focus on Cancel. Screens never pass `placement="center"` themselves.
- A dialog closes with its close button, Escape or a click outside it. A confirmation must be answered, and a long form with no draft (the AES-CM-07 assessment) asks before an outside click closes it.
- `printable` dialogs print their body full width without the sheet.

## Forms

- Fields sit in a `FormGrid` (one to four columns, 16px gaps). Rows start at the top, so a hint or an error under one field never moves the controls beside it; a wide field spans with `formSpan`.
- Every field in a row is a `Field`, or a `RadioGroup` / `CheckboxGroup` with a `legend`, and every control in a row is the same size (`lg`). A button beside an input is `lg` too.
- Nothing in a row sits in its own tinted or bordered box. A value the form works out or holds for reference is a read-only control with a hint: grey fill, `color-line` edge, `color-ink-2` text (8.8:1), because it is there to be read. Disabled is for a control that does not apply right now; its text is pale on purpose (2.4:1), so it never shows a value.
- A count or a link that belongs to a field goes in its hint or under the control, never beside the label.
- A horizontal radio or checkbox group in a row takes `choiceRowInForm`, so its options centre on the controls beside it.
- Sections of a long form are `Card`s with a `title`. A dialog footer is Cancel, then secondary actions, then the primary last, all `lg`; a destructive action sits alone on the left as `danger-ghost`. An action appears once: not in the header and again in the footer.
- Steps of a long form are `Tabs`; a status that summarises the record goes in the dialog header's meta line, not in the step row.

## Motion

- Three durations and one easing (`ease-standard`, a quick start and a soft landing): `duration-fast` 120ms for hover, press, menus, popovers and tooltips; `duration-base` 180ms for centred dialogs and the page fade-in; `duration-slow` 260ms for side sheets sliding in and their backdrop. `motion.fast`, `motion.base` and `motion.slow` in `styles.ts` pair each with the easing, and every `transition-*` utility defaults to fast. Raw durations (`duration-150`, `duration-[250ms]`) are rejected by lint.
- Under `prefers-reduced-motion: reduce` every transition and animation stops, the sheet's slide-in included; things appear in their final state. A busy spinner keeps turning, because it is the only sign of progress.

## Density

- Two densities. Default is the dense desktop layout above. Comfortable is for tablets on the hangar floor and anyone working standing or gloved: the control heights grow to `control-xs-comfortable` 36px, `control-sm-comfortable` 40px, `control-md-comfortable` 44px and `control-lg-comfortable` 48px, checkbox and radio boxes to 20px in a 32px target, body text to `body-comfortable` 15px, and table cells to 16px padding.
- Switch it with `data-density="comfortable"` on `<html>`, remembered per user, defaulting to comfortable on touch screens. Colours, radii, weights and layout rules stay the same.
- The control heights are CSS variables that change value under that attribute, so a control written once with `h-control-md` follows it; text and padding use the `comfortable:` variant in `theme.css`. People switch it under Settings, Display density (`src/lib/density.tsx`).

## Labels

- Status (success, warning, danger, and neutral for a state that cannot be evaluated) is a pill: `rounded-full`, semibold. Every status label is a `StatusBadge`, mapped (`kind` readiness, authorisation, document, finding, outcome or activity) or direct (`tone` plus the word, from a lookup table). In a requirement row's Status column use `width="column"`, the 120px pill, so statuses line up down the page.
- Success, warning and danger always carry their symbol; `dot` marks a neutral status only.
- A status a person sets is a `StatusSelect`: the same pill with a chevron.
- Categories and counts (neutral, info, violet, brand) are a `Badge`: `radius-md`, medium weight. Badge does not take a status tone. Violet is outlined so it differs from the filled info chip by more than hue.

## Iconography

- lucide-react, stroke icons at 16px (`h-4 w-4`) in controls and 20px in empty states. Icons inherit `currentColor`.
- An icon-only button always has a name, shown as a tooltip on hover and keyboard focus (`IconButton`); never a native `title`.
- The mark is an aircraft seen from above inside a hexagon "hub", drawn in the same 2px stroke as lucide (`src/components/BrandMark.tsx`). It takes the text colour: brand on a light page, on-solid on a brand tile (navy with a white mark in light, light blue with a dark mark in dark), `color-accent-soft` on the navy sign-in banner. The favicon is the same mark in white on a navy tile.
- The operator's logo appears only on printed authorisation cards, as the operator's mark.

## Components

- Build screens from the kit in `src/components` (`import { Button, Field, Select, StatTile, StatusBadge } from 'aero-design-system'`), always from the index, never from a kit file by path. A component carries its variants as typed props, so a screen cannot pick a size, colour or radius the system does not have.
- Write a class string by hand only inside `src/components`. The recipes in `src/components/styles.ts` are the building material for components, not for screens.
- A status is never coloured by hand. Use `StatusBadge`, which looks the colour up in `src/components/statusTones.ts`. Add a new status there, once.
- Stat tiles are `StatTile`. Give it `alert` and the figure turns amber or red only while the value is above zero.
- Sizes follow one scale, `sm` 32, `md` 36, `lg` 40px. Forms: one `Field` per control, controls at their default `lg`, footer buttons `lg`. Toolbars: `md` controls, `FilterSelect` and `md` buttons (the Button default). Tables: `Table` (`frame` card, inset or none), `Th` and `Td`, with `sm` controls inside cells. Panels: `Card`, with 20px or 16px padding.
- Choices: `Checkbox` (and `CheckboxGroup`) for independent yes or no, `RadioGroup` for one of a few visible options, `SegmentedControl` for two to four peer views, `ToggleChip` for a multi-select set, `Select` or `Combobox` for long lists. Never a raw `<input type="checkbox">` or `type="radio"`.
- Dates are `DatePicker` (DD-MMM-YYYY on screen, ISO in and out); never `<input type="date">`.
- Pick-or-type lists are `Combobox`: search as you type, `allowCreate` for "Add new value" and `allowListEditing` to rename or delete entries in organisation-maintained lists (positions, departments, categories, authorities).
- Hints for controls are `Tooltip` (hover and keyboard focus, Escape closes, never touch); `IconButton` shows its label through it.
- Waiting: `Button loading` for an action in progress, `Spinner` inline, `LoadingState` for a panel, `Skeleton` where the shape is known, `Table`/`DataTable` `loading` for rows.
- Confirmations are `ConfirmDialog` or `useConfirmDialog`, never `window.confirm`.
- Status banners are `Notice`; give it `live` when it reports the result of an action so screen readers announce it.
- When a pattern appears on a second screen, add it to the kit instead of copying it.
- Merge classes with `cn()` from `src/lib/utils.ts`. It knows the custom type scale, control heights and durations; plain `tailwind-merge` drops `text-13` next to `text-ink`.
- Lint holds these rules: `ds/no-off-system-classes` (palette, sizes, weights, shadows, faded tokens), `ds/no-retired-classes` (`*-faint`, raw durations, default easings) and `ds/prefer-kit-components` (kit controls in screens; raw tables and hand-written cards; kit files imported by path; raw checkboxes, radios and date inputs; `title` on kit buttons; `window.confirm`; hand-made spinners; the `uppercase` class; removed kit APIs). Silence a line only with a reason after `--`.

## Using the kit in another app

- The core kit (buttons, fields, checkbox, radio, date picker, combobox, card, table, tabs, segmented control, badge, notice, empty state, spinner, skeleton, tooltip, modal, confirm dialog, row menu, status select), `cn()` and the lint rules read every colour and size from tokens. Another app keeps them and brings its own `@theme`.
- `StatusBadge`, `statusTones.ts`, `StatTile`'s status meaning, `ReadinessStrip`, `EvidenceField` and the mark belong to this app.
- When a second app starts, move the core into a shared package and give each app its own tokens and design system page.

## Reports

Printed records (training orders, AES-CM-07 assessments, authorisations, certificates) follow their own print rules: see the Reports section.

## Recently added

Now in `src/components`:

- **Checkbox**, **CheckboxGroup**, **Radio** and **RadioGroup** on native inputs, with indeterminate, invalid, disabled and card variants.
- **DatePicker**, moved into the kit from `components/common/DatePickerField.tsx`, on the field frame and size scale.
- **Tooltip** (Radix), used by `IconButton` for its label.
- **Spinner**, **LoadingState** and **Skeleton**, and `loading` on `Button`, `IconButton`, `Table` and `DataTable`.
- **ConfirmDialog** and `useConfirmDialog`, replacing `window.confirm` and hand-built confirmation overlays.
- **StatusSelect**, the status pill as a dropdown, which removed the last lint exception.
- **Select** and **FilterSelect** draw their own list (the popover surface, a tick on the current option, keyboard and type-ahead) instead of the browser's: same props and `<option>` children, so no screen changed. They share the listbox core with StatusSelect.
- **One control-size scale** (`sm`, `md`, `lg`) on four density-aware height tokens; `Button` gains `lg`.
- **One status component**: `StatusBadge` takes a direct `tone` and `width="column"`; `StatusPill` is gone and `Badge` is categories only.
- **Four dialog sizes**, a shared **focus recipe**, **motion tokens** with reduced motion, and re-tinted **shadows**.

- **Table `frame`** (card, inset, none) and **Card** as a plain box, a `div` or a `form`, so every table and panel in a screen is the kit's.

- **PageHeader**, **AlertList** and a pinned actions column on `Table`, plus one status vocabulary (`finding`, `outcome` and `activity` kinds) and one 60-day expiry window.

- **FormGrid**, the one grid for form fields, with the form rules above; every form dialog uses it.

- **`color-warning-fill`** for solid amber marks, and a **read-only** field look that keeps its text dark.

- **The guide is built from the code**: its source is `design-system/` in the repository, and `npm run guide:build` rebuilds the live previews, the stylesheet and the token list. Change the code, not this page.

The Audit section lists what was fixed and what is still open.
