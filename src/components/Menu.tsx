'use client';

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
import type { LucideIcon } from 'lucide-react';
import { noticeIconTone, type NoticeTone } from './Notice.js';
import { menuItem } from './styles.js';
import { cn } from '../lib/utils.js';

/** Why a menu asks to close: Escape (focus goes back to its trigger), Tab (focus moves on), or an item was chosen. */
export type MenuCloseReason = 'escape' | 'tab' | 'select';

const ITEM_SELECTOR = '[role="menuitem"]:not(:disabled)';

/**
 * Arrow keys, Home and End over the enabled [role="menuitem"] elements inside `ref`; Escape
 * and Tab call `onClose`. Returns the keydown handler for the role="menu" element.
 */
export function useMenuKeyboard(ref: React.RefObject<HTMLElement | null>, onClose?: (reason: MenuCloseReason) => void) {
  return useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      const entries = Array.from(ref.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? []);
      const index = entries.indexOf(document.activeElement as HTMLElement);
      if (e.key === 'Escape') {
        if (!onClose) return;
        // Handled here, so a ModalShell underneath stays open.
        e.preventDefault();
        e.stopPropagation();
        onClose('escape');
      } else if (e.key === 'Tab') {
        onClose?.('tab');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        entries[(index + 1) % entries.length]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        entries[(index - 1 + entries.length) % entries.length]?.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        entries[0]?.focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        entries[entries.length - 1]?.focus();
      }
    },
    [ref, onClose],
  );
}

/** Lets a MenuItem tell its list that it was chosen. */
const MenuCloseContext = React.createContext<((reason: MenuCloseReason) => void) | undefined>(undefined);

export interface MenuListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role'> {
  /** The menu's accessible name: "Account", "Notifications", "Actions for SMS & HF". */
  label: string;
  /**
   * Called on Escape, on Tab and when an item is chosen (before its onSelect), with the reason. Close the popover
   * there (and on 'escape' return focus to the trigger, which a Popover does by itself).
   */
  onClose?: (reason: MenuCloseReason) => void;
  /** Focus the first enabled item when the list mounts (a menu that has just opened). Default false. */
  autoFocus?: boolean;
  children: React.ReactNode;
}

/** The role="menu" list. Rows are MenuItems; a rule between groups is `<MenuSeparator />`. */
export const MenuList = React.forwardRef<HTMLDivElement, MenuListProps>(function MenuList(
  { label, onClose, autoFocus = false, onKeyDown, className, children, ...rest },
  forwardedRef,
) {
  const ref = useRef<HTMLDivElement | null>(null);
  const setRef = (node: HTMLDivElement | null) => {
    ref.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };
  const onMenuKeyDown = useMenuKeyboard(ref, onClose);
  useEffect(() => {
    if (autoFocus) ref.current?.querySelector<HTMLElement>(ITEM_SELECTOR)?.focus();
  }, [autoFocus]);
  return (
    <MenuCloseContext.Provider value={onClose}>
      <div
        ref={setRef}
        role="menu"
        aria-label={label}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (!e.defaultPrevented) onMenuKeyDown(e);
        }}
        className={cn('flex flex-col', className)}
        {...rest}
      >
        {children}
      </div>
    </MenuCloseContext.Provider>
  );
});

/** A hairline between groups of a menu (regular actions, then destructive ones). */
export function MenuSeparator() {
  return <div className="-mx-1 my-1 border-t border-line" role="separator" />;
}

export interface MenuItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onSelect' | 'role'> {
  /** Leading icon, 16px. */
  icon?: LucideIcon;
  /** Icon colour: muted (default), or the tone of what the row is about (a notification). Never colours the text. */
  iconTone?: NoticeTone;
  /** A destructive action: red text and icon, danger-bg hover. Goes last, after a MenuSeparator. */
  danger?: boolean;
  /** A second line under the label (12px muted): a message, a time, an email. */
  description?: React.ReactNode;
  /** Shown at the end of the label line: a shortcut, a count, an unread dot. */
  meta?: React.ReactNode;
  /** Runs when the item is chosen (click, Enter or Space), just after the list's onClose('select'). */
  onSelect?: () => void;
  /** The label. */
  children: React.ReactNode;
}

export function MenuItem({
  icon: Icon,
  iconTone = 'neutral',
  danger = false,
  description,
  meta,
  onSelect,
  onClick,
  className,
  children,
  type = 'button',
  ...rest
}: MenuItemProps) {
  const close = useContext(MenuCloseContext);
  return (
    <button
      type={type}
      role="menuitem"
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        // Close first (focus goes back to the trigger), then act: a dialog the action opens
        // takes focus from there, and keeps it.
        close?.('select');
        onSelect?.();
      }}
      className={cn(menuItem(danger, description !== undefined), className)}
      {...rest}
    >
      {Icon && (
        <Icon
          className={cn('h-4 w-4 shrink-0', description !== undefined && 'mt-0.5', !danger && noticeIconTone[iconTone])}
          aria-hidden="true"
        />
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex min-w-0 items-center gap-2">
          <span className={cn('min-w-0 flex-1', description === undefined && 'truncate')}>{children}</span>
          {meta !== undefined && <span className="shrink-0 text-12 font-normal text-muted comfortable:text-13">{meta}</span>}
        </span>
        {description !== undefined && (
          <span className="mt-0.5 block text-12 font-normal text-muted comfortable:text-13">{description}</span>
        )}
      </span>
    </button>
  );
}
