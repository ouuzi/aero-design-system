'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useId } from 'react';
import { ChoiceGroupContext, ChoiceGroupFrame, ChoiceText } from './Checkbox.js';
import { choiceBox, choiceBoxInvalid, choiceGlyph, choiceRoot, choiceTarget, } from './styles.js';
import { cn } from '../lib/utils.js';
const RadioGroupContext = React.createContext(null);
export const Radio = React.forwardRef(function Radio(props, ref) {
    const { value, label, description, invalid, size, variant, className, id, name, checked, onChange, disabled, required, 'aria-describedby': describedBy, 'aria-labelledby': labelledBy, ...rest } = props;
    const group = React.useContext(RadioGroupContext);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const labelId = `${inputId}-label`;
    const noteId = `${inputId}-note`;
    const resolvedSize = size ?? group?.size ?? 'md';
    const resolvedVariant = variant ?? group?.variant ?? 'plain';
    const isDisabled = disabled ?? group?.disabled ?? false;
    const isInvalid = invalid ?? group?.invalid ?? false;
    const hasLabel = label !== undefined && label !== null && label !== false;
    // In a group the group owns name, checked and the change; alone, the native props do.
    const groupProps = group
        ? {
            name: name ?? group.name,
            checked: group.value === value,
            required: required ?? group.required,
            onChange: (event) => {
                onChange?.(event);
                if (event.target.checked)
                    group.onChange(value);
            },
        }
        : { name, checked, required, onChange };
    const describedByIds = [describedBy, description && hasLabel ? noteId : undefined].filter(Boolean).join(' ') || undefined;
    const input = (_jsx("input", { ref: ref, type: "radio", id: inputId, value: value, disabled: isDisabled, "aria-describedby": describedByIds, "aria-labelledby": labelledBy ?? (hasLabel ? labelId : undefined), className: cn(choiceBox, 'rounded-full', isInvalid && choiceBoxInvalid), ...groupProps, ...rest }));
    const dot = (_jsx("span", { className: cn(choiceGlyph, 'size-1.5 rounded-full bg-on-solid opacity-0 peer-checked:opacity-100 comfortable:size-2'), "aria-hidden": "true" }));
    if (!hasLabel) {
        return (_jsxs("label", { className: cn(choiceTarget, 'cursor-pointer align-middle', isDisabled && 'cursor-not-allowed', className), children: [input, dot] }));
    }
    return (_jsxs("label", { htmlFor: inputId, className: cn(choiceRoot(resolvedVariant, { disabled: isDisabled, invalid: isInvalid }), className), children: [_jsxs("span", { className: choiceTarget, children: [input, dot] }), _jsx(ChoiceText, { label: label, labelId: labelId, note: description, noteId: noteId, noteIsError: false, size: resolvedSize, variant: resolvedVariant, disabled: isDisabled })] }));
});
/**
 * One choice from a visible list. Controlled: pass `value` and `onChange`; each <Radio>
 * inside gives its own `value` and `label`. Values are strings (the DOM's); map booleans or
 * numbers at the call site, e.g. `value={required ? 'yes' : 'no'}`.
 */
export function RadioGroup({ value, onChange, name, size, variant = 'plain', disabled, required, error, children, ...frame }) {
    const generatedName = useId();
    const invalid = Boolean(error);
    const groupName = name ?? generatedName;
    const context = React.useMemo(() => ({
        name: groupName,
        value,
        // The DOM hands back the string of a Radio rendered with one of T's values.
        onChange: (next) => onChange(next),
        size,
        variant,
        disabled,
        invalid,
        required,
    }), [groupName, value, onChange, size, variant, disabled, invalid, required]);
    return (_jsx(RadioGroupContext.Provider, { value: context, children: _jsx(ChoiceGroupContext.Provider, { value: null, children: _jsx(ChoiceGroupFrame, { ...frame, role: "radiogroup", error: error, required: required, disabled: disabled, variant: variant, ariaState: { invalid, required }, children: children }) }) }));
}
