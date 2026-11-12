import React from 'react';
import type { LucideIcon } from 'lucide-react';
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
export declare function NavItem({ icon: Icon, active, badge, badgeTone, badgeLabel, type, className, children, ...rest }: NavItemProps): React.JSX.Element;
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
export declare function NavList({ label, 'aria-label': ariaLabel, as, className, children }: NavListProps): React.JSX.Element;
export interface NavBrandProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    /** The mark, drawn on-solid on a 32px brand tile (`<BrandMark className="h-[18px] w-[18px]" />`). */
    logo: React.ReactNode;
    /** The app's name, 14px semibold. */
    name: string;
}
/** The app's name at the top of the sidebar: a button that goes to the home page. */
export declare function NavBrand({ logo, name, type, className, ...rest }: NavBrandProps): React.JSX.Element;
