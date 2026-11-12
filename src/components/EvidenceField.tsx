'use client';

/*
 * Evidence field: the cell that shows which documents or training records back a
 * requirement. It looks like a compact dropdown (the shared grey select look) and
 * opens the evidence picker, where one or many records can be chosen or a new
 * certificate uploaded. A quiet clear button appears once something is linked.
 * Both follow comfortable density (32px, 40px comfortable) through the shared recipes,
 * so the clear button is never below target-min (24px). The full text of a truncated cell
 * shows as a Tooltip on hover and keyboard focus.
 */

import React from 'react';
import { ChevronDown, Paperclip, Layers, X } from 'lucide-react';
import { selectSmBase, codeChip, type StatusTone } from './styles.js';
import { StatusBadge } from './StatusBadge.js';
import { IconButton } from './Button.js';
import { Tooltip } from './Tooltip.js';

interface EvidenceFieldProps {
  /** Number of linked records. */
  count: number;
  /** Main text: the record's title when one is linked. */
  title?: string;
  /** Secondary text: certificate or record reference(s). */
  detail?: string;
  onOpen: () => void;
  onClear?: () => void;
  placeholder?: string;
  id?: string;
}

export default function EvidenceField({
  count,
  title,
  detail,
  onOpen,
  onClear,
  placeholder = 'Link evidence',
  id,
}: EvidenceFieldProps) {
  const Icon = count > 1 ? Layers : Paperclip;
  const summary =
    count === 0
      ? placeholder
      : count === 1
      ? title || detail || '1 record'
      : `${count} records`;
  const secondary = count === 0 ? undefined : count === 1 ? (title ? detail : undefined) : detail;

  return (
    <div className="flex items-center gap-1 min-w-0">
      <Tooltip content={[summary, secondary].filter(Boolean).join(' · ')} asLabel>
        <button
          type="button"
          id={id}
          onClick={onOpen}
          aria-haspopup="dialog"
          className={`${selectSmBase} relative flex w-full min-w-0 items-center gap-2 pr-8 text-left`}
        >
          <Icon className={`h-3.5 w-3.5 shrink-0 ${count ? 'text-ink-2' : 'text-muted'}`} aria-hidden />
          <span className={`truncate ${count ? 'text-ink' : 'text-muted font-normal'}`}>{summary}</span>
          {secondary && <span className="truncate font-normal text-muted tabular-nums">{secondary}</span>}
          <ChevronDown className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
        </button>
      </Tooltip>
      {count > 0 && onClear && <IconButton icon={X} label="Clear evidence" variant="danger" onClick={onClear} className="shrink-0" />}
    </div>
  );
}

export interface LinkedEvidenceRow {
  key: string;
  title: string;
  code?: string;
  completed?: string;
  due?: string;
  status?: string;
}

/** The records behind a multi-linked requirement: a quiet nested list under the row. */
export function LinkedEvidenceList({ rows, formatDate }: { rows: LinkedEvidenceRow[]; formatDate: (d: string) => string }) {
  const tone = (s = 'Valid'): StatusTone =>
    /expir|overdue|invalid|missing/i.test(s) ? 'danger' : /due|soon|pending/i.test(s) ? 'warning' : 'success';
  return (
    <div>
      <p className="mb-1.5 text-12 font-semibold text-ink-2 comfortable:text-13">Linked records ({rows.length})</p>
      <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
        {rows.map((r) => (
          <li key={r.key} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 text-12 comfortable:py-3 comfortable:text-13">
            {r.code && <span className={codeChip}>{r.code}</span>}
            <span className="min-w-0 flex-1 truncate text-ink" title={r.title}>
              {r.title}
            </span>
            <span className="whitespace-nowrap text-muted tabular-nums">
              {r.completed ? `Completed ${formatDate(r.completed)}` : 'Completion date not recorded'}
            </span>
            <span className="whitespace-nowrap text-muted tabular-nums">{r.due ? `Due ${formatDate(r.due)}` : 'Does not expire'}</span>
            <StatusBadge tone={tone(r.status)}>{r.status || 'Valid'}</StatusBadge>
          </li>
        ))}
      </ul>
    </div>
  );
}
