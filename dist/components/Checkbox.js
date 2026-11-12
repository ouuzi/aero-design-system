'use client';
import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useId, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { Check, Minus } from 'lucide-react';
import { choiceBox, choiceBoxDark, choiceBoxDarkInvalid, choiceBoxInvalid, choiceBoxMixed, choiceGlyph, choiceGlyphDark, choiceLabelText, choiceListLayout, choiceNoteText, choiceRoot, choiceTarget, fieldLabel, fieldNote, } from './styles.js';
import { cn } from '../lib/utils.js';
export const ChoiceGroupContext = React.createContext(null);
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
/** The label line and the description or error under it. Ids are wired by the caller. */
export function ChoiceText({ label, labelId, note, noteId, noteIsError, size, variant, disabled, required, dark = false }) {
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
    return (_jsxs("span", { className: "min-w-0 flex-1", children: [_jsxs("span", { id: labelId, className: cn(choiceLabelText[size], variant === 'card' ? 'font-medium' : 'font-normal', labelTone), children: [label, required && (_jsxs("span", { className: dark ? 'text-danger-on-dark' : 'text-danger', "aria-hidden": "true", children: [' ', "*"] }))] }), note && (_jsx("span", { id: noteId, className: cn(choiceNoteText, noteTone), children: note }))] }));
}
export const Checkbox = React.forwardRef(function Checkbox(props, forwardedRef) {
    const { label, description, error, indeterminate = false, invalid, size, variant, dark = false, onCheckedChange, onChange, className, id, disabled, required, 'aria-describedby': describedBy, 'aria-labelledby': labelledBy, ...rest } = props;
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
    const inputRef = useRef(null);
    useImperativeHandle(forwardedRef, () => inputRef.current, []);
    useIsomorphicLayoutEffect(() => {
        if (inputRef.current)
            inputRef.current.indeterminate = indeterminate;
    });
    const hasLabel = label !== undefined && label !== null && label !== false;
    const describedByIds = [describedBy, note && hasLabel ? noteId : undefined].filter(Boolean).join(' ') || undefined;
    const input = (_jsx("input", { ref: inputRef, type: "checkbox", id: inputId, disabled: isDisabled, required: isRequired, "aria-invalid": isInvalid || undefined, "aria-describedby": describedByIds, "aria-labelledby": labelledBy ?? (hasLabel ? labelId : undefined), className: dark
            ? cn(choiceBoxDark, 'rounded-md', isInvalid && choiceBoxDarkInvalid)
            : cn(choiceBox, 'rounded-md', choiceBoxMixed, isInvalid && choiceBoxInvalid), onChange: (event) => {
            onChange?.(event);
            onCheckedChange?.(event.target.checked);
        }, ...rest }));
    const glyphs = (_jsxs(_Fragment, { children: [_jsx(Check, { className: cn(dark ? choiceGlyphDark : choiceGlyph, 'size-3 opacity-0 peer-checked:opacity-100 peer-indeterminate:opacity-0 comfortable:size-3.5'), strokeWidth: 3, "aria-hidden": "true" }), _jsx(Minus, { className: cn(dark ? choiceGlyphDark : choiceGlyph, 'size-3 opacity-0 peer-indeterminate:opacity-100 comfortable:size-3.5'), strokeWidth: 3, "aria-hidden": "true" })] }));
    // No visible text: the label is just the 24px target around the box.
    if (!hasLabel) {
        return (_jsxs("label", { className: cn(choiceTarget, 'cursor-pointer align-middle', isDisabled && 'cursor-not-allowed', className), children: [input, glyphs] }));
    }
    return (_jsxs("label", { htmlFor: inputId, className: cn(choiceRoot(dark ? 'plain' : resolvedVariant, { disabled: isDisabled, invalid: isInvalid }), className), children: [_jsxs("span", { className: choiceTarget, children: [input, glyphs] }), _jsx(ChoiceText, { label: label, labelId: labelId, note: note, noteId: noteId, noteIsError: Boolean(error), size: resolvedSize, variant: dark ? 'plain' : resolvedVariant, disabled: isDisabled, required: isRequired, dark: dark })] }));
});
/** The <fieldset> + <legend> + list + hint shared by CheckboxGroup and RadioGroup. */
export function ChoiceGroupFrame({ legend, legendHidden, hint, error, required, disabled, orientation = 'vertical', className, listClassName, 'aria-label': ariaLabel, role, variant, ariaState, children, }) {
    const baseId = useId();
    const legendId = `${baseId}-legend`;
    const noteId = `${baseId}-note`;
    const note = error || hint;
    return (_jsxs("fieldset", { role: role, disabled: disabled, "aria-labelledby": legend ? legendId : undefined, "aria-label": legend ? undefined : ariaLabel, "aria-describedby": note ? noteId : undefined, "aria-invalid": ariaState?.invalid || undefined, "aria-required": ariaState?.required || undefined, className: cn('min-w-0', className), children: [legend && (_jsxs("legend", { id: legendId, className: legendHidden ? 'sr-only' : fieldLabel, children: [legend, required && _jsx("span", { className: "text-danger", children: " *" })] })), _jsx("div", { className: listClassName ?? choiceListLayout[orientation][variant], children: children }), note && (_jsx("p", { id: noteId, className: fieldNote(Boolean(error)), children: note }))] }));
}
/**
 * A set of independent checkboxes that answer one question ("Relevant departments"):
 * a <fieldset> whose <legend> names the set, with the hint or error under it. Each
 * Checkbox inside keeps its own `checked` / `onChange`; the group only lays them out and
 * hands down size, variant, disabled and invalid.
 */
export function CheckboxGroup({ size, variant = 'plain', disabled, error, required, children, ...frame }) {
    const defaults = React.useMemo(() => ({ size, variant, disabled, invalid: Boolean(error) }), [size, variant, disabled, error]);
    return (_jsx(ChoiceGroupContext.Provider, { value: defaults, children: _jsx(ChoiceGroupFrame, { ...frame, error: error, required: required, disabled: disabled, variant: variant, children: children }) }));
}
