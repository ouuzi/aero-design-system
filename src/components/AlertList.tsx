'use client';

import React, { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { LinkButton } from './Button.js';
import { noticeIcon, noticeIconTone, type NoticeTone } from './Notice.js';
import { metaLine } from './styles.js';
import { cn } from '../lib/utils.js';

/*
 * AlertList: a list of alerts inside a Card ("Urgent alerts", "Expiring this month"). White
 * rows divided by hairlines; the status lives on the icon only (its tone colour), never on
 * a tinted row or a coloured border, so a column of red cards cannot drown the page. Each
 * row is a title, one meta line and at most one link action on the right.
 *
 *   <Card title="Urgent alerts" padding="none">
 *     <AlertList label="Urgent alerts" limit={5} onViewAll={openAlerts}>
 *       {alerts.map((a) => (
 *         <AlertRow
 *           key={a.id}
 *           tone={ALERT_TONE[a.type]}
 *           title={a.title}
 *           meta={<>{a.personnel} · {a.department}</>}
 *           action={<LinkButton size="sm" onClick={() => open(a)}>View profile</LinkButton>}
 *         />
 *       ))}
 *     </AlertList>
 *   </Card>
 *
 * Never clip: `limit` shows the first N rows and a "View all (n)" link under them, which
 * calls `onViewAll` (a page or a sheet with the whole list) or, without it, shows every row
 * in place ("Show fewer" folds them again). The count in the link is the number of rows
 * passed in, so it always agrees with the list.
 */

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

export function AlertList({ label, limit, onViewAll, className, children }: AlertListProps) {
  const [expanded, setExpanded] = useState(false);
  const rows = React.Children.toArray(children).filter(Boolean);
  const clipped = limit !== undefined && rows.length > limit && !expanded;
  const shown = clipped ? rows.slice(0, limit) : rows;
  const canFold = limit !== undefined && rows.length > limit && expanded;
  return (
    <div className={className}>
      <ul aria-label={label} className="divide-y divide-line">
        {shown}
      </ul>
      {(clipped || canFold) && (
        <div className="border-t border-line px-4 py-2">
          {clipped ? (
            <LinkButton size="sm" onClick={onViewAll ?? (() => setExpanded(true))}>
              View all ({rows.length})
            </LinkButton>
          ) : (
            <LinkButton size="sm" tone="muted" onClick={() => setExpanded(false)}>
              Show fewer
            </LinkButton>
          )}
        </div>
      )}
    </div>
  );
}

/** Said before the title, because the colour and the icon are not read out. */
const toneWord: Record<NoticeTone, string> = { danger: 'Critical', warning: 'Warning', info: 'Note', success: 'Done', neutral: '' };

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

export function AlertRow({ tone, icon, title, meta, action, className }: AlertRowProps) {
  const Icon = icon ?? noticeIcon[tone];
  return (
    <li className={cn('flex items-start gap-3 bg-surface px-4 py-3 comfortable:py-4', className)}>
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', noticeIconTone[tone])} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-13 font-semibold text-ink comfortable:text-15">
          {toneWord[tone] && <span className="sr-only">{toneWord[tone]}: </span>}
          {title}
        </p>
        {meta && <div className={cn(metaLine, 'mt-0.5')}>{meta}</div>}
      </div>
      {action && <div className="flex shrink-0 items-center self-center">{action}</div>}
    </li>
  );
}
