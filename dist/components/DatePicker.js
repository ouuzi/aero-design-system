'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useId, useRef, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { formatDate, toIsoDate } from '../lib/dateFormat.js';
import { useFieldControl } from './Field.js';
import { fieldDark, fieldInvalid, selectGeometry, selectSizes } from './styles.js';
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
function spokenDate(iso) {
    const [year, month, day] = iso.split('-').map(Number);
    return spokenDateFormat.format(new Date(Date.UTC(year, month - 1, day)));
}
export const DatePicker = React.forwardRef(function DatePicker({ value = '', onChange, size = 'lg', invalid: invalidProp, disabled = false, required, min, max, name, form, id: idProp, autoFocus, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, 'aria-describedby': describedByProp, onFocus, onBlur, dark = false, className, }, ref) {
    const field = useFieldControl({ id: idProp, invalid: invalidProp, describedBy: describedByProp });
    const { id, describedBy } = field;
    const invalid = field.invalid;
    const baseId = useId();
    const valueId = `${baseId}-value`;
    const buttonRef = useRef(null);
    const inputRef = useRef(null);
    // Assume showPicker() until mounted (it is in every current browser), so the server and
    // first client render match; fall back to the plain native input where it is missing.
    const [pickerSupported, setPickerSupported] = useState(true);
    useEffect(() => {
        if (typeof HTMLInputElement !== 'undefined' && !('showPicker' in HTMLInputElement.prototype))
            setPickerSupported(false);
    }, []);
    const iso = toIsoDate(value);
    const showInvalid = invalid && !disabled;
    const frame = dark ? cn(selectGeometry[size], fieldDark) : cn(selectSizes[size], showInvalid && fieldInvalid);
    const iconClass = cn('shrink-0', size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4', dark ? 'text-viewer-muted' : disabled ? 'text-disabled' : 'text-muted');
    const setRefs = (el) => {
        if (typeof ref === 'function')
            ref(el);
        else if (ref)
            ref.current = el;
    };
    // Fallback: the native date input is the control itself, in the same frame.
    if (!pickerSupported) {
        return (_jsx("span", { className: cn('relative block w-full', className), children: _jsx("input", { ref: (el) => {
                    inputRef.current = el;
                    setRefs(el);
                }, type: "date", id: id, name: name, form: form, value: iso, min: min, max: max, required: required, disabled: disabled, autoFocus: autoFocus, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": describedBy, "aria-invalid": showInvalid || undefined, onChange: (event) => onChange(event.target.value), onFocus: onFocus, onBlur: onBlur, className: cn('w-full tabular-nums', frame) }) }));
    }
    const openPicker = () => {
        const input = inputRef.current;
        if (disabled || !input)
            return;
        try {
            input.showPicker?.();
        }
        catch {
            // No user activation (a programmatic call) or the picker is already open: nothing to do.
        }
    };
    const onKeyDown = (event) => {
        if (disabled || event.ctrlKey || event.metaKey)
            return;
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            openPicker();
        }
        else if ((event.key === 'Delete' || event.key === 'Backspace') && iso) {
            event.preventDefault();
            onChange('');
        }
    };
    const describedByIds = [valueId, describedBy].filter(Boolean).join(' ');
    return (_jsxs("span", { className: cn('relative block w-full', className), children: [_jsxs("button", { ref: (el) => {
                    buttonRef.current = el;
                    setRefs(el);
                }, type: "button", id: id, disabled: disabled, autoFocus: autoFocus, "aria-haspopup": "dialog", "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": describedByIds, onClick: openPicker, onKeyDown: onKeyDown, onFocus: onFocus, onBlur: onBlur, className: cn('relative flex w-full items-center justify-between gap-2 overflow-hidden whitespace-nowrap text-left tabular-nums', frame), children: [_jsxs("span", { id: valueId, className: cn('min-w-0 flex-1 truncate', iso ? showInvalid && 'font-medium' : dark ? 'text-viewer-muted' : !disabled && 'text-muted'), children: [_jsx("span", { "aria-hidden": "true", children: iso ? formatDate(iso) : EMPTY_TEXT }), _jsxs("span", { className: "sr-only", children: [iso ? spokenDate(iso) : 'No date set', required && !disabled && ', required', showInvalid && ', invalid'] })] }), _jsx(CalendarDays, { className: iconClass, "aria-hidden": "true" })] }), _jsx("input", { ref: inputRef, type: "date", tabIndex: -1, "aria-hidden": "true", name: name, form: form, value: iso, min: min, max: max, required: required, disabled: disabled, onChange: (event) => onChange(event.target.value), onFocus: () => buttonRef.current?.focus(), className: "pointer-events-none absolute inset-0 h-full w-full min-w-0 max-w-full appearance-none opacity-0" })] }));
});
export default DatePicker;
