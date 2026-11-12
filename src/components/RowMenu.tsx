'use client';

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
import { MoreHorizontal, type LucideIcon } from 'lucide-react';
import { btn, iconButtonOutline, menuPanel } from './styles.js';
import { MenuItem, MenuList, MenuSeparator, type MenuCloseReason } from './Menu.js';
import { Tooltip } from './Tooltip.js';
import { cn } from '../lib/utils.js';

export interface RowMenuItem {
  label: string;
  onSelect: () => void;
  icon?: LucideIcon;
  /** Destructive actions: shown last, in red, after a rule. */
  tone?: 'danger';
  disabled?: boolean;
  id?: string;
}

export interface RowMenuProps {
  /** Falsy entries are skipped, so items can be listed conditionally inline. */
  items: Array<RowMenuItem | false | null | undefined | ''>;
  /** Accessible name of the ⋯ button (and of the menu), e.g. "Actions for SMS & HF". */
  label?: string;
  /** Optional caption at the top of the menu (the record's name or code). */
  heading?: string;
  id?: string;
  /** Tone of the trigger: the default quiet icon button, or an outlined one beside other buttons. */
  variant?: 'ghost' | 'outline';
  /**
   * A labelled trigger instead of the ⋯ icon button: one kit Button,
   * `trigger={<Button icon={Download}>Export</Button>}`. RowMenu adds aria-haspopup,
   * aria-expanded, the click and Down-arrow handlers, `id` and its ref; `label` names the menu.
   */
  trigger?: React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>;
}

const MENU_WIDTH = 208;
const GAP = 4;

export default function RowMenu({ items, label = 'More actions', heading, id, variant = 'ghost', trigger }: RowMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

  const list = items.filter(Boolean) as RowMenuItem[];
  const regular = list.filter((i) => i.tone !== 'danger');
  const danger = list.filter((i) => i.tone === 'danger');

  const close = useCallback((refocus = false) => {
    setOpen(false);
    setPos(null);
    if (refocus) buttonRef.current?.focus();
  }, []);
  // Escape and choosing an item hand focus back to the trigger; Tab lets it move on.
  const onClose = useCallback((reason: MenuCloseReason) => close(reason !== 'tab'), [close]);

  // Place the menu under the button, right-aligned, flipping up if it would leave the screen.
  useLayoutEffect(() => {
    if (!open || !buttonRef.current || !menuRef.current) return;
    const r = buttonRef.current.getBoundingClientRect();
    const h = menuRef.current.offsetHeight;
    const below = r.bottom + GAP;
    const top = below + h > window.innerHeight - 8 && r.top - GAP - h > 8 ? r.top - GAP - h : below;
    const left = Math.min(Math.max(8, r.right - MENU_WIDTH), window.innerWidth - MENU_WIDTH - 8);
    setPos({ top, left });
    menuRef.current.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !buttonRef.current?.contains(t)) close();
    };
    const onScroll = (e: Event) => {
      if (!menuRef.current?.contains(e.target as Node)) close();
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

  if (list.length === 0) return null;

  const renderItem = (item: RowMenuItem, i: number) => (
    <MenuItem
      key={`${item.label}-${i}`}
      id={item.id}
      icon={item.icon}
      danger={item.tone === 'danger'}
      disabled={item.disabled}
      onSelect={item.onSelect}
    >
      {item.label}
    </MenuItem>
  );

  const triggerProps = {
    // A custom trigger keeps its own id unless RowMenu is given one.
    ...(id !== undefined && { id }),
    'aria-haspopup': 'menu' as const,
    'aria-expanded': open,
    'aria-controls': open ? menuId : undefined,
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (open) close();
      else setOpen(true);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'ArrowDown' && !open) {
        e.preventDefault();
        setOpen(true);
      }
    },
  };

  return (
    <>
      {trigger ? (
        // React 19 passes `ref` as a prop, so a kit Button takes it like any other.
        React.cloneElement(trigger, { ...triggerProps, ref: buttonRef } as React.ButtonHTMLAttributes<HTMLButtonElement>)
      ) : (
        <Tooltip content={label} asLabel disabled={open}>
          <button
            ref={buttonRef}
            type="button"
            aria-label={label}
            {...triggerProps}
            className={cn(variant === 'outline' ? cn(iconButtonOutline, 'text-ink-2') : btn.icon, open && 'bg-subtle-2 text-ink')}
          >
            <MoreHorizontal className="w-4 h-4" aria-hidden />
          </button>
        </Tooltip>
      )}

      {open &&
        createPortal(
          <MenuList
            ref={menuRef}
            id={menuId}
            label={label}
            onClose={onClose}
            style={{ position: 'fixed', top: pos?.top ?? -9999, left: pos?.left ?? -9999, width: MENU_WIDTH }}
            className={`z-[100] ${menuPanel}`}
          >
            {heading && (
              <div className="-mx-1 px-4 pt-1 pb-1.5 mb-1 border-b border-line text-11 font-semibold text-muted truncate comfortable:text-12">{heading}</div>
            )}
            {regular.map(renderItem)}
            {regular.length > 0 && danger.length > 0 && <MenuSeparator />}
            {danger.map(renderItem)}
          </MenuList>,
          document.body
        )}
    </>
  );
}
