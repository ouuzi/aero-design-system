export declare const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
export declare const focusRingInset = "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent";
export declare const focusRingGroup = "group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-accent";
export declare const focusField = "focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent";
export declare const focusFieldWithin = "focus-within:outline-hidden focus-within:border-accent focus-within:ring-2 focus-within:ring-accent";
export declare const fieldOpen = "data-[state=open]:border-accent data-[state=open]:ring-2 data-[state=open]:ring-accent";
export declare const fieldInvalid = "border-danger text-danger hover:border-danger focus:border-danger focus:ring-danger focus-within:border-danger focus-within:ring-danger data-[state=open]:border-danger data-[state=open]:ring-danger";
/**
 * focusRing on the dark document viewer: the same 2px ring 2px out, in accent-soft, because
 * accent is too dark to see there. A complete recipe, never a cn() override of focusRing.
 */
export declare const focusRingDark = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft";
/**
 * Focusable wrapper that carries a Tooltip for a disabled button (a disabled <button> fires
 * no events): `<span tabIndex={0} className={tooltipAnchor}>`. It takes the shared focus ring
 * and the button's radius.
 */
export declare const tooltipAnchor = "inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
/** tooltipAnchor on the dark document viewer (accent-soft ring). */
export declare const tooltipAnchorDark = "inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft";
export declare const motion: {
    /** 120ms: menus, popovers, tooltips opening; hover and press. */
    readonly fast: "duration-fast ease-standard";
    /** 180ms: centred dialogs, page fade-in. */
    readonly base: "duration-base ease-standard";
    /** 260ms: side sheets sliding in, and their backdrop. */
    readonly slow: "duration-slow ease-standard";
};
export type ControlSize = 'sm' | 'md' | 'lg';
declare const buttonSize: {
    readonly lg: "h-control-lg px-4 text-13 comfortable:text-15";
    readonly md: "h-control-md px-4 text-13 comfortable:text-15";
    readonly sm: "h-control-sm px-3 text-12 comfortable:text-13";
};
declare const buttonVariant: {
    readonly primary: "bg-brand text-on-solid shadow-xs hover:bg-brand-2";
    readonly secondary: "border border-line-strong bg-surface text-ink shadow-xs hover:bg-subtle aria-pressed:border-accent aria-pressed:bg-info-bg aria-pressed:text-accent";
    readonly ghost: "text-ink-2 hover:bg-subtle-2 aria-pressed:bg-subtle-2 aria-pressed:text-ink";
    readonly danger: "bg-danger text-on-solid shadow-xs hover:bg-danger-2";
    readonly 'danger-ghost': "text-danger hover:bg-danger-bg";
};
export type ButtonVariant = keyof typeof buttonVariant;
export type ButtonSize = keyof typeof buttonSize;
/** A button's classes. `dark` for the document viewer: its variants and the accent-soft focus ring. */
export declare function buttonClass(variant?: ButtonVariant, size?: ButtonSize, dark?: boolean): string;
export declare const btn: {
    readonly primary: string;
    readonly secondary: string;
    readonly ghost: string;
    readonly danger: string;
    readonly dangerGhost: string;
    readonly link: "inline-flex min-h-6 items-center gap-1.5 rounded-md text-13 font-medium text-accent hover:text-brand transition-colors cursor-pointer disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent comfortable:text-15";
    readonly icon: "inline-flex items-center justify-center size-control-sm rounded-lg text-muted hover:text-ink hover:bg-subtle-2 aria-pressed:bg-subtle-2 aria-pressed:text-ink transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
    /** Icon-only destructive row action: muted until hovered, then danger. */
    readonly iconDanger: "inline-flex items-center justify-center size-control-sm rounded-lg text-muted hover:text-danger hover:bg-danger-bg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
};
/**
 * Read-only: a value the form works out or holds for reference (a calculated date, "No expiry").
 * It is meant to be read, so the text stays dark (ink-2 on subtle, 8.8:1); the grey fill, the
 * hairline edge and no shadow say it cannot be typed in. Disabled is the pale one: a control
 * that does not apply right now.
 */
export declare const fieldReadOnly = "[&[readonly]]:bg-subtle [&[readonly]]:text-ink-2 [&[readonly]]:border-line [&[readonly]]:shadow-none [&[readonly]]:cursor-default";
declare const linkSize: {
    readonly lg: "text-13 comfortable:text-15";
    readonly md: "text-12 comfortable:text-13";
    readonly sm: "text-11 comfortable:text-12";
};
declare const linkTone: {
    readonly accent: "text-accent hover:text-brand";
    readonly muted: "text-muted hover:text-ink";
    readonly ink: "text-ink hover:text-accent";
};
export type LinkButtonSize = keyof typeof linkSize;
export type LinkButtonTone = keyof typeof linkTone;
export declare function linkButton(size?: LinkButtonSize, tone?: LinkButtonTone, dark?: boolean): string;
/** Icon-only button with a border, for row actions next to other icon buttons. 32px, 40px comfortable. */
export declare const iconButtonOutline = "inline-flex items-center justify-center size-control-sm rounded-lg border border-line-strong bg-surface text-ink shadow-xs hover:bg-subtle aria-pressed:border-accent aria-pressed:bg-info-bg aria-pressed:text-accent transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
export declare const iconButtonDark: {
    readonly ghost: "inline-flex items-center justify-center size-control-sm rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-viewer-muted hover:bg-viewer-hover hover:text-white aria-pressed:bg-viewer-hover aria-pressed:text-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft";
    readonly outline: "inline-flex items-center justify-center size-control-sm rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border border-viewer-line bg-viewer-raised text-viewer-muted hover:bg-viewer-hover hover:text-white aria-pressed:border-accent-soft aria-pressed:text-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft";
    readonly danger: "inline-flex items-center justify-center size-control-sm rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-danger-on-dark hover:bg-viewer-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft";
};
export declare const iconButtonCount = "pointer-events-none absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-10 font-semibold leading-none tabular-nums text-on-solid ring-2 ring-surface";
export declare const iconButtonDot = "pointer-events-none absolute right-1 top-1 size-2 rounded-full bg-danger ring-2 ring-surface";
export declare const countAlert = "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-11 font-medium leading-5 tabular-nums ring-1 ring-inset bg-danger-bg text-danger ring-danger-line";
export declare function navItem(active: boolean): string;
/** The group label above a NavList ("Workspace"): 11px medium muted, aligned with the item text. */
export declare const navGroupLabel = "px-2.5 pb-1.5 text-11 font-medium text-muted comfortable:text-12";
/** Single-line input, size `lg`: 40px tall (48px comfortable), a form row. `inputBase` leaves the width to the caller. */
export declare const inputBase = "h-control-lg px-3 text-13 comfortable:text-15 rounded-lg border border-line-strong bg-surface text-ink shadow-xs transition-colors placeholder:text-muted focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent [&[readonly]]:bg-subtle [&[readonly]]:text-ink-2 [&[readonly]]:border-line [&[readonly]]:shadow-none [&[readonly]]:cursor-default disabled:bg-subtle disabled:text-disabled";
export declare const input = "w-full h-control-lg px-3 text-13 comfortable:text-15 rounded-lg border border-line-strong bg-surface text-ink shadow-xs transition-colors placeholder:text-muted focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent [&[readonly]]:bg-subtle [&[readonly]]:text-ink-2 [&[readonly]]:border-line [&[readonly]]:shadow-none [&[readonly]]:cursor-default disabled:bg-subtle disabled:text-disabled";
export declare const inputClass = "w-full h-control-lg px-3 text-13 comfortable:text-15 rounded-lg border border-line-strong bg-surface text-ink shadow-xs transition-colors placeholder:text-muted focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent [&[readonly]]:bg-subtle [&[readonly]]:text-ink-2 [&[readonly]]:border-line [&[readonly]]:shadow-none [&[readonly]]:cursor-default disabled:bg-subtle disabled:text-disabled";
/** Input, size `md`: 36px (44px comfortable), the same height as toolbar buttons, dropdowns and filters (search fields). */
export declare const inputMdBase = "h-control-md px-3 text-13 comfortable:text-15 rounded-lg border border-line-strong bg-surface text-ink shadow-xs transition-colors placeholder:text-muted focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent [&[readonly]]:bg-subtle [&[readonly]]:text-ink-2 [&[readonly]]:border-line [&[readonly]]:shadow-none [&[readonly]]:cursor-default disabled:bg-subtle disabled:text-disabled";
/** Input, size `sm`: 32px (40px comfortable), for table cells, inline edits and dense lists (pairs with selectSmBase). */
export declare const inputSmBase = "h-control-sm px-2.5 text-12 comfortable:text-13 rounded-lg border border-line-strong bg-surface text-ink shadow-xs transition-colors placeholder:text-muted focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent [&[readonly]]:bg-subtle [&[readonly]]:text-ink-2 [&[readonly]]:border-line [&[readonly]]:shadow-none [&[readonly]]:cursor-default disabled:bg-subtle disabled:text-disabled";
export declare const inputSmClass = "w-full h-control-sm px-2.5 text-12 comfortable:text-13 rounded-lg border border-line-strong bg-surface text-ink shadow-xs transition-colors placeholder:text-muted focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent [&[readonly]]:bg-subtle [&[readonly]]:text-ink-2 [&[readonly]]:border-line [&[readonly]]:shadow-none [&[readonly]]:cursor-default disabled:bg-subtle disabled:text-disabled";
/** Input frame per ControlSize (no width). */
export declare const inputSizes: Record<ControlSize, string>;
/**
 * Height, padding and text size of a select-like control per ControlSize, without the frame.
 * selectSizes adds the light frame; fieldDark (below) is the dark viewer's frame.
 */
export declare const selectGeometry: Record<ControlSize, string>;
/** Dropdown, size `lg`: 40px tall (48px comfortable) to line up with form inputs. `selectBase` leaves the width to the caller. */
export declare const selectBase: string;
export declare const selectClass: string;
/** Dropdown, size `md`: 36px (44px comfortable), the same height as toolbar buttons, search fields and filters. */
export declare const selectMdBase: string;
export declare const selectMdClass: string;
/** Dropdown, size `sm`: 32px (40px comfortable), for table cells and dense lists. */
export declare const selectSmBase: string;
export declare const selectSmClass: string;
/** Select (and select-like trigger: Combobox, DatePicker) frame per ControlSize (no width). */
export declare const selectSizes: Record<ControlSize, string>;
export declare const focusFieldDark = "focus:outline-hidden focus:border-accent-soft focus:ring-2 focus:ring-accent-soft";
export declare const fieldDark = "rounded-lg border border-viewer-line bg-viewer text-white transition-colors cursor-pointer hover:border-viewer-muted focus:outline-hidden focus:border-accent-soft focus:ring-2 focus:ring-accent-soft disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-viewer-line";
/** A filter with its label inside the box ("Dept: All"): wrap a borderless, transparent select in this. Same frame as selects. */
export declare const selectFilterBox = "flex items-center gap-1.5 h-control-md comfortable:text-15 border border-line-strong rounded-lg px-3 bg-surface shadow-xs text-12 hover:border-muted focus-within:outline-hidden focus-within:border-accent focus-within:ring-2 focus-within:ring-accent transition-colors";
export declare function selectTrigger(size: ControlSize): string;
export declare const selectFilterTrigger = "flex items-center gap-1.5 h-control-md comfortable:text-15 border border-line-strong rounded-lg px-3 bg-surface shadow-xs text-12 hover:border-muted focus-within:outline-hidden focus-within:border-accent focus-within:ring-2 focus-within:ring-accent transition-colors cursor-pointer text-left data-[state=open]:border-accent data-[state=open]:ring-2 data-[state=open]:ring-accent disabled:cursor-not-allowed disabled:bg-subtle disabled:text-disabled disabled:hover:border-line-strong";
export declare function selectChevron(open: boolean, disabled?: boolean): string;
export declare function selectChevronInline(open: boolean, disabled?: boolean): string;
export declare const selectValue = "grid min-w-0 flex-1";
export declare const selectValueText = "col-start-1 row-start-1 min-w-0 truncate";
export declare const selectValueSizer = "invisible col-start-1 row-start-1 h-0 overflow-hidden whitespace-nowrap";
export declare const nativeSelectHidden = "sr-only appearance-none";
/** Multi-line textarea with the same frame as inputs. */
export declare const textareaBase = "px-3 py-2 text-13 comfortable:py-3 comfortable:text-15 rounded-lg border border-line-strong bg-surface text-ink shadow-xs transition-colors placeholder:text-muted focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent [&[readonly]]:bg-subtle [&[readonly]]:text-ink-2 [&[readonly]]:border-line [&[readonly]]:shadow-none [&[readonly]]:cursor-default disabled:bg-subtle disabled:text-disabled";
export declare const textareaClass = "w-full px-3 py-2 text-13 comfortable:py-3 comfortable:text-15 rounded-lg border border-line-strong bg-surface text-ink shadow-xs transition-colors placeholder:text-muted focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent [&[readonly]]:bg-subtle [&[readonly]]:text-ink-2 [&[readonly]]:border-line [&[readonly]]:shadow-none [&[readonly]]:cursor-default disabled:bg-subtle disabled:text-disabled";
export declare const fieldLabel = "block text-12 font-medium text-ink-2 mb-1.5 comfortable:text-13";
export declare const card = "bg-surface border border-line rounded-xl shadow-xs";
/** Every page's outer frame: gutter, max width and vertical rhythm. */
export declare const pageShell: string;
/** Titles: one per page (22px), one per card or section (16px). */
export declare const pageTitle = "text-22 font-semibold text-ink tracking-tight leading-tight";
export declare const sectionTitle = "text-16 font-semibold text-ink";
export declare const scrollRegion = "overflow-y-auto overscroll-contain border-y border-line focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent";
export declare const statTile = "bg-surface border border-line rounded-xl p-5 shadow-xs";
export declare const statTileCompact = "bg-surface border border-line rounded-xl p-4 shadow-xs";
export declare const statLabel = "text-14 font-medium text-ink-2";
export declare const statValue = "text-32 font-semibold leading-none tracking-tight tabular-nums";
export declare const statValueCompact = "text-22 font-semibold leading-none tabular-nums";
/** Table header row: grey band, 12px semibold secondary text, rule underneath. Use on <thead> (or the header <tr>). */
export declare const tableHead = "bg-subtle text-12 font-semibold text-ink-2 border-b border-line comfortable:text-13";
/**
 * Header cell and body cell padding, so every table keeps the same rhythm. Header labels never wrap.
 * Comfortable density pads every cell 16px.
 */
export declare const tableTh = "py-2.5 px-3 first:pl-4 last:pr-4 font-semibold whitespace-nowrap comfortable:py-4 comfortable:px-4";
export declare const tableTd = "py-3 px-3 first:pl-4 last:pr-4 align-middle comfortable:py-4 comfortable:px-4";
export declare const tablePinEnd = "sticky right-0 before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-line";
export declare const tablePinEndTh = "sticky right-0 before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-line z-20 bg-subtle";
export declare const tablePinEndTd = "sticky right-0 before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-line z-[1] bg-surface [tr:hover>&]:bg-subtle";
/** Secondary line under a row's main text: 12px muted, items separated by MetaDot. */
export declare const metaLine = "flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-12 text-muted comfortable:text-13";
/** Regulator and record codes (TRN-002, B1.1, AES-CM-07): a quiet grey chip, never a status colour. */
export declare const codeChip = "inline-flex items-center rounded-md bg-subtle-2 px-1.5 py-0.5 text-11 font-medium leading-4 text-ink-2 tabular-nums whitespace-nowrap";
export declare const segmentedTrack = "gap-1 rounded-xl bg-subtle-2 p-1 ring-1 ring-inset ring-line";
export declare const segmentedGroup = "inline-flex items-center gap-1 rounded-xl bg-subtle-2 p-1 ring-1 ring-inset ring-line";
declare const segmentedItemSize: {
    readonly md: "h-control-md px-4 text-13 comfortable:text-15";
    readonly sm: "h-control-xs px-3 text-12 comfortable:text-13";
};
export declare function segmentedItem(active: boolean, size?: keyof typeof segmentedItemSize): string;
export declare const tabList = "flex items-center gap-1 border-b border-line overflow-x-auto";
export declare function tabItem(active: boolean): string;
export type StatusTone = 'success' | 'warning' | 'danger' | 'neutral';
export type CategoryTone = 'neutral' | 'info' | 'violet' | 'brand';
export type Tone = StatusTone | CategoryTone;
/**
 * True for the three status colours (success, warning, danger). Narrows a `Tone` that may
 * hold either family: `isStatusTone(t) ? <StatusBadge tone={t}>… : <Badge tone={t}>…`
 * (the else branch is a CategoryTone; neutral goes to Badge there, so a NEUTRAL STATUS
 * should be typed StatusTone and sent to StatusBadge directly instead).
 */
export declare function isStatusTone(tone: Tone): tone is Exclude<StatusTone, 'neutral'>;
export declare const toneClasses: Record<Tone, string>;
export declare const badgeBase = "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-11 font-medium leading-4 tabular-nums ring-1 ring-inset whitespace-nowrap";
export declare const statusBadgeBase = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-11 font-semibold leading-4 tabular-nums ring-1 ring-inset whitespace-nowrap";
export type StatusBadgeWidth = 'auto' | 'column';
/** The small round dot in a label (a neutral status, or a Badge with `dot`): the text colour, a little softer. */
export declare const labelDot = "h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-80";
/** Category chip (Badge). */
export declare function badgeClass(tone: CategoryTone): string;
export declare function chipClass(tone: CategoryTone): string;
export declare function chipRemove(tone: Tone): string;
/** Status pill (StatusBadge): inline (`auto`) or the 120px Status-column pill (`column`). */
export declare function statusBadgeClass(tone: StatusTone, width?: StatusBadgeWidth): string;
/**
 * StatusSelect's trigger, laid over statusBadgeClass(tone, width): a shadow-xs lift on hover
 * and while open, the disabled look, and an invisible hit area that does not change the
 * pill's look beside read-only pills: 2px above and below by default (the 20px inline pill
 * reaches target-min, 24px; the 24px column pill 28px) and 6px under comfortable density
 * (36px for the column pill).
 */
export declare const statusSelectTrigger = "relative cursor-pointer transition-shadow hover:shadow-xs data-[state=open]:shadow-xs disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none after:absolute after:inset-x-0 after:-inset-y-0.5 comfortable:after:-inset-y-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
export declare function menuItem(danger?: boolean, tall?: boolean): string;
/** The floating panel of a menu (RowMenu): radius xl like Popover, surface, hairline, shadow-popover, a quick fade and zoom in. */
export declare const menuPanel: string;
/**
 * A menu item with a second line (MenuItem `description`): the row grows from the 32px menu
 * height and its icon sits on the first line. Merge over menuItem() with cn().
 */
/** @deprecated The height now comes from `menuItem(danger, true)`. */
export declare const menuItemTall = "items-start min-h-control-sm py-2";
export declare const toastViewport = "pointer-events-none fixed bottom-4 right-4 z-[90] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2";
export declare const toastPanel: string;
/**
 * One option in a listbox popup (StatusSelect), highlighted while active (data-active, driven
 * by aria-activedescendant): the fill plus a 2px inset accent outline.
 */
export declare const listOption = "flex w-full items-center gap-2 min-h-control-sm rounded-md py-1 text-left text-13 text-ink cursor-pointer transition-colors comfortable:text-15 px-2 data-[active=true]:bg-subtle data-[active=true]:outline-2 data-[active=true]:-outline-offset-2 data-[active=true]:outline-accent aria-disabled:cursor-not-allowed aria-disabled:opacity-40";
/**
 * The listbox popup of Select and FilterSelect, laid over PopoverContent: as wide as its
 * longest option, never narrower than the trigger nor wider than 384px, and never taller
 * than the room on the side it opened (Radix flips it above when there is more room there).
 * listboxScroll is the scrolling list inside it, at most 288px (nine rows).
 */
export declare const listboxPanel = "flex w-max min-w-(--radix-popover-trigger-width) max-w-96 max-h-(--radix-popover-content-available-height) flex-col p-1";
export declare const listboxScroll = "min-h-0 max-h-72 overflow-y-auto outline-none custom-scrollbar";
/** An <optgroup> heading in a listbox: 11px semibold muted, above its options. */
export declare const listGroupLabel = "px-2 pb-1 pt-2 text-11 font-semibold text-muted comfortable:text-12";
/** The tick in front of a listbox option: accent, kept in the row (invisible) when not selected so the text lines up. */
export declare function listOptionCheck(selected: boolean): string;
/**
 * One option in a cmdk list (CommandItem: Combobox, command palette): the listOption geometry,
 * highlighted while cmdk marks it selected (keyboard or pointer, data-selected).
 */
export declare const commandOption = "flex w-full items-center gap-2 min-h-control-sm rounded-md py-1 text-left text-13 text-ink cursor-pointer transition-colors comfortable:text-15 px-3 select-none data-[selected=true]:bg-subtle data-[selected=true]:outline-2 data-[selected=true]:-outline-offset-2 data-[selected=true]:outline-accent data-[disabled=true]:pointer-events-none data-[disabled=true]:text-disabled [&_svg]:pointer-events-none [&_svg]:shrink-0";
/**
 * The tooltip panel: the same surface as menus at a smaller radius, 12px medium ink
 * text (13px comfortable), above every other layer (z-[110]: dialogs 50 / 60 / 70, Popover
 * 80, RowMenu 100). The open animation is scoped to data-state=delayed-open, so an instant
 * open (keyboard focus, skip-delay) and the close are not animated.
 */
export declare const tooltipPanel: string;
/**
 * A control that is busy or unavailable but keeps focus (aria-disabled instead of disabled,
 * so focus does not drop to <body> mid-action): looks disabled, ignores the pointer cursor.
 */
export declare const ariaDisabled = "aria-disabled:cursor-not-allowed aria-disabled:opacity-40";
export type ChoiceSize = 'md' | 'sm';
export type ChoiceVariant = 'plain' | 'card';
export type ChoiceOrientation = 'vertical' | 'horizontal';
export declare const choiceBox = "peer col-start-1 row-start-1 m-0 size-4 shrink-0 cursor-pointer appearance-none border border-line-strong bg-surface transition-colors comfortable:size-5 hover:border-muted checked:border-brand checked:bg-brand checked:hover:border-brand-2 checked:hover:bg-brand-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-line disabled:bg-subtle disabled:checked:border-disabled disabled:checked:bg-disabled forced-colors:appearance-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
/** Indeterminate fill, checkbox only (a radio has no mixed state). */
export declare const choiceBoxMixed = "indeterminate:border-brand indeterminate:bg-brand indeterminate:hover:border-brand-2 indeterminate:hover:bg-brand-2 disabled:indeterminate:border-disabled disabled:indeterminate:bg-disabled";
/** Box edge while invalid: danger, also on hover. A checked box still fills navy. Merge with cn(). */
export declare const choiceBoxInvalid = "border-danger hover:border-danger";
/** The 24px target square around the box (32px comfortable); input and glyph share its one grid cell. */
export declare const choiceTarget = "grid size-6 shrink-0 place-items-center comfortable:size-8";
/** The glyph laid over the box: on-solid, ignores the pointer, hidden in forced-colours mode (the native control draws it). */
export declare const choiceGlyph = "pointer-events-none col-start-1 row-start-1 text-on-solid forced-colors:hidden";
export declare const choiceBoxDark = "peer col-start-1 row-start-1 m-0 size-4 shrink-0 cursor-pointer appearance-none border border-viewer-muted bg-viewer transition-colors comfortable:size-5 hover:border-viewer-text checked:border-accent-soft checked:bg-accent-soft indeterminate:border-accent-soft indeterminate:bg-accent-soft disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 forced-colors:appearance-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft";
/** Box edge while invalid on the dark viewer. */
export declare const choiceBoxDarkInvalid = "border-danger-on-dark hover:border-danger-on-dark";
/** The glyph on the dark box: viewer-dark on the accent-soft fill. */
export declare const choiceGlyphDark = "pointer-events-none col-start-1 row-start-1 text-viewer forced-colors:hidden";
/** The <label> that holds a choice (box plus text), per variant and state. */
export declare function choiceRoot(variant: ChoiceVariant, state?: {
    disabled?: boolean;
    invalid?: boolean;
}): string;
export declare const choiceLabelText: Record<ChoiceSize, string>;
/** The description or error line under a choice's label. */
export declare const choiceNoteText = "block text-12 leading-4 comfortable:text-13 comfortable:leading-5";
/** Layout of the options in a CheckboxGroup / RadioGroup, per orientation and variant. */
export declare const choiceListLayout: Record<ChoiceOrientation, Record<ChoiceVariant, string>>;
/** The line under a field or a group of choices: hint in muted, error in danger. */
/** `listClassName` for a horizontal RadioGroup or CheckboxGroup in a form row: its options centre on the height of the `lg` controls beside it. */
export declare const choiceRowInForm = "flex flex-wrap items-center gap-x-4 gap-y-1 min-h-control-lg";
export declare function fieldNote(error: boolean): string;
export declare function emptyStateFrame(size?: 'md' | 'sm'): string;
export declare function emptyStateIcon(size?: 'md' | 'sm'): string;
export declare function emptyStateTitle(size?: 'md' | 'sm'): string;
export declare const emptyStateDetail = "mt-1 text-12 comfortable:text-13";
export declare const skeletonFill = "bg-subtle-2 animate-pulse motion-reduce:animate-none";
export {};
