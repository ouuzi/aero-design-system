'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './Popover.js';
import { useFieldControl } from './Field.js';
import { parseSelectOptions, selectedOptionIndex } from './selectOptions.js';
import { useListbox } from './useListbox.js';
import { fieldInvalid, listboxPanel, listboxScroll, listGroupLabel, listOption, listOptionCheck, nativeSelectHidden, selectChevron, selectChevronInline, selectFilterTrigger, selectTrigger, selectValue, selectValueSizer, selectValueText, } from './styles.js';
import { cn } from '../lib/utils.js';
/** Sets a select's value as the browser does for a pick, past React's value property wrapper. */
function setNativeValue(select, value) {
    const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
    if (setter)
        setter.call(select, value);
    else
        select.value = value;
}
/** Consecutive options of the same <optgroup> (or of none), in order. */
function sections(options) {
    const out = [];
    for (const option of options) {
        if (option.hidden)
            continue;
        const last = out[out.length - 1];
        if (last && last.group === option.group)
            last.options.push(option);
        else
            out.push({ group: option.group, options: [option] });
    }
    return out;
}
const ListboxSelect = React.forwardRef(function ListboxSelect({ look, children, value, defaultValue, onChange, onInput, onInvalid, name, required, disabled = false, form, autoComplete, multiple: _multiple, // single select only: the listbox picks one value
className, id: idProp, 'aria-describedby': describedByProp, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, onKeyDown, ...triggerRest }, ref) {
    const field = useFieldControl({
        id: idProp,
        invalid: look.kind === 'field' ? look.invalid : undefined,
        describedBy: describedByProp,
    });
    const baseId = useId();
    const triggerId = field.id ?? `${baseId}-trigger`;
    const filterLabelId = `${baseId}-label`;
    const { options, groups } = parseSelectOptions(children);
    const controlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState(() => defaultValue === undefined ? undefined : String(defaultValue));
    const selectedIndex = selectedOptionIndex(options, controlled ? String(value) : uncontrolledValue);
    const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;
    const selectRef = useRef(null);
    const setSelectRef = useCallback((el) => {
        selectRef.current = el;
        if (typeof ref === 'function')
            ref(el);
        else if (ref)
            ref.current = el;
    }, [ref]);
    const { open, onOpenChange, triggerRef, listId, onTriggerKeyDown, listProps, optionProps, onOpenAutoFocus } = useListbox({
        items: options.map((o) => ({ label: o.label, disabled: o.disabled || o.hidden })),
        selectedIndex,
        disabled,
        onPick: (index) => {
            const option = options[index];
            const select = selectRef.current;
            if (!option || !select || option.value === selected?.value)
                return;
            setNativeValue(select, option.value);
            select.dispatchEvent(new Event('input', { bubbles: true }));
            select.dispatchEvent(new Event('change', { bubbles: true }));
            if (!controlled)
                setUncontrolledValue(option.value);
        },
    });
    // Uncontrolled: a form reset puts the native select back to its default; show that.
    useEffect(() => {
        const formEl = selectRef.current?.form;
        if (controlled || !formEl)
            return;
        const onReset = () => window.setTimeout(() => setUncontrolledValue(selectRef.current?.value), 0);
        formEl.addEventListener('reset', onReset);
        return () => formEl.removeEventListener('reset', onReset);
    }, [controlled]);
    const isFilter = look.kind === 'filter';
    const empty = !selected || selected.value === '';
    const listName = ariaLabelledBy
        ? { 'aria-labelledby': ariaLabelledBy }
        : ariaLabel
            ? { 'aria-label': ariaLabel }
            : isFilter
                ? { 'aria-labelledby': filterLabelId }
                : field.labelId
                    ? { 'aria-labelledby': field.labelId }
                    : {};
    const { ref: listRef, ...listRest } = listProps;
    // A Select labelled by a <label htmlFor> outside a Field: name the list after that label too.
    const setListRef = (el) => {
        listRef.current = el;
        if (!el || el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby'))
            return;
        const trigger = document.getElementById(triggerId);
        const text = trigger?.labels?.[0]?.textContent?.trim();
        if (text)
            el.setAttribute('aria-label', text);
        else
            el.setAttribute('aria-labelledby', triggerId);
    };
    return (_jsxs(_Fragment, { children: [_jsx("select", { ref: setSelectRef, "aria-hidden": "true", tabIndex: -1, className: nativeSelectHidden, value: value, defaultValue: defaultValue, onChange: onChange, onInput: onInput, onInvalid: onInvalid, onFocus: () => triggerRef.current?.focus(), name: name, required: required, disabled: disabled, form: form, autoComplete: autoComplete, children: children }), _jsxs(Popover, { open: open, onOpenChange: onOpenChange, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs("button", { ...triggerRest, ref: triggerRef, type: "button", id: triggerId, role: "combobox", "aria-haspopup": "listbox", "aria-expanded": open, "aria-controls": open ? listId : undefined, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy ?? (isFilter && !ariaLabel ? filterLabelId : undefined), "aria-describedby": field.describedBy, "aria-invalid": field.invalid || undefined, "aria-required": required || undefined, disabled: disabled, onKeyDown: (e) => {
                                onKeyDown?.(e);
                                if (!e.defaultPrevented)
                                    onTriggerKeyDown(e);
                            }, className: look.kind === 'field'
                                ? cn(selectTrigger(look.size), field.invalid && fieldInvalid, className)
                                : cn(selectFilterTrigger, className), children: [look.kind === 'filter' && (
                                // Hidden from the content (the value), still the trigger's name through aria-labelledby.
                                _jsxs("span", { id: filterLabelId, "aria-hidden": "true", className: "shrink-0 font-medium text-ink-2", children: [look.label, ":"] })), _jsxs("span", { className: selectValue, children: [_jsx("span", { className: cn(selectValueText, isFilter ? 'font-medium text-ink' : empty && !disabled && 'text-muted'), children: selected?.label }), options.map((o) => (_jsx("span", { "aria-hidden": "true", className: selectValueSizer, children: o.label }, o.index)))] }), _jsx(ChevronDown, { className: isFilter ? selectChevronInline(open, disabled) : selectChevron(open, disabled), "aria-hidden": "true" })] }) }), _jsx(PopoverContent
                    // Only a frame around the listbox: no dialog role, so a screen reader goes straight
                    // from the combobox to its listbox.
                    , { 
                        // Only a frame around the listbox: no dialog role, so a screen reader goes straight
                        // from the combobox to its listbox.
                        role: "presentation", align: "start", sideOffset: 4, collisionPadding: 8, className: listboxPanel, onOpenAutoFocus: onOpenAutoFocus, children: _jsx("div", { ...listRest, ref: setListRef, ...listName, className: listboxScroll, children: sections(options).map((section) => {
                                const rows = section.options.map((option) => {
                                    const isSelected = option.index === selectedIndex;
                                    return (_jsxs("div", { ...optionProps(option.index), className: cn(listOption, isSelected && 'font-medium'), children: [_jsx(Check, { className: listOptionCheck(isSelected), "aria-hidden": "true" }), _jsx("span", { className: "min-w-0 flex-1 break-words", children: option.label })] }, option.index));
                                });
                                if (section.group < 0)
                                    return _jsx(React.Fragment, { children: rows }, `o${section.options[0].index}`);
                                const headingId = `${baseId}-group-${section.options[0].index}`;
                                return (_jsxs("div", { role: "group", "aria-labelledby": headingId, children: [_jsx("div", { id: headingId, role: "presentation", className: listGroupLabel, children: groups[section.group].label }), rows] }, `g${section.options[0].index}`));
                            }) }) })] })] }));
});
/** A form dropdown: `<option>` / `<optgroup>` children, `value` / `onChange` as on a native select. */
export const Select = React.forwardRef(function Select({ size = 'lg', invalid, ...rest }, ref) {
    return _jsx(ListboxSelect, { ref: ref, look: { kind: 'field', size, invalid }, ...rest });
});
/** A toolbar filter with its label inside the box ("Dept: All departments"). */
export function FilterSelect({ label, ...rest }) {
    return _jsx(ListboxSelect, { look: { kind: 'filter', label }, ...rest });
}
