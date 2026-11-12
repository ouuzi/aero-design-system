import React from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle2, Info, type LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils.js';

/*
 * Notice: a banner inside a page, card or dialog that explains a state ("This record is
 * locked", "3 requirements are missing"). Full-strength tint and line tokens, never faded,
 * an icon that carries the meaning, then a title and one or two lines. Pass `live` when it
 * reports the result of an action so screen readers announce it. Use `danger` only
 * for something that is wrong or blocks the person, `warning` for something due, `info`
 * for guidance, `success` to confirm, `neutral` for a quiet note.
 *
 * A Notice is one banner. A list of alerts (each a row with its own action) is an AlertList
 * of AlertRows in a Card: white rows, the colour on the icon only.
 */

export type NoticeTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

const toneFrame: Record<NoticeTone, string> = {
  info: 'bg-info-bg border-info-line',
  success: 'bg-success-bg border-success-line',
  warning: 'bg-warning-bg border-warning-line',
  danger: 'bg-danger-bg border-danger-line',
  neutral: 'bg-subtle border-line',
};
/** Icon colour per tone; shared with AlertRow. */
export const noticeIconTone: Record<NoticeTone, string> = {
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  neutral: 'text-muted',
};
/** Icon per tone; shared with AlertRow. */
export const noticeIcon: Record<NoticeTone, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertOctagon,
  neutral: Info,
};

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

export function Notice({ tone = 'info', title, icon, action, compact = false, live = false, className, children }: NoticeProps) {
  const Icon = icon === null ? null : icon ?? noticeIcon[tone];
  return (
    <div
      role={live ? (tone === 'danger' || tone === 'warning' ? 'alert' : 'status') : undefined}
      className={cn(
        'flex flex-wrap gap-3 rounded-lg border text-13 text-ink sm:flex-nowrap',
        children ? 'items-start' : 'items-center',
        compact ? 'px-3 py-2' : 'px-4 py-3',
        toneFrame[tone],
        className,
      )}
    >
      {Icon && <Icon className={cn('h-4 w-4 shrink-0', children && 'mt-0.5', noticeIconTone[tone])} aria-hidden="true" />}
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold text-ink">{title}</p>}
        {children && <div className={cn('text-12 text-ink-2', title && 'mt-0.5')}>{children}</div>}
      </div>
      {/* On phones a wide action drops under the text instead of covering the title. */}
      {action && <div className={cn('shrink-0 basis-full sm:basis-auto', Icon && 'pl-7 sm:pl-0')}>{action}</div>}
    </div>
  );
}
