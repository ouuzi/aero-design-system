import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { type NoticeTone } from './Notice.js';
/** Why a menu asks to close: Escape (focus goes back to its trigger), Tab (focus moves on), or an item was chosen. */
export type MenuCloseReason = 'escape' | 'tab' | 'select';
/**
 * Arrow keys, Home and End over the enabled [role="menuitem"] elements inside `ref`; Escape
 * and Tab call `onClose`. Returns the keydown handler for the role="menu" element.
 */
export declare function useMenuKeyboard(ref: React.RefObject<HTMLElement | null>, onClose?: (reason: MenuCloseReason) => void): (e: React.KeyboardEvent<HTMLElement>) => void;
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
export declare const MenuList: React.ForwardRefExoticComponent<MenuListProps & React.RefAttributes<HTMLDivElement>>;
/** A hairline between groups of a menu (regular actions, then destructive ones). */
export declare function MenuSeparator(): React.JSX.Element;
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
export declare function MenuItem({ icon: Icon, iconTone, danger, description, meta, onSelect, onClick, className, children, type, ...rest }: MenuItemProps): React.JSX.Element;
