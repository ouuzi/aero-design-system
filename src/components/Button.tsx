import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Spinner } from './Spinner.js';
import { Tooltip } from './Tooltip.js';
import {
  btn,
  buttonClass,
  iconButtonCount,
  iconButtonDark,
  iconButtonDot,
  iconButtonOutline,
  linkButton,
  type ButtonSize,
  type ButtonVariant,
  type LinkButtonSize,
  type LinkButtonTone,
} from './styles.js';
import { cn } from '../lib/utils.js';

/*
 * Buttons. Every clickable action goes through one of these three, so height, radius,
 * weight, focus ring and disabled look are the same on every screen.
 *
 * - Button: a labelled action. `primary` once per view (the main action), `secondary`
 *   for the rest, `ghost` inside dense toolbars, `danger` only to confirm a destructive step.
 * - IconButton: an icon-only action. `label` is required: it is the accessible name, and it
 *   shows as a Tooltip on hover and keyboard focus (never the native `title`).
 * - LinkButton: an inline text action ("View profile", "Clear filters").
 *
 * Heights (the kit's control-size scale): sm 32px, md 36px (default), lg 40px for a form
 * footer or a row beside 40px inputs; icon buttons 32px. Comfortable density: 40, 44 and
 * 48px (icon buttons 40x40). LinkButton keeps a 24px minimum target (target-min) around
 * its text. Icon sizes stay the same in both densities.
 *
 * Toggles: pass `aria-pressed`; secondary and ghost buttons (and IconButton) show the pressed
 * look themselves. Dark: `dark` on any of the three draws it for the dark document viewer
 * (viewer fills, accent primary, accent-soft focus ring), as Checkbox and DatePicker `dark` do.
 *
 * Busy: `loading` shows a Spinner in the icon's place (over the label when there is no
 * icon, so the width never changes), sets aria-busy and ignores clicks, a form submit
 * included. The button stays focusable (aria-disabled, not disabled), so focus does not
 * drop to <body> in the middle of an action.
 */

type NativeButton = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

const iconSize = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-4 w-4' } as const satisfies Record<ButtonSize, string>;

/** Swallows clicks while busy: no handler, no form submit. */
function guardBusy(loading: boolean, onClick: React.MouseEventHandler<HTMLButtonElement> | undefined) {
  if (!loading) return onClick;
  return (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();
}

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

export function Button({
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  loading = false,
  dark = false,
  type = 'button',
  className,
  children,
  onClick,
  'aria-disabled': ariaDisabledProp,
  ...rest
}: ButtonProps) {
  const spinnerSize = size === 'sm' ? 14 : 16;
  // No icon: the spinner sits over the label, which stays in place (and in the accessibility
  // tree) at opacity 0, so the button keeps its width and its name.
  const overlay = loading && !Icon;
  return (
    <button
      type={type}
      aria-busy={loading || undefined}
      aria-disabled={loading || ariaDisabledProp || undefined}
      onClick={guardBusy(loading, onClick)}
      className={cn(buttonClass(variant, size, dark), loading && 'cursor-progress', overlay && 'relative', className)}
      {...rest}
    >
      {Icon && (loading ? <Spinner decorative size={spinnerSize} /> : <Icon className={iconSize[size]} aria-hidden="true" />)}
      {overlay ? (
        <>
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner decorative size={spinnerSize} />
          </span>
          <span className="inline-flex items-center gap-1.5 opacity-0">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

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

const iconButtonVariant = { ghost: btn.icon, outline: iconButtonOutline, danger: btn.iconDanger } as const;

/** The badge as shown ("99+") and as spoken, or null when there is nothing to show. */
function iconBadge(badge: number | boolean | undefined, badgeLabel: string | undefined) {
  if (badge === true) return { text: null, spoken: badgeLabel ?? 'new' };
  if (typeof badge !== 'number' || badge <= 0) return null;
  return { text: badge > 99 ? '99+' : String(badge), spoken: badgeLabel ?? `${badge} new` };
}

export function IconButton({
  icon: Icon,
  label,
  tooltip,
  variant = 'ghost',
  loading = false,
  badge,
  badgeLabel,
  dark = false,
  type = 'button',
  className,
  onClick,
  'aria-disabled': ariaDisabledProp,
  ...rest
}: IconButtonProps) {
  const count = iconBadge(badge, badgeLabel);
  // Tooltip is a client component: the props reach the <button> through it unchanged.
  // The tooltip shows the label alone; the badge is spoken in the name, so asLabel still holds.
  return (
    <Tooltip content={tooltip === undefined ? label : tooltip} asLabel={tooltip === undefined}>
      <button
        type={type}
        aria-label={count ? `${label}, ${count.spoken}` : label}
        aria-busy={loading || undefined}
        aria-disabled={loading || ariaDisabledProp || undefined}
        onClick={guardBusy(loading, onClick)}
        className={cn(dark ? iconButtonDark[variant] : iconButtonVariant[variant], count && 'relative', loading && 'cursor-progress', className)}
        {...rest}
      >
        {loading ? <Spinner decorative /> : <Icon className="h-4 w-4" aria-hidden="true" />}
        {count &&
          (count.text === null ? (
            <span className={iconButtonDot} aria-hidden="true" />
          ) : (
            <span className={iconButtonCount} aria-hidden="true">
              {count.text}
            </span>
          ))}
      </button>
    </Tooltip>
  );
}

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

export function LinkButton({
  size = 'md',
  tone = 'accent',
  icon: Icon,
  truncate = false,
  dark = false,
  type = 'button',
  className,
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <button type={type} className={cn(linkButton(size, tone, dark), truncate && 'min-w-0 max-w-full text-left', className)} {...rest}>
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
      {truncate ? <span className="min-w-0 truncate">{children}</span> : children}
    </button>
  );
}
