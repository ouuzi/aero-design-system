'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/*
 * Row actions menu: a ⋯ button that opens a short list of actions for one row,
 * card or record. Keep the one action people use most as a visible button next
 * to it, and put the rest here. Destructive items go last, in red, after a rule.
 *
 * The menu renders in a portal with fixed positioning, so it is never clipped by
 * a scrolling table or a card with overflow hidden, and flips upwards near the
 * bottom of the screen.
 *
 * Sizes: the trigger is a 32px icon button and items are 32px rows; both grow to 40px
 * in comfortable density, so every target stays well above target-min (24px).
 *
 * Look: menuPanel, the same floating surface as Popover (radius xl, hairline,
 * shadow-popover), with rows inset 4px. The trigger's name shows as a Tooltip (no native
 * title); it closes as soon as the menu opens.
 *
 * Trigger: the ⋯ icon button by default; `trigger` takes a kit Button instead ("Export ▾"),
 * and RowMenu adds the popup wiring to it (aria-haspopup, aria-expanded, click, Down to open).
 *
 * The list and its rows are MenuList and MenuItem (Menu.tsx), so the keyboard
 * (useMenuKeyboard) and the look are the ones a screen gets when it builds its own menu.
 */
import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MoreHorizontal } from 'lucide-react';
import { btn, iconButtonOutline, menuPanel } from './styles.js';
import { MenuItem, MenuList, MenuSeparator } from './Menu.js';
import { Tooltip } from './Tooltip.js';
import { cn } from '../lib/utils.js';
const MENU_WIDTH = 208;
const GAP = 4;
export default function RowMenu({ items, label = 'More actions', heading, id, variant = 'ghost', trigger }) {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState(null);
    const buttonRef = useRef(null);
    const menuRef = useRef(null);
    const menuId = useId();
    const list = items.filter(Boolean);
    const regular = list.filter((i) => i.tone !== 'danger');
    const danger = list.filter((i) => i.tone === 'danger');
    const close = useCallback((refocus = false) => {
        setOpen(false);
        setPos(null);
        if (refocus)
            buttonRef.current?.focus();
    }, []);
    // Escape and choosing an item hand focus back to the trigger; Tab lets it move on.
    const onClose = useCallback((reason) => close(reason !== 'tab'), [close]);
    // Place the menu under the button, right-aligned, flipping up if it would leave the screen.
    useLayoutEffect(() => {
        if (!open || !buttonRef.current || !menuRef.current)
            return;
        const r = buttonRef.current.getBoundingClientRect();
        const h = menuRef.current.offsetHeight;
        const below = r.bottom + GAP;
        const top = below + h > window.innerHeight - 8 && r.top - GAP - h > 8 ? r.top - GAP - h : below;
        const left = Math.min(Math.max(8, r.right - MENU_WIDTH), window.innerWidth - MENU_WIDTH - 8);
        setPos({ top, left });
        menuRef.current.querySelector('[role="menuitem"]:not(:disabled)')?.focus();
    }, [open]);
    useEffect(() => {
        if (!open)
            return;
        const onPointer = (e) => {
            const t = e.target;
            if (!menuRef.current?.contains(t) && !buttonRef.current?.contains(t))
                close();
        };
        const onScroll = (e) => {
            if (!menuRef.current?.contains(e.target))
                close();
        };
        const onResize = () => close();
        document.addEventListener('mousedown', onPointer);
        window.addEventListener('scroll', onScroll, true);
        window.addEventListener('resize', onResize);
        return () => {
            document.removeEventListener('mousedown', onPointer);
            window.removeEventListener('scroll', onScroll, true);
            window.removeEventListener('resize', onResize);
        };
    }, [open, close]);
    if (list.length === 0)
        return null;
    const renderItem = (item, i) => (_jsx(MenuItem, { id: item.id, icon: item.icon, danger: item.tone === 'danger', disabled: item.disabled, onSelect: item.onSelect, children: item.label }, `${item.label}-${i}`));
    const triggerProps = {
        // A custom trigger keeps its own id unless RowMenu is given one.
        ...(id !== undefined && { id }),
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': open ? menuId : undefined,
        onClick: (e) => {
            e.stopPropagation();
            if (open)
                close();
            else
                setOpen(true);
        },
        onKeyDown: (e) => {
            if (e.key === 'ArrowDown' && !open) {
                e.preventDefault();
                setOpen(true);
            }
        },
    };
    return (_jsxs(_Fragment, { children: [trigger ? (
            // React 19 passes `ref` as a prop, so a kit Button takes it like any other.
            React.cloneElement(trigger, { ...triggerProps, ref: buttonRef })) : (_jsx(Tooltip, { content: label, asLabel: true, disabled: open, children: _jsx("button", { ref: buttonRef, type: "button", "aria-label": label, ...triggerProps, className: cn(variant === 'outline' ? cn(iconButtonOutline, 'text-ink-2') : btn.icon, open && 'bg-subtle-2 text-ink'), children: _jsx(MoreHorizontal, { className: "w-4 h-4", "aria-hidden": true }) }) })), open &&
                createPortal(_jsxs(MenuList, { ref: menuRef, id: menuId, label: label, onClose: onClose, style: { position: 'fixed', top: pos?.top ?? -9999, left: pos?.left ?? -9999, width: MENU_WIDTH }, className: `z-[100] ${menuPanel}`, children: [heading && (_jsx("div", { className: "-mx-1 px-4 pt-1 pb-1.5 mb-1 border-b border-line text-11 font-semibold text-muted truncate comfortable:text-12", children: heading })), regular.map(renderItem), regular.length > 0 && danger.length > 0 && _jsx(MenuSeparator, {}), danger.map(renderItem)] }), document.body)] }));
}
