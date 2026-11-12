# Audit

_This audit was made in AeroMetric-Control, before the design system became the aero-design-system package. Its paths are that app's: `app/globals.css` is now `theme.css`, `components/ui` is `src/components`, `eslint-rules/design-system.mjs` is `eslint/plugin.mjs`, and `npm run design-system:build` / `design-system:check` are `npm run guide:build` / `guide:check`._

This section checked the tokens in `app/globals.css` and the recipes in `components/ui/styles.ts` against how 96 screens and modals used them (commit 7cb48e4). Reviewers ran each check twice, and only findings confirmed in the code were listed. The token values were mostly sound; nearly all the drift was in how screens used them. Pull requests #21 to #23 fixed that drift and added lint rules so it cannot return; the review fixes on `design-system/review-fixes` settle the token decisions and fill the kit gaps that were still open. A second check of the screens against this page (November 2026) found the tokens identical and moved the remaining hand-written tables, panels and form labels onto the kit. A visual review of every section with sample data (November 2026) then found what the code checks could not see: clipped tables, mismatched counts and inconsistent wording. Those are fixed too, on new shared pieces. A visual check of the dialogs followed, after misaligned elements were reported in them; every form dialog now sits on one form grid.

## How drift is prevented now

- **Lint** (`npm run lint`, also in CI). `ds/no-off-system-classes` rejects Tailwind's default palette, arbitrary colours and font sizes, classes the theme removed (`font-bold`, `text-sm`), shadows outside xs, popover and modal, and faded tokens such as `border-line/60`. `ds/no-retired-classes` rejects `*-faint`, raw or arbitrary durations (`duration-150`, `duration-[250ms]`) and default easings. `ds/prefer-kit-components` requires the kit's controls, tables, cards, tabs and filled buttons in screens, and rejects a raw `<table>`, the card surface written by hand, a kit file imported by path, raw checkboxes, radios and date inputs, `title` on kit buttons, `window.confirm`, hand-made spinners and placeholders, direct imports of `@radix-ui/react-tooltip`, and removed kit APIs (`StatusPill`, `<Badge tone="success">`, `size="toolbar"`, old `ModalShell` sizes, `DatePickerField`).
- **Locks in `@theme`.** `--color-*`, `--shadow-*`, `--font-weight-*`, `--text-*` and `--ease-*` start from `initial`, so a default Tailwind colour, shadow, weight, size or easing does not compile.
- **One status map.** `components/ui/statusTones.ts`, read by `StatusBadge`; one status component, so every status label carries its check, triangle or cross.
- **One focus recipe.** `focusRing`, `focusRingInset` and `focusField` in `styles.ts`; a test in `tests/designSystem.test.ts` fails if a kit file writes its own focus classes.
- **Tests in CI.** `npm run test:design-system` runs `tests/designSystem.test.ts` on every pull request.
- **No white, no black.** `ds/no-off-system-classes` also rejects `white` and `black` in any colour utility (`bg-white`, `text-white`, `ring-white`, `border-black`…) and names the role token instead: `surface` for a panel or control, `on-solid` for text on a solid fill. They stay legal only in `print:` variants, in a class string that also draws the always-dark viewer (`viewer-*`, `accent-soft`, `*-on-dark`), and in the two files configured with `allowWhiteBlack` (the authorisation card replica and the PDF viewer). The dialog backdrop is the `scrim` token, so `bg-ink/40` is no longer an allowed fade.
- **Both themes tested.** `tests/designSystem.test.ts` parses `app/globals.css` and checks every contrast rule in light and dark, that every flipping colour has a dark value, and that the light pin repeats the light values exactly. `design-system:check` compares tokens.json with both themes, and `check-previews.cjs` compares every preview in light and dark against `baselines/` and `baselines/dark/`.
- **Lint exceptions.** None remain in screens. Two files are exempt by configuration: the printed Part-145 card and the compliance dossier (see Checked and fine).

## Fixed

| Area | Before | Now |
|---|---|---|
| Status colours | "Not Configured" was grey, amber or red depending on the screen. "Lapsed" was grey on Authorisations. Suspended and Revoked had no badge. | Every status label is a `StatusBadge` reading the shared map. |
| Status components | `StatusBadge`, `StatusPill` and status-tone `Badge` all drew status; `kind="authorisation"` took any string. | `StatusBadge` is the only status label (mapped or direct `tone`, `width="column"` for the 120px pill). `StatusPill` is removed, `Badge` takes category tones only, and authorisation statuses are typed, with a neutral fallback for legacy strings. |
| Stat tiles | Red "0" figures, coloured labels and tinted icon wells. | `StatTile`: the figure is amber or red only above zero. |
| Documents | "Rejected" shown as "Overdue". | Review states keep their names. |
| Selects | 1.16:1 grey border next to 3:1 inputs. | Same frame as inputs. |
| Selection | Ink text on dark surfaces. | Readable everywhere. |
| Default palette | 56 classes on the Part-145 card, plus stray navies (#001e40, #003671). | Tokens only. |
| Faded tokens | About 70 shades made with `/20` to `/80`. | Full-strength tokens and `Notice`. |
| Status misuse | Green counts and categories; red "Mandatory" and "Cancelled"; "Suggested" in three tones; status-coloured filter buttons. | Neutral and info badges; navy `SegmentedControl`. |
| Info and violet | Violet and info chips were both tinted fills told apart by hue. | Info is filled, violet is outlined (white fill, violet text and ring); `color-violet-bg` is gone and the role is written in `styles.ts`. |
| Codes | Five styles. | `CodeChip`. |
| Tables | 66 hand-padded headers. | `THead`, `Th` and `Td`. |
| Table frames | 21 hand-written `<table>` shells in four class combinations; `Table` was used nowhere. | Every table is a `Table`, with `frame` card, inset or none. |
| Cards | About 70 hand-written panels in seven paddings (12 to 32px), some without the card shadow; `Card` was used once. | `Card`, at 16px or 20px. |
| Form labels | 41 label-and-control pairs written with the label classes, most not tied to their control. | `Field`. |
| Kit imports | About 27 imports of kit files by path. | The kit index. |
| Dialog radius | `radius-2xl` on two panels and an icon well. | `radius-xl`; 2xl is for centred dialogs only. |
| Clipped tables | At 1440px the actions column was cut off on Personnel and Competency assessment. | The actions column is pinned (`pin="end"`) and columns have set widths. |
| Counts | The bell, the dashboard alerts, the sidebar badge and the blocking-findings tile showed 16, 13, 13 and 12 for the same thing; Authorisations said "Showing 13 of 12". | One function builds the badge, the alerts and the notifications; every count on a page comes from one list. |
| Waiting shown as failing | Draft, Pending verification and Scheduled were drawn with the red cross in the findings table. | `StatusBadge kind="finding"`: draft neutral, pending and scheduled amber. |
| Status wording | "Non-Compliant", "Non-compliant" and "Not compliant"; all-caps statuses in the activity log; an outcome drawn as a category badge. | One vocabulary in `statusTones.ts`, sentence case, with `finding`, `outcome` and `activity` kinds. |
| Expiry window | 60 days in the logic, "< 30 days" on Personnel, 45 on Certificates. | `EXPIRY_WINDOW_DAYS` (60) and `expiringLabel()` everywhere. |
| Page headers | Hand-written on every screen; buttons wrapped and the primary dropped to a second row. | `PageHeader`. |
| Alerts | Red-tinted cards, cut off mid-card, all reading "N overdue or incomplete personnel items". | `AlertList`: white rows that name the person and the problem, with "View all". |
| View switching | A large segmented control, underline tabs and a header segmented control for the same job. | `Tabs` for sections of a page; `SegmentedControl` for filters only. |
| Clipped panels | The profile's required documents cut off their third item. | First items and a "View all" link. |
| Profile documents | Pending counted under "Due soon" and Rejected under "Expired". | One function drives the tiles, the filter and the row badge. |
| Borrowed copy | "Search records, personnel, flights", "Immediate sim check or line check required", slash labels. | Plain maintenance wording; the top-bar search opens the command palette. |
| Misaligned form rows | In dialogs, a control sat a few pixels lower than its neighbours (mixed label markup), fields were boxed in their own panels, counts and links sat beside labels, and radio groups sat on the label line. | `FormGrid` of `Field`s with equal control sizes; groups with a `legend`; extras in the hint. |
| Dialog footers | Up to six buttons, with PDF and print in both the header and the footer of the AES-CM-07 form. | Each action once: Cancel, secondary, then the primary last; delete alone on the left. |
| AES-CM-07 steps | Two status pills shared the step row and hid the fifth step. | The pills are in the header's meta line; all five steps show. |
| Spreadsheet leftovers | "(Excel Formula Cell B49)", "OK / NO GAP IDENTIFIED", pilot and helicopter placeholders. | Sentence-case statuses and maintenance examples. |
| Command palette | Raw buttons with title-case text, reaching four sections. | Built on the kit `Command`; reaches all ten sections. |
| Amber as a fill | The text amber was used for solid marks: it looked brown and was 1.08:1 from the success green. | `color-warning-fill` (#c27803): 3.51:1 on white, lighter than both green and red. |
| Calculated values | Shown in disabled fields, with pale text at 2.4:1. | Read-only fields with dark text at 8.8:1. |
| Closing dialogs | A click outside a dialog did nothing. | It closes the dialog; a confirmation must be answered and the AES-CM-07 form asks first. |
| The guide itself | Edited by hand on the page; its component bundle was built outside the repository and fell behind. | Its source is `design-system/` in the repository; one command rebuilds the bundle, stylesheet and tokens from the code, and CI fails when they drift. |
| Controls | 18 copied 32px inputs and hand-built selects and buttons. | `Field`, `Input`, `Select`, `Button`, `ToggleChip`. |
| Control sizes | Inputs `md` 40 / `toolbar` 36 / `sm` 32 while buttons were `md` 36 / `sm` 32: the same name meant two heights. | One scale, `sm` 32, `md` 36, `lg` 40px, on four density-aware tokens (`control-xs` to `control-lg`). |
| Checkboxes and radios | Raw native inputs with `accent-brand`, 16px targets, no shared look. | `Checkbox`, `CheckboxGroup`, `Radio`, `RadioGroup`: a 16px box in a 24px target, invalid and disabled states, density. |
| Dates | `DatePickerField` lived outside the kit with its own frame. | `DatePicker` in the kit, on the field frame and size scale. |
| Tooltips | Native `title` on icon buttons: no keyboard access, no Escape. | `Tooltip` (Radix); `IconButton` shows its label through it. |
| Waiting | Hand-made spinners and pulsing blocks. | `Spinner`, `LoadingState`, `Skeleton`, and `loading` on `Button`, `Table` and `DataTable`. |
| Confirmations | `window.confirm` and hand-built confirmation overlays. | `ConfirmDialog` and `useConfirmDialog`. |
| Status dropdown | A native select styled as a status pill in the AES-CM-07 form, under a lint exception. | `StatusSelect`; the exception is gone. |
| Tabs | 11 hand-built tab bars in three active colours. | `Tabs`. |
| Dialogs | 5 overlays without `role="dialog"`; three different backdrops; grey header and footer bands; no focus management; nine sizes. | Every dialog is a side sheet in `ModalShell` on one `ink` 40% backdrop (the PDF viewer keeps its dark scrim), with focus moved in, trapped and returned, in four sizes (`sm` 480, `md` 640, `lg` 896, `xl` 1280px), with `id` and `printable` typed. `ConfirmDialog` is the centred exception. |
| Focus | Offset ring, inset ring and a 15% field ring, written by hand per component. | `focusRing` (2px accent, 2px out), `focusRingInset` where it would clip, and fields with an accent border plus a full-strength ring. |
| Status symbols | Success and danger told apart by hue alone (1.12:1). | Check, triangle or cross on every status label. |
| Muted text | `color-muted` failed 4.5:1 on subtle-2 (4.36:1) and info-bg (4.46:1); `color-faint` was a second name for it. | Muted is `#626c81`: 4.62:1 on subtle-2, 4.73:1 on info-bg, at least 4.5:1 on every light fill. `color-faint` is removed. |
| Control edge | `color-line-strong` was 3.02:1 on white. | `#868e9b`: 3.30:1 on white, 3.05:1 on canvas. |
| Duplicate tokens | `color-info` copied accent; `color-subtle` and `color-canvas` were 1.01:1 apart. | `color-info` aliases accent; `color-subtle` aliases canvas. |
| Shadows | `shadow-sm` in 9 places; `shadow-popover` tinted with 16 read as decimal, `shadow-modal` with an old navy, `shadow-xs` with Tailwind's black. | Three shadows, all tinted from ink rgb(22 32 46); nothing else compiles. |
| Hatch | `.annunciator-hatch-soft` hardcoded the danger red. | Derived from `--color-danger` with `color-mix`. |
| Comments | `color-brand` said "headings"; `text-10` was "for uppercase code chips". | Brand: primary actions, selected chips and segments. `text-10`: the printed card only. |
| Motion | `tw-animate-css` was never imported; durations were ad hoc; nothing honoured reduced motion. | Imported; three durations and one easing as tokens; `prefers-reduced-motion` switches every transition and animation off. |
| Pick-or-type lists | `EditableCombobox`: option rows not reachable by keyboard. | `Combobox`: full keyboard support, Add new value and list management. |
| Notifications | Coloured left borders; warning rows louder than critical ones. | White rows; colour on the icon only. |
| Menus | The RowMenu popover was `rounded-lg` where other popovers were `rounded-xl`. | One floating surface (`menuPanel`): radius xl, hairline, `shadow-popover`. |
| Copy | All-caps labels. | Sentence case. |
| `cn()` | Dropped `text-13` and `text-32` next to a colour class. | Knows the type scale, control heights and durations; covered by a test. |
| DatePickerField | Border lightened on hover; the invalid border was weaker than the normal one. | Fixed, and now `DatePicker` in the kit. |

## Still open

- `color-viewer` and `color-viewer-raised` are only 1.06:1 apart; the PDF viewer separates them with `color-viewer-line` rules.
- Radius outliers remain: `rounded-[2px]` on the readiness strip cells and legend swatches (`ReadinessStrip`), `rounded-[3px]` on the dashboard's readiness grid cells, and `rounded-xs` on the printed card.
- 52 raw `<button>` elements remain in screens: navigation items, the PDF viewer's dark toolbar, chip remove buttons and names that act as links. The kit has no component for them yet.
- 50 raw `<label>` elements remain, wrapping what `Field` does not cover: checkboxes, segmented controls, file pickers and the dark viewer's fields.
- `HistoryTimeline`, `DataTable` and `RiskMatrix` are in the kit but no screen uses them yet.
- The `test:training` script fails on Node 20 and 22 (`--test-isolation=none`); only the design system tests have a script that runs there.
- This page is built from the repository (`npm run design-system:build`) but published by hand from a Claude session; CI checks that the tokens and component pages are in step, not that the page was republished. The pinned table column and the new status kinds have no preview of their own yet.
- Tablet width and comfortable density have not had a visual review. Five dialogs were changed but not seen on screen: issue training order, close out order, credited training, data import and the PDF viewer.
- Two tests pin title-case and slash wording in the AES-CM-07 form ("2A.1 Position & Scope Required Documents", "Competent with Limitations / Actions"); those strings stay until the tests change.
- The training matrix draws row lines under every second row only.
- Shadows are inlined by Tailwind into the utilities; they now read `--elevation-*` variables (so the dark theme can change them), but a value changed on this page still does not reach the live previews until the code changes too.
- Dark theme: the selected privilege tiles on the card's Interactive view and the selected segment fills are large pale-blue blocks (brand turned light). They meet every contrast rule but are brighter than anything else on a dark page; a softer selected fill for large areas has not been designed. The comfortable density and tablet width have not been seen in dark.
- Dark theme: the Google logo on the sign-in button keeps Google's own colours (brand rule), and stored department colours (`#0f2a4a` by default) are data, not drawn; neither follows the theme.
- Reports: confirm the real form number for the training certificate (the code holds `AES-TRN-CERT-01`) and add Acrobat Sign tags to the attendance sheet's trainee rows (only the instructor and quality rows carry them).

## Checked and fine

- `color-line-strong` misses 3:1 on subtle-2 (2.89), info-bg (2.96) and danger-bg (2.95) in light, but no bordered control sits on those fills; on surface, canvas, success-bg and warning-bg it holds 3:1. In dark it holds 3:1 everywhere (3.14 on subtle-2 at worst).
- Dark theme (November 2026): every section, every dialog and every component preview was seen in dark, and the axe WCAG 2.2 AA scan of 36 views runs in both themes. The surfaces, scrim, popovers over dialogs, readiness cells and hatching, status pills, risk matrix, skeletons, notices, chips, segmented controls, tabs, the native date picker (`color-scheme: dark`), the select chevron, scrollbars and the analytics bars (Tailwind classes, so they follow the tokens) all follow the theme. Paper stays paper: the authorisation card replica and the viewer's page are pinned light, and print emulation of the card renders light while the app is dark.
- Success and danger differ only in hue, but every use carries a word, icon or hatch.
- The printed Part-145 card and the compliance dossier are paper-form replicas. They may keep print sizes, `tracking-wider` uppercase labels and plain table cells (a lint exemption scoped to those two files).
- The PDF and report hex values all match tokens, including the new muted and the canvas grey for table headers. Moving them into one `PDF_COLORS` object would stop future drift.
