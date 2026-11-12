'use client';

import React, { useEffect, useId, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { Check, Minus } from 'lucide-react';
import {
  choiceBox,
  choiceBoxDark,
  choiceBoxDarkInvalid,
  choiceBoxInvalid,
  choiceBoxMixed,
  choiceGlyph,
  choiceGlyphDark,
  choiceLabelText,
  choiceListLayout,
  choiceNoteText,
  choiceRoot,
  choiceTarget,
  fieldLabel,
  fieldNote,
  type ChoiceOrientation,
  type ChoiceSize,
  type ChoiceVariant,
} from './styles.js';
import { cn } from '../lib/utils.js';

/*
 * Checkbox and CheckboxGroup: native <input type="checkbox">, so Space toggles it, a form
 * submits it, `required` works and a screen reader hears "checkbox, checked / not checked /
 * mixed" with no ARIA of ours. The input itself is the 16px box (appearance-none, drawn
 * with tokens) and takes the shared focusRing; the check or dash is a glyph laid over it.
 *
 * - Box: 16px, line-strong edge on white, navy (brand) fill with a white check when checked,
 *   a white dash when `indeterminate`. Disabled: hairline on subtle, or a grey fill when checked.
 * - Target: the box sits in a 24px square (target-min) that is part of the <label>, so the
 *   whole row, text included, toggles it. Comfortable density: 20px box in a 32px square,
 *   label 13 -> 15px, description 12 -> 13px.
 * - `variant="card"`: the whole option is a bordered tile (white; accent edge on an info fill
 *   while checked), for option grids such as departments, positions or a rating matrix.
 * - No visible text (a table row's selection box): pass `aria-label` or `aria-labelledby`
 *   instead of `label`; the type requires one of the three.
 * - `dark`: for the dark PDF viewer only (bg-viewer), like DatePicker `dark`. Accent-soft
 *   fill and focus, a viewer-dark glyph, viewer-text label. Plain variant only.
 * - Never wrap a Checkbox in your own <label>: it is a label already.
 * - Windows high-contrast mode (forced colours) gets the native checkbox back.
 *
 * Radio.tsx builds Radio and RadioGroup on the same pieces (the choice* recipes in
 * styles.ts, ChoiceText and ChoiceGroupFrame), so a checkbox list and a radio list line up
 * exactly. ChoiceGroupContext, ChoiceText and ChoiceGroupFrame are internal to the kit:
 * index.ts does not export them.
 */

export type { ChoiceOrientation, ChoiceSize, ChoiceVariant };

/* ------------------------------------------------------------------------------------------
 * Shared pieces
 * ---------------------------------------------------------------------------------------- */

/** Defaults a CheckboxGroup or RadioGroup hands to the options inside it. */
export interface ChoiceGroupDefaults {
  size?: ChoiceSize;
  variant?: ChoiceVariant;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
}

export const ChoiceGroupContext = React.createContext<ChoiceGroupDefaults | null>(null);

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

interface ChoiceTextProps {
  label: React.ReactNode;
  labelId: string;
  note?: React.ReactNode;
  noteId: string;
  noteIsError: boolean;
  size: ChoiceSize;
  variant: ChoiceVariant;
  disabled: boolean;
  required?: boolean;
  /** Text colours for the dark viewer (Checkbox `dark`). */
  dark?: boolean;
}

/** The label line and the description or error under it. Ids are wired by the caller. */
export function ChoiceText({ label, labelId, note, noteId, noteIsError, size, variant, disabled, required, dark = false }: ChoiceTextProps) {
  const labelTone = dark ? (disabled ? 'text-viewer-muted' : 'text-viewer-text') : disabled ? 'text-disabled' : 'text-ink';
  const noteTone = noteIsError
    ? dark
      ? 'text-danger-on-dark'
      : 'text-danger'
    : dark
      ? 'text-viewer-muted'
      : disabled
        ? 'text-disabled'
        : 'text-muted';
  return (
    <span className="min-w-0 flex-1">
      <span id={labelId} className={cn(choiceLabelText[size], variant === 'card' ? 'font-medium' : 'font-normal', labelTone)}>
        {label}
        {required && (
          <span className={dark ? 'text-danger-on-dark' : 'text-danger'} aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </span>
      {note && (
        <span id={noteId} className={cn(choiceNoteText, noteTone)}>
          {note}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------------------------------
 * Checkbox
 * ---------------------------------------------------------------------------------------- */

type NativeCheckbox = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'children'>;

interface CheckboxOwnProps {
  /**
   * The visible text, beside the box. Clicking it toggles the box, and it is the accessible
   * name. Keep links and buttons out of it (they would toggle the box too).
   */
  label?: React.ReactNode;
  /** One line under the label: what ticking it means. Read after the name (aria-describedby). */
  description?: React.ReactNode;
  /** Replaces the description in danger text and marks the box invalid. */
  error?: React.ReactNode;
  /** Some, not all (a "select all" box over a partly selected list): a dash, announced as mixed. */
  indeterminate?: boolean;
  /** Danger edge without a message (the message is shown elsewhere, e.g. by the group). */
  invalid?: boolean;
  /** Label text: `md` 13px (default), `sm` 12px for a field's aside ("Does not expire"). */
  size?: ChoiceSize;
  /** `plain` (default) or `card`, a bordered tile that fills while checked. */
  variant?: ChoiceVariant;
  /**
   * For the dark PDF viewer only (bg-viewer): accent-soft fill and focus, a viewer-dark glyph,
   * viewer-text label. Plain variant only.
   */
  dark?: boolean;
  /** Convenience: called with the new checked value, after `onChange`. */
  onCheckedChange?: (checked: boolean) => void;
  /** Classes for the outer <label> (layout only: margins, grid placement, width). */
  className?: string;
}

/** A checkbox must have a name: visible `label`, or `aria-label` / `aria-labelledby` when it has no text. */
type CheckboxName =
  | { label: React.ReactNode }
  | { label?: undefined; 'aria-label': string }
  | { label?: undefined; 'aria-labelledby': string };

export type CheckboxProps = NativeCheckbox & CheckboxOwnProps & CheckboxName;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(props, forwardedRef) {
  const {
    label,
    description,
    error,
    indeterminate = false,
    invalid,
    size,
    variant,
    dark = false,
    onCheckedChange,
    onChange,
    className,
    id,
    disabled,
    required,
    'aria-describedby': describedBy,
    'aria-labelledby': labelledBy,
    ...rest
  } = props;

  const group = React.useContext(ChoiceGroupContext);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = `${inputId}-label`;
  const noteId = `${inputId}-note`;

  const resolvedSize = size ?? group?.size ?? 'md';
  const resolvedVariant = variant ?? group?.variant ?? 'plain';
  const isDisabled = disabled ?? group?.disabled ?? false;
  const isRequired = required ?? group?.required;
  const isInvalid = Boolean(error) || (invalid ?? group?.invalid ?? false);
  const note = error || description;

  // `indeterminate` is a DOM property, not an attribute: set it after every render, because
  // a click clears it in the DOM even when the prop stays true.
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement, []);
  useIsomorphicLayoutEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  });

  const hasLabel = label !== undefined && label !== null && label !== false;
  const describedByIds = [describedBy, note && hasLabel ? noteId : undefined].filter(Boolean).join(' ') || undefined;

  const input = (
    <input
      ref={inputRef}
      type="checkbox"
      id={inputId}
      disabled={isDisabled}
      required={isRequired}
      aria-invalid={isInvalid || undefined}
      aria-describedby={describedByIds}
      // With a visible label the name is the label line only, not the description inside the same <label>.
      aria-labelledby={labelledBy ?? (hasLabel ? labelId : undefined)}
      className={
        dark
          ? cn(choiceBoxDark, 'rounded-md', isInvalid && choiceBoxDarkInvalid)
          : cn(choiceBox, 'rounded-md', choiceBoxMixed, isInvalid && choiceBoxInvalid)
      }
      onChange={(event) => {
        onChange?.(event);
        onCheckedChange?.(event.target.checked);
      }}
      {...rest}
    />
  );
  const glyphs = (
    <>
      <Check
        className={cn(dark ? choiceGlyphDark : choiceGlyph, 'size-3 opacity-0 peer-checked:opacity-100 peer-indeterminate:opacity-0 comfortable:size-3.5')}
        strokeWidth={3}
        aria-hidden="true"
      />
      <Minus
        className={cn(dark ? choiceGlyphDark : choiceGlyph, 'size-3 opacity-0 peer-indeterminate:opacity-100 comfortable:size-3.5')}
        strokeWidth={3}
        aria-hidden="true"
      />
    </>
  );

  // No visible text: the label is just the 24px target around the box.
  if (!hasLabel) {
    return (
      <label className={cn(choiceTarget, 'cursor-pointer align-middle', isDisabled && 'cursor-not-allowed', className)}>
        {input}
        {glyphs}
      </label>
    );
  }

  return (
    <label
      htmlFor={inputId}
      className={cn(choiceRoot(dark ? 'plain' : resolvedVariant, { disabled: isDisabled, invalid: isInvalid }), className)}
    >
      <span className={choiceTarget}>
        {input}
        {glyphs}
      </span>
      <ChoiceText
        label={label}
        labelId={labelId}
        note={note}
        noteId={noteId}
        noteIsError={Boolean(error)}
        size={resolvedSize}
        variant={dark ? 'plain' : resolvedVariant}
        disabled={isDisabled}
        required={isRequired}
        dark={dark}
      />
    </label>
  );
});

/* ------------------------------------------------------------------------------------------
 * Group frame (shared with RadioGroup)
 * ---------------------------------------------------------------------------------------- */

export interface ChoiceGroupFrameProps {
  /** The question the options answer ("Relevant departments"). Rendered as the <legend>. */
  legend?: React.ReactNode;
  /** Keep the legend for screen readers but do not show it (a heading above already says it). */
  legendHidden?: boolean;
  /** One line under the options. */
  hint?: React.ReactNode;
  /** Replaces the hint in danger text and marks every option invalid. */
  error?: React.ReactNode;
  /** Shows the required asterisk on the legend. */
  required?: boolean;
  /** Disables every option (a disabled <fieldset>). */
  disabled?: boolean;
  /** `vertical` (default) stacks the options; `horizontal` wraps them in a row. */
  orientation?: ChoiceOrientation;
  /** Classes for the <fieldset> (layout only). */
  className?: string;
  /**
   * Replaces the list layout, e.g. a grid of cards:
   * `listClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"`.
   */
  listClassName?: string;
  /** Name for a group without a legend. */
  'aria-label'?: string;
  children: React.ReactNode;
}

interface ChoiceGroupFrameInternalProps extends ChoiceGroupFrameProps {
  role?: 'group' | 'radiogroup';
  variant: ChoiceVariant;
  /** aria-invalid / aria-required are valid on a radiogroup, not on a plain group. */
  ariaState?: { invalid?: boolean; required?: boolean };
}

/** The <fieldset> + <legend> + list + hint shared by CheckboxGroup and RadioGroup. */
export function ChoiceGroupFrame({
  legend,
  legendHidden,
  hint,
  error,
  required,
  disabled,
  orientation = 'vertical',
  className,
  listClassName,
  'aria-label': ariaLabel,
  role,
  variant,
  ariaState,
  children,
}: ChoiceGroupFrameInternalProps) {
  const baseId = useId();
  const legendId = `${baseId}-legend`;
  const noteId = `${baseId}-note`;
  const note = error || hint;
  return (
    <fieldset
      role={role}
      disabled={disabled}
      aria-labelledby={legend ? legendId : undefined}
      aria-label={legend ? undefined : ariaLabel}
      aria-describedby={note ? noteId : undefined}
      aria-invalid={ariaState?.invalid || undefined}
      aria-required={ariaState?.required || undefined}
      className={cn('min-w-0', className)}
    >
      {legend && (
        <legend id={legendId} className={legendHidden ? 'sr-only' : fieldLabel}>
          {legend}
          {required && <span className="text-danger"> *</span>}
        </legend>
      )}
      <div className={listClassName ?? choiceListLayout[orientation][variant]}>{children}</div>
      {note && (
        <p id={noteId} className={fieldNote(Boolean(error))}>
          {note}
        </p>
      )}
    </fieldset>
  );
}

/* ------------------------------------------------------------------------------------------
 * CheckboxGroup
 * ---------------------------------------------------------------------------------------- */

export interface CheckboxGroupProps extends ChoiceGroupFrameProps {
  /** Label size for every checkbox inside (each may still override). */
  size?: ChoiceSize;
  /** `plain` (default) or `card` for every checkbox inside. */
  variant?: ChoiceVariant;
}

/**
 * A set of independent checkboxes that answer one question ("Relevant departments"):
 * a <fieldset> whose <legend> names the set, with the hint or error under it. Each
 * Checkbox inside keeps its own `checked` / `onChange`; the group only lays them out and
 * hands down size, variant, disabled and invalid.
 */
export function CheckboxGroup({ size, variant = 'plain', disabled, error, required, children, ...frame }: CheckboxGroupProps) {
  const defaults = React.useMemo<ChoiceGroupDefaults>(
    () => ({ size, variant, disabled, invalid: Boolean(error) }),
    [size, variant, disabled, error],
  );
  return (
    <ChoiceGroupContext.Provider value={defaults}>
      <ChoiceGroupFrame {...frame} error={error} required={required} disabled={disabled} variant={variant}>
        {children}
      </ChoiceGroupFrame>
    </ChoiceGroupContext.Provider>
  );
}
