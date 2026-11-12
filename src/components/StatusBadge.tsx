import React from 'react';
import { codeChip, labelDot, statusBadgeClass, type StatusBadgeWidth, type StatusTone } from './styles.js';
import {
  AUTH_LABEL,
  AUTH_TONE,
  DOCUMENT_REVIEW_STATUS,
  activityLogStatus,
  findingStatus,
  isAuthorisationStatus,
  normaliseAuthorisationStatus,
  outcomeStatus,
  readinessStatus,
} from './statusTones.js';
import type { PersonnelAuthorisationStatus, ReadinessStatus } from '../lib/statusTypes.js';
import { cn } from '../lib/utils.js';
import { StatusSymbol } from './StatusSymbol.js';
import { ChipRemoveButton, defaultRemoveLabel } from './Chip.js';

/*
 * StatusBadge: the one status label in the app. Always the rounded status pill, whatever
 * the tone, so a neutral status ("Not configured", "Draft") has the same shape as its
 * siblings in a column. Success, warning and danger always show their symbol (check,
 * triangle, cross) before the word; `dot` marks a neutral one and is ignored otherwise.
 *
 * Two ways to say which status:
 * - Mapped (preferred): `kind` + `status`. The colour and label come from statusTones.ts,
 *   so a status looks the same on every screen.
 *     <StatusBadge kind="readiness" status={s} />
 *     <StatusBadge kind="authorisation" status={auth.status} />
 *     <StatusBadge kind="document" status={doc.status} />
 *     <StatusBadge kind="finding" status={finding.issue} />          // compliance findings
 *     <StatusBadge kind="outcome" status={record.finalDecision} />   // assessment outcomes
 *     <StatusBadge kind="activity" status={log.status} />            // activity log ('PENDING VERIFICATION')
 *   Labels are sentence case whatever the stored value ("Expiring Soon" shows "Expiring soon",
 *   "ACTION REQUIRED" shows "Action required"). `finding`, `outcome` and `activity` take any
 *   string: a value their table does not know renders neutral, its text in sentence case.
 * - Direct: `tone` + children, for a status outside those maps (an experience log's
 *   state, a checklist result). Keep the tone in a lookup table, not a ternary.
 *     <StatusBadge tone={STATUS_TONE[p.status]}>{p.status}</StatusBadge>
 *
 * `width="column"` is the 120px pill (12px text, centred) for a requirement row's Status
 * column, so statuses line up down the page.
 *
 * `onRemove` (with `removeLabel`) adds the Chip's × for a picked value that is in a problem
 * state (an aircraft type not in the register): the same 24px target as a removable Chip.
 *
 * Categories and counts are a <Badge>, never a StatusBadge.
 */

interface StatusBadgeCommon {
  /** Leading dot for a neutral status; status colours show their symbol instead. */
  dot?: boolean;
  /** `auto` (default) an inline pill; `column` the 120px pill of a Status column. */
  width?: StatusBadgeWidth;
  /** Adds a × button (a picked value that can be taken out again, as on a Chip). */
  onRemove?: () => void;
  /** The remove button's accessible name. Default "Remove <label>" for plain text. */
  removeLabel?: string;
  className?: string;
}

type MappedStatus =
  | { kind: 'readiness'; status: ReadinessStatus }
  | { kind: 'authorisation'; status: PersonnelAuthorisationStatus }
  | { kind: 'document'; status: keyof typeof DOCUMENT_REVIEW_STATUS }
  | { kind: 'finding' | 'outcome' | 'activity'; status: string | null | undefined };

type DirectStatus = { kind?: never; status?: never; tone: StatusTone; children: React.ReactNode };

export type StatusBadgeProps = StatusBadgeCommon & ((MappedStatus & { tone?: never; children?: never }) | DirectStatus);

function resolve(props: StatusBadgeProps): { tone: StatusTone; label: React.ReactNode } {
  switch (props.kind) {
    case 'readiness':
      // Typed to the known statuses, but screens cast stored strings: loose spellings are matched, unknown values show neutral.
      return readinessStatus(props.status);
    case 'finding':
      return findingStatus(props.status);
    case 'outcome':
      return outcomeStatus(props.status);
    case 'activity':
      return activityLogStatus(props.status);
    case 'document':
      return DOCUMENT_REVIEW_STATUS[props.status] ?? { tone: 'neutral', label: props.status };
    case 'authorisation':
      // Typed to the known statuses, but older records may still hold a free string: unknown values show neutral.
      return isAuthorisationStatus(props.status)
        ? { tone: AUTH_TONE[props.status], label: AUTH_LABEL[props.status] }
        : { tone: 'neutral', label: props.status || 'Unknown' };
    default:
      return { tone: props.tone, label: props.children };
  }
}

export function StatusBadge(props: StatusBadgeProps) {
  const { tone, label } = resolve(props);
  return (
    <span className={cn(statusBadgeClass(tone, props.width), props.className)}>
      {tone === 'neutral' ? (
        props.dot && <span className={labelDot} aria-hidden="true" />
      ) : (
        <StatusSymbol tone={tone} />
      )}
      {label}
      {props.onRemove && <ChipRemoveButton tone={tone} label={props.removeLabel ?? defaultRemoveLabel(label)} onRemove={props.onRemove} />}
    </span>
  );
}

/**
 * StatusBadge props for an authorisation status read from a record that may hold a legacy
 * free string. A known status (matched ignoring case, spaces, hyphens, underscores) gets
 * the mapped badge; anything else a neutral badge with the raw text (or `fallbackLabel`).
 *
 *   <StatusBadge {...authorisationStatusBadge(a.status)} dot />
 */
export function authorisationStatusBadge(
  value: string | null | undefined,
  fallbackLabel = 'Unknown',
): StatusBadgeProps {
  const status = normaliseAuthorisationStatus(value);
  return status ? { kind: 'authorisation', status } : { tone: 'neutral', children: value?.trim() || fallbackLabel };
}

/** Regulator and record codes (B1.1, AES-CM-07, TRN-002): a quiet grey chip, never a status colour. */
export function CodeChip({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={cn(codeChip, className)}>{children}</span>;
}
