/*
 * Shared class recipes for the AeroCompetence Hub design system. Colours, type
 * sizes, weights and letter-spacing come from the tokens in app/globals.css.
 * Use these instead of copying class strings into components.
 *
 * Density: control heights come from the control tokens in app/globals.css
 * (`h-control-xs|sm|md|lg`, 28/32/36/40px), which grow by themselves under
 * <html data-density="comfortable"> (36/40/44/48px; set by lib/density.tsx). Body text
 * and cell padding still carry their `comfortable:` size (the variant in globals.css):
 *   13px body text -> 15px (body-comfortable); 12px labels -> 13px; table cells -> 16px padding.
 * Targets: anything clickable is at least 24x24px (target-min, `min-h-6 min-w-6`),
 * even when its glyph or text is smaller.
 */

/*
 * Focus. One look for keyboard focus everywhere, and only these constants draw it: no
 * component in components/ui writes its own focus classes.
 * - focusRing: a solid 2px accent ring 2px outside the control, on keyboard focus
 *   (focus-visible). Buttons, links, chips, tiles, cells. It is drawn as an outline, not
 *   a box-shadow ring, so it never mixes with a control's own `ring-1 ring-inset` edge
 *   (badges, status pills, annunciator cells) and it survives Windows high-contrast mode,
 *   which drops box-shadows.
 * - focusRingInset: the same ring drawn just inside the box, where an outer ring would be
 *   clipped (tabs in a scrolling tab list, sortable table header buttons, scroll regions).
 * - focusRingGroup: the ring on a child, when the focusable element is its `group`
 *   parent (risk-matrix cells); the parent takes `outline-none`.
 * - focusField: text fields, selects and comboboxes on any focus (a click too, since the
 *   caret goes there): accent border plus a full-strength 2px accent ring hugging it.
 *   `outline-hidden` keeps a transparent outline that high-contrast mode paints.
 *   focusFieldWithin is the same for a frame around a borderless control (date picker,
 *   filter select), fieldOpen for a trigger whose list is open, fieldInvalid for a field
 *   with an error (danger border and ring instead of accent, in every state the frames
 *   style: rest, hover, focus, focus-within and open).
 */
export const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
export const focusRingInset = 'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent';
export const focusRingGroup = 'group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-accent';
export const focusField = 'focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent';
export const focusFieldWithin = 'focus-within:outline-hidden focus-within:border-accent focus-within:ring-2 focus-within:ring-accent';
export const fieldOpen = 'data-[state=open]:border-accent data-[state=open]:ring-2 data-[state=open]:ring-accent';
export const fieldInvalid =
  'border-danger text-danger hover:border-danger focus:border-danger focus:ring-danger focus-within:border-danger focus-within:ring-danger data-[state=open]:border-danger data-[state=open]:ring-danger';
/**
 * focusRing on the dark document viewer: the same 2px ring 2px out, in accent-soft, because
 * accent is too dark to see there. A complete recipe, never a cn() override of focusRing.
 */
export const focusRingDark = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft';

/**
 * Focusable wrapper that carries a Tooltip for a disabled button (a disabled <button> fires
 * no events): `<span tabIndex={0} className={tooltipAnchor}>`. It takes the shared focus ring
 * and the button's radius.
 */
export const tooltipAnchor = `inline-flex rounded-lg ${focusRing}`;
/** tooltipAnchor on the dark document viewer (accent-soft ring). */
export const tooltipAnchorDark = `inline-flex rounded-lg ${focusRingDark}`;

/*
 * Motion: three durations and one easing (tokens in app/globals.css). transition-*
 * utilities already default to fast + standard, so a hover needs nothing more; an
 * entrance animation (animate-in) picks one of these. Never duration-150 or duration-[…].
 */
export const motion = {
  /** 120ms: menus, popovers, tooltips opening; hover and press. */
  fast: 'duration-fast ease-standard',
  /** 180ms: centred dialogs, page fade-in. */
  base: 'duration-base ease-standard',
  /** 260ms: side sheets sliding in, and their backdrop. */
  slow: 'duration-slow ease-standard',
} as const;

const buttonShape = 'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
const buttonBase = `${buttonShape} ${focusRing}`;

/*
 * One control-size scale for every control that has a height: sm 32px, md 36px, lg 40px
 * (comfortable 40/44/48px). Which size is the DEFAULT differs by control:
 * - Input, Select, Combobox, DatePicker default to `lg` (40px, a form row);
 *   `md` lines up with toolbar buttons and filters; `sm` sits in table cells and dense lists.
 * - Button defaults to `md` (36px); `lg` is for a form footer beside 40px inputs.
 * ToggleChip and `sm` SegmentedControl items sit below the scale on --control-xs (28px, 36px comfortable).
 */
export type ControlSize = 'sm' | 'md' | 'lg';

const buttonSize = {
  lg: 'h-control-lg px-4 text-13 comfortable:text-15',
  md: 'h-control-md px-4 text-13 comfortable:text-15',
  sm: 'h-control-sm px-3 text-12 comfortable:text-13',
} as const satisfies Record<ControlSize, string>;

/*
 * A button with aria-pressed is a toggle (a panel shown, a filter on): secondary and ghost
 * show the pressed state themselves (`aria-pressed:`), so a screen passes the attribute only.
 */
const buttonVariant = {
  primary: 'bg-brand text-on-solid shadow-xs hover:bg-brand-2',
  secondary:
    'border border-line-strong bg-surface text-ink shadow-xs hover:bg-subtle aria-pressed:border-accent aria-pressed:bg-info-bg aria-pressed:text-accent',
  ghost: 'text-ink-2 hover:bg-subtle-2 aria-pressed:bg-subtle-2 aria-pressed:text-ink',
  danger: 'bg-danger text-on-solid shadow-xs hover:bg-danger-2',
  'danger-ghost': 'text-danger hover:bg-danger-bg',
} as const;

/*
 * The same variants on the dark document viewer (Button `dark`): viewer fills and hairlines,
 * white or viewer-muted text, the primary in viewer-primary (the light accent: navy vanishes
 * on the viewer), the destructive text in danger-on-dark, and focusRingDark. Only fixed
 * colours (viewer-*, accent-soft, *-on-dark, white): the viewer looks the same in both themes.
 */
const buttonVariantDark = {
  primary: 'bg-viewer-primary text-white shadow-xs hover:bg-viewer-primary-hover',
  secondary:
    'border border-viewer-line bg-viewer-raised text-white hover:bg-viewer-hover aria-pressed:border-accent-soft aria-pressed:bg-viewer-hover aria-pressed:text-accent-soft',
  ghost: 'text-viewer-muted hover:bg-viewer-hover hover:text-white aria-pressed:bg-viewer-hover aria-pressed:text-accent-soft',
  danger: 'bg-viewer-danger text-white shadow-xs hover:bg-viewer-danger-hover',
  'danger-ghost': 'text-danger-on-dark hover:bg-viewer-hover',
} as const satisfies Record<keyof typeof buttonVariant, string>;

export type ButtonVariant = keyof typeof buttonVariant;
export type ButtonSize = keyof typeof buttonSize;

/** A button's classes. `dark` for the document viewer: its variants and the accent-soft focus ring. */
export function buttonClass(variant: ButtonVariant = 'secondary', size: ButtonSize = 'md', dark = false) {
  if (dark) return `${buttonShape} ${focusRingDark} ${buttonSize[size]} ${buttonVariantDark[variant]}`;
  return `${buttonBase} ${buttonSize[size]} ${buttonVariant[variant]}`;
}

export const btn = {
  primary: buttonClass('primary'),
  secondary: buttonClass('secondary'),
  ghost: buttonClass('ghost'),
  danger: buttonClass('danger'),
  dangerGhost: buttonClass('danger-ghost'),
  link: `inline-flex min-h-6 items-center gap-1.5 rounded-md text-13 font-medium text-accent hover:text-brand transition-colors cursor-pointer disabled:opacity-40 ${focusRing} comfortable:text-15`,
  icon: `inline-flex items-center justify-center size-control-sm rounded-lg text-muted hover:text-ink hover:bg-subtle-2 aria-pressed:bg-subtle-2 aria-pressed:text-ink transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${focusRing}`,
  /** Icon-only destructive row action: muted until hovered, then danger. */
  iconDanger: `inline-flex items-center justify-center size-control-sm rounded-lg text-muted hover:text-danger hover:bg-danger-bg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${focusRing}`,
} as const;

/* The frame every text field shares; height, padding and text size are added per size below. */
/**
 * Read-only: a value the form works out or holds for reference (a calculated date, "No expiry").
 * It is meant to be read, so the text stays dark (ink-2 on subtle, 8.8:1); the grey fill, the
 * hairline edge and no shadow say it cannot be typed in. Disabled is the pale one: a control
 * that does not apply right now.
 */
export const fieldReadOnly = '[&[readonly]]:bg-subtle [&[readonly]]:text-ink-2 [&[readonly]]:border-line [&[readonly]]:shadow-none [&[readonly]]:cursor-default';
const fieldFrame = `rounded-lg border border-line-strong bg-surface text-ink shadow-xs transition-colors placeholder:text-muted ${focusField} ${fieldReadOnly} disabled:bg-subtle disabled:text-disabled`;

/*
 * Inline text action ("View profile", "Clear filters"): no box, underline on hover, a 24px target.
 * Sizes are text sizes: `lg` 13px (body text: a name in a table row), `md` 12px, `sm` 11px.
 * Tones: `accent` for actions and navigation, `muted` for resets, `ink` for a name or title
 * that opens its record (reads as text, turns accent and underlined on hover).
 */
const linkSize = { lg: 'text-13 comfortable:text-15', md: 'text-12 comfortable:text-13', sm: 'text-11 comfortable:text-12' } as const;
const linkTone = { accent: 'text-accent hover:text-brand', muted: 'text-muted hover:text-ink', ink: 'text-ink hover:text-accent' } as const;
/** The tones on the dark document viewer. */
const linkToneDark = {
  accent: 'text-accent-soft hover:text-white',
  muted: 'text-viewer-muted hover:text-white',
  ink: 'text-white hover:text-accent-soft',
} as const satisfies Record<keyof typeof linkTone, string>;
export type LinkButtonSize = keyof typeof linkSize;
export type LinkButtonTone = keyof typeof linkTone;
export function linkButton(size: LinkButtonSize = 'md', tone: LinkButtonTone = 'accent', dark = false) {
  return `inline-flex min-h-6 items-center gap-1 ${linkSize[size]} font-semibold ${dark ? linkToneDark[tone] : linkTone[tone]} hover:underline transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${dark ? focusRingDark : focusRing} rounded-md`;
}

/** Icon-only button with a border, for row actions next to other icon buttons. 32px, 40px comfortable. */
export const iconButtonOutline = `inline-flex items-center justify-center size-control-sm rounded-lg border border-line-strong bg-surface text-ink shadow-xs hover:bg-subtle aria-pressed:border-accent aria-pressed:bg-info-bg aria-pressed:text-accent transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${focusRing}`;

/*
 * Icon buttons on the dark document viewer (IconButton `dark`), per variant: viewer-muted
 * icons that turn white on the viewer hover fill, the outline on the raised viewer panel,
 * danger in danger-on-dark; focusRingDark. A pressed toggle (aria-pressed) turns accent-soft.
 */
const iconButtonShape = 'inline-flex items-center justify-center size-control-sm rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
export const iconButtonDark = {
  ghost: `${iconButtonShape} text-viewer-muted hover:bg-viewer-hover hover:text-white aria-pressed:bg-viewer-hover aria-pressed:text-accent-soft ${focusRingDark}`,
  outline: `${iconButtonShape} border border-viewer-line bg-viewer-raised text-viewer-muted hover:bg-viewer-hover hover:text-white aria-pressed:border-accent-soft aria-pressed:text-accent-soft ${focusRingDark}`,
  danger: `${iconButtonShape} text-danger-on-dark hover:bg-viewer-hover ${focusRingDark}`,
} as const;

/*
 * Counts. A count on an icon button sits at its top-right corner (unread notifications): a
 * solid danger disc with a surface-coloured edge so it reads over any icon, 16px, 10px semibold text;
 * `iconButtonDot` is the same mark without a number. A count beside a nav item is a
 * `Badge` (neutral), or `countAlert`, the red pill for something to act on (urgent alerts).
 * They are counts, never a status label: a status is a StatusBadge.
 */
export const iconButtonCount =
  'pointer-events-none absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-10 font-semibold leading-none tabular-nums text-on-solid ring-2 ring-surface';
export const iconButtonDot = 'pointer-events-none absolute right-1 top-1 size-2 rounded-full bg-danger ring-2 ring-surface';
export const countAlert =
  'inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-11 font-medium leading-5 tabular-nums ring-1 ring-inset bg-danger-bg text-danger ring-danger-line';

/*
 * Navigation (NavItem in a NavList): 36px rows (h-control-md, 44px comfortable), radius lg,
 * a 16px icon and 13px text. The current page fills subtle-2 in ink, medium weight, its icon
 * in brand; the rest are ink-2 with a muted icon and hover to subtle.
 */
export function navItem(active: boolean) {
  return `flex w-full items-center gap-2 h-control-md rounded-lg px-2.5 text-left text-13 comfortable:text-15 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${focusRing} ${
    active ? 'bg-subtle-2 text-ink font-medium' : 'text-ink-2 hover:bg-subtle hover:text-ink'
  }`;
}
/** The group label above a NavList ("Workspace"): 11px medium muted, aligned with the item text. */
export const navGroupLabel = 'px-2.5 pb-1.5 text-11 font-medium text-muted comfortable:text-12';

/** Single-line input, size `lg`: 40px tall (48px comfortable), a form row. `inputBase` leaves the width to the caller. */
export const inputBase = `h-control-lg px-3 text-13 comfortable:text-15 ${fieldFrame}`;
export const input = `w-full ${inputBase}`;
export const inputClass = input;

/** Input, size `md`: 36px (44px comfortable), the same height as toolbar buttons, dropdowns and filters (search fields). */
export const inputMdBase = `h-control-md px-3 text-13 comfortable:text-15 ${fieldFrame}`;

/** Input, size `sm`: 32px (40px comfortable), for table cells, inline edits and dense lists (pairs with selectSmBase). */
export const inputSmBase = `h-control-sm px-2.5 text-12 comfortable:text-13 ${fieldFrame}`;
export const inputSmClass = `w-full ${inputSmBase}`;

/** Input frame per ControlSize (no width). */
export const inputSizes: Record<ControlSize, string> = { sm: inputSmBase, md: inputMdBase, lg: inputBase };

/*
 * Dropdowns: the same frame as inputs (surface, line-strong border at 3:1, shadow-xs) so a
 * select and an input side by side read as the same kind of control. Select, Combobox and
 * DatePicker are buttons on this frame and draw their own chevron (selectChevron, 36px kept
 * clear with pr-9); the global select rule in app/globals.css gives any native select the
 * same chevron.
 */
const selectFrame = `rounded-lg border border-line-strong bg-surface text-ink shadow-xs transition-colors cursor-pointer hover:border-muted ${focusField} disabled:cursor-not-allowed disabled:bg-subtle disabled:text-disabled disabled:hover:border-line-strong`;
/**
 * Height, padding and text size of a select-like control per ControlSize, without the frame.
 * selectSizes adds the light frame; fieldDark (below) is the dark viewer's frame.
 */
export const selectGeometry: Record<ControlSize, string> = {
  lg: 'h-control-lg px-3 text-13 comfortable:text-15',
  md: 'h-control-md px-3 text-12 comfortable:text-15',
  sm: 'h-control-sm px-2.5 text-12 comfortable:text-13',
};
/** Dropdown, size `lg`: 40px tall (48px comfortable) to line up with form inputs. `selectBase` leaves the width to the caller. */
export const selectBase = `${selectGeometry.lg} ${selectFrame}`;
export const selectClass = `w-full ${selectBase}`;
/** Dropdown, size `md`: 36px (44px comfortable), the same height as toolbar buttons, search fields and filters. */
export const selectMdBase = `${selectGeometry.md} ${selectFrame}`;
export const selectMdClass = `w-full ${selectMdBase}`;
/** Dropdown, size `sm`: 32px (40px comfortable), for table cells and dense lists. */
export const selectSmBase = `${selectGeometry.sm} ${selectFrame}`;
export const selectSmClass = `w-full ${selectSmBase}`;

/** Select (and select-like trigger: Combobox, DatePicker) frame per ControlSize (no width). */
export const selectSizes: Record<ControlSize, string> = { sm: selectSmBase, md: selectMdBase, lg: selectBase };

/*
 * Fields on the dark document viewer (bg-viewer): viewer fill and hairline, and the field
 * focus drawn in accent-soft, because accent is too dark to see there. Pair with
 * selectGeometry[size]. Used by DatePicker `dark` and the viewer's own inputs.
 */
export const focusFieldDark = 'focus:outline-hidden focus:border-accent-soft focus:ring-2 focus:ring-accent-soft';
export const fieldDark = `rounded-lg border border-viewer-line bg-viewer text-white transition-colors cursor-pointer hover:border-viewer-muted ${focusFieldDark} disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-viewer-line`;
/** A filter with its label inside the box ("Dept: All"): wrap a borderless, transparent select in this. Same frame as selects. */
export const selectFilterBox = `flex items-center gap-1.5 h-control-md comfortable:text-15 border border-line-strong rounded-lg px-3 bg-surface shadow-xs text-12 hover:border-muted ${focusFieldWithin} transition-colors`;

/*
 * Select and FilterSelect: a <button role="combobox"> on the select frame that opens a
 * listbox popup (listboxPanel, listOption rows), over a visually hidden native <select> that
 * keeps the form value, `required` and the ref.
 * - selectTrigger(size): the frame per size, room for the chevron, the open state (fieldOpen).
 *   Merge fieldInvalid after it with cn() for an error.
 * - selectFilterTrigger: the FilterSelect box ("Dept: All departments") as one button.
 * - selectChevron: the 16px muted chevron, turned over while the list is open; on the filter
 *   box it sits in the row (selectChevronInline) instead of absolutely.
 * - selectValue / selectValueText / selectValueSizer: the value cell. Every option's text is
 *   laid, invisible and zero-high, in the same grid cell as the value, so a trigger whose
 *   width is `w-auto` is as wide as its longest option (as a native select is) and does not
 *   jump when the value changes; a long value truncates.
 * - nativeSelectHidden: the hidden native select (sr-only; appearance-none opts it out of the
 *   global chevron rule).
 */
export function selectTrigger(size: ControlSize) {
  return `relative flex w-full items-center text-left ${selectSizes[size]} pr-9 ${fieldOpen}`;
}
export const selectFilterTrigger = `${selectFilterBox} cursor-pointer text-left ${fieldOpen} disabled:cursor-not-allowed disabled:bg-subtle disabled:text-disabled disabled:hover:border-line-strong`;
export function selectChevron(open: boolean, disabled = false) {
  return `pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-transform ${disabled ? 'text-disabled' : 'text-muted'} ${open ? 'rotate-180' : ''}`;
}
export function selectChevronInline(open: boolean, disabled = false) {
  // 10px from the value and 22px from the edge, where the native select's chevron sat, so a toolbar keeps its widths.
  return `pointer-events-none ml-1 mr-2.5 h-4 w-4 shrink-0 transition-transform ${disabled ? 'text-disabled' : 'text-muted'} ${open ? 'rotate-180' : ''}`;
}
export const selectValue = 'grid min-w-0 flex-1';
export const selectValueText = 'col-start-1 row-start-1 min-w-0 truncate';
export const selectValueSizer = 'invisible col-start-1 row-start-1 h-0 overflow-hidden whitespace-nowrap';
export const nativeSelectHidden = 'sr-only appearance-none';

/** Multi-line textarea with the same frame as inputs. */
export const textareaBase = `px-3 py-2 text-13 comfortable:py-3 comfortable:text-15 ${fieldFrame}`;
export const textareaClass = `w-full ${textareaBase}`;

export const fieldLabel = 'block text-12 font-medium text-ink-2 mb-1.5 comfortable:text-13';

export const card = 'bg-surface border border-line rounded-xl shadow-xs';

/** Every page's outer frame: gutter, max width and vertical rhythm. */
export const pageShell = `px-6 lg:px-8 py-6 max-w-[1440px] mx-auto space-y-6 pb-16 animate-in fade-in ${motion.base}`;

/** Titles: one per page (22px), one per card or section (16px). */
export const pageTitle = 'text-22 font-semibold text-ink tracking-tight leading-tight';
export const sectionTitle = 'text-16 font-semibold text-ink';

/*
 * Scroll region: a panel's list that scrolls inside a fixed height instead of being cut
 * mid-item. Its edge stays visible (hairlines above and below), it is a keyboard stop
 * (tabIndex={0}, role="region", aria-label) and it takes the inset focus ring. Set the
 * height on the element (`max-h-80`).
 */
export const scrollRegion = `overflow-y-auto overscroll-contain border-y border-line ${focusRingInset}`;

/*
 * Stat tiles. Full tiles open a page (four across); compact tiles sit inside a page
 * section or a profile tab. Status shows through the icon and the figure colour,
 * never through a coloured border or tinted background.
 */
export const statTile = 'bg-surface border border-line rounded-xl p-5 shadow-xs';
export const statTileCompact = 'bg-surface border border-line rounded-xl p-4 shadow-xs';
export const statLabel = 'text-14 font-medium text-ink-2';
export const statValue = 'text-32 font-semibold leading-none tracking-tight tabular-nums';
export const statValueCompact = 'text-22 font-semibold leading-none tabular-nums';

/** Table header row: grey band, 12px semibold secondary text, rule underneath. Use on <thead> (or the header <tr>). */
export const tableHead = 'bg-subtle text-12 font-semibold text-ink-2 border-b border-line comfortable:text-13';
/**
 * Header cell and body cell padding, so every table keeps the same rhythm. Header labels never wrap.
 * Comfortable density pads every cell 16px.
 */
export const tableTh = 'py-2.5 px-3 first:pl-4 last:pr-4 font-semibold whitespace-nowrap comfortable:py-4 comfortable:px-4';
export const tableTd = 'py-3 px-3 first:pl-4 last:pr-4 align-middle comfortable:py-4 comfortable:px-4';
/*
 * Pinned actions column (Th / Td `pin="end"`, DataTable column `pin: 'end'`): the last cell of
 * every row sticks to the right edge of the table's scroller, so a row's action is always on
 * screen however wide the table. It is opaque (surface body, the subtle header band, the row's
 * hover fill) and draws a hairline on its left edge, so cells scrolling under it are visibly cut.
 * The hairline is a pseudo-element: a border on a sticky cell in a collapsed table stays behind.
 * Body cells sit at z 1, under a sticky header (z 10); the pinned header cell is above both (z 20).
 */
export const tablePinEnd = 'sticky right-0 before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-line';
export const tablePinEndTh = `${tablePinEnd} z-20 bg-subtle`;
export const tablePinEndTd = `${tablePinEnd} z-[1] bg-surface [tr:hover>&]:bg-subtle`;

/** Secondary line under a row's main text: 12px muted, items separated by MetaDot. */
export const metaLine = 'flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-12 text-muted comfortable:text-13';

/** Regulator and record codes (TRN-002, B1.1, AES-CM-07): a quiet grey chip, never a status colour. */
export const codeChip = 'inline-flex items-center rounded-md bg-subtle-2 px-1.5 py-0.5 text-11 font-medium leading-4 text-ink-2 tabular-nums whitespace-nowrap';

/*
 * Segmented control: a grey track with a navy active option. Use for two to four
 * peer views or filters. `segmentedTrack` leaves the layout (flex or grid) to the caller.
 */
export const segmentedTrack = 'gap-1 rounded-xl bg-subtle-2 p-1 ring-1 ring-inset ring-line';
export const segmentedGroup = `inline-flex items-center ${segmentedTrack}`;
const segmentedItemBase = `inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-colors ${focusRing}`;
const segmentedItemSize = {
  md: 'h-control-md px-4 text-13 comfortable:text-15',
  sm: 'h-control-xs px-3 text-12 comfortable:text-13',
} as const;
export function segmentedItem(active: boolean, size: keyof typeof segmentedItemSize = 'md') {
  return `${segmentedItemBase} ${segmentedItemSize[size]} ${
    active ? 'bg-brand text-on-solid shadow-xs' : 'text-ink-2 hover:bg-surface hover:text-ink hover:shadow-xs'
  }`;
}

/* Underline tabs: sections of one record or page (profile tabs, assessment steps). */
export const tabList = 'flex items-center gap-1 border-b border-line overflow-x-auto';
export function tabItem(active: boolean) {
  return `inline-flex items-center gap-2 -mb-px px-3 py-3 border-b-2 rounded-t-md text-13 comfortable:min-h-11 comfortable:text-15 whitespace-nowrap cursor-pointer transition-colors ${focusRingInset} ${
    active ? 'border-brand-2 text-ink font-semibold' : 'border-transparent text-muted font-medium hover:text-ink'
  }`;
}

/*
 * Tones. Two families that never mix:
 * - StatusTone (success, warning, danger, neutral): what state something is in. Only
 *   StatusBadge (and StatusSelect) draw it, always as a rounded pill; success, warning and
 *   danger carry their symbol. Green, amber and red only ever mean status.
 * - CategoryTone (neutral, info, violet, brand): what kind of thing it is, or a count.
 *   Only Badge draws it, as a slightly rounded chip. Info is filled, violet is outlined
 *   (surface fill, violet text and ring), so the two differ by more than hue.
 * `Tone` is the union of both, for code that holds either (StatusSymbol, a lookup table
 * before it is split); a component prop always takes one family.
 */
export type StatusTone = 'success' | 'warning' | 'danger' | 'neutral';
export type CategoryTone = 'neutral' | 'info' | 'violet' | 'brand';
export type Tone = StatusTone | CategoryTone;

const STATUS_COLOUR_TONES = ['success', 'warning', 'danger'] as const;
/**
 * True for the three status colours (success, warning, danger). Narrows a `Tone` that may
 * hold either family: `isStatusTone(t) ? <StatusBadge tone={t}>… : <Badge tone={t}>…`
 * (the else branch is a CategoryTone; neutral goes to Badge there, so a NEUTRAL STATUS
 * should be typed StatusTone and sent to StatusBadge directly instead).
 */
export function isStatusTone(tone: Tone): tone is Exclude<StatusTone, 'neutral'> {
  return (STATUS_COLOUR_TONES as readonly string[]).includes(tone);
}

export const toneClasses: Record<Tone, string> = {
  success: 'bg-success-bg text-success ring-success-line',
  warning: 'bg-warning-bg text-warning ring-warning-line',
  danger: 'bg-danger-bg text-danger ring-danger-line',
  info: 'bg-info-bg text-info ring-info-line',
  violet: 'bg-surface text-violet ring-violet-line',
  neutral: 'bg-subtle text-ink-2 ring-line',
  brand: 'bg-brand text-on-solid ring-brand',
};

/*
 * Two label shapes:
 * - Category chip (Badge): slightly rounded, medium weight. `badgeClass(tone)`.
 * - Status pill (StatusBadge): fully rounded, semibold. `statusBadgeClass(tone)` inline,
 *   `statusBadgeClass(tone, 'column')` for the 120px pill in a requirement row's Status
 *   column (12px text, centred), so statuses line up down the page.
 */
export const badgeBase =
  'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-11 font-medium leading-4 tabular-nums ring-1 ring-inset whitespace-nowrap';
export const statusBadgeBase =
  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-11 font-semibold leading-4 tabular-nums ring-1 ring-inset whitespace-nowrap';
const statusColumnBase =
  'inline-flex w-[120px] items-center justify-center gap-1 rounded-full px-2.5 py-1 text-12 font-semibold leading-4 ring-1 ring-inset whitespace-nowrap';

export type StatusBadgeWidth = 'auto' | 'column';

/** The small round dot in a label (a neutral status, or a Badge with `dot`): the text colour, a little softer. */
export const labelDot = 'h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-80';

/** Category chip (Badge). */
export function badgeClass(tone: CategoryTone) {
  return `${badgeBase} ${toneClasses[tone]}`;
}

/*
 * Chip: a value picked into a form (an aircraft type, an ATA chapter, an engine variant),
 * often removable. The Badge shape one step up: 24px tall (32px comfortable), 12px medium
 * text, so its remove button fits; category tones only.
 * chipRemove is the × inside it (also on a removable StatusBadge): a 16px glyph box with a
 * 24px hit area (32px comfortable), the shared focus ring and a hover fill per tone.
 */
export function chipClass(tone: CategoryTone) {
  return `inline-flex min-h-6 max-w-full items-center gap-1 rounded-md px-2 text-12 font-medium leading-4 tabular-nums ring-1 ring-inset whitespace-nowrap comfortable:min-h-8 comfortable:px-2.5 comfortable:text-13 ${toneClasses[tone]}`;
}
const chipRemoveTone: Record<Tone, string> = {
  neutral: 'text-muted hover:bg-subtle-2 hover:text-ink',
  info: 'hover:bg-surface',
  violet: 'hover:bg-subtle',
  brand: 'hover:bg-on-solid/20',
  success: 'hover:bg-surface',
  warning: 'hover:bg-surface',
  danger: 'hover:bg-surface',
};
export function chipRemove(tone: Tone) {
  return `relative -mr-1 inline-flex size-4 shrink-0 items-center justify-center rounded-sm cursor-pointer transition-colors after:absolute after:left-1/2 after:top-1/2 after:size-6 after:-translate-x-1/2 after:-translate-y-1/2 comfortable:after:size-8 disabled:cursor-not-allowed disabled:opacity-40 ${focusRing} ${chipRemoveTone[tone]}`;
}

/** Status pill (StatusBadge): inline (`auto`) or the 120px Status-column pill (`column`). */
export function statusBadgeClass(tone: StatusTone, width: StatusBadgeWidth = 'auto') {
  return `${width === 'column' ? statusColumnBase : statusBadgeBase} ${toneClasses[tone]}`;
}

/**
 * StatusSelect's trigger, laid over statusBadgeClass(tone, width): a shadow-xs lift on hover
 * and while open, the disabled look, and an invisible hit area that does not change the
 * pill's look beside read-only pills: 2px above and below by default (the 20px inline pill
 * reaches target-min, 24px; the 24px column pill 28px) and 6px under comfortable density
 * (36px for the column pill).
 */
export const statusSelectTrigger = `relative cursor-pointer transition-shadow hover:shadow-xs data-[state=open]:shadow-xs disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none after:absolute after:inset-x-0 after:-inset-y-0.5 comfortable:after:-inset-y-1.5 ${focusRing}`;

/*
 * Floating surfaces: Popover, menus, list popups and tooltips are one family. Surface, a
 * hairline, shadow-popover and radius xl for panels (md for the small tooltip), opening
 * with a quick fade and zoom (motion.fast).
 */

/*
 * Menus (RowMenu): one row per action, 32px (40px comfortable), inset 4px in the panel with
 * radius md. The item that has keyboard focus (arrow keys, or the first item when the menu
 * opens) keeps the hover fill and takes focusRingInset, because the fill alone is about
 * 1.1:1 against the panel.
 */
export function menuItem(danger = false, tall = false) {
  // `tall` (a row with a description) sets its own height here: merging `h-auto` over
  // `h-control-sm` afterwards left both classes on the row, and rows overlapped.
  return `flex w-full shrink-0 ${tall ? 'items-start min-h-control-sm py-2' : 'items-center h-control-sm'} gap-2.5 rounded-md px-3 text-left text-13 font-medium comfortable:text-15 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
    danger ? 'text-danger hover:bg-danger-bg focus:bg-danger-bg' : 'text-ink hover:bg-subtle focus:bg-subtle'
  } ${focusRingInset}`;
}

/** The floating panel of a menu (RowMenu): radius xl like Popover, surface, hairline, shadow-popover, a quick fade and zoom in. */
export const menuPanel = `rounded-xl border border-line bg-surface p-1 shadow-popover animate-in fade-in zoom-in-95 ${motion.fast}`;
/**
 * A menu item with a second line (MenuItem `description`): the row grows from the 32px menu
 * height and its icon sits on the first line. Merge over menuItem() with cn().
 */
/** @deprecated The height now comes from `menuItem(danger, true)`. */
export const menuItemTall = 'items-start min-h-control-sm py-2';

/*
 * Toasts (ToastProvider): the popover surface (surface, hairline, shadow-popover, radius xl) in
 * a stack at the bottom right, sliding up and fading in (motion.fast; off under reduced
 * motion). Layer z-[90]: above dialogs (50 / 60 / 70) and Popover (80), under RowMenu (100)
 * and Tooltip (110), so a menu or a hint opened near the corner stays on top.
 */
export const toastViewport =
  'pointer-events-none fixed bottom-4 right-4 z-[90] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2';
export const toastPanel = `pointer-events-auto flex items-start gap-3 rounded-xl border border-line bg-surface py-3 pl-4 pr-2 text-13 text-ink shadow-popover comfortable:text-15 animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none ${motion.fast}`;

/*
 * Option rows in list popups share one geometry: menu-row height (32px, 40px comfortable),
 * radius md, 13px ink text. The highlighted row keeps the subtle fill plus a 2px inset accent
 * outline, because DOM focus stays on the list (or its input) and the fill alone is about
 * 1.1:1 against the panel, so the outline is the only focus indicator (WCAG 1.4.11).
 */
const optionRowBase =
  'flex w-full items-center gap-2 min-h-control-sm rounded-md py-1 text-left text-13 text-ink cursor-pointer transition-colors comfortable:text-15';

/**
 * One option in a listbox popup (StatusSelect), highlighted while active (data-active, driven
 * by aria-activedescendant): the fill plus a 2px inset accent outline.
 */
export const listOption = `${optionRowBase} px-2 data-[active=true]:bg-subtle data-[active=true]:outline-2 data-[active=true]:-outline-offset-2 data-[active=true]:outline-accent aria-disabled:cursor-not-allowed aria-disabled:opacity-40`;

/**
 * The listbox popup of Select and FilterSelect, laid over PopoverContent: as wide as its
 * longest option, never narrower than the trigger nor wider than 384px, and never taller
 * than the room on the side it opened (Radix flips it above when there is more room there).
 * listboxScroll is the scrolling list inside it, at most 288px (nine rows).
 */
export const listboxPanel = 'flex w-max min-w-(--radix-popover-trigger-width) max-w-96 max-h-(--radix-popover-content-available-height) flex-col p-1';
export const listboxScroll = 'min-h-0 max-h-72 overflow-y-auto outline-none custom-scrollbar';
/** An <optgroup> heading in a listbox: 11px semibold muted, above its options. */
export const listGroupLabel = 'px-2 pb-1 pt-2 text-11 font-semibold text-muted comfortable:text-12';
/** The tick in front of a listbox option: accent, kept in the row (invisible) when not selected so the text lines up. */
export function listOptionCheck(selected: boolean) {
  return `h-4 w-4 shrink-0 text-accent ${selected ? '' : 'invisible'}`;
}

/**
 * One option in a cmdk list (CommandItem: Combobox, command palette): the listOption geometry,
 * highlighted while cmdk marks it selected (keyboard or pointer, data-selected).
 */
export const commandOption = `${optionRowBase} px-3 select-none data-[selected=true]:bg-subtle data-[selected=true]:outline-2 data-[selected=true]:-outline-offset-2 data-[selected=true]:outline-accent data-[disabled=true]:pointer-events-none data-[disabled=true]:text-disabled [&_svg]:pointer-events-none [&_svg]:shrink-0`;

/**
 * The tooltip panel: the same surface as menus at a smaller radius, 12px medium ink
 * text (13px comfortable), above every other layer (z-[110]: dialogs 50 / 60 / 70, Popover
 * 80, RowMenu 100). The open animation is scoped to data-state=delayed-open, so an instant
 * open (keyboard focus, skip-delay) and the close are not animated.
 */
export const tooltipPanel = `z-[110] max-w-xs origin-(--radix-tooltip-content-transform-origin) rounded-md border border-line bg-surface px-2 py-1 text-12 font-medium leading-4 text-ink shadow-popover text-pretty select-none comfortable:px-2.5 comfortable:py-1.5 comfortable:text-13 comfortable:leading-5 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 ${motion.fast}`;

/**
 * A control that is busy or unavailable but keeps focus (aria-disabled instead of disabled,
 * so focus does not drop to <body> mid-action): looks disabled, ignores the pointer cursor.
 */
export const ariaDisabled = 'aria-disabled:cursor-not-allowed aria-disabled:opacity-40';

/*
 * Choices: Checkbox and Radio share one box, target and text, so a checkbox list and a
 * radio list line up exactly.
 * - choiceBox: the 16px box drawn on the native input (appearance-none) with the shared
 *   focusRing. Hover darkens the edge; checked (or indeterminate, choiceBoxMixed) fills
 *   navy, brand-2 on hover; disabled is a hairline on subtle, or a grey fill when checked.
 *   Windows high-contrast mode gets the native control back. Shape is added per control
 *   (checkbox rounded-md, radio rounded-full). Comfortable density: 20px.
 * - choiceTarget: the 24px square (target-min) around it, 32px comfortable.
 * - choiceRoot(variant): the <label> that holds box and text. `plain` box and text; `card` a
 *   bordered tile that fills info-bg with an accent edge while checked (has-checked).
 */
export type ChoiceSize = 'md' | 'sm';
export type ChoiceVariant = 'plain' | 'card';
export type ChoiceOrientation = 'vertical' | 'horizontal';

export const choiceBox = `peer col-start-1 row-start-1 m-0 size-4 shrink-0 cursor-pointer appearance-none border border-line-strong bg-surface transition-colors comfortable:size-5 hover:border-muted checked:border-brand checked:bg-brand checked:hover:border-brand-2 checked:hover:bg-brand-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-line disabled:bg-subtle disabled:checked:border-disabled disabled:checked:bg-disabled forced-colors:appearance-auto ${focusRing}`;
/** Indeterminate fill, checkbox only (a radio has no mixed state). */
export const choiceBoxMixed =
  'indeterminate:border-brand indeterminate:bg-brand indeterminate:hover:border-brand-2 indeterminate:hover:bg-brand-2 disabled:indeterminate:border-disabled disabled:indeterminate:bg-disabled';
/** Box edge while invalid: danger, also on hover. A checked box still fills navy. Merge with cn(). */
export const choiceBoxInvalid = 'border-danger hover:border-danger';
/** The 24px target square around the box (32px comfortable); input and glyph share its one grid cell. */
export const choiceTarget = 'grid size-6 shrink-0 place-items-center comfortable:size-8';
/** The glyph laid over the box: on-solid, ignores the pointer, hidden in forced-colours mode (the native control draws it). */
export const choiceGlyph = 'pointer-events-none col-start-1 row-start-1 text-on-solid forced-colors:hidden';

/*
 * The dark viewer's box (Checkbox `dark`, on bg-viewer): navy and accent vanish there, so the
 * checked (and mixed) fill and the focus outline are accent-soft and the glyph is viewer-dark.
 * The unchecked edge is viewer-muted, because viewer-line is under 3:1 on the viewer fill.
 * A complete recipe, not a cn() override, so its outline colour never merges with focusRing's.
 */
export const choiceBoxDark =
  'peer col-start-1 row-start-1 m-0 size-4 shrink-0 cursor-pointer appearance-none border border-viewer-muted bg-viewer transition-colors comfortable:size-5 hover:border-viewer-text checked:border-accent-soft checked:bg-accent-soft indeterminate:border-accent-soft indeterminate:bg-accent-soft disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 forced-colors:appearance-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft';
/** Box edge while invalid on the dark viewer. */
export const choiceBoxDarkInvalid = 'border-danger-on-dark hover:border-danger-on-dark';
/** The glyph on the dark box: viewer-dark on the accent-soft fill. */
export const choiceGlyphDark = 'pointer-events-none col-start-1 row-start-1 text-viewer forced-colors:hidden';

const choiceRootVariant: Record<ChoiceVariant, string> = {
  plain: 'inline-flex max-w-full items-start gap-1',
  // 8px round the 24px target puts the box 12px from the edge; the text keeps 12px on the right.
  card: 'flex w-full items-start gap-1.5 rounded-lg border bg-surface py-2 pl-2 pr-3 transition-colors comfortable:py-3 comfortable:pl-3 comfortable:pr-4 has-checked:border-accent has-checked:bg-info-bg',
};

/** The <label> that holds a choice (box plus text), per variant and state. */
export function choiceRoot(variant: ChoiceVariant, state: { disabled?: boolean; invalid?: boolean } = {}) {
  const cursor = state.disabled ? 'cursor-not-allowed' : 'cursor-pointer';
  if (variant === 'plain') return `${choiceRootVariant.plain} ${cursor}`;
  const edge = state.invalid ? 'border-danger' : 'border-line';
  const hover = state.disabled ? '' : 'hover:bg-subtle has-checked:hover:bg-info-bg';
  return `${choiceRootVariant.card} ${edge} ${hover} ${cursor}`.trim();
}

/*
 * Text beside the box. The first line is centred on the 24px target: a 20px line plus 2px
 * above (a 24px line plus 4px in comfortable, on the 32px target).
 */
export const choiceLabelText: Record<ChoiceSize, string> = {
  md: 'block mt-0.5 text-13 leading-5 comfortable:mt-1 comfortable:text-15 comfortable:leading-6',
  sm: 'block mt-0.5 text-12 leading-5 comfortable:mt-1 comfortable:text-13 comfortable:leading-6',
};
/** The description or error line under a choice's label. */
export const choiceNoteText = 'block text-12 leading-4 comfortable:text-13 comfortable:leading-5';

/** Layout of the options in a CheckboxGroup / RadioGroup, per orientation and variant. */
export const choiceListLayout: Record<ChoiceOrientation, Record<ChoiceVariant, string>> = {
  vertical: { plain: 'flex flex-col gap-1', card: 'flex flex-col gap-2' },
  horizontal: { plain: 'flex flex-wrap items-start gap-x-4 gap-y-1', card: 'flex flex-wrap items-stretch gap-2' },
};

/** The line under a field or a group of choices: hint in muted, error in danger. */
/** `listClassName` for a horizontal RadioGroup or CheckboxGroup in a form row: its options centre on the height of the `lg` controls beside it. */
export const choiceRowInForm = 'flex flex-wrap items-center gap-x-4 gap-y-1 min-h-control-lg';

export function fieldNote(error: boolean) {
  return `mt-1 text-12 comfortable:text-13 ${error ? 'text-danger' : 'text-muted'}`;
}

/*
 * Waiting: EmptyState and LoadingState share one frame (width, spacing, type), so a panel
 * does not jump when it goes from loading to empty. Skeletons fill with subtle-2 and pulse,
 * stopping under prefers-reduced-motion.
 */
export function emptyStateFrame(size: 'md' | 'sm' = 'md') {
  return `mx-auto max-w-sm text-center ${size === 'sm' ? 'py-6' : 'py-12'}`;
}
export function emptyStateIcon(size: 'md' | 'sm' = 'md') {
  return `mx-auto mb-3 flex items-center justify-center ${size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'}`;
}
export function emptyStateTitle(size: 'md' | 'sm' = 'md') {
  return `font-semibold ${size === 'sm' ? 'text-13 comfortable:text-15' : 'text-14 comfortable:text-16'}`;
}
export const emptyStateDetail = 'mt-1 text-12 comfortable:text-13';
export const skeletonFill = 'bg-subtle-2 animate-pulse motion-reduce:animate-none';
