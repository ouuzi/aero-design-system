import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { type NoticeTone } from './Notice.js';
export interface AlertListProps {
    /** Names the list for screen readers ("Urgent alerts"). */
    label: string;
    /** Show the first `limit` rows and a "View all (n)" link when there are more. */
    limit?: number;
    /** Where "View all" goes. Without it the link expands the list in place. */
    onViewAll?: () => void;
    className?: string;
    children: React.ReactNode;
}
export declare function AlertList({ label, limit, onViewAll, className, children }: AlertListProps): React.JSX.Element;
export interface AlertRowProps {
    /** The icon's colour and default icon: danger, warning, info, success or neutral. */
    tone: NoticeTone;
    /** Override the tone's icon. */
    icon?: LucideIcon;
    title: React.ReactNode;
    /** One line under the title: who, where, when ("Eleni Georgiou · Line maintenance · 3 days"). */
    meta?: React.ReactNode;
    /** One link action on the right: a `sm` LinkButton ("View profile", "Review"). */
    action?: React.ReactNode;
    className?: string;
}
export declare function AlertRow({ tone, icon, title, meta, action, className }: AlertRowProps): React.JSX.Element;
