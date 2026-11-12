import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, IconButton } from './Button.js';
import { pageWindow } from './pageWindow.js';
import { cn } from '../lib/utils.js';

/*
 * Pagination: the footer of a paged table. On the left what is shown ("Showing 1 to 15 of 140
 * records"), on the right previous, the page numbers and next, all `sm` (32px, 40px
 * comfortable). The current page is the primary button with aria-current="page"; the others
 * are secondary. With more than seven pages the list keeps the first, the last and the
 * current page with its neighbours, and an ellipsis for each gap.
 *
 * - `page` is 1-based; `onPageChange` gets the new page. The component keeps no state.
 * - With one page (or none) the buttons are hidden and only the count line stays.
 * - `label` is the noun of the count: "records" (default), "people", "courses".
 * - Place it in the footer of the table's Card: `className="border-t border-line p-4"`.
 */

export interface PaginationProps {
  /** The current page, 1-based. */
  page: number;
  /** Rows per page. */
  pageSize: number;
  /** All rows across every page (after filtering). */
  total: number;
  onPageChange: (page: number) => void;
  /** The noun in the count line. Default "records". */
  label?: string;
  /** Layout only (border, padding). */
  className?: string;
}

export function Pagination({ page, pageSize, total, onPageChange, label = 'records', className }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const current = Math.min(Math.max(1, page), pageCount);
  const first = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const last = Math.min(current * pageSize, total);
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-3 text-13 text-ink-2 comfortable:text-15', className)}>
      <p className="tabular-nums">
        {total === 0 ? `No ${label}` : `Showing ${first} to ${last} of ${total} ${label}`}
      </p>
      {pageCount > 1 && (
        <nav aria-label="Pagination" className="flex items-center gap-1">
          <IconButton
            icon={ChevronLeft}
            variant="outline"
            label="Previous page"
            disabled={current === 1}
            onClick={() => onPageChange(current - 1)}
          />
          {pageWindow(current, pageCount).map((p, i) =>
            p === 'gap' ? (
              <span key={`gap-${i}`} className="px-1 text-muted" aria-hidden="true">
                …
              </span>
            ) : (
              <Button
                key={p}
                size="sm"
                variant={p === current ? 'primary' : 'secondary'}
                aria-current={p === current ? 'page' : undefined}
                aria-label={`Page ${p}`}
                onClick={() => onPageChange(p)}
                className="min-w-control-sm px-2 tabular-nums"
              >
                {p}
              </Button>
            ),
          )}
          <IconButton
            icon={ChevronRight}
            variant="outline"
            label="Next page"
            disabled={current === pageCount}
            onClick={() => onPageChange(current + 1)}
          />
        </nav>
      )}
    </div>
  );
}
