// AeroCompetence Hub UI kit: components/ui in ouuzi/aerometric-control.
// Import from '@/components/ui'. Types as documentation.
import type * as React from 'react';
import type { LucideIcon } from 'lucide-react';

/** What state something is in. Only StatusBadge and StatusSelect draw it; success, warning and danger carry their symbol. */
export type StatusTone = 'success' | 'warning' | 'danger' | 'neutral';
/** What kind of thing something is, or a count. Only Badge draws it. */
export type CategoryTone = 'neutral' | 'info' | 'violet' | 'brand';
/** Either family, for lookup tables that hold both; a component prop always takes one. `isStatusTone(t)` narrows it. */
export type Tone = StatusTone | CategoryTone;
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-ghost';
/** The kit's control-size scale: sm 32px, md 36px, lg 40px (comfortable 40 / 44 / 48px). */
export type ControlSize = 'sm' | 'md' | 'lg';
export type ButtonSize = ControlSize;
export type ReadinessStatus = 'Compliant' | 'Expiring Soon' | 'Non-Compliant' | 'Not Configured';
export type PersonnelAuthorisationStatus = 'Draft' | 'Issued' | 'Valid' | 'Expiring Soon' | 'Expired' | 'Lapsed' | 'Suspended' | 'Revoked';
/** `auto` an inline pill; `column` the 120px pill (12px text, centred) of a requirement row's Status column. */
export type StatusBadgeWidth = 'auto' | 'column';
export type ChoiceSize = 'md' | 'sm';
export type ChoiceVariant = 'plain' | 'card';
export type ChoiceOrientation = 'vertical' | 'horizontal';

// ---- Actions ----

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** primary once per view; secondary for the rest; ghost in toolbars; danger to confirm a destructive step. Default secondary. */
  variant?: ButtonVariant;
  /** sm 32px, md 36px (default), lg 40px in a form footer beside 40px inputs. */
  size?: ButtonSize;
  /** Leading lucide icon, 16px (14px in sm). */
  icon?: LucideIcon;
  /** Busy: a spinner replaces the icon (or sits over the label), aria-busy, clicks and submits ignored, width and focus kept. Keep the label as it is. */
  loading?: boolean;
  /** Dark document viewer only: viewer fills, an accent primary, the accent-soft focus ring. */
  dark?: boolean;
  children: React.ReactNode;
}
/** A toggle is a Button with aria-pressed: secondary and ghost show the pressed look themselves. */
export declare function Button(props: ButtonProps): React.JSX.Element;

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'title'> {
  icon: LucideIcon;
  /** Accessible name, required. Also the tooltip, unless `tooltip` says otherwise. */
  label: string;
  /** Tooltip content. Default: the label. A longer hint, or false for none (a trigger that opens its own menu). No native title. */
  tooltip?: React.ReactNode | false;
  /** ghost in rows and toolbars, outline beside bordered controls, danger for a destructive row action. Default ghost. */
  variant?: 'ghost' | 'outline' | 'danger';
  /** Busy: the icon becomes a spinner, aria-busy, clicks ignored. */
  loading?: boolean;
  /** A count at the top-right corner (0 hides it, above 99 shows "99+"), or true for a dot. The name becomes "<label>, <badgeLabel>". */
  badge?: number | boolean;
  /** The badge in the accessible name. Default "<n> new" ("new" for a dot). */
  badgeLabel?: string;
  /** Dark document viewer only. */
  dark?: boolean;
}
/** 32px square (40px comfortable). */
export declare function IconButton(props: IconButtonProps): React.JSX.Element;

export type LinkButtonSize = 'lg' | 'md' | 'sm';
export type LinkButtonTone = 'accent' | 'muted' | 'ink';
export interface LinkButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Text size: lg 13px (a name in a table row), md 12px (default), sm 11px. */
  size?: LinkButtonSize;
  /** accent (default) actions; muted resets; ink a name or title that opens its record. */
  tone?: LinkButtonTone;
  icon?: LucideIcon;
  /** One line with an ellipsis; never widens its cell. */
  truncate?: boolean;
  /** Dark document viewer only. */
  dark?: boolean;
  children: React.ReactNode;
}
export declare function LinkButton(props: LinkButtonProps): React.JSX.Element;

// ---- Forms ----

export interface FieldProps {
  label: React.ReactNode;
  /** One muted line under the control. */
  hint?: React.ReactNode;
  /** Replaces the hint and turns the control red. */
  error?: React.ReactNode;
  required?: boolean;
  className?: string;
  /** One Input, Select, Textarea, DatePicker, Combobox or EvidenceField. Never a Checkbox: use CheckboxGroup. */
  children: React.ReactNode;
}
export declare function Field(props: FieldProps): React.JSX.Element;
/** For a kit control that is not a native input: reads the enclosing Field's id, hint and error. Explicit values win. */
export declare function useFieldControl(props: { id?: string; invalid?: boolean; describedBy?: string }): { id?: string; invalid: boolean; describedBy?: string; labelId?: string };

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** lg 40px (default, forms), md 36px (toolbars), sm 32px (table cells). */
  size?: ControlSize;
  invalid?: boolean;
}
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;

/**
 * The form dropdown: `<option>` / `<optgroup>` children and `value` / `onChange` as on a native select
 * (onChange gets a real change event; the ref is the hidden native select). Drawn by the kit: a
 * combobox button on the field frame opening a listbox (popover surface, tick on the current option).
 * `id`, `className`, aria-* go to the visible field; `name`, `required`, `form` stay on the native select.
 */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** lg 40px (default, forms), md 36px (toolbars), sm 32px (table cells). */
  size?: ControlSize;
  invalid?: boolean;
}
export declare const Select: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLSelectElement>>;

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}
export declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;

export interface FilterSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Shown inside the box before the value: "Dept", "Status". 36px, the md height. */
  label: string;
}
/** A toolbar filter with its label inside the box ("Dept: All departments"): the Select list behind one button. */
export declare function FilterSelect(props: FilterSelectProps): React.JSX.Element;

/** A checkbox needs a name: visible `label`, or aria-label / aria-labelledby when it has no text. */
type ChoiceName =
  | { label: React.ReactNode }
  | { label?: undefined; 'aria-label': string }
  | { label?: undefined; 'aria-labelledby': string };

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'children'> & {
  /** Visible text beside the box; clicking it toggles. No links or buttons inside. */
  label?: React.ReactNode;
  /** One line under the label, read after the name. */
  description?: React.ReactNode;
  /** Replaces the description in danger text and marks the box invalid. */
  error?: React.ReactNode;
  /** Some, not all: a dash, announced as mixed. */
  indeterminate?: boolean;
  /** Danger edge without a message. */
  invalid?: boolean;
  /** Label text: md 13px (default), sm 12px. The box is always 16px in a 24px target (20 in 32 comfortable). */
  size?: ChoiceSize;
  /** plain (default) or card, a bordered tile that fills info-bg while checked. */
  variant?: ChoiceVariant;
  /** The dark PDF viewer only. */
  dark?: boolean;
  /** Called with the new checked value, after onChange. */
  onCheckedChange?: (checked: boolean) => void;
  /** Layout only. */
  className?: string;
} & ChoiceName;
/** Native checkbox. Never wrap it in your own label. */
export declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;

export interface ChoiceGroupProps {
  /** The question the options answer, as the fieldset legend. */
  legend?: React.ReactNode;
  legendHidden?: boolean;
  hint?: React.ReactNode;
  /** Replaces the hint in danger text and marks every option invalid. */
  error?: React.ReactNode;
  required?: boolean;
  /** Disables every option. */
  disabled?: boolean;
  orientation?: ChoiceOrientation;
  className?: string;
  /** Replaces the list layout (a grid of cards). */
  listClassName?: string;
  'aria-label'?: string;
  children: React.ReactNode;
}
export interface CheckboxGroupProps extends ChoiceGroupProps {
  size?: ChoiceSize;
  variant?: ChoiceVariant;
}
/** Independent checkboxes that answer one question: a fieldset; each Checkbox keeps its own checked / onChange. */
export declare function CheckboxGroup(props: CheckboxGroupProps): React.JSX.Element;

export type RadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'children' | 'value'> & {
  /** This option's value; chosen when it equals the group's value. */
  value: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  invalid?: boolean;
  size?: ChoiceSize;
  variant?: ChoiceVariant;
  className?: string;
} & ChoiceName;
export declare const Radio: React.ForwardRefExoticComponent<RadioProps & React.RefAttributes<HTMLInputElement>>;

export interface RadioGroupProps<T extends string = string> extends ChoiceGroupProps {
  /** Controlled; null or undefined when nothing is chosen yet. */
  value: T | null | undefined;
  onChange: (value: T) => void;
  /** Shared name for a form post; generated when omitted. */
  name?: string;
  size?: ChoiceSize;
  variant?: ChoiceVariant;
}
/** One of two to six visible options: a fieldset role="radiogroup"; arrow keys move and choose. */
export declare function RadioGroup<T extends string>(props: RadioGroupProps<T>): React.JSX.Element;

export interface DatePickerProps {
  /** ISO YYYY-MM-DD, '' when empty. Shown as DD-MMM-YYYY. */
  value?: string;
  /** The new ISO date, or '' when cleared. */
  onChange: (value: string) => void;
  /** lg 40px (default, forms), md 36px (toolbars), sm 32px (table cells). */
  size?: ControlSize;
  /** Inside <Field error> it is on by itself. */
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  min?: string;
  max?: string;
  name?: string;
  form?: string;
  /** Inside <Field> it defaults to the Field's id. */
  id?: string;
  autoFocus?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  onFocus?: React.FocusEventHandler<HTMLElement>;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  /** The dark PDF viewer only. */
  dark?: boolean;
  /** Layout only. Full width by default. */
  className?: string;
}
/** The one date field: a button with the Select frame that opens the browser's calendar. Enter, Space, Up or Down open it; Delete or Backspace clear it. */
export declare const DatePicker: React.ForwardRefExoticComponent<DatePickerProps & React.RefAttributes<HTMLElement>>;

export interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  /** What the list holds ("Category"): names the search field and the list for screen readers. */
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  /** lg 40px (default, forms), md 36px (toolbars), sm 32px; comfortable 48/44/40px. */
  size?: ControlSize;
  /** Inside <Field> it defaults to the Field's id. */
  id?: string;
  invalid?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  required?: boolean;
  disabled?: boolean;
  /** Posted in a hidden input. */
  name?: string;
  className?: string;
  /** Offer Add "<query>" when the search matches no option exactly. */
  allowCreate?: boolean;
  onCreate?: (value: string) => Promise<void> | void;
  /** Called with the updated list after an add, rename or delete. */
  onOptionsChange?: (options: string[]) => void;
  /** Saves the updated list (e.g. to Firestore); rejecting shows an inline error. */
  onPersistOptions?: (options: string[]) => Promise<void> | void;
  catalogId?: string;
  /** Offer "Manage list" (rename and delete). */
  allowListEditing?: boolean;
}
/** Search-as-you-type picker (Radix Popover + cmdk). Up/Down move, Enter selects, Escape closes without closing the dialog. */
export declare function Combobox(props: ComboboxProps): React.JSX.Element;

export interface ToggleChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onChange'> {
  selected: boolean;
  onChange: (selected: boolean) => void;
  children: React.ReactNode;
}
/** 28px (control-xs; 36px comfortable). */
export declare function ToggleChip(props: ToggleChipProps): React.JSX.Element;

export interface SearchInputProps extends Omit<InputProps, 'type' | 'value'> {
  value: string;
  /** Shows the clear button while the field has a value; set the value to '' here. Focus returns to the field. */
  onClear?: () => void;
  /** The clear button's name and tooltip. Default "Clear search". */
  clearLabel?: string;
}
/** The Input (md 36px by default) with the search icon inside and a clear button; className lays out the wrapper. */
export declare const SearchInput: React.ForwardRefExoticComponent<SearchInputProps & React.RefAttributes<HTMLInputElement>>;

export interface ChipProps {
  tone?: CategoryTone;
  /** 12px leading icon. */
  icon?: LucideIcon;
  /** Adds the × (16px glyph, 24px target). */
  onRemove?: () => void;
  /** The ×'s name. Default "Remove <text>". */
  removeLabel?: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}
/** A value picked into a form, often removable. 24px tall (32px comfortable), category tones only. */
export declare function Chip(props: ChipProps): React.JSX.Element;

export interface EvidenceFieldProps {
  /** Number of linked records. */
  count: number;
  /** The record's title when one is linked. */
  title?: string;
  /** Certificate or record reference(s). */
  detail?: string;
  /** Opens your evidence picker. */
  onOpen: () => void;
  /** Shows a clear button once something is linked. */
  onClear?: () => void;
  /** Default "Link evidence". */
  placeholder?: string;
  id?: string;
}
export declare function EvidenceField(props: EvidenceFieldProps): React.JSX.Element;

// ---- Layout ----

interface CardCommon {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Body padding: md 20px, sm 16px, none. Default md. */
  padding?: 'none' | 'sm' | 'md';
  className?: string;
  children?: React.ReactNode;
}
export interface StaticCardProps extends CardCommon, Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'onSubmit' | 'onClick'> {
  actions?: React.ReactNode;
  as?: 'section' | 'div' | 'form';
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  onClick?: never;
  pressed?: never;
}
/** The whole card as one button: hover line-strong, pressed = aria-pressed and a 2px accent edge. No actions, no as. */
export interface ButtonCardProps extends CardCommon, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title' | 'children'> {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  pressed?: boolean;
  actions?: never;
  as?: never;
}
export type CardProps = StaticCardProps | ButtonCardProps;
export declare function Card(props: CardProps): React.JSX.Element;

export interface StatTileProps {
  label: React.ReactNode;
  value: number | string;
  unit?: React.ReactNode;
  detail?: React.ReactNode;
  icon?: LucideIcon;
  /** The tile's meaning, always shown on the icon. Default muted. */
  iconTone?: 'muted' | 'success' | 'warning' | 'danger';
  /** Figure colour when the value is above 0; a zero stays ink. */
  alert?: 'danger' | 'warning';
  compact?: boolean;
  /** Makes the tile a filter toggle. */
  onClick?: () => void;
  pressed?: boolean;
  className?: string;
}
export declare function StatTile(props: StatTileProps): React.JSX.Element;

// ---- Status and labels ----

interface StatusBadgeCommon {
  /** Leading dot, rendered for a neutral status only; success, warning and danger always show their symbol. */
  dot?: boolean;
  /** auto (default) or column (120px). */
  width?: StatusBadgeWidth;
  /** Adds a Chip's × (a picked value in a problem state). */
  onRemove?: () => void;
  /** The ×'s name. Default "Remove <label>". */
  removeLabel?: string;
  className?: string;
}
/**
 * The one status label. Mapped (preferred): kind + status, colour from statusTones.ts. Direct: tone + children,
 * for a status outside the maps (tone from a lookup table, never a ternary). Unknown mapped values render neutral.
 */
export type StatusBadgeProps = StatusBadgeCommon &
  (
    | { kind: 'readiness'; status: ReadinessStatus; tone?: never; children?: never }
    | { kind: 'authorisation'; status: PersonnelAuthorisationStatus; tone?: never; children?: never }
    | { kind: 'document'; status: 'Verified' | 'Pending Verification' | 'Rejected'; tone?: never; children?: never }
    | { kind?: never; status?: never; tone: StatusTone; children: React.ReactNode }
  );
export declare function StatusBadge(props: StatusBadgeProps): React.JSX.Element;
/** StatusBadge props for a record that may hold a legacy free string: known statuses are mapped, anything else neutral. */
export declare function authorisationStatusBadge(value: string | null | undefined, fallbackLabel?: string): StatusBadgeProps;
/** "valid", "EXPIRING_SOON" -> "Expiring Soon"; undefined when unknown. */
export declare function normaliseAuthorisationStatus(value: string | null | undefined): PersonnelAuthorisationStatus | undefined;

export interface StatusOption<V extends string = string> {
  /** The stored value ("Yes"). */
  value: V;
  /** The word on the pill ("Valid"). */
  label: string;
  tone: StatusTone;
  /** One short line beside the pill in the list. */
  description?: string;
  disabled?: boolean;
}
export interface StatusSelectProps<V extends string = string> {
  /** A value matching no option shows as a neutral pill with that text (or placeholder). */
  value: V | null | undefined;
  /** Called only when the value changes. */
  onChange: (value: V) => void;
  /** Keep in a module-level table. */
  options: ReadonlyArray<StatusOption<V>>;
  /** Required unless aria-labelledby is given: "QC-3 status". */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  id?: string;
  /** column (default) the 120px pill; auto sized to its word. */
  width?: StatusBadgeWidth;
  /** Default "Not set". */
  placeholder?: string;
  /** Leading dot on neutral statuses. */
  dot?: boolean;
  disabled?: boolean;
  /** Posted in a hidden input. */
  name?: string;
  align?: 'start' | 'center' | 'end';
  className?: string;
}
/** A status a person sets: the status pill with a chevron, opening a listbox of the statuses as pills (select-only combobox). */
export declare function StatusSelect<V extends string>(props: StatusSelectProps<V>): React.JSX.Element;

export interface BadgeProps {
  /** Categories and counts only. Default neutral. info is filled; violet is outlined. Never success, warning or danger. */
  tone?: CategoryTone;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}
export declare function Badge(props: BadgeProps): React.JSX.Element;

export interface CodeChipProps {
  className?: string;
  children: React.ReactNode;
}
export declare function CodeChip(props: CodeChipProps): React.JSX.Element;

// ---- Feedback ----

export type NoticeTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';
export interface NoticeProps {
  /** Default info. danger only for something wrong or blocking. */
  tone?: NoticeTone;
  title?: React.ReactNode;
  /** Override the tone's icon; null for none. */
  icon?: LucideIcon | null;
  action?: React.ReactNode;
  compact?: boolean;
  /** Announce to screen readers when it appears (feedback after an action). */
  live?: boolean;
  className?: string;
  children?: React.ReactNode;
}
export declare function Notice(props: NoticeProps): React.JSX.Element;

export interface EmptyStateProps {
  title: React.ReactNode;
  children?: React.ReactNode;
  icon?: React.ElementType;
  action?: React.ReactNode;
  size?: 'md' | 'sm';
  className?: string;
}
export declare function EmptyState(props: EmptyStateProps): React.JSX.Element;

/** Ring diameter: 16 inline (default), 14 in a sm button, 12 in a badge, 20 for a panel. */
export type SpinnerSize = 12 | 14 | 16 | 20;
export type SpinnerTone = 'current' | 'muted' | 'accent';
export interface SpinnerProps {
  size?: SpinnerSize;
  /** Default current (the text colour). */
  tone?: SpinnerTone;
  /** Screen-reader text, default "Loading". Ignored with children or decorative. */
  label?: string;
  /** Visible text beside the ring; becomes the status text. */
  children?: React.ReactNode;
  /** Inside something that already says it is busy (a loading Button): hidden from assistive technology. */
  decorative?: boolean;
  className?: string;
}
/** A polite status (role="status") unless decorative. Keeps turning under reduced motion. */
export declare function Spinner(props: SpinnerProps): React.JSX.Element;

export interface LoadingStateProps {
  /** What is loading: "Loading document". Also the announced status. */
  title: React.ReactNode;
  children?: React.ReactNode;
  size?: 'md' | 'sm';
  /** dark on the document viewer. */
  surface?: 'light' | 'dark';
  className?: string;
}
/** The busy twin of EmptyState, on the same frame. */
export declare function LoadingState(props: LoadingStateProps): React.JSX.Element;

export type SkeletonShape = 'line' | 'block' | 'circle';
export interface SkeletonProps {
  /** line (default) 12px bar; block 80px area; circle 32px avatar. */
  shape?: SkeletonShape;
  /** px number or CSS length. */
  width?: number | string;
  height?: number | string;
  /** Status text for one skeleton per region; never inside an aria-busy element. */
  label?: string;
  className?: string;
}
export declare function Skeleton(props: SkeletonProps): React.JSX.Element;
export interface SkeletonTextProps {
  /** Default 3; the last of two or more is 60% wide. */
  lines?: number;
  size?: 'md' | 'sm';
  width?: number | string;
  label?: string;
  className?: string;
}
export declare function SkeletonText(props: SkeletonTextProps): React.JSX.Element;
export interface SkeletonTableRowsProps {
  /** Match the header. */
  columns: number;
  /** Default 5. */
  rows?: number;
  align?: readonly ('left' | 'right' | 'center')[];
  /** Inside Table or DataTable with `loading`, leave it out: they announce themselves. */
  label?: string;
  /** Hairline between rows (default true); false inside a divide-y tbody. */
  divided?: boolean;
}
export declare function SkeletonTableRows(props: SkeletonTableRowsProps): React.JSX.Element;

// ---- Overlays ----

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';
export type TooltipAlign = 'start' | 'center' | 'end';
export interface TooltipProps {
  /** A few words, sentence case, nothing interactive. Empty renders the child alone. */
  content: React.ReactNode;
  /** ONE focusable element that takes a ref (a native button or any kit button). For a disabled button, wrap it in a focusable span. */
  children: React.ReactElement;
  /** Default top; flips when there is no room. */
  side?: TooltipSide;
  align?: TooltipAlign;
  /** The content only repeats the trigger's name: no aria-describedby. */
  asLabel?: boolean;
  /** Hover delay for this one, ms (provider default 400). */
  delayDuration?: number;
  /** Keep it closed. */
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** A wider max-w-* for a long hint. Not for colour. */
  className?: string;
}
/** Radix Tooltip on shadow-popover: hover (400ms) and keyboard focus (at once), Escape closes, touch never opens. */
export declare function Tooltip(props: TooltipProps): React.JSX.Element;
export interface TooltipProviderProps {
  children: React.ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
}
/** Mount once near the root; a Tooltip outside one supplies its own. */
export declare function TooltipProvider(props: TooltipProviderProps): React.JSX.Element;

export interface RowMenuItem {
  label: string;
  onSelect: () => void;
  icon?: LucideIcon;
  /** Destructive: shown last, in red, after a rule. */
  tone?: 'danger';
  disabled?: boolean;
  id?: string;
}
export interface RowMenuProps {
  /** Falsy entries are skipped, so items can be conditional. */
  items: Array<RowMenuItem | false | null | undefined | ''>;
  /** Accessible name and tooltip of the trigger. Default "More actions". */
  label?: string;
  /** Caption at the top of the menu (the record's name or code). */
  heading?: string;
  id?: string;
  variant?: 'ghost' | 'outline';
  /** A labelled trigger instead of the ⋯ button: one kit Button. RowMenu adds aria-haspopup, aria-expanded, the handlers and its ref. */
  trigger?: React.ReactElement;
}
export declare function RowMenu(props: RowMenuProps): React.JSX.Element;

/** sm 480px, md 640px (default), lg 896px, xl min(1280px, 96vw). Same for sheets and centred dialogs. */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';
export interface ModalShellProps {
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  eyebrow?: React.ReactNode;
  /** Accepted for compatibility; the header shows no icon. */
  icon?: React.ElementType;
  headerAside?: React.ReactNode;
  headerExtra?: React.ReactNode;
  /** Footer actions, primary last. */
  footer?: React.ReactNode;
  footerStart?: React.ReactNode;
  children: React.ReactNode;
  size?: ModalSize;
  /** sheet (default): full-height panel docked right. center: the centred dialog, used by ConfirmDialog; screens do not pass it. */
  placement?: 'center' | 'sheet';
  /** base z-50, nested z-[60] (opened from a dialog), top z-[70]. */
  layer?: 'base' | 'nested' | 'top';
  bodyClassName?: string;
  className?: string;
  closeDisabled?: boolean;
  /** Accessible name of the close button. Default "Close". */
  closeLabel?: string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  /** Wraps body and footer in a <form> with these props. */
  formProps?: React.FormHTMLAttributes<HTMLFormElement>;
  /** Children manage their own scroll area and footer. */
  rawBody?: boolean;
  /** Prints its body full width, without the sheet chrome. */
  printable?: boolean;
  /** Id of the dialog element; the title is `${id}-title`. */
  id?: string;
  /** alertdialog for a dialog that interrupts (ConfirmDialog). Default dialog. */
  role?: 'dialog' | 'alertdialog';
  'aria-describedby'?: string;
}
export declare function ModalShell(props: ModalShellProps): React.JSX.Element;

export interface ConfirmDialogProps {
  /** Default true, so it can also be rendered conditionally. */
  open?: boolean;
  /** A question: "Delete this department?". */
  title: React.ReactNode;
  /** What happens and whether it can be undone; describes the dialog. */
  body?: React.ReactNode;
  children?: React.ReactNode;
  /** Names the action: "Delete department". Never "Yes" or "OK". Default "Confirm". */
  confirmLabel?: string;
  cancelLabel?: string;
  /** danger: red confirm button, initial focus on Cancel. Default default (navy). */
  tone?: 'default' | 'danger';
  /** A returned Promise keeps the dialog busy until it settles. */
  onConfirm: () => void | Promise<unknown>;
  /** Cancel, the close button and Escape. */
  onCancel: () => void;
  /** Loading confirm button; Cancel and Escape locked. */
  busy?: boolean;
  /** Why the action failed, shown above the buttons and announced. */
  error?: React.ReactNode;
  eyebrow?: React.ReactNode;
  /** Default top; portalled to <body>. */
  layer?: 'base' | 'nested' | 'top';
}
/** The small centred alertdialog (ModalShell placement="center", sm 480px). Replaces window.confirm. */
export declare function ConfirmDialog(props: ConfirmDialogProps): React.JSX.Element | null;
export type ConfirmRequest = Omit<ConfirmDialogProps, 'open' | 'onConfirm' | 'onCancel' | 'busy' | 'error'>;
/** `if (!(await confirm({ … }))) return;` in a handler; render `dialog` once. */
export declare function useConfirmDialog(): { confirm: (request: ConfirmRequest) => Promise<boolean>; dialog: React.ReactNode };

// ---- Data and navigation ----

export interface TableProps {
  /** Minimum table width in px; the card scrolls sideways below it. */
  minWidth?: number;
  /** Body is loading (SkeletonTableRows inside, without label): aria-busy, and loadingLabel is announced. */
  loading?: boolean;
  /** Default "Loading". */
  loadingLabel?: string;
  className?: string;
  children: React.ReactNode;
}
export declare function Table(props: TableProps): React.JSX.Element;
export declare function THead(props: { children: React.ReactNode }): React.JSX.Element;
export declare function Th(props: React.ThHTMLAttributes<HTMLTableCellElement> & { align?: 'left' | 'right' | 'center' }): React.JSX.Element;
export declare function Td(props: React.TdHTMLAttributes<HTMLTableCellElement> & { align?: 'left' | 'right' | 'center' }): React.JSX.Element;

export interface TabOption<T extends string> {
  value: T;
  label: React.ReactNode;
  count?: number;
  icon?: React.ElementType;
  /** Not selectable; skipped by the arrow keys, Home and End. */
  disabled?: boolean;
  /** Id of the button, e.g. for the panel's aria-labelledby. */
  id?: string;
  /** Id of the panel this option shows (aria-controls). */
  controls?: string;
}
/** Tabs and SegmentedControl are one tab stop: Left/Right move and select (wrapping), Home/End jump to the ends. */
export interface TabsProps<T extends string = string> {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name of the tab list. */
  label: string;
  className?: string;
}
export declare function Tabs<T extends string>(props: TabsProps<T>): React.JSX.Element;

export interface SegmentedControlProps<T extends string = string> extends TabsProps<T> {
  /** md 36px (control-md), sm 28px (control-xs); comfortable 44 / 36px. */
  size?: 'md' | 'sm';
}
export declare function SegmentedControl<T extends string>(props: SegmentedControlProps<T>): React.JSX.Element;

export interface DataTableColumn<Row> {
  key: string;
  label: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  /** Header becomes a button that cycles ascending, descending, unsorted and announces it (aria-sort). */
  sortable?: boolean;
  /** Value to sort by when the cell shows something else (an ISO date behind "14 Mar 2027"). */
  sortValue?: (row: Row) => string | number | null;
  render?: (row: Row) => React.ReactNode;
}
export interface DataTableProps<Row = Record<string, unknown>> {
  columns: DataTableColumn<Row>[];
  /** Each row carries a stable `id`. */
  rows: Row[];
  /** What the table lists, for screen readers. Always give one. */
  caption?: string;
  defaultSort?: { key: string; dir: 'asc' | 'desc' };
  /** A column of kit Checkboxes and a bulk bar while rows are selected. */
  selectable?: boolean;
  defaultSelected?: (string | number)[];
  onSelectionChange?: (ids: (string | number)[]) => void;
  bulkActions?: (ids: (string | number)[]) => React.ReactNode;
  /** Names the row in its checkbox label: "Select Eleni Georgiou". */
  rowLabel?: (row: Row) => string;
  /** Scroll inside the card with a sticky header. */
  maxHeight?: number | string;
  minWidth?: number;
  /** comfortable for tablets; also follows [data-density="comfortable"] on an ancestor. */
  density?: 'default' | 'comfortable';
  /** Total records when rows are one page: "Showing 50 of 312". */
  total?: number;
  footerEnd?: React.ReactNode;
  footer?: false;
  /** An EmptyState spanning every column when rows is empty. */
  empty?: React.ReactNode;
  /** Placeholder rows and aria-busy while data is on its way. */
  loading?: boolean;
  /** Default "Loading". */
  loadingLabel?: string;
  className?: string;
}
export declare function DataTable<Row>(props: DataTableProps<Row>): React.JSX.Element;

export interface HistoryEvent {
  id?: string;
  kind?: 'create' | 'edit' | 'sign' | 'status';
  /** Sentence case: "Authorisation issued", "Expiry date corrected". */
  action: React.ReactNode;
  by?: string;
  role?: string;
  authNo?: string;
  /** ISO timestamp in UTC. */
  at?: string;
  /** "06 Nov 2026 09:30 UTC". */
  atLabel?: string;
  /** `from` is struck through, never deleted. */
  changes?: { field: React.ReactNode; from?: React.ReactNode; to: React.ReactNode }[];
  /** Required for any change to a signed record. */
  reason?: React.ReactNode;
  signature?: { meaning: React.ReactNode; hash?: string };
  /** The state the record moved to: a StatusBadge after the action. */
  status?: { tone: StatusTone; label: React.ReactNode };
  /** A category or count beside the action ("Correction"): a Badge. */
  badge?: { tone: CategoryTone; label: React.ReactNode };
}
export interface HistoryTimelineProps {
  /** Newest first. */
  events: HistoryEvent[];
  label?: string;
}
export declare function HistoryTimeline(props: HistoryTimelineProps): React.JSX.Element;

/** Likelihood 1-5 and severity A-E, e.g. "4B". */
export type RiskCode = string;
export interface RiskMatrixProps {
  value?: RiskCode;
  residual?: RiskCode;
  /** Makes cells buttons; without it the matrix is read-only. */
  onChange?: (code: RiskCode) => void;
  /** Which of value or residual a click sets. */
  mode?: 'initial' | 'residual';
  /** Defaults to the ICAO Doc 9859 example; codes not listed are acceptable. Store the bands with each assessment. */
  bands?: { intolerable: RiskCode[]; tolerable: RiskCode[] };
  caption?: string;
}
export declare function RiskMatrix(props: RiskMatrixProps): React.JSX.Element;

export interface ReadinessCell {
  key: string;
  code: string;
  name: string;
  state: 'valid' | 'due' | 'missing' | 'pending' | 'na';
  note?: string;
  targetId?: string;
}
export interface ReadinessGroup {
  key: string;
  label: string;
  cells: ReadinessCell[];
}
export interface ReadinessStripProps {
  groups: ReadinessGroup[];
  size?: 'sm' | 'md';
  className?: string;
}
export declare function ReadinessStrip(props: ReadinessStripProps): React.JSX.Element;
export declare function ReadinessSummary(props: { groups: ReadinessGroup[]; className?: string }): React.JSX.Element | null;
export declare function AnnunciatorPanel(props: { groups: ReadinessGroup[]; onSelect?: (cell: ReadinessCell) => void }): React.JSX.Element;
export declare function ReadinessLegend(props: { states?: ReadinessCell['state'][] }): React.JSX.Element;
export interface ReadinessCellButtonProps {
  state: ReadinessCell['state'];
  /** Name and tooltip: who or what, then the state ("Maria Konstantinou: Expiring soon"). Required. */
  label: string;
  onSelect: () => void;
  className?: string;
}
/** One clickable readiness cell: 24px, the compact strip's colour, the shared focus ring. */
export declare function ReadinessCellButton(props: ReadinessCellButtonProps): React.JSX.Element;

/** True for success, warning and danger. */
export declare function isStatusTone(tone: Tone): tone is Exclude<StatusTone, 'neutral'>;

// ---- Added November 2026 -------------------------------------------------------------

/** The top of every page: title, one line of description, at most three actions (primary last). */
export interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Buttons, primary last. When they do not fit beside the title the whole group moves under it. */
  actions?: React.ReactNode;
  /** A quiet link above the title, for a page reached from another. */
  back?: { label: React.ReactNode; onClick: () => void };
  meta?: React.ReactNode;
  as?: 'h1' | 'h2';
  className?: string;
}
export declare function PageHeader(props: PageHeaderProps): React.JSX.Element;

/** A list of alerts in a card: white rows, colour on the icon only. */
export interface AlertListProps {
  /** The list's name for screen readers. */
  label: string;
  /** Show the first N rows, then a "View all (n)" link. */
  limit?: number;
  /** Where "View all" goes. Without it the list opens in place. */
  onViewAll?: () => void;
  className?: string;
  children: React.ReactNode;
}
export interface AlertRowProps {
  tone: 'danger' | 'warning' | 'info' | 'success' | 'neutral';
  icon?: LucideIcon;
  /** The person or record first, then what is wrong in plain words. */
  title: React.ReactNode;
  meta?: React.ReactNode;
  /** One small link button. */
  action?: React.ReactNode;
  className?: string;
}
export declare function AlertList(props: AlertListProps): React.JSX.Element;
export declare function AlertRow(props: AlertRowProps): React.JSX.Element;

/** The one grid for form fields: rows start at the top, gaps are 16px. */
export interface FormGridProps {
  /** Columns from md up; one column below it. Default 2. */
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  children: React.ReactNode;
}
export declare function FormGrid(props: FormGridProps): React.JSX.Element;
/** className for a FormGrid child that spans more than one column. */
export declare const formSpan: { two: string; three: string; full: string };

/** What a Table sits in: its own card, a hairline box inside a card or dialog, or nothing. */
export type TableFrame = 'card' | 'inset' | 'none';
/** `pin="end"` on Th and Td keeps the actions column in view when the table scrolls sideways. */
export type TablePin = 'end';

/** StatusBadge kinds added with the status vocabulary: each takes any string as `status`. */
export type StatusBadgeLookupKind = 'finding' | 'outcome' | 'activity';

/** ModalShell: a click outside closes the dialog (not an alertdialog); `onBackdropClose` asks first. */
export interface ModalShellClosingProps {
  closeOnBackdrop?: boolean;
  onBackdropClose?: () => void;
}

// ---- Navigation, menus, paging and toasts -----------------------------------------------

export interface NavItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** 16px. */
  icon?: LucideIcon;
  /** The current page: aria-current="page", subtle-2 fill, medium weight, brand icon. */
  active?: boolean;
  /** A count at the end; 0 or undefined shows nothing. */
  badge?: number | string;
  /** neutral (default) a grey Badge; alert the red count pill. */
  badgeTone?: 'neutral' | 'alert';
  /** What the count means, read after the label ("3 urgent alerts"). */
  badgeLabel?: string;
  children: React.ReactNode;
}
/** A side-navigation row: 36px (h-control-md), 13px label. */
export declare function NavItem(props: NavItemProps): React.JSX.Element;
export interface NavListProps {
  /** Visible group label ("Workspace"); names the landmark. */
  label?: React.ReactNode;
  'aria-label'?: string;
  /** nav (default) or div for rows that open dialogs. */
  as?: 'nav' | 'div';
  className?: string;
  children: React.ReactNode;
}
export declare function NavList(props: NavListProps): React.JSX.Element;
export interface NavBrandProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Drawn white on a 32px navy tile. */
  logo: React.ReactNode;
  name: string;
}
export declare function NavBrand(props: NavBrandProps): React.JSX.Element;

export type MenuCloseReason = 'escape' | 'tab' | 'select';
export interface MenuListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role'> {
  /** The menu's accessible name. */
  label: string;
  /** Escape, Tab, and choosing an item (before its onSelect). */
  onClose?: (reason: MenuCloseReason) => void;
  /** Focus the first item on mount. Default false. */
  autoFocus?: boolean;
  children: React.ReactNode;
}
/** role="menu" with the RowMenu keyboard (Up, Down, Home, End, Escape, Tab). Put it in a PopoverContent or a panel. */
export declare const MenuList: React.ForwardRefExoticComponent<MenuListProps & React.RefAttributes<HTMLDivElement>>;
export interface MenuItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onSelect' | 'role'> {
  icon?: LucideIcon;
  /** Icon colour only. Default neutral (muted). */
  iconTone?: NoticeTone;
  /** Destructive: red, last, after a MenuSeparator. */
  danger?: boolean;
  /** A second 12px muted line. */
  description?: React.ReactNode;
  /** At the end of the label line: a time, a count, an unread dot. */
  meta?: React.ReactNode;
  onSelect?: () => void;
  children: React.ReactNode;
}
/** A 32px menu row (40px comfortable); grows with a description. */
export declare function MenuItem(props: MenuItemProps): React.JSX.Element;
export declare function MenuSeparator(): React.JSX.Element;
/** The shared menu keyboard, for a role="menu" element. */
export declare function useMenuKeyboard(ref: React.RefObject<HTMLElement | null>, onClose?: (reason: MenuCloseReason) => void): (e: React.KeyboardEvent<HTMLElement>) => void;

export interface PaginationProps {
  /** 1-based. */
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  /** The noun of the count. Default "records". */
  label?: string;
  className?: string;
}
/** "Showing 1 to 15 of 140 records", previous, page numbers (sm, current aria-current="page"), next. Buttons hidden with one page. */
export declare function Pagination(props: PaginationProps): React.JSX.Element;

export type ToastTone = NoticeTone;
export interface ToastOptions {
  /** success (default), info, neutral close after 5s; warning and danger stay. */
  tone?: ToastTone;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** One follow-up; choosing it closes the toast. */
  action?: { label: string; onClick: () => void };
  /** ms, or null to stay until closed. */
  duration?: number | null;
}
export interface ToastApi {
  /** Shows a toast; returns its id. */
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}
/** Mount once (components/Providers.tsx). Bottom-right stack, z-[90], danger role="alert", the rest role="status". */
export declare function ToastProvider(props: { children: React.ReactNode }): React.JSX.Element;
/** Throws outside a ToastProvider. */
export declare function useToast(): ToastApi;
