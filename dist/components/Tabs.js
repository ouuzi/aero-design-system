'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { badgeClass, segmentedGroup, segmentedItem, tabItem, tabList } from './styles.js';
import { cn } from '../lib/utils.js';
/*
 * The tab and segmented recipes have no disabled state, so a disabled option is dimmed here and
 * its recipe hover is cancelled (cn merges the classes), so it never looks clickable.
 */
const disabledItem = 'opacity-40 cursor-not-allowed';
const disabledTabHover = 'hover:text-muted';
const disabledSegmentHover = 'hover:bg-transparent hover:text-ink-2 hover:shadow-none';
/** Roving tabindex + arrow/Home/End selection shared by Tabs and SegmentedControl. */
function useRovingOptions(options, value, onChange) {
    const buttons = useRef(new Map());
    const activeIndex = options.findIndex((option) => option.value === value && !option.disabled);
    const tabStop = activeIndex >= 0 ? options[activeIndex].value : options.find((option) => !option.disabled)?.value;
    const register = (optionValue) => (element) => {
        if (element)
            buttons.current.set(optionValue, element);
        else
            buttons.current.delete(optionValue);
    };
    const onKeyDown = (event, from) => {
        if (event.altKey || event.ctrlKey || event.metaKey)
            return;
        const enabled = options.filter((option) => !option.disabled);
        if (enabled.length === 0)
            return;
        const current = enabled.findIndex((option) => option.value === from);
        let next;
        switch (event.key) {
            case 'ArrowRight':
                next = enabled[(current + 1) % enabled.length];
                break;
            case 'ArrowLeft':
                next = enabled[current <= 0 ? enabled.length - 1 : current - 1];
                break;
            case 'Home':
                next = enabled[0];
                break;
            case 'End':
                next = enabled[enabled.length - 1];
                break;
            default:
                return;
        }
        event.preventDefault();
        buttons.current.get(next.value)?.focus();
        if (next.value !== value)
            onChange(next.value);
    };
    return { tabStop, register, onKeyDown };
}
export function Tabs({ options, value, onChange, label, className, }) {
    const { tabStop, register, onKeyDown } = useRovingOptions(options, value, onChange);
    return (_jsx("div", { role: "tablist", "aria-label": label, className: cn(tabList, className), children: options.map((option) => {
            const Icon = option.icon;
            const active = option.value === value;
            return (_jsxs("button", { ref: register(option.value), id: option.id, type: "button", role: "tab", "aria-selected": active, "aria-controls": option.controls, tabIndex: option.value === tabStop ? 0 : -1, disabled: option.disabled, onClick: () => onChange(option.value), onKeyDown: (event) => onKeyDown(event, option.value), className: option.disabled ? cn(tabItem(active), disabledItem, !active && disabledTabHover) : tabItem(active), children: [Icon && _jsx(Icon, { className: "h-4 w-4", "aria-hidden": "true" }), option.label, option.count !== undefined && _jsx("span", { className: badgeClass('neutral'), children: option.count })] }, option.value));
        }) }));
}
export function SegmentedControl({ options, value, onChange, label, size = 'md', className, }) {
    const { tabStop, register, onKeyDown } = useRovingOptions(options, value, onChange);
    return (_jsx("div", { role: "group", "aria-label": label, className: cn(segmentedGroup, className), children: options.map((option) => {
            const Icon = option.icon;
            const active = option.value === value;
            return (_jsxs("button", { ref: register(option.value), id: option.id, type: "button", "aria-pressed": active, "aria-controls": option.controls, tabIndex: option.value === tabStop ? 0 : -1, disabled: option.disabled, onClick: () => onChange(option.value), onKeyDown: (event) => onKeyDown(event, option.value), className: option.disabled ? cn(segmentedItem(active, size), disabledItem, !active && disabledSegmentHover) : segmentedItem(active, size), children: [Icon && _jsx(Icon, { className: "h-4 w-4", "aria-hidden": "true" }), option.label, option.count !== undefined && _jsx("span", { className: "tabular-nums opacity-80", children: option.count })] }, option.value));
        }) }));
}
