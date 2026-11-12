'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useId } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './Popover.js';
import { StatusBadge } from './StatusBadge.js';
import { StatusSymbol } from './StatusSymbol.js';
import { labelDot, listOption, statusBadgeClass, statusSelectTrigger } from './styles.js';
import { useListbox } from './useListbox.js';
import { cn } from '../lib/utils.js';
export function StatusSelect({ value, onChange, options, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, 'aria-describedby': describedBy, id, width = 'column', placeholder = 'Not set', dot = false, disabled = false, name, align, className, }) {
    const baseId = useId();
    const triggerId = id ?? `${baseId}-trigger`;
    const nameId = `${baseId}-name`;
    const valueId = `${baseId}-value`;
    // Name then value: "QC-3 status, Valid". aria-label alone would hide the status word.
    const triggerLabelledBy = `${ariaLabelledBy ?? (ariaLabel ? nameId : '')} ${valueId}`.trim();
    const selectedIndex = options.findIndex((o) => o.value === value);
    const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;
    const tone = selected?.tone ?? 'neutral';
    const label = selected?.label ?? (value ? String(value) : placeholder);
    const { open, onOpenChange, triggerRef, listId, onTriggerKeyDown, listProps, optionProps, onOpenAutoFocus } = useListbox({
        items: options,
        selectedIndex,
        disabled,
        onPick: (index) => {
            if (options[index].value !== value)
                onChange(options[index].value);
        },
    });
    return (_jsxs(_Fragment, { children: [_jsxs(Popover, { open: open, onOpenChange: onOpenChange, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs("button", { ref: triggerRef, type: "button", id: triggerId, role: "combobox", "aria-haspopup": "listbox", "aria-expanded": open, "aria-controls": open ? listId : undefined, "aria-labelledby": triggerLabelledBy, "aria-describedby": describedBy, disabled: disabled, onKeyDown: onTriggerKeyDown, className: cn(statusBadgeClass(tone, width), statusSelectTrigger, className), children: [ariaLabel && !ariaLabelledBy && (_jsx("span", { id: nameId, className: "sr-only", children: ariaLabel })), tone === 'neutral' ? (dot && _jsx("span", { className: labelDot, "aria-hidden": "true" })) : (_jsx(StatusSymbol, { tone: tone })), _jsx("span", { id: valueId, className: cn('min-w-0 truncate', !selected && !value && 'font-medium'), children: label }), _jsx(ChevronDown, { className: cn('h-3.5 w-3.5 shrink-0 transition-transform', open && 'rotate-180'), strokeWidth: 2.25, "aria-hidden": "true" })] }) }), _jsx(PopoverContent
                    // The panel is only a frame around the listbox: no dialog role, so a screen reader
                    // goes straight from the combobox to its listbox.
                    , { 
                        // The panel is only a frame around the listbox: no dialog role, so a screen reader
                        // goes straight from the combobox to its listbox.
                        role: "presentation", align: align ?? (width === 'column' ? 'center' : 'start'), sideOffset: 4, className: "w-auto min-w-48 max-w-80 p-1", onOpenAutoFocus: onOpenAutoFocus, children: _jsx("div", { ...listProps, "aria-labelledby": ariaLabelledBy ?? (ariaLabel ? nameId : triggerId), className: "max-h-72 overflow-y-auto outline-none custom-scrollbar", children: options.map((option, index) => {
                                const isSelected = index === selectedIndex;
                                return (_jsxs("div", { ...optionProps(index), className: listOption, children: [_jsx(StatusBadge, { tone: option.tone, dot: dot, children: option.label }), option.description && (_jsx("span", { className: "min-w-0 flex-1 truncate text-12 text-muted comfortable:text-13", children: option.description })), _jsx(Check, { className: cn('ml-auto h-4 w-4 shrink-0 text-accent', !isSelected && 'invisible'), "aria-hidden": "true" })] }, option.value));
                            }) }) })] }), name && _jsx("input", { type: "hidden", name: name, value: value ?? '', disabled: disabled })] }));
}
export default StatusSelect;
