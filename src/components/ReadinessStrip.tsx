'use client';

/*
 * Annunciator readiness strip: the system's one signature element. Like a
 * cockpit annunciator panel, each requirement is a small cell lit in its status
 * colour, so a person's (or a department's) readiness reads at a glance.
 *
 * - ReadinessStrip: the compact strip (profile header, directory rows).
 * - ReadinessSummary: the one-line count beside it.
 * - AnnunciatorPanel: labelled cells (assessment Section 2 opener).
 * - ReadinessLegend: what the colours mean. Show it wherever the strip is new to the reader.
 * Missing cells are hatched so they read without colour.
 *
 * Interaction: the compact strip cells are never buttons (the strip is one image with a
 * spoken summary). AnnunciatorPanel cells become buttons only with `onSelect`; each is then
 * at least target-min (24x24px: 48px tall, and as wide as its grid column, which keeps
 * `min-w-0` so long notes truncate instead of widening it), has a visible focus ring and is named by
 * its requirement and state ("SMS & HF: Missing, expired or unverified (Expired)").
 *
 * ReadinessCellButton is one clickable cell on its own (a person in a department row that
 * opens their profile): the compact cell's colour at target size (24x24px), a hover lift,
 * the shared focus ring, and `label` as its name and tooltip, which must say who or what it is
 * and the state ("Maria Konstantinou: Expiring soon").
 */

import React from 'react';
import {
  READINESS_LABELS,
  countReadiness,
  readinessSentence,
  type ReadinessCell,
  type ReadinessGroup,
  type ReadinessState,
} from '../lib/readiness.js';
import { focusRing } from './styles.js';
import { Tooltip } from './Tooltip.js';
import { cn } from '../lib/utils.js';

export const readinessCellClass: Record<ReadinessState, string> = {
  valid: 'bg-success',
  due: 'bg-warning-fill',
  missing: 'bg-danger annunciator-hatch',
  pending: 'bg-surface ring-1 ring-inset ring-line-strong',
  na: 'bg-subtle-2',
};

const litClass: Record<ReadinessState, string> = {
  valid: 'bg-success-bg text-success ring-success-line',
  due: 'bg-warning-bg text-warning ring-warning-line',
  missing: 'bg-danger-bg text-danger ring-danger-line annunciator-hatch-soft',
  pending: 'bg-surface text-ink-2 ring-line-strong',
  na: 'bg-subtle text-muted ring-line',
};

function cellTitle(c: ReadinessCell) {
  return `${c.name}: ${READINESS_LABELS[c.state]}${c.note && c.note !== READINESS_LABELS[c.state] ? ` (${c.note})` : ''}`;
}

/** Compact strip: one small cell per requirement, groups separated by a gap. */
export function ReadinessStrip({ groups, size = 'md', className = '' }: { groups: ReadinessGroup[]; size?: 'sm' | 'md'; className?: string }) {
  const dims = size === 'sm' ? 'h-3 w-2' : 'h-4 w-2.5';
  if (groups.length === 0) return <span className="text-12 text-muted comfortable:text-13">No requirements configured</span>;
  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${className}`} role="img" aria-label={`Readiness: ${readinessSentence(groups)}`}>
      {groups.map((g) => (
        <span key={g.key} className="flex items-center gap-1" title={g.label}>
          {g.cells.map((c) => (
            <span key={c.key} className={`${dims} shrink-0 rounded-[2px] ${readinessCellClass[c.state]}`} title={cellTitle(c)} />
          ))}
        </span>
      ))}
    </div>
  );
}

export interface ReadinessCellButtonProps {
  state: ReadinessState;
  /** Accessible name and tooltip: the person or requirement, then the state. Required. */
  label: string;
  onSelect: () => void;
  className?: string;
}

/** One readiness cell that is a button: 24px square, lit in its state's colour. */
export function ReadinessCellButton({ state, label, onSelect, className }: ReadinessCellButtonProps) {
  return (
    <Tooltip content={label} asLabel>
      <button
        type="button"
        aria-label={label}
        onClick={onSelect}
        className={cn(
          'size-6 shrink-0 rounded-sm cursor-pointer transition-transform hover:scale-110',
          focusRing,
          readinessCellClass[state],
          className,
        )}
      />
    </Tooltip>
  );
}

/** "10/13 valid, 1 due, 1 missing" */
export function ReadinessSummary({ groups, className = '' }: { groups: ReadinessGroup[]; className?: string }) {
  const n = countReadiness(groups);
  if (n.total === 0) return null;
  return (
    <span className={`text-12 text-ink-2 tabular-nums whitespace-nowrap comfortable:text-13 ${className}`}>
      <strong className="font-semibold text-ink">{n.valid}</strong>/{n.total} valid
      {n.due > 0 && <span className="font-medium text-warning">, {n.due} due</span>}
      {n.missing > 0 && <span className="font-medium text-danger">, {n.missing} missing</span>}
      {n.pending > 0 && <span className="text-muted">, {n.pending} not assessed</span>}
    </span>
  );
}

/** Labelled annunciator: cells you can read across a room. Cells with a targetId scroll to their row. */
export function AnnunciatorPanel({ groups, onSelect }: { groups: ReadinessGroup[]; onSelect?: (cell: ReadinessCell) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {groups.map((g) => (
        <div key={g.key} className="min-w-0">
          <p className="mb-2 text-12 font-semibold text-ink-2 comfortable:text-13">{g.label}</p>
          {g.cells.length === 0 ? (
            <p className="text-12 text-muted comfortable:text-13">None required</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {g.cells.map((c) => {
                const content = (
                  <>
                    <span className="block truncate text-12 font-semibold leading-tight comfortable:text-13">{c.code}</span>
                    <span className="block truncate text-11 font-normal leading-tight comfortable:text-12">{c.note || READINESS_LABELS[c.state]}</span>
                  </>
                );
                const cls = `flex h-12 min-w-0 flex-col justify-center rounded-md px-2 text-left ring-1 ring-inset comfortable:h-14 ${litClass[c.state]}`;
                return onSelect ? (
                  <Tooltip key={c.key} content={cellTitle(c)} asLabel>
                    <button
                      type="button"
                      aria-label={cellTitle(c)}
                      onClick={() => onSelect(c)}
                      className={cn(cls, 'min-h-6 cursor-pointer transition-shadow hover:shadow-xs', focusRing)}
                    >
                      {content}
                    </button>
                  </Tooltip>
                ) : (
                  <div key={c.key} title={cellTitle(c)} className={cls}>
                    {content}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function ReadinessLegend({ states = ['valid', 'due', 'missing', 'pending'] }: { states?: ReadinessState[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-12 text-ink-2 comfortable:text-13">
      {states.map((s) => (
        <span key={s} className="inline-flex items-center gap-1.5">
          <span className={`h-3 w-2 rounded-[2px] ${readinessCellClass[s]}`} aria-hidden />
          {READINESS_LABELS[s]}
        </span>
      ))}
    </div>
  );
}
