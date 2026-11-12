import React from 'react';
import { type LucideIcon } from 'lucide-react';
export type NoticeTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';
/** Icon colour per tone; shared with AlertRow. */
export declare const noticeIconTone: Record<NoticeTone, string>;
/** Icon per tone; shared with AlertRow. */
export declare const noticeIcon: Record<NoticeTone, LucideIcon>;
export interface NoticeProps {
    tone?: NoticeTone;
    title?: React.ReactNode;
    /** Override the tone's icon; pass `null` for none. */
    icon?: LucideIcon | null;
    /** A button or link on the right. */
    action?: React.ReactNode;
    /** Tighter padding for dense panels and table cells. */
    compact?: boolean;
    /**
     * Announce it to screen readers when it appears: set this on feedback that shows up after
     * an action (a save error, "Saved", a scan result). Danger and warning are announced
     * assertively (role="alert"), the rest politely (role="status"). Static guidance stays silent.
     */
    live?: boolean;
    className?: string;
    children?: React.ReactNode;
}
export declare function Notice({ tone, title, icon, action, compact, live, className, children }: NoticeProps): React.JSX.Element;
