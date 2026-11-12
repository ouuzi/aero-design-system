import React from 'react';
import { skeletonFill, tableTd } from './styles.js';
import { cn } from '../lib/utils.js';

/*
 * Skeletons: grey placeholders in the shape of content that is on its way, so the layout
 * holds still while data loads and nothing jumps when it arrives. Use them where the
 * shape is known (a table body, a list, a card, an avatar); use Spinner / LoadingState
 * where it is not, or for an action in progress.
 *
 * - Skeleton: one placeholder, a text `line`, a `block` (card, chart, image) or a
 *   `circle` (avatar). Width and height in px or any CSS length.
 * - SkeletonText: a paragraph of `lines` text bars sized to 13px body text (15px
 *   comfortable), or to 12px meta text with size="sm"; the last bar is shorter.
 * - SkeletonTableRows: placeholder <tr>s for a <tbody>, with the kit's cell padding, so
 *   a Table or DataTable keeps its row height while it loads.
 *
 * Look: subtle-2 fill (the kit's track and hover grey) on white or canvas, radius md for
 * bars and lg for blocks, matching chips and controls. A slow opacity pulse says "still
 * coming"; it stops under prefers-reduced-motion (motion-reduce:animate-none here, and
 * the global reduced-motion rule in app/globals.css).
 *
 * Screen readers. Every placeholder is hidden from assistive technology (grey bars mean
 * nothing read aloud). Instead, pass `label` to ONE skeleton per loading region: it adds a
 * visually hidden polite status ("Loading records"). A `label` (on Skeleton, SkeletonText
 * or SkeletonTableRows) must never sit inside an element that has aria-busy: screen readers
 * may hold back live updates in a busy subtree, and the node is gone when aria-busy clears.
 * Inside a busy region the announcement belongs to a status region outside the busy element
 * that stays mounted, as Table and DataTable provide (`loadingLabel`).
 *
 * Density: text bars and table rows track the text size and cell padding of comfortable
 * density through the comfortable: variant, so a skeleton row is as tall as a real row.
 */

/** A length: a number is px, a string is any CSS length ("60%", "12rem"). */
type Length = number | string;

const pulse = skeletonFill;

const shapeClass = {
  /** One text line's bar: 12px tall (14px comfortable), the cap height of body text. */
  line: 'block h-3 w-full rounded-md comfortable:h-3.5',
  /** A card, chart or image area: 80px tall unless `height` says otherwise. */
  block: 'block h-20 w-full rounded-lg',
  /** An avatar or round icon tile: 32px unless `width` says otherwise. */
  circle: 'block h-8 w-8 shrink-0 rounded-full',
} as const;

export type SkeletonShape = keyof typeof shapeClass;

/** The hidden status line a skeleton adds when it is given a `label`. */
function SkeletonStatus({ label }: { label?: string }) {
  if (!label) return null;
  return (
    <span role="status" className="sr-only">
      {label}
    </span>
  );
}

export interface SkeletonProps {
  /** `line` (default) a text bar; `block` a card, chart or image area; `circle` an avatar. */
  shape?: SkeletonShape;
  /** Width in px or a CSS length. Defaults to the full width (line, block) or 32px (circle). */
  width?: Length;
  /** Height in px or a CSS length. Defaults to 12px / 14px comfortable (line), 80px (block), or the width (circle). */
  height?: Length;
  /**
   * Status text for screen readers, e.g. "Loading profile". Give it to one skeleton per
   * loading region; the rest stay silent. Sentence case, no trailing dots.
   */
  label?: string;
  /** Layout only (margins, flex sizing). Fill, radius and motion come from the kit. */
  className?: string;
}

/**
 * One placeholder.
 *
 *   <Skeleton shape="circle" width={32} label="Loading account" />
 *   <Skeleton shape="block" height={160} />
 *   <Skeleton width="40%" />
 */
export function Skeleton({ shape = 'line', width, height, label, className }: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width !== undefined) style.width = width;
  if (height !== undefined) style.height = height;
  else if (shape === 'circle' && width !== undefined) style.height = width;

  const bar = <span aria-hidden="true" className={cn(pulse, shapeClass[shape], !label && className)} style={style} />;
  if (!label) return bar;
  return (
    <span className={cn('block', shape === 'circle' && 'w-fit shrink-0', className)}>
      {bar}
      <SkeletonStatus label={label} />
    </span>
  );
}

const textRow = {
  /** 13px body text (15px comfortable), line height 1.5: a 20px row (24px comfortable). */
  md: 'flex h-5 items-center comfortable:h-6',
  /** 12px meta text (13px comfortable): an 18px row (20px comfortable). */
  sm: 'flex h-4.5 items-center comfortable:h-5',
} as const;

const textBar = {
  md: 'h-3 comfortable:h-3.5',
  sm: 'h-2.5 comfortable:h-3',
} as const;

export interface SkeletonTextProps {
  /** Number of text lines (default 3). The last of two or more is 60% wide. */
  lines?: number;
  /** `md` (default) for 13px body text; `sm` for 12px meta lines. */
  size?: keyof typeof textRow;
  /** Width of the whole paragraph, in px or a CSS length. Defaults to the full width. */
  width?: Length;
  /** Status text for screen readers, e.g. "Loading notes". See Skeleton. */
  label?: string;
  /** Layout only (margins, flex sizing). */
  className?: string;
}

/**
 * A paragraph of text bars with the line height of real text, so the block is as tall
 * as the text that replaces it.
 *
 *   <SkeletonText lines={2} label="Loading description" />
 *   <SkeletonText lines={1} size="sm" width={160} />
 */
export function SkeletonText({ lines = 3, size = 'md', width, label, className }: SkeletonTextProps) {
  const count = Math.max(1, Math.floor(lines));
  return (
    <div className={cn('w-full', className)} style={width !== undefined ? { width } : undefined}>
      <div aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className={textRow[size]}>
            <span className={cn(pulse, 'block rounded-md', textBar[size], count > 1 && i === count - 1 ? 'w-3/5' : 'w-full')} />
          </div>
        ))}
      </div>
      <SkeletonStatus label={label} />
    </div>
  );
}

/*
 * Column bar widths for table placeholders: the first column (usually a name) is the
 * widest, the rest vary a little so the rows read as data rather than stripes.
 */
const columnBarWidth = ['w-4/5', 'w-3/5', 'w-1/2', 'w-2/3', 'w-2/5'] as const;

type CellAlign = 'left' | 'right' | 'center';
const cellAlign: Record<CellAlign, string> = { left: '', right: 'ml-auto', center: 'mx-auto' };

export interface SkeletonTableRowsProps {
  /** Number of columns, so each row fills the table (match the header). */
  columns: number;
  /** Number of placeholder rows (default 5). Use about one screen's worth, not the page size. */
  rows?: number;
  /**
   * Alignment per column, matching the header's Th `align` (numbers right). Missing
   * entries are left aligned.
   */
  align?: readonly CellAlign[];
  /**
   * Status text for screen readers, only for a hand-built <table> that is neither the kit
   * Table nor DataTable and has no aria-busy. Inside Table or DataTable leave it out: they
   * announce their own `loadingLabel` from outside the busy <table>. Without it every row is
   * hidden from assistive technology.
   */
  label?: string;
  /** Row rule. `true` (default) draws the hairline between rows (on the cells), as DataTable rows do; pass `false` inside a tbody that already has `divide-y`. */
  divided?: boolean;
}

/**
 * Placeholder rows for a table body, with the kit's cell padding and text bar height, so
 * the table keeps its shape while it loads. Pass `loading` and `loadingLabel` to Table
 * meanwhile (aria-busy on the <table>, and the announcement from outside it).
 *
 *   <Table loading={loading} loadingLabel="Loading personnel">
 *     <THead>…</THead>
 *     <tbody className="divide-y divide-line">
 *       {loading ? <SkeletonTableRows columns={5} rows={6} align={['left', 'left', 'left', 'right', 'left']} divided={false} /> : rows}
 *     </tbody>
 *   </Table>
 */
export function SkeletonTableRows({ columns, rows = 5, align, label, divided = true }: SkeletonTableRowsProps) {
  const colCount = Math.max(1, Math.floor(columns));
  const rowCount = Math.max(1, Math.floor(rows));
  return (
    <>
      {Array.from({ length: rowCount }, (_, r) => (
        <tr key={r} aria-hidden={r === 0 && label ? undefined : true}>
          {Array.from({ length: colCount }, (_, c) => (
            // The rule sits on the cells, so it draws in border-separate tables (DataTable) too.
            <td key={c} className={cn(tableTd, divided && r > 0 && 'border-t border-line')}>
              {r === 0 && c === 0 && <SkeletonStatus label={label} />}
              <div aria-hidden="true" className={textRow.md}>
                <span
                  className={cn(
                    pulse,
                    'block rounded-md',
                    textBar.md,
                    columnBarWidth[c % columnBarWidth.length],
                    cellAlign[align?.[c] ?? 'left'],
                  )}
                />
              </div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
