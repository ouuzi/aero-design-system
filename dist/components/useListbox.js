'use client';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
const TYPEAHEAD_RESET_MS = 500;
const PAGE_STEP = 5;
/** Index of the next option (from `from`, stepping `step`) that can be picked, clamped to the ends (no wrap). */
export function nextEnabled(items, from, step) {
    const n = items.length;
    let i = from;
    for (let k = 0; k < n; k += 1) {
        const candidate = Math.min(n - 1, Math.max(0, i + step));
        if (candidate === i)
            break;
        i = candidate;
        if (!items[i].disabled)
            return i;
    }
    return items[from] && !items[from].disabled ? from : -1;
}
export function firstEnabled(items) {
    return items.findIndex((o) => !o.disabled);
}
export function lastEnabled(items) {
    for (let i = items.length - 1; i >= 0; i -= 1)
        if (!items[i].disabled)
            return i;
    return -1;
}
/**
 * The option a typed string points at, searching from `from`: the whole string matched
 * against the start of each label (case-insensitive); a string of one repeated letter cycles
 * through the options that start with it, starting after `from`.
 */
export function matchTypeahead(items, query, from) {
    if (!query)
        return -1;
    const cycling = query.split('').every((c) => c === query[0]);
    const needle = cycling ? query[0] : query;
    const start = cycling ? from + 1 : Math.max(from, 0);
    const n = items.length;
    for (let k = 0; k < n; k += 1) {
        const i = (((start + k) % n) + n) % n;
        if (!items[i].disabled && items[i].label.toLowerCase().startsWith(needle))
            return i;
    }
    return -1;
}
const isTypeKey = (e) => e.key.length === 1 && e.key !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey;
export function useListbox({ items, selectedIndex, disabled = false, onPick }) {
    const baseId = useId();
    const listId = `${baseId}-list`;
    const optionId = useCallback((index) => `${baseId}-option-${index}`, [baseId]);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);
    const triggerRef = useRef(null);
    const listRef = useRef(null);
    const typed = useRef('');
    const typedTimer = useRef(undefined);
    const selectable = selectedIndex >= 0 && items[selectedIndex] && !items[selectedIndex].disabled ? selectedIndex : -1;
    useEffect(() => () => window.clearTimeout(typedTimer.current), []);
    // Keep the active option in view (also the current one when the list opens), scrolling
    // the list only: scrollIntoView would also scroll the page or a dialog behind the popover.
    useEffect(() => {
        const list = listRef.current;
        if (!open || active < 0 || !list)
            return;
        const row = list.querySelector(`[data-index="${active}"]`);
        if (!row)
            return;
        const listBox = list.getBoundingClientRect();
        const rowBox = row.getBoundingClientRect();
        if (rowBox.top < listBox.top)
            list.scrollTop -= listBox.top - rowBox.top;
        else if (rowBox.bottom > listBox.bottom)
            list.scrollTop += rowBox.bottom - listBox.bottom;
    }, [open, active]);
    /** Adds a typed character to the type-ahead string (cleared after a pause) and returns the match. */
    const typeahead = (char, from) => {
        window.clearTimeout(typedTimer.current);
        typed.current += char.toLowerCase();
        typedTimer.current = window.setTimeout(() => {
            typed.current = '';
        }, TYPEAHEAD_RESET_MS);
        return matchTypeahead(items, typed.current, from);
    };
    const openAt = (index) => {
        setActive(index);
        setOpen(true);
    };
    /** For Popover's onOpenChange: a click on the trigger opens on the current option. */
    const onOpenChange = (next) => {
        if (next)
            setActive(selectable >= 0 ? selectable : firstEnabled(items));
        setOpen(next);
    };
    const pick = (index) => {
        const item = items[index];
        if (!item || item.disabled)
            return;
        setOpen(false);
        onPick(index);
    };
    const onTriggerKeyDown = (e) => {
        if (disabled || open)
            return;
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            openAt(selectable >= 0 ? selectable : e.key === 'ArrowDown' ? firstEnabled(items) : lastEnabled(items));
        }
        else if (e.key === 'Home' || e.key === 'End') {
            e.preventDefault();
            openAt(e.key === 'Home' ? firstEnabled(items) : lastEnabled(items));
        }
        else if (isTypeKey(e)) {
            e.preventDefault();
            const match = typeahead(e.key, selectable);
            openAt(match >= 0 ? match : selectable >= 0 ? selectable : firstEnabled(items));
        }
        // Enter and Space click the button, which opens it through onOpenChange.
    };
    const onListKeyDown = (e) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActive((i) => (i < 0 ? firstEnabled(items) : nextEnabled(items, i, 1)));
                return;
            case 'ArrowUp':
                e.preventDefault();
                if (e.altKey) {
                    pick(active);
                    return;
                }
                setActive((i) => (i < 0 ? lastEnabled(items) : nextEnabled(items, i, -1)));
                return;
            case 'Home':
                e.preventDefault();
                setActive(firstEnabled(items));
                return;
            case 'End':
                e.preventDefault();
                setActive(lastEnabled(items));
                return;
            case 'PageDown':
                e.preventDefault();
                setActive((i) => nextEnabled(items, Math.max(i, 0), PAGE_STEP));
                return;
            case 'PageUp':
                e.preventDefault();
                setActive((i) => nextEnabled(items, Math.max(i, 0), -PAGE_STEP));
                return;
            case 'Enter':
            case ' ':
                e.preventDefault();
                pick(active);
                return;
            case 'Tab':
                // Like a native select: close without a change and move on from the trigger
                // (focus goes back to it now, the browser's Tab then moves past it).
                if (e.altKey || e.ctrlKey || e.metaKey)
                    return;
                triggerRef.current?.focus();
                setOpen(false);
                return;
            default:
                if (isTypeKey(e)) {
                    e.preventDefault();
                    const match = typeahead(e.key, active);
                    if (match >= 0)
                        setActive(match);
                }
        }
    };
    /** Props for one option row (role, id, active state, pointer). */
    const optionProps = (index) => {
        const item = items[index];
        return {
            id: optionId(index),
            role: 'option',
            'data-index': index,
            'data-active': index === active,
            'aria-selected': index === selectedIndex,
            'aria-disabled': item?.disabled || undefined,
            onMouseMove: () => {
                if (item && !item.disabled && index !== active)
                    setActive(index);
            },
            onClick: () => pick(index),
        };
    };
    /** Props for the role="listbox" element. */
    const listProps = {
        ref: listRef,
        id: listId,
        role: 'listbox',
        tabIndex: -1,
        'aria-activedescendant': open && active >= 0 ? optionId(active) : undefined,
        onKeyDown: onListKeyDown,
    };
    /** For PopoverContent: focus goes to the list when it opens. */
    const onOpenAutoFocus = (e) => {
        e.preventDefault();
        listRef.current?.focus();
    };
    return {
        open,
        onOpenChange,
        active,
        triggerRef,
        listId,
        onTriggerKeyDown,
        listProps,
        optionProps,
        onOpenAutoFocus,
    };
}
