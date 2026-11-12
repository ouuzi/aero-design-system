import React from 'react';
import { ArrowRight, CircleCheck, Lock, Pencil, Plus, type LucideIcon } from 'lucide-react';
import Badge from './Badge.js';
import { StatusBadge } from './StatusBadge.js';
import type { CategoryTone, StatusTone } from './styles.js';
import { cn } from '../lib/utils.js';

/*
 * The audit trail of one record: who did what, when, what changed and why, with
 * signatures stamped in place. Newest first. A change shows the old value struck
 * through beside the new one, and both are read out ("Previous value", "New value").
 * Signatures (kind 'sign', a navy lock node) show the meaning the signer confirmed and
 * the record hash. Read-only: corrections arrive as new events, nothing is edited.
 */

export interface HistoryEvent {
  id?: string;
  kind?: 'create' | 'edit' | 'sign' | 'status';
  /** Sentence case: "Authorisation issued", "Expiry date corrected". */
  action: React.ReactNode;
  by?: string;
  role?: string;
  authNo?: string;
  /** ISO timestamp in UTC. */
  at?: string;
  /** "06 Nov 2026 09:30 UTC". */
  atLabel?: string;
  /** `from` is struck through, never deleted. */
  changes?: { field: React.ReactNode; from?: React.ReactNode; to: React.ReactNode }[];
  /** Required for any change to a signed record. */
  reason?: React.ReactNode;
  signature?: { meaning: React.ReactNode; hash?: string };
  /** The state the record moved to ("Issued", "Suspended"): a StatusBadge after the action. */
  status?: { tone: StatusTone; label: React.ReactNode };
  /** A category or count beside the action ("Correction", "2 fields"): a Badge. */
  badge?: { tone: CategoryTone; label: React.ReactNode };
}

export interface HistoryTimelineProps {
  /** Newest first. */
  events: HistoryEvent[];
  label?: string;
}

const NODE: Record<NonNullable<HistoryEvent['kind']>, { icon: LucideIcon; className: string }> = {
  edit: { icon: Pencil, className: 'border border-line bg-surface text-muted' },
  sign: { icon: Lock, className: 'bg-brand text-on-solid' },
  status: { icon: CircleCheck, className: 'border border-info-line bg-info-bg text-info' },
  create: { icon: Plus, className: 'border border-line bg-surface text-muted' },
};

function Node({ kind }: { kind?: HistoryEvent['kind'] }) {
  const node = kind ? NODE[kind] : undefined;
  if (!node) {
    return (
      <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-surface" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-line-strong" />
      </span>
    );
  }
  const Icon = node.icon;
  return (
    <span className={cn('relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full', node.className)} aria-hidden="true">
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
    </span>
  );
}

function Meta({ event }: { event: HistoryEvent }) {
  const parts: React.ReactNode[] = [];
  if (event.by) parts.push(event.by);
  if (event.role) parts.push(event.role);
  if (event.authNo) parts.push(<span className="tabular-nums">{event.authNo}</span>);
  if (event.at) {
    parts.push(
      <time dateTime={event.at} className="tabular-nums">
        {event.atLabel ?? event.at}
      </time>,
    );
  } else if (event.atLabel) {
    parts.push(<span className="tabular-nums">{event.atLabel}</span>);
  }
  if (parts.length === 0) return null;
  return (
    <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-12 text-muted comfortable:text-13">
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span className="sr-only">, </span>
            </>
          )}
          <span>{part}</span>
        </React.Fragment>
      ))}
    </p>
  );
}

function Changes({ changes }: { changes: NonNullable<HistoryEvent['changes']> }) {
  return (
    <ul className="mt-2 space-y-1.5 rounded-lg border border-line bg-surface px-3 py-2.5 text-13 comfortable:text-15">
      {changes.map((change, i) => (
        <li key={i} className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="mr-2 text-ink-2">{change.field}</span>
          {change.from !== undefined && change.from !== null && (
            <>
              <del className="text-muted line-through tabular-nums">
                <span className="sr-only">Previous value: </span>
                {change.from}
              </del>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
            </>
          )}
          <ins className="font-medium text-ink no-underline tabular-nums">
            <span className="sr-only">New value: </span>
            {change.to}
          </ins>
        </li>
      ))}
    </ul>
  );
}

function Signature({ signature }: { signature: NonNullable<HistoryEvent['signature']> }) {
  return (
    <p className="mt-2 inline-flex max-w-full flex-wrap items-center gap-x-1.5 gap-y-0.5 rounded-md border border-line bg-surface px-2 py-1 text-11 text-ink-2 comfortable:text-12">
      <Lock className="h-3 w-3 shrink-0 text-muted" aria-hidden="true" />
      <span>{signature.meaning}</span>
      {signature.hash && <span className="text-muted tabular-nums">{'SHA-256 ' + signature.hash}</span>}
    </p>
  );
}

export function HistoryTimeline({ events, label }: HistoryTimelineProps) {
  return (
    <ol aria-label={label} className="relative">
      {events.map((event, i) => {
        const last = i === events.length - 1;
        return (
          <li key={event.id ?? i} className={cn('relative flex gap-3', !last && 'pb-6')}>
            {!last && <span className="absolute left-3.5 top-7 bottom-0 w-px -translate-x-1/2 bg-line" aria-hidden="true" />}
            <Node kind={event.kind} />
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-14 font-semibold text-ink comfortable:text-16">{event.action}</span>
                {event.status && <StatusBadge tone={event.status.tone}>{event.status.label}</StatusBadge>}
                {event.badge && <Badge tone={event.badge.tone}>{event.badge.label}</Badge>}
              </div>
              <Meta event={event} />
              {event.changes && event.changes.length > 0 && <Changes changes={event.changes} />}
              {event.reason && (
                <p className="mt-2 text-12 text-ink-2 comfortable:text-13">
                  <span className="font-semibold text-ink">Reason:</span> {event.reason}
                </p>
              )}
              {event.signature && (
                <div>
                  <Signature signature={event.signature} />
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default HistoryTimeline;
