import React from 'react';
import type { LucideIcon } from 'lucide-react';
export type StatAlert = 'danger' | 'warning';
type IconTone = 'muted' | 'success' | 'warning' | 'danger';
export interface StatTileProps {
    label: React.ReactNode;
    value: number | string;
    /** Small text after the figure: "personnel", "of 42". */
    unit?: React.ReactNode;
    /** One muted line under the figure. */
    detail?: React.ReactNode;
    icon?: LucideIcon;
    iconTone?: IconTone;
    alert?: StatAlert;
    compact?: boolean;
    onClick?: () => void;
    pressed?: boolean;
    className?: string;
}
export declare function StatTile({ label, value, unit, detail, icon: Icon, iconTone, alert, compact, onClick, pressed, className, }: StatTileProps): React.JSX.Element;
export {};
