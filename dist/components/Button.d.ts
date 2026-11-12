import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { type ButtonSize, type ButtonVariant, type LinkButtonSize, type LinkButtonTone } from './styles.js';
type NativeButton = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;
export interface ButtonProps extends NativeButton {
    variant?: ButtonVariant;
    /** `sm` 32px, `md` 36px (default), `lg` 40px beside form inputs. */
    size?: ButtonSize;
    /** Leading icon, 16px (14px in `sm`). */
    icon?: LucideIcon;
    /**
     * The action is running: a spinner replaces the icon (or sits over the label when there is
     * none), aria-busy is set and clicks are ignored. Keep the label as it is ("Save", not
     * "Saving…"), so the width stays the same. The button keeps focus.
     */
    loading?: boolean;
    /** For the dark document viewer only: viewer fills, an accent primary, the accent-soft focus ring. */
    dark?: boolean;
    children: React.ReactNode;
}
export declare function Button({ variant, size, icon: Icon, loading, dark, type, className, children, onClick, 'aria-disabled': ariaDisabledProp, ...rest }: ButtonProps): React.JSX.Element;
export interface IconButtonProps extends Omit<NativeButton, 'title'> {
    icon: LucideIcon;
    /** Accessible name, e.g. "Delete record". It is also the tooltip, unless `tooltip` says otherwise. */
    label: string;
    /**
     * The tooltip. Default: the `label`. Pass a longer hint ("Authorisation form (AES-PA-01) as
     * PDF") to describe the action beyond its name, or `false` for none (a trigger whose own
     * popup opens on click, such as a menu button).
     */
    tooltip?: React.ReactNode | false;
    /** `ghost` in rows and toolbars, `outline` beside other bordered controls, `danger` for a destructive row action. */
    variant?: 'ghost' | 'outline' | 'danger';
    /** The action is running: the icon becomes a spinner, aria-busy is set and clicks are ignored. */
    loading?: boolean;
    /**
     * A count at the top-right corner (unread notifications): a number (0 hides it, above 99
     * shows "99+") or `true` for a dot. The accessible name becomes "<label>, <badgeLabel>".
     */
    badge?: number | boolean;
    /** The words for the badge in the accessible name. Default "<n> new" (a dot: "new"). */
    badgeLabel?: string;
    /** For the dark document viewer only: viewer colours and the accent-soft focus ring. */
    dark?: boolean;
}
export declare function IconButton({ icon: Icon, label, tooltip, variant, loading, badge, badgeLabel, dark, type, className, onClick, 'aria-disabled': ariaDisabledProp, ...rest }: IconButtonProps): React.JSX.Element;
export interface LinkButtonProps extends NativeButton {
    /** Text size: `lg` 13px (a name in a table row, body text), `md` 12px (default), `sm` 11px. */
    size?: LinkButtonSize;
    /** `accent` (default) actions and navigation, `muted` resets, `ink` a name or title that opens its record. */
    tone?: LinkButtonTone;
    icon?: LucideIcon;
    /** Cut a long name with an ellipsis on one line instead of wrapping; the button never outgrows its cell. */
    truncate?: boolean;
    /** For the dark document viewer only: accent-soft (or viewer-muted, white) text and focus ring. */
    dark?: boolean;
    children: React.ReactNode;
}
export declare function LinkButton({ size, tone, icon: Icon, truncate, dark, type, className, children, ...rest }: LinkButtonProps): React.JSX.Element;
export {};
