'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { formatDate, toIsoDate } from '../lib/dateFormat.js';
import { useFieldControl } from './Field.js';
import { fieldDark, fieldInvalid, selectGeometry, selectSizes, type ControlSize } from './styles.js';
import { cn } from '../lib/utils.js';

/*
 * DatePicker: one look for every date field. The box is the same as Select and Combobox
 * (white, line-strong border, shadow-xs, the field focus ring, heights per size) with a
 * muted calendar icon on the right. Dates always show as DD-MMM-YYYY; the value passed in
 * and out is an ISO date (YYYY-MM-DD), or '' when empty.
 *
 *   <Field label="Issue date" required>
 *     <DatePicker id="auth-issue-date" value={issued} onChange={setIssued} required />
 *   </Field>
 *
 * How it works: the box is a real <button> (the focusable, labelled control). Activating it
 * opens the browser's own calendar through showPicker() on a hidden native date input, which
 * also carries `name`, `required`, `min` and `max`, so forms post and validate it as before.
 * Browsers without showPicker() get the plain native date input in the same frame instead.
 *
 * Keyboard: Enter, Space, Down or Up open the calendar; Delete or Backspace clear the date.
 * Screen readers hear the label (from Field, a wrapping <label> or aria-label), "button",
 * then the date in words ("12 March 2025", or "No date set"), plus ", required" when
 * `required` and ", invalid" when `invalid`, and any hint or error.
 *
 * Field: inside <Field> the control takes Field's id (so Field's label points at it), its
 * hint or error (aria-describedby) and its error state (invalid) by itself. Explicit `id`,
 * `invalid` and `aria-describedby` props win.
 *
 * Dark: the document viewer's frame (fieldDark: viewer fill, accent-soft focus) at the
 * same geometry (selectGeometry[size]).
 */

const EMPTY_TEXT = 'DD-MMM-YYYY';
const spokenDateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** "2025-03-12" -> "12 March 2025", for screen readers ("12-Mar-2025" reads as a sum). */
function spokenDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return spokenDateFormat.format(new Date(Date.UTC(year, month - 1, day)));
}

type PickerInput = HTMLInputElement & { showPicker?: () => void };

export interface DatePickerProps {
  /** The date as ISO YYYY-MM-DD ('' or undefined when empty). Other formats toIsoDate understands (DD-MMM-YYYY, DD/MM/YYYY) are read too. */
  value?: string;
  /** Called with the new ISO date (YYYY-MM-DD), or '' when cleared. */
  onChange: (value: string) => void;
  /** `lg` 40px (default, forms), `md` 36px (toolbars), `sm` 32px (table cells, dense rows). 48/44/40px comfortable. */
  size?: ControlSize;
  /** Marks the date as wrong or overdue: danger border, ring and text. Inside <Field error> it is on by itself. */
  invalid?: boolean;
  disabled?: boolean;
  /** Native form validation: an empty required date blocks submit and focus returns here. */
  required?: boolean;
  /** Earliest pickable date, ISO YYYY-MM-DD. */
  min?: string;
  /** Latest pickable date, ISO YYYY-MM-DD. */
  max?: string;
  /** Form field name: the ISO value is posted with the form. */
  name?: string;
  /** Id of a <form> elsewhere in the page this field belongs to. */
  form?: string;
  /** Id of the button. Inside <Field> it defaults to Field's, so Field's label points at it. */
  id?: string;
  autoFocus?: boolean;
  /** Use when there is no visible label (table cells): "Due date for Human factors". */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  /** Hint or error ids; inside <Field> it defaults to Field's note. The spoken date is added in front. */
  'aria-describedby'?: string;
  onFocus?: React.FocusEventHandler<HTMLElement>;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  /** For the dark PDF viewer only. */
  dark?: boolean;
  /** Layout only (width, margins, grid placement). The look comes from the component. Full width by default. */
  className?: string;
}

export const DatePicker = React.forwardRef<HTMLElement, DatePickerProps>(function DatePicker(
  {
    value = '',
    onChange,
    size = 'lg',
    invalid: invalidProp,
    disabled = false,
    required,
    min,
    max,
    name,
    form,
    id: idProp,
    autoFocus,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': describedByProp,
    onFocus,
    onBlur,
    dark = false,
    className,
  },
  ref,
) {
  const field = useFieldControl({ id: idProp, invalid: invalidProp, describedBy: describedByProp });
  const { id, describedBy } = field;
  const invalid = field.invalid;
  const baseId = useId();
  const valueId = `${baseId}-value`;
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<PickerInput | null>(null);
  // Assume showPicker() until mounted (it is in every current browser), so the server and
  // first client render match; fall back to the plain native input where it is missing.
  const [pickerSupported, setPickerSupported] = useState(true);
  useEffect(() => {
    if (typeof HTMLInputElement !== 'undefined' && !('showPicker' in HTMLInputElement.prototype)) setPickerSupported(false);
  }, []);

  const iso = toIsoDate(value);
  const showInvalid = invalid && !disabled;
  const frame = dark ? cn(selectGeometry[size], fieldDark) : cn(selectSizes[size], showInvalid && fieldInvalid);
  const iconClass = cn(
    'shrink-0',
    size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4',
    dark ? 'text-viewer-muted' : disabled ? 'text-disabled' : 'text-muted',
  );

  const setRefs = (el: HTMLElement | null) => {
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  // Fallback: the native date input is the control itself, in the same frame.
  if (!pickerSupported) {
    return (
      <span className={cn('relative block w-full', className)}>
        <input
          ref={(el) => {
            inputRef.current = el;
            setRefs(el);
          }}
          type="date"
          id={id}
          name={name}
          form={form}
          value={iso}
          min={min}
          max={max}
          required={required}
          disabled={disabled}
          autoFocus={autoFocus}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={describedBy}
          aria-invalid={showInvalid || undefined}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          className={cn('w-full tabular-nums', frame)}
        />
      </span>
    );
  }

  const openPicker = () => {
    const input = inputRef.current;
    if (disabled || !input) return;
    try {
      input.showPicker?.();
    } catch {
      // No user activation (a programmatic call) or the picker is already open: nothing to do.
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openPicker();
    } else if ((event.key === 'Delete' || event.key === 'Backspace') && iso) {
      event.preventDefault();
      onChange('');
    }
  };

  const describedByIds = [valueId, describedBy].filter(Boolean).join(' ');

  return (
    <span className={cn('relative block w-full', className)}>
      {/* The button comes first, so a wrapping <label> labels it (the first labelable child). */}
      <button
        ref={(el) => {
          buttonRef.current = el;
          setRefs(el);
        }}
        type="button"
        id={id}
        disabled={disabled}
        autoFocus={autoFocus}
        aria-haspopup="dialog"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={describedByIds}
        onClick={openPicker}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        className={cn('relative flex w-full items-center justify-between gap-2 overflow-hidden whitespace-nowrap text-left tabular-nums', frame)}
      >
        <span id={valueId} className={cn('min-w-0 flex-1 truncate', iso ? showInvalid && 'font-medium' : dark ? 'text-viewer-muted' : !disabled && 'text-muted')}>
          <span aria-hidden="true">{iso ? formatDate(iso) : EMPTY_TEXT}</span>
          {/* A button takes no aria-required or aria-invalid, so both states are spoken with the date. */}
          <span className="sr-only">
            {iso ? spokenDate(iso) : 'No date set'}
            {required && !disabled && ', required'}
            {showInvalid && ', invalid'}
          </span>
        </span>
        <CalendarDays className={iconClass} aria-hidden="true" />
      </button>
      {/*
        The browser's calendar opens on this input (showPicker), anchored to the box it covers.
        It is invisible and out of the tab order; it holds the value for form posting and native
        validation, and hands focus to the button if validation focuses it.
      */}
      <input
        ref={inputRef}
        type="date"
        tabIndex={-1}
        aria-hidden="true"
        name={name}
        form={form}
        value={iso}
        min={min}
        max={max}
        required={required}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => buttonRef.current?.focus()}
        className="pointer-events-none absolute inset-0 h-full w-full min-w-0 max-w-full appearance-none opacity-0"
      />
    </span>
  );
});

export default DatePicker;
