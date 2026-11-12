# UI kit

This folder is the kit of the `aero-design-system` package (apps import it as
`'aero-design-system'`). Every screen in AeroCompetence Hub is built from these components. The design
system page (tokens, components with live previews, and the audit) is the visual reference;
this file explains how the pieces fit and how to work with them.

## The design guide

The design guide people read is a published copy of this kit (a Claude artifact). Its text and
previews live in `design-system/`; `npm run guide:build` rebuilds its component bundle,
stylesheet and token list from the code, and CI (`npm run guide:check`) fails when a
token or a component has no entry there. To change the guide, change the code and
`design-system/`, then publish: see `design-system/PUBLISHING.md`.

## The four layers

```
theme.css          tokens      colours, type scale, weights, shadows (@theme)
src/components/styles.ts  recipes     class strings: the building material of components
src/components/*.tsx      components  Button, Field, Select, Table, StatTile, StatusBadge…
components/*View.tsx     screens     compose components; own layout, data and behaviour
```

Each layer only uses the one above it. A screen never writes a colour, font size or shadow
class to style a control: it picks a component and a variant. Screens still write layout
classes (`grid`, `gap-4`, `w-64`, `mt-2`) and text colours for plain copy (`text-muted`).

## Rules, and the lint that enforces them

The rules live in `eslint/plugin.mjs`; apps turn them on with the shareable config
`aero-design-system/eslint` (in AeroMetric-Control: `app/` and `components/`, except `app/api`).
In this repository `npm run lint` runs them on `src/`, with `ds/prefer-kit-components` off inside
the kit itself:

| Rule | Catches | Use instead |
|---|---|---|
| `ds/no-off-system-classes` | Tailwind's default palette (`gray-500`), arbitrary colours (`text-[#001e40]`) and sizes (`text-[9px]`), removed classes (`font-bold`, `text-sm`), shadows outside the set, faded tokens (`border-line/60`, `bg-ink/40`); `white` and `black` in any colour utility (`bg-white`, `text-white`, `ring-white`, `border-black`), except in `print:` variants, in a class string that also draws the dark viewer (`viewer-*`, `accent-soft`, `*-on-dark`) and in files with `allowWhiteBlack` | a token, the type scale, `shadow-xs` / `shadow-popover` / `shadow-modal`, a token at full strength; `bg-surface` for a panel or control, `text-on-solid` on a solid fill, `bg-scrim` behind a dialog |
| `ds/prefer-kit-components` | raw `<button>` in a screen (the message names the kit component to use; `app/error.tsx` and `app/global-error.tsx` are exempt through the rule's `allowRawButton` option, because an error boundary stays minimal); raw `<select>`, `<textarea>`, text `<input>`, `<table>`, `<th>`, `role="tab"`, filled `<button className="bg-brand…">` and the card surface written by hand (`bg-surface border border-line rounded-xl`) in screens; a kit file imported by path (`@/components/ui/Button`, `aero-design-system/dist/…`); raw `<input type="checkbox">`, `type="radio"`, `type="date"` and `<Input type="date">`; `title=` on `<button>`, `Button`, `IconButton`, `LinkButton`; `window.confirm()`; hand-made spinners and placeholders (`animate-spin`, `animate-pulse`, the `Loader2` / `LoaderCircle` icons) and checkbox colours (`accent-brand`); status labels built from classes (`statusPill()`, `badgeClass('danger')`, `toneClasses`, `statusSelectClass()`); imports of `components/common/DatePickerField` and `@radix-ui/react-tooltip`; removed kit APIs (`StatusPill`, `ModalStatusPill`, `<Badge tone="success">`, `size="toolbar"`, `ModalShell size="2xl"`, `<DatePickerField>`…); text set in capitals (`uppercase` on anything but a code `<Input>`) | `Button`, `IconButton`, `LinkButton`, `NavItem`, `MenuItem`, `Chip`, `ToggleChip`, `Card onClick`, `ReadinessCellButton`, `Pagination`, `SearchInput onClear`; `Select`, `Textarea`, `Input`, `Table`, `Th`, `Tabs`, `Button`, `Card`; the kit index `aero-design-system`; `Checkbox`, `RadioGroup`, `DatePicker`; `Tooltip` or IconButton `tooltip`; `ConfirmDialog` / `useConfirmDialog`; `Spinner`, `LoadingState`, Button `loading`, `Skeleton`; `StatusBadge`, `StatusSelect`; the new API it names; sentence case (`StatusBadge kind` sentence-cases a stored status) |
| `ds/no-retired-classes` | retired tokens: `text-faint` (and any `*-faint`), raw or arbitrary durations (`duration-150`, `duration-[250ms]`), default easings (`ease-in-out`) | `text-muted`; `duration-fast` / `duration-base` / `duration-slow` (or `motion.*`); `ease-standard` |

The palette is also locked in `theme.css` (`--color-*: initial`), so a default
Tailwind colour does not even compile. If a case truly cannot use the kit, silence one line
with a reason: `// eslint-disable-next-line ds/prefer-kit-components -- why`.

## Working with the kit

- **Need a control?** Import it: `import { Button, Field, Input, Select } from 'aero-design-system'`.
  Everything the kit offers is exported from `index.ts`; screens never import a kit file by path
  (lint). The one exception is `aero-design-system/styles` for page recipes (`pageShell`,
  `pageTitle`, `sectionTitle`, `metaLine`), and a server component, which cannot import the
  index (it is client code) and takes a recipe from `styles` instead.
- **A page?** `<PageHeader title description actions />` at the top of `pageShell`, never a
  hand-written title row. Actions go primary LAST; the header keeps the group together (see
  Page rules). `back={{ label, onClick }}` for a page opened from a list, `meta` for a record line.
- **A panel?** `<Card>`: `padding` `md` (20px, default), `sm` (16px, toolbars and filter bars)
  or `none` (a table or list edge to edge). Without a `title` the card is one box, so
  `className` lays out its children (`flex`, `grid`, `space-y-4`); `as="div"` for a panel that
  is not a page section, `as="form"` for a form that is the card.
- **A table?** `<Table>` with `THead`, `Th`, `Td`. `frame="card"` (default) is the table as its
  own card, `frame="inset"` a hairline box at radius lg inside a card or dialog, `frame="none"`
  no box and no scroller, inside a Card or scroll region that has them (a sticky header needs
  this). `minWidth` scrolls it sideways below that width; `tableClassName="table-fixed"`.
  A `none` table that can outgrow its box needs an `overflow-x-auto` parent (a `padding="none"`
  Card clips). **Row actions:** the last column, "Actions", is pinned: `pin="end"` on its `Th`
  and every `Td` (DataTable: `pin: 'end'` on the column). It sticks to the right edge, opaque,
  with a hairline on its left, so Edit or Review is never scrolled off screen. One action is a
  `sm` Button or an IconButton; more than one is a single `RowMenu`. Rows hover with
  `hover:bg-subtle`, which the pinned cell follows.
- **Showing a status?** `<StatusBadge kind="readiness" status={s} />`. Colours and words come
  from `statusTones.ts`; a new status is added there once, never as a ternary in a screen. A
  category or a count is a `<Badge>` (see Labels below).
- **A list of alerts?** `<AlertList>` of `<AlertRow tone title meta action />` in a
  `<Card padding="none">`: surface rows, hairlines, the colour on the icon only. A `Notice` is one
  banner, never a list item.
- **A number with meaning?** `<StatTile alert="danger" value={n} />`: red only while `n > 0`.
- **Merging classes?** Use `cn()` from `src/lib/utils.ts`. It knows our type scale; plain
  `tailwind-merge` silently drops `text-13` next to `text-ink`.
- **Bordered controls on a tinted panel?** Inputs, selects, comboboxes, date fields, textareas,
  unchecked checkboxes and radios, and outline icon buttons sit only on surface, canvas/subtle,
  success-bg or warning-bg. Inside an info, danger or violet panel, or on a subtle-2 fill, wrap
  them in a surface inner panel (`bg-surface border border-line rounded-lg`): line-strong, the
  control edge, is under 3:1 on those fills.
- **Same markup on a second screen?** Make it a component here instead of copying it.
- **Changing a component?** Change it once here; every screen follows. Update its preview on
  the design system page when the look changes.

## Forms

- Fields sit in a `FormGrid` (`columns` 1 to 4): rows start at the top, so a hint or an error
  under one field never moves the controls beside it. A wide field spans with `formSpan`.
- Every child of the grid is a `Field` (or a `RadioGroup` / `CheckboxGroup` with a `legend`), and
  every control in a row is the same size (the default `lg`). No hand-written labels.
- Nothing in a row sits in its own tinted or bordered box. A value the form works out or holds
  for reference is a **read-only** control (`<Input readOnly>`) with a hint: grey fill, hairline
  edge, dark text (ink-2, 8.8:1), because it is there to be read. **Disabled** is for a control
  that does not apply right now; its text is pale on purpose, so never use it to show a value.
- Solid amber marks (a readiness cell, a progress bar, a status dot) use `bg-warning-fill`, the
  brighter amber made for fills. `warning` is the text colour and looks brown as a block; as a
  fill it is also only 1.08:1 from the success green.
- A horizontal RadioGroup or CheckboxGroup in a row takes `listClassName={choiceRowInForm}`
  (from `styles.ts`), so its options centre on the controls beside it.
- A button beside an input (Add, Browse) is the same height as the input: `lg` beside `lg`.
- Sections of a long form are `Card`s with a `title`; a dialog's footer has Cancel, then
  secondary actions, then the primary action last, all `lg`. A destructive action sits alone
  on the left as `danger-ghost`.

## Sizes

One control-size scale, `ControlSize = 'sm' | 'md' | 'lg'`: 32, 36 and 40px (40, 44 and 48px
comfortable), read from the `--control-*` tokens. The scale is shared; the default differs:

| Control | `sm` 32px | `md` 36px | `lg` 40px | Default |
|---|---|---|---|---|
| `Input`, `Select`, `Combobox`, `DatePicker` | table cells, dense lists | toolbars, beside buttons and filters | form rows | `lg` |
| `Button` | dense rows, cards | everywhere else | a form footer or row beside 40px inputs | `md` |

The old sizes map like this: Input, Select, Combobox and DatePicker `md` (40px) is now `lg`,
still the default, so leave it out; `toolbar` (36px) is now `md`; `sm` is unchanged. Button
gains `lg`.

`ToggleChip` and `sm` `SegmentedControl` items sit below the scale on `--control-xs` (28px, 36px
comfortable); `md` `SegmentedControl` items are `--control-md` (36px). `EmptyState`,
`LoadingState`, `LinkButton`, `Card`, `Checkbox` and `Radio` keep their own `sm` / `md` props,
which are text sizes, not control heights (a choice's box is always 16px in a 24px target). Recipes: `inputSizes[size]` / `selectSizes[size]` in
`styles.ts` give the frame for a size (`inputBase` / `selectBase` are `lg`, `inputMdBase` /
`selectMdBase` `md`, `inputSmBase` / `selectSmBase` `sm`).

## Labels: status and category

Two components, never mixed:

- **`StatusBadge`** is the only status label: a rounded, semibold pill. Success, warning and
  danger always show their symbol (check, triangle, cross); `dot` marks a neutral status.
  - Mapped (preferred): `<StatusBadge kind="readiness" | "authorisation" | "document" | "finding" | "outcome" | "activity" status={…} />`.
    `kind="authorisation"` takes a `PersonnelAuthorisationStatus`; for a record that may hold
    a legacy free string use `<StatusBadge {...authorisationStatusBadge(raw)} />`, or
    `normaliseAuthorisationStatus(raw)`. Unknown values render neutral.
  - `kind="finding"` takes a compliance finding's `issue`, `kind="outcome"` an assessment's
    final decision (or the record's `COMPETENT` / `NOT COMPETENT`), `kind="activity"` an
    activity log status (`PENDING VERIFICATION`). They take any string; a value their table
    does not know renders neutral, in sentence case.
  - Direct, for a status outside those maps: `<StatusBadge tone="success" | "warning" | "danger" | "neutral">Passed</StatusBadge>`,
    with the tone from a `Record<…, StatusTone>` lookup, not a ternary.
  - `width="column"`: the 120px pill (12px text, centred) in a requirement row's Status
    column, so statuses line up down the page.
- **`StatusSelect`** is a status a person sets: the same pill (120px `column` by default, or
  `auto`) with a chevron, opening a list of the statuses drawn as their pills. Options live in
  a module-level table: `{ value, label, tone, description?, disabled? }[]`. A read-only status
  stays a `StatusBadge`; a status dropdown is always `StatusSelect`, never a native `<select>`
  styled as a pill (the old `statusSelectClass()` is removed and linted).
- **`Badge`** is categories and counts only: `tone` `neutral` (default) | `info` (filled
  blue) | `violet` (outlined, so it differs from info by more than hue) | `brand` (navy).
  It does not accept success, warning or danger.

Types: `StatusTone`, `CategoryTone`, and `Tone` (their union, for lookup tables that hold
either; `isStatusTone(t)` narrows one).

### One status vocabulary

A state has one word and one tone everywhere. The tables in `statusTones.ts` map the value as
stored to `{ label, tone }` (`StatusEntry`), labels in sentence case; matching ignores case,
spaces and punctuation, so "PENDING VERIFICATION" and "Pending verification" are one status.
Need the word in a sentence or a filter? Take the label (`READINESS_LABEL[s]`,
`findingStatus(issue).label`), never retype it.

| Table | Helper | Says |
|---|---|---|
| `READINESS_STATUS` (`READINESS_LABEL`, `READINESS_TONE`) | `readinessStatus(v)` | Compliant (success), Expiring soon (warning), Non-compliant (danger), Not configured (neutral). Never "Not compliant", "Expiring Soon" or "Non-Compliant" on screen. |
| `AUTH_TONE` + `AUTH_LABEL` | `authTone(v)` | Draft neutral; Issued, Valid success; Expiring soon warning; Expired, Lapsed, Suspended, Revoked danger. |
| `FINDING_ISSUE_STATUS` | `findingStatus(v)` | Expired, Not completed, Missing, Revoked, Suspended, Lapsed: danger. Pending verification, Scheduled, not yet completed, Expiring (shown "Expiring soon"): warning. Draft and the setup reasons: neutral. |
| `ASSESSMENT_OUTCOME_STATUS` | `outcomeStatus(v)` | Competent success; Competent with limitations or actions, Deferred, further evidence required: warning; Not competent danger. Deferred is a status, never a category Badge. |
| `ACTIVITY_STATUS` | `activityLogStatus(v)` | Verified, Completed success; Pending verification warning; Action required danger. |

Capitals are a storage format, never a look: no status, heading or label is set in capitals
(lint: `uppercase`). `sentenceCase(v)` is the fallback the helpers use for unknown values.

## Choices: checkbox, radio, segmented, select

- **`Checkbox`**: an independent yes or no ("Does not expire", "Mandatory requirement"). A
  native checkbox drawn as a 16px box in a 24px target (20px in 32px comfortable), its
  `label` clickable and the accessible name, an optional `description` or `error` under it,
  `indeterminate` for a partial "select all". `size="sm"` (12px text) for a field's aside;
  `variant="card"` for a bordered tile that fills while checked (option grids).
- **`CheckboxGroup`**: several checkboxes that answer one question: a `<fieldset>` with a
  `legend`, `hint` or `error`, and `orientation` / `size` / `variant` handed to every box;
  `listClassName` replaces the layout (a grid of cards).
- **`RadioGroup` + `Radio`**: one of two to six visible options, each with a sentence or a
  description. Controlled (`value`, `onChange`), string values (map booleans at the call site).
- **`SegmentedControl`**: two to four peer views or filters. **`Select` / `Combobox`**: long lists.

Never wrap a Checkbox or Radio in your own `<label>` (it is one), never put buttons or links in
its `label`, and never give its container an `onClick` that toggles the same state. A Checkbox
does not go inside `<Field>`; a group's legend, hint and error come from CheckboxGroup or
RadioGroup.

## Page rules

- **Page header.** Every screen opens with `PageHeader`. Title and actions share one row while
  they fit; when they do not, the whole actions group moves under the title as one
  left-aligned row. Primary action last, at most three buttons (more go in one RowMenu).
- **Expiring means 60 days.** `EXPIRY_WINDOW_DAYS` (60) and `expiringLabel()` ("Expiring within
  60 days") come from `lib/expiryWindow.ts` (re-exported by `lib/complianceOverview.ts`), and
  `isWithinExpiryWindow(days)` tests one. Never write the number in a screen.
- **Never clip.** A panel never cuts its content mid-item. Show the first N items and a
  "View all (n)" link (`AlertList limit onViewAll`), or scroll inside a region with a visible
  edge: `scrollRegion` from `styles.ts` (hairlines above and below, inset focus ring) on an
  element with a max height, `tabIndex={0}`, `role="region"` and an `aria-label`.
- **Switching views.** `Tabs` for sections of a page or a record. `SegmentedControl` only for two
  to four filters or modes of ONE list (`md` in a page toolbar, `sm` inside a card header), never
  as page navigation. Never both for the same job, and no third pattern (chips as tabs,
  buttons styled as tabs).
- **Counts.** A count shown in two places (a tab and a stat tile, a badge and a heading) comes
  from one function or one memo, never two filters that can drift.

## Dates

`DatePicker` is the one date field: the Select frame and size scale (default `lg`), the date
shown as DD-MMM-YYYY in tabular figures, the value passed in and out as an ISO `YYYY-MM-DD`
string (`onChange` receives the string, `''` when cleared). The box is a button that opens the
browser's own calendar; Enter, Space, Down or Up open it, Delete or Backspace clear it. Inside
`<Field>` it takes Field's id, hint and error by itself (`useFieldControl`, which Combobox uses
too). `dark` is for the document viewer only (as is Checkbox `dark`: accent-soft fill and
focus, viewer-text label). `className` is layout only. A button takes no `aria-required`, so a
`required` date is spoken as ", required" with the date (and ", invalid" when invalid).

## Buttons and everything clickable

A screen never writes `<button>` (lint). Every clickable thing has a kit component, so its
look, focus ring, 24px target and accessible name are the same everywhere:

| Clickable thing | Component |
|---|---|
| An action with words | `Button` (`variant`, `size`, `icon`, `loading`) |
| An action with an icon only | `IconButton` (`label` required; `badge` for a count at its corner) |
| An inline text action, or a name that opens its record | `LinkButton` (`tone="ink" size="lg" truncate` for a name in a table row) |
| A sidebar page or a sidebar action | `NavItem` in a `NavList`; the app name at the top is `NavBrand` |
| A row in a menu or a popover list | `MenuItem` in a `MenuList` (or `RowMenu` with `items`) |
| A picked value with a × | `Chip onRemove` (a value in a problem state: `StatusBadge onRemove`) |
| An option that turns on and off | `ToggleChip` |
| A whole card that selects or filters | `Card onClick pressed` |
| One readiness cell that opens a person | `ReadinessCellButton` |
| Page numbers | `Pagination` |
| Clearing a search field | `SearchInput onClear` |

- **Toggles.** A Button or IconButton with `aria-pressed` is a toggle: `secondary`, `ghost`
  and the icon buttons show the pressed look themselves (accent edge and info fill, or the
  subtle-2 fill). Pass the attribute; never a class.
- **The dark viewer.** `dark` on Button, IconButton and LinkButton draws them for the
  document viewer, as Checkbox and DatePicker `dark` do: viewer fills (`viewer-raised`,
  `viewer-hover`), white or viewer-muted text, the primary in viewer-primary (navy vanishes there),
  danger text in `danger-on-dark`, and `focusRingDark` (accent-soft). A disabled one with a
  tooltip sits in `tooltipAnchorDark`.
- **IconButton `badge`.** A number (0 hides it, above 99 shows "99+") or `true` for a dot: a
  danger disc at the top-right corner with a surface-coloured edge. The name becomes "Notifications, 3
  new" (`badgeLabel` changes the words); the tooltip still shows the label only.
- **NavItem.** 36px rows (`h-control-md`), 16px icon, 13px label, `active` sets
  `aria-current="page"`, the subtle-2 fill and medium weight. `badge` is a count: a neutral
  `Badge`, or `badgeTone="alert"` for the red count pill of something to act on; `badgeLabel`
  says what it counts to screen readers. `NavList label="Workspace"` is the group (a `nav`
  landmark, or `as="div"` for rows that open dialogs).
- **Menus.** `MenuList` is a `role="menu"` list with the RowMenu keyboard (Up, Down, Home,
  End; Escape and Tab call `onClose(reason)`; choosing an item calls `onClose('select')`, then
  its `onSelect`). Put it in a `PopoverContent` (Escape, outside click and focus return come
  with it) or the screen's own panel. `MenuItem` takes `icon`, `iconTone`, `danger`,
  `description` (a second line), `meta` (end of the label line). A labelled trigger for a
  plain action menu is `RowMenu trigger={<Button>…</Button>}`.
- **Chip.** 24px tall (32px comfortable), 12px text, category tones only; `onRemove` adds a
  16px × in a 24px target named `removeLabel` ("Remove A320").
- **Card `onClick`.** The whole card is one left-aligned `<button>`: line-strong edge on hover,
  `pressed` gives `aria-pressed` and a 2px accent edge (border plus a 1px ring, full
  strength), the shared focus ring. It takes no `actions` (a button holds no buttons).
- **ReadinessCellButton.** `state`, `label` (who and the state: "Maria Konstantinou:
  Expiring soon"), `onSelect`: a 24px cell in the compact strip's colour with a tooltip.

## Search fields and paging

- **`SearchInput`** replaces the hand-built search icon beside an `Input`: the `md` Input
  (36px) with the 16px search icon inside, `type="search"`, and with `onClear` a 24px ×
  (`clearLabel`, default "Clear search") while it has a value; clearing puts focus back in
  the field. `className` lays out the wrapper (`w-64`, `flex-1`); name it with `aria-label`
  or a `Field`.
- **`Pagination`** is a paged table's footer: "Showing 1 to 15 of 140 records" (`label` is
  the noun), then previous, page numbers (`sm`, the current one primary with
  `aria-current="page"`, an ellipsis past seven pages) and next. With one page only the count
  shows. Props: `page` (1-based), `pageSize`, `total`, `onPageChange`. Put it in the Card's
  footer with `className="border-t border-line p-4"`.

## Toasts

`ToastProvider` is mounted once in `components/Providers.tsx`; `const { toast, dismiss } =
useToast()` anywhere below it. `toast({ tone, title, description?, action?, duration? })`:

- **When.** The outcome of an action that does not keep a dialog open ("Course saved",
  "Could not delete TRN-002"). An error about a field or inside an open dialog stays a
  `Notice` (or the field's `error`) there; a question is a `ConfirmDialog`; a validation
  message is never a toast.
- **Look.** Bottom right, on the popover surface (`surface`, hairline, `shadow-popover`, radius
  xl), the tone's Notice icon in its colour, a semibold title, one optional line, one optional
  `action` (`{ label, onClick }`, a LinkButton that also closes it) and a close button.
- **Timing.** `success` (default), `info` and `neutral` close after 5 seconds; `warning` and
  `danger` stay until closed (`duration` in ms, or `null`, overrides). The timer pauses while
  the pointer is over the stack or focus is inside it. At most four show at once.
- **Screen readers.** Danger is announced assertively (`role="alert"`), the rest politely
  (`role="status"`), from live regions that stay mounted.
- **Layer and motion.** z-[90] (see Floating surfaces), slide and fade in with `motion.fast`,
  no motion under reduced motion.

## Tooltips

`Tooltip` (Radix, on the popover surface) is a short hint for a control that can take focus:
it opens on hover after 400ms and at once on keyboard focus, Escape closes it without closing
the dialog underneath, and touch never opens it. One `TooltipProvider` is mounted in
`components/Providers.tsx`.

- `IconButton` shows its `label` as a tooltip by itself (`asLabel`, so screen readers hear the
  name once). `tooltip="…"` gives a longer hint, `tooltip={false}` none. It takes no `title`.
- Wrap any other kit button: `<Tooltip content="Open the full assessment"><Button …/></Tooltip>`.
  The child must be one element that takes a ref and spreads its props (every kit button does).
- A disabled button fires no events: put the tooltip on `<span tabIndex={0} className={tooltipAnchor}>`
  around it (`tooltipAnchor` from `styles.ts`: the shared focus ring and the button's radius).
- Never put essential information only in a tooltip, nothing interactive inside one, and no
  tooltip on a trigger whose click opens its own panel (menus, popovers). A native `title`
  stays only on non-interactive truncated text and chart marks.

## Busy states

- **`Button loading`** (and `IconButton loading`): the spinner replaces the icon, or sits over
  the label when there is none, so the width never changes; aria-busy is set, clicks and form
  submits are ignored, and the button keeps focus. Keep the label as it is.
- **`Spinner`**: 16px inline (default), 14 in a `sm` button, 12 in a badge, 20 for a panel;
  `tone` current / muted / accent; `decorative` inside something that already says it is busy,
  otherwise it is a polite status named by `label` or its visible children. It keeps turning
  under reduced motion (the only sign of progress).
- **`LoadingState`**: the busy twin of `EmptyState` (same frame and `size`, plus
  `surface="dark"` for the viewer).
- **`Skeleton`**, **`SkeletonText`**, **`SkeletonTableRows`**: placeholders where the shape is
  known. Give a `label` to one per region, but never inside an element with `aria-busy`
  (screen readers may hold back live updates there, and the node is gone when it clears).
  For tables set `loading` and `loadingLabel` on `Table` (or on `DataTable`, which renders the
  rows itself): they announce from a status region outside the busy `<table>` that stays
  mounted, so `SkeletonTableRows` there takes no `label`.

## Focus

One look for keyboard focus, drawn only by the constants in `styles.ts`; no file in this
folder writes its own `focus:` classes (a test in `tests/designSystem.test.ts` checks it).

- `focusRing`: a solid 2px accent ring 2px outside the control on keyboard focus. It is an
  outline, so it never mixes with a control's own `ring-1 ring-inset` edge and it survives
  Windows high-contrast mode. Buttons, links, chips, tiles, cells.
- `focusRingInset`: the same ring just inside the box, where an outer one would be clipped
  (tabs, sortable table headers, scroll regions). `focusRingGroup` puts it on a child of a
  focusable `group`.
- `focusField`: inputs, selects, textareas and combobox triggers on any focus: accent border
  plus a full-strength 2px accent ring. `focusFieldWithin` for a frame around a borderless
  control, `fieldOpen` for a trigger whose list is open, `fieldInvalid` for an error.
  `focusFieldDark` (inside `fieldDark`) is the same ring in accent-soft on the dark viewer.
- Choices (`choiceBox`), the StatusSelect pill (`statusSelectTrigger`) and every kit button take
  `focusRing`; menus and listboxes highlight the active row instead of drawing a ring.

## Motion

Three durations and one easing, from tokens in `theme.css`: `duration-fast` 120ms
(hover, menus, popovers), `duration-base` 180ms (centred dialogs, page fade-in),
`duration-slow` 260ms (side sheets and their backdrop), all on `ease-standard`. `motion.fast`
/ `base` / `slow` in `styles.ts` pair each duration with the easing. `transition-colors` and
friends already default to fast + standard, so a hover needs no duration class. Under
`prefers-reduced-motion: reduce` every transition and animation is switched off (a busy
spinner keeps turning).

## Dialogs

Every dialog is a side sheet: `ModalShell` docks a full-height panel to the right edge,
sliding in from the right over the scrim backdrop. The header and the pinned footer are
ruled and the body scrolls between them. Nothing needs to be passed for this; it is the
default.

- **Width** follows `size`, four steps, the same for sheets and centred dialogs: `sm` 480px
  (a confirmation, a short form), `md` 640px (default, an ordinary form or record), `lg`
  896px (two-column forms, a form with a table), `xl` min(1280px, 96vw) (large working
  forms such as the AES-CM-07 assessment, printable cards). Below the `sm` breakpoint every
  sheet is full width. `id` sets the dialog element's id.
- **Closing.** The close button, Escape and a click outside the dialog all close it. Only a
  press that starts on the backdrop counts, so dragging a selection out of a field does
  nothing. A click outside a nested dialog closes that one only. Exceptions: a `ConfirmDialog`
  must be answered (outside clicks do nothing); a long form with no draft passes
  `onBackdropClose` and asks first (the AES-CM-07 assessment); a dialog with an inline form
  open can pass `closeOnBackdrop={false}` while it is open; `closeDisabled` (a save in
  progress) blocks all three.
- **Stacked sheets.** A dialog opened from a dialog passes `layer="nested"` (z-[60]); one
  opened from that passes `layer="top"` (z-[70]); the base layer is z-50. The child docks on
  top of the parent with its own shadow, and its backdrop covers the parent, which dims.
  Keep a child no wider than its parent so the parent still shows beside it. Escape and
  the focus trap belong to the top-most dialog only.
- **Printing.** `printable` dialogs (the Part-145 authorisation card) drop the sheet when
  printed: the body flows onto the page at full width with no header, footer, shadow,
  fixed positioning or animation.
- **Old sizes** map like this: `sm`, `md` become `sm`; `lg`, `xl` become `md`; `2xl`, `3xl`
  become `lg`; `4xl`, `wide`, `full` become `xl`.
- **Centred dialogs are an explicit opt-out:** `placement="center"` gives the calm centred
  dialog (surface, rounded, hairlines only while the body scrolls). Its one sanctioned use is
  `ConfirmDialog`; screens do not pass it themselves.
- **Confirmations: `ConfirmDialog`.** The small centred alertdialog (480px) that asks before a
  step that cannot be taken back. It replaces `window.confirm` and hand-built confirmation
  sheets. The title is a question ("Delete course TRN-002?"), `body` says what happens and
  whether it can be undone, `confirmLabel` names the action ("Delete course", never "Yes" or
  "OK"). `tone="danger"` gives the red button and starts focus on Cancel. `busy` (or a Promise
  returned by `onConfirm`) puts the confirm button in its loading state and locks Cancel and
  Escape. It portals to `<body>` on layer "top", so it needs no layer. In an event handler use
  `const { confirm, dialog } = useConfirmDialog()`, then `if (!(await confirm({ … }))) return;`,
  and render `{dialog}` once.
- `role="alertdialog"` and `aria-describedby` are ModalShell props, for dialogs that interrupt.

## Floating surfaces

Popover, menus (RowMenu), list popups (Combobox, StatusSelect) and tooltips are one family:
surface, hairline border, `shadow-popover`, radius xl for panels (md for the small tooltip), and
a quick fade and zoom in (`motion.fast`). Option rows share one geometry (32px, 40px
comfortable, radius md): `menuItem` (RowMenu), `listOption` (StatusSelect) and `commandOption`
(Combobox's CommandItem). The highlighted row keeps its subtle fill and adds a 2px inset accent
outline (a focused menu item takes `focusRingInset`), because the fill alone is about 1.1:1
against the panel. Recipes: `menuPanel`, `menuItem`, `listOption`, `commandOption`,
`tooltipPanel`, `toastPanel`. Layers: dialogs 50 / 60 / 70, Popover 80, Toast 90, RowMenu 100, Tooltip 110.

## Density

Two densities. **Default** is the dense desktop layout. **Comfortable** is for tablets on the
hangar floor and anyone working standing or gloved.

- **How it switches.** `DensityProvider` (`src/lib/density.tsx`) sets `data-density="comfortable"`
  on `<html>`. People choose it in the Settings dialog ("Display density");
  the choice is remembered per user in this browser, and touch screens (`pointer: coarse`)
  start comfortable. `useDensity()` reads or sets it from code.
- **How the kit follows it.** Control heights are tokens: `--control-xs|sm|md|lg` (used as
  `h-control-md`, `size-control-sm`…) change value under `data-density="comfortable"`, so a
  control grows without a `comfortable:` class. Text and padding use the `comfortable:`
  variant defined in `theme.css`, which applies only under that attribute. Every screen
  using the kit grows without changes of its own:

  | Default | Comfortable | Token | Used by |
  |---|---|---|---|
  | 28px | 36px | `h-control-xs` | toggle chips, `sm` segmented items |
  | 32px | 40px | `h-control-sm` | `sm` buttons, icon buttons (`size-control-sm`), `sm` inputs, selects and comboboxes, option rows (menus, list popups) |
  | 36px | 44px | `h-control-md` | `md` buttons (default), `md` inputs, selects and comboboxes (toolbars), `FilterSelect`, `md` segmented items |
  | 40px | 48px | `h-control-lg` | `lg` inputs, selects, comboboxes and date fields (the default), `lg` buttons |
  | 16px box in a 24px target | 20px box in a 32px target | | `Checkbox`, `Radio` |
  | 13px body | 15px (`body-comfortable`) | | buttons, inputs, selects, table cells, tabs |
  | 12px labels | 13px | | field labels, table headers, meta lines, hints |
  | cell padding 10-12px | 16px | | `Th` / `Td` (`tableTh`, `tableTd`) |

  Colours, radii, weights, icon sizes and layout stay the same.
- **Writing a new kit component?** Take its height from a control token and pair its body
  text with the `comfortable:` size, e.g. `h-control-md text-13 comfortable:text-15`. Screens
  do not add `comfortable:` classes themselves; they pick a kit size.
- `DataTable` can also be forced comfortable on its own with `density="comfortable"`.

## Themes

Light (default) and dark, one set of tokens. `ThemeProvider` (`src/lib/theme.tsx`) sets
`data-theme="dark"` on `<html>`; people choose it in the Settings dialog ("Theme"), per user,
remembered in this browser like density, never from the operating system. A small script from
`getThemeInitScript(storageKey)`, inlined in the app's root layout, applies the last theme used
before the first paint. `useTheme()` reads or sets
it from code.

- **How the kit follows it.** Every colour is a token, and the dark block in
  `theme.css` gives the same tokens other values, so the kit needs no `dark:` classes.
  Write panels as `bg-surface` and text on a solid fill as `text-on-solid`, never white.
- **Fixed in both themes:** the viewer family (`viewer-*`, `accent-soft`, `*-on-dark`, the
  `dark` recipes) and paper. Wrap on-screen paper in `data-theme="light"` (the light pin).
- **Print** is always light: the dark values apply on screen only.

## Targets

Anything clickable is at least `target-min`, 24x24px, even when its glyph or text is smaller
(WCAG 2.2 target size). Kit controls already meet it: `LinkButton` and `btn.link` keep a
`min-h-6` box around their text, icon buttons are 32px (40px comfortable), a Chip's × and a
`ReadinessCellButton` are 24px, and panel cells in
`AnnunciatorPanel` that are buttons (`onSelect`) are 48px tall with a focus ring and a name
that says the requirement and its state. The compact `ReadinessStrip` cells are never buttons.
When you build a small icon-only control, give it `min-h-6 min-w-6` (or use `IconButton`) and
an `aria-label`.

## Taking the kit to another app

The kit is now the `aero-design-system` package; see the repository's README.md and
MIGRATING.md. Everything that was in AeroMetric-Control's `components/ui` ships, in two kinds:

- **Core** (any app): Button, IconButton, LinkButton, NavItem, NavList, NavBrand, MenuList,
  MenuItem, Chip, Pagination, SearchInput, ToastProvider and useToast, Field, Input, Select, Textarea,
  FilterSelect, Checkbox, CheckboxGroup, Radio, RadioGroup, DatePicker, Combobox, ToggleChip,
  Card, PageHeader, Table, DataTable, Tabs, SegmentedControl, Badge, Notice, AlertList, EmptyState, Spinner,
  LoadingState, Skeleton, Tooltip, Popover, ModalShell, ConfirmDialog, RowMenu, StatusSelect,
  `styles.ts`, `cn()` and the lint rules.
- **Domain** (Part-145 vocabulary): StatusBadge `kind` and `statusTones.ts`, StatTile's status
  semantics, ReadinessStrip (and ReadinessCellButton), EvidenceField, RiskMatrix, BrandMark. They
  take plain props and types defined in the package (`ReadinessStatus`,
  `PersonnelAuthorisationStatus`, `ReadinessGroup`); how a status is worked out stays in each app.
