import React from 'react';
import { card, tableHead, tablePinEndTd, tablePinEndTh, tableTd, tableTh } from './styles.js';
import { cn } from '../lib/utils.js';

/*
 * Data table: a card that scrolls sideways when it must, a grey header band, and one
 * cell padding for every table so rows keep the same rhythm across pages. In comfortable
 * density cells pad 16px and body text grows to 15px; put `sm` controls in cells (40px there).
 *
 *   <Table>
 *     <THead><tr><Th>Name</Th><Th align="right">Hours</Th></tr></THead>
 *     <tbody className="divide-y divide-line"><tr><Td>…</Td><Td align="right">…</Td></tr></tbody>
 *   </Table>
 *
 * `frame` says what the table sits in. `card` (default) is the table as its own card.
 * `inset` is a table inside a card or a dialog body: a hairline box at radius-lg, no shadow.
 * `none` draws no box and no scroller, for a table inside a Card or a scroll region that
 * already has them (a card with a toolbar above, a tall list with a sticky header). A
 * frameless table that can be wider than its box needs that box to scroll sideways
 * (`overflow-x-auto`): a Card with `padding="none"` clips instead.
 *
 * Row actions: the last column, "Actions", is pinned with `pin="end"` on its Th and every Td.
 * It sticks to the right edge of the scroller, so Edit or Review is never scrolled off screen,
 * stays opaque (surface, the header's subtle band, the row's `hover:bg-subtle` fill) and draws
 * a hairline on its left. One action is an `sm` Button or an IconButton; more than one is a
 * single RowMenu.
 *
 *   <Th pin="end" align="right"><span className="sr-only">Actions</span></Th>
 *   <Td pin="end" align="right"><Button size="sm">Review</Button></Td>
 */

export type TableFrame = 'card' | 'inset' | 'none';

const frameClass: Record<Exclude<TableFrame, 'none'>, string> = {
  card: `${card} overflow-x-auto`,
  inset: 'rounded-lg border border-line overflow-x-auto',
};

export function Table({
  frame = 'card',
  className,
  tableClassName,
  minWidth,
  loading,
  loadingLabel = 'Loading',
  children,
}: {
  frame?: TableFrame;
  /** Layout of the frame (margins, max height). Not used by `frame="none"`, which has no frame. */
  className?: string;
  /** Layout of the <table> itself only: `table-fixed`. */
  tableClassName?: string;
  /** Narrowest the table gets, in px, before its frame scrolls sideways. */
  minWidth?: number;
  /**
   * The body is loading (render SkeletonTableRows in it, without `label`): sets aria-busy on
   * the <table>, and the table announces `loadingLabel` itself from a status region outside
   * the busy <table> that stays mounted.
   */
  loading?: boolean;
  /** Status read by screen readers while loading, e.g. "Loading personnel". Default "Loading". */
  loadingLabel?: string;
  children: React.ReactNode;
}) {
  const body = (
    <>
      <span role="status" className="sr-only">
        {loading ? loadingLabel : ''}
      </span>
      <table
        aria-busy={loading || undefined}
        className={cn('w-full text-left text-13 text-ink comfortable:text-15', tableClassName)}
        style={minWidth ? { minWidth } : undefined}
      >
        {children}
      </table>
    </>
  );
  if (frame === 'none') return body;
  return <div className={cn(frameClass[frame], className)}>{body}</div>;
}

export function THead({ children }: { children: React.ReactNode }) {
  return <thead className={tableHead}>{children}</thead>;
}

type Align = 'left' | 'right' | 'center';
const alignClass: Record<Align, string> = { left: 'text-left', right: 'text-right', center: 'text-center' };

/** `end`: the cell sticks to the right edge of the table's scroller (the pinned actions column). */
export type TablePin = 'end';

export function Th({
  align = 'left',
  pin,
  className,
  children,
  ...rest
}: React.ThHTMLAttributes<HTMLTableCellElement> & { align?: Align; pin?: TablePin }) {
  return (
    <th scope="col" className={cn(tableTh, alignClass[align], pin === 'end' && tablePinEndTh, className)} {...rest}>
      {children}
    </th>
  );
}

export function Td({
  align = 'left',
  pin,
  className,
  children,
  ...rest
}: React.TdHTMLAttributes<HTMLTableCellElement> & { align?: Align; pin?: TablePin }) {
  return (
    <td className={cn(tableTd, alignClass[align], align === 'right' && 'tabular-nums', pin === 'end' && tablePinEndTd, className)} {...rest}>
      {children}
    </td>
  );
}
