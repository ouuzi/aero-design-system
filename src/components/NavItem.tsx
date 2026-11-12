import React from 'react';
import type { LucideIcon } from 'lucide-react';
import Badge from './Badge.js';
import { countAlert, focusRing, navGroupLabel, navItem } from './styles.js';
import { cn } from '../lib/utils.js';

/*
 * Side navigation. NavList is a group of NavItems under an optional label ("Workspace");
 * NavItem is one row: a 16px icon, a 13px label, an optional count at the end. NavBrand is
 * the app's name at the top of the sidebar, a button that goes home.
 *
 * - NavItem rows are 36px (h-control-md, 44px comfortable), radius lg, the shared focusRing.
 *   `active` marks the current page: aria-current="page", the subtle-2 fill, ink text in
 *   medium weight, the icon in brand. The rest are ink-2 with a muted icon, subtle on hover.
 * - `badge` is a count (0 or undefined shows nothing): a neutral Badge, or with
 *   `badgeTone="alert"` the red count pill (countAlert) for something to act on. Say what the
 *   count is with `badgeLabel` ("3 urgent alerts"): screen readers hear it after the label.
 * - A row that opens a dialog (Support, Settings) is a NavItem without `active`.
 */

export interface NavItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon?: LucideIcon;
  /** The current page: aria-current="page" and the active look. */
  active?: boolean;
  /** A count at the end of the row; 0 or undefined shows nothing. */
  badge?: number | string;
  /** `neutral` (default) a grey Badge; `alert` the red count pill, for something to act on. */
  badgeTone?: 'neutral' | 'alert';
  /** What the count means, read after the label ("3 urgent alerts"). Default: the count alone. */
  badgeLabel?: string;
  /** The label. */
  children: React.ReactNode;
}

export function NavItem({
  icon: Icon,
  active = false,
  badge,
  badgeTone = 'neutral',
  badgeLabel,
  type = 'button',
  className,
  children,
  ...rest
}: NavItemProps) {
  const showBadge = badge !== undefined && badge !== 0 && badge !== '';
  return (
    <button type={type} aria-current={active ? 'page' : undefined} className={cn(navItem(active), className)} {...rest}>
      {Icon && <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-brand' : 'text-muted')} aria-hidden="true" />}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {showBadge && (
        <>
          {badgeTone === 'alert' ? (
            <span className={countAlert} aria-hidden="true">
              {badge}
            </span>
          ) : (
            <span aria-hidden="true">
              <Badge>{badge}</Badge>
            </span>
          )}
          <span className="sr-only">, {badgeLabel ?? badge}</span>
        </>
      )}
    </button>
  );
}

export interface NavListProps {
  /** The group's visible label ("Workspace"); it also names the landmark. */
  label?: React.ReactNode;
  /** The accessible name when there is no visible label ("Main", "Help and settings"). */
  'aria-label'?: string;
  /** `nav` (default) a navigation landmark; `div` for rows that open dialogs rather than pages. */
  as?: 'nav' | 'div';
  /** Layout only (`flex-1 overflow-y-auto`, `mt-auto`). */
  className?: string;
  /** NavItems; each is put in its own list item. */
  children: React.ReactNode;
}

export function NavList({ label, 'aria-label': ariaLabel, as = 'nav', className, children }: NavListProps) {
  const labelId = React.useId();
  const Tag = as;
  return (
    <Tag className={className} aria-labelledby={label ? labelId : undefined} aria-label={label ? undefined : ariaLabel}>
      {label && (
        <p id={labelId} className={navGroupLabel}>
          {label}
        </p>
      )}
      <ul className="space-y-0.5">
        {React.Children.map(children, (child) => (child ? <li>{child}</li> : null))}
      </ul>
    </Tag>
  );
}

export interface NavBrandProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The mark, drawn on-solid on a 32px brand tile (`<BrandMark className="h-[18px] w-[18px]" />`). */
  logo: React.ReactNode;
  /** The app's name, 14px semibold. */
  name: string;
}

/** The app's name at the top of the sidebar: a button that goes to the home page. */
export function NavBrand({ logo, name, type = 'button', className, ...rest }: NavBrandProps) {
  return (
    <button
      type={type}
      className={cn('flex w-full min-w-0 items-center gap-2.5 rounded-lg px-2 text-left cursor-pointer', focusRing, className)}
      {...rest}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand text-on-solid" aria-hidden="true">
        {logo}
      </span>
      <span className="truncate text-14 font-semibold leading-tight tracking-tight text-ink comfortable:text-16">{name}</span>
    </button>
  );
}
