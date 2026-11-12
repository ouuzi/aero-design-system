'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/*
 * Menu rows for a popover the screen controls (an account menu, a notification centre):
 * MenuList is the role="menu" list and its keyboard, MenuItem one row. They bring no panel
 * and no trigger: put the list in a PopoverContent (which already handles Escape, a click
 * outside and focus return) or in the screen's own panel. RowMenu is built from the same
 * two pieces, so a row menu and a hand-opened menu look and move alike.
 *
 * Keyboard (useMenuKeyboard, shared with RowMenu): Up and Down move between the enabled
 * items (wrapping), Home and End jump to the ends, Enter or Space chooses. Escape and Tab
 * call `onClose` with the reason, as does choosing an item; without `onClose` they are left
 * to the surface around the list (a Popover closes itself on Escape).
 *
 * Look: the menuItem recipe, 32px rows (40px comfortable), radius md, 13px medium text, a 16px
 * icon in muted (or in the row's `iconTone`); a `danger` row is red with a danger-bg hover.
 * A row with a `description` grows to fit its second line (`menuItem(danger, true)`). The focused row
 * keeps its fill and takes the inset accent ring (focusRingInset), because the fill alone is
 * about 1.1:1 against the panel.
 */
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { noticeIconTone } from './Notice.js';
import { menuItem } from './styles.js';
import { cn } from '../lib/utils.js';
const ITEM_SELECTOR = '[role="menuitem"]:not(:disabled)';
/**
 * Arrow keys, Home and End over the enabled [role="menuitem"] elements inside `ref`; Escape
 * and Tab call `onClose`. Returns the keydown handler for the role="menu" element.
 */
export function useMenuKeyboard(ref, onClose) {
    return useCallback((e) => {
        const entries = Array.from(ref.current?.querySelectorAll(ITEM_SELECTOR) ?? []);
        const index = entries.indexOf(document.activeElement);
        if (e.key === 'Escape') {
            if (!onClose)
                return;
            // Handled here, so a ModalShell underneath stays open.
            e.preventDefault();
            e.stopPropagation();
            onClose('escape');
        }
        else if (e.key === 'Tab') {
            onClose?.('tab');
        }
        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            entries[(index + 1) % entries.length]?.focus();
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            entries[(index - 1 + entries.length) % entries.length]?.focus();
        }
        else if (e.key === 'Home') {
            e.preventDefault();
            entries[0]?.focus();
        }
        else if (e.key === 'End') {
            e.preventDefault();
            entries[entries.length - 1]?.focus();
        }
    }, [ref, onClose]);
}
/** Lets a MenuItem tell its list that it was chosen. */
const MenuCloseContext = React.createContext(undefined);
/** The role="menu" list. Rows are MenuItems; a rule between groups is `<MenuSeparator />`. */
export const MenuList = React.forwardRef(function MenuList({ label, onClose, autoFocus = false, onKeyDown, className, children, ...rest }, forwardedRef) {
    const ref = useRef(null);
    const setRef = (node) => {
        ref.current = node;
        if (typeof forwardedRef === 'function')
            forwardedRef(node);
        else if (forwardedRef)
            forwardedRef.current = node;
    };
    const onMenuKeyDown = useMenuKeyboard(ref, onClose);
    useEffect(() => {
        if (autoFocus)
            ref.current?.querySelector(ITEM_SELECTOR)?.focus();
    }, [autoFocus]);
    return (_jsx(MenuCloseContext.Provider, { value: onClose, children: _jsx("div", { ref: setRef, role: "menu", "aria-label": label, onKeyDown: (e) => {
                onKeyDown?.(e);
                if (!e.defaultPrevented)
                    onMenuKeyDown(e);
            }, className: cn('flex flex-col', className), ...rest, children: children }) }));
});
/** A hairline between groups of a menu (regular actions, then destructive ones). */
export function MenuSeparator() {
    return _jsx("div", { className: "-mx-1 my-1 border-t border-line", role: "separator" });
}
export function MenuItem({ icon: Icon, iconTone = 'neutral', danger = false, description, meta, onSelect, onClick, className, children, type = 'button', ...rest }) {
    const close = useContext(MenuCloseContext);
    return (_jsxs("button", { type: type, role: "menuitem", onClick: (e) => {
            onClick?.(e);
            if (e.defaultPrevented)
                return;
            // Close first (focus goes back to the trigger), then act: a dialog the action opens
            // takes focus from there, and keeps it.
            close?.('select');
            onSelect?.();
        }, className: cn(menuItem(danger, description !== undefined), className), ...rest, children: [Icon && (_jsx(Icon, { className: cn('h-4 w-4 shrink-0', description !== undefined && 'mt-0.5', !danger && noticeIconTone[iconTone]), "aria-hidden": "true" })), _jsxs("span", { className: "flex min-w-0 flex-1 flex-col", children: [_jsxs("span", { className: "flex min-w-0 items-center gap-2", children: [_jsx("span", { className: cn('min-w-0 flex-1', description === undefined && 'truncate'), children: children }), meta !== undefined && _jsx("span", { className: "shrink-0 text-12 font-normal text-muted comfortable:text-13", children: meta })] }), description !== undefined && (_jsx("span", { className: "mt-0.5 block text-12 font-normal text-muted comfortable:text-13", children: description }))] })] }));
}
