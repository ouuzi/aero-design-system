'use client';

import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Button } from './Button.js';
import { Checkbox } from './Checkbox.js';
import { SkeletonTableRows } from './Skeleton.js';
import { card, focusRingInset, tableHead, tablePinEnd, tableTd, tableTh } from './styles.js';
import { cn } from '../lib/utils.js';

/*
 * DataTable: the kit's Table cells with sorting, bulk selection, a sticky header, a
 * screen-reader caption and a "Showing 12 of 140" footer. Use it for long lists people
 * scan and act on (personnel, authorisations, findings, training records); a short fixed
 * table only needs plain `Table`.
 *
 *   <DataTable
 *     caption="Authorisations expiring in 60 days"     // always: read by screen readers, not shown
 *     rows={rows}                                       // each row carries a stable `id`
 *     columns={[
 *       { key: 'name', label: 'Name', sortable: true },
 *       { key: 'until', label: 'Valid until', sortable: true, sortValue: (r) => r.iso },
 *       { key: 'status', label: 'Status', render: (r) => <StatusBadge kind="authorisation" status={r.status} /> },
 *     ]}
 *     selectable rowLabel={(r) => r.name}               // "Select Eleni Georgiou"
 *     bulkActions={(ids) => <Button size="sm" icon={Clock}>Send reminder</Button>}
 *     total={140} footerEnd={<Button size="sm" variant="ghost" icon={Download}>Export</Button>}
 *     maxHeight={480}                                   // scrolls inside the card, header stays put
 *     empty={<EmptyState … />}
 *   />
 *
 * What it does for you:
 * - Sorting: a `sortable` header is a real <button> inside the <th>, cycling ascending,
 *   descending, unsorted. The <th> carries aria-sort; an arrow shows the order. `sortValue`
 *   sorts by something other than what the cell shows (an ISO date behind "14 Mar 2027").
 *   Empty values (null, undefined, '') always sort last, in either direction.
 * - Selection: `selectable` adds a column of kit Checkboxes (24px targets, 32px comfortable).
 *   The header checkbox selects every row and shows the indeterminate state for some. While
 *   rows are selected a bar above the table names the count and offers `bulkActions` and
 *   Clear. Selected rows take color-info-bg, and muted meta text in them turns ink-2,
 *   because muted reads only 4.46:1 on that fill.
 * - Scrolling: `maxHeight` scrolls the rows inside the card with a sticky header, and
 *   scroll-padding keeps a focused row from hiding under it. `minWidth` scrolls sideways.
 * - Density: `density="comfortable"`, or data-density="comfortable" on any ancestor
 *   (DensityProvider sets it on <html>), gives 16px cell padding and 15px text.
 * - Footer: "Showing {rows.length} of {total ?? rows.length}" with `footerEnd` on the
 *   right (pagination, Export). `footer={false}` hides it.
 * - Row actions: the last column, "Actions", takes `pin: 'end'`: it sticks to the right edge
 *   while the table scrolls sideways, opaque (surface, info-bg on a selected row) with a hairline
 *   on its left. One action is an `sm` Button or an IconButton; more than one, one RowMenu.
 *     { key: 'actions', label: <span className="sr-only">Actions</span>, align: 'right', pin: 'end', render: (r) => <RowMenu … /> }
 * - Empty: when `rows` is empty, `empty` renders in one cell spanning every column.
 * - Loading: `loading` shows placeholder rows (SkeletonTableRows) in the body and sets
 *   aria-busy on the table; `loadingLabel` is what screen readers hear ("Loading personnel").
 *
 * Sorting and selection are local state; pass rows already filtered and paged.
 */

type RowId = string | number;
type Align = 'left' | 'right' | 'center';
type SortDir = 'asc' | 'desc';

export interface DataTableColumn<Row> {
  key: string;
  label: React.ReactNode;
  align?: Align;
  /** Header becomes a button that cycles ascending, descending, unsorted and announces it (aria-sort). */
  sortable?: boolean;
  /** Value to sort by when the cell shows something else (an ISO date behind "14 Mar 2027"). */
  sortValue?: (row: Row) => string | number | null;
  render?: (row: Row) => React.ReactNode;
  /** `end`: the pinned actions column, stuck to the right edge while the table scrolls sideways. */
  pin?: 'end';
}

export interface DataTableProps<Row = Record<string, unknown>> {
  columns: DataTableColumn<Row>[];
  /** Each row carries a stable `id`. */
  rows: Row[];
  /** What the table lists, for screen readers. Always give one. */
  caption?: string;
  defaultSort?: { key: string; dir: SortDir };
  /** Checkbox column with 24px hit areas and a bulk bar while rows are selected. */
  selectable?: boolean;
  defaultSelected?: RowId[];
  onSelectionChange?: (ids: RowId[]) => void;
  /** Bulk bar buttons, given the selected ids: Assign, Send reminder, Export. */
  bulkActions?: (ids: RowId[]) => React.ReactNode;
  /** Names the row in its checkbox label: "Select Eleni Georgiou". */
  rowLabel?: (row: Row) => string;
  /** Scroll inside the card with a sticky header. */
  maxHeight?: number | string;
  minWidth?: number;
  /** comfortable for tablets; also follows [data-density="comfortable"] on an ancestor. */
  density?: 'default' | 'comfortable';
  /** Total records when rows are one page: "Showing 50 of 312". */
  total?: number;
  footerEnd?: React.ReactNode;
  footer?: false;
  /** An EmptyState spanning every column when rows is empty. */
  empty?: React.ReactNode;
  /** Data is on its way: placeholder rows in the body, aria-busy on the table. */
  loading?: boolean;
  /** Status read by screen readers while loading. Default "Loading". */
  loadingLabel?: string;
  className?: string;
}

const alignClass: Record<Align, string> = { left: 'text-left', right: 'text-right', center: 'text-center' };
const justifyClass: Record<Align, string> = { left: 'justify-start', right: 'justify-end', center: 'justify-center' };

/*
 * Cells. The table is border-separate so the header's rule sticks with it when the body
 * scrolls; row rules therefore sit on the cells (border-t on every row after the first).
 */
const thClass = cn(tableTh, 'sticky top-0 z-10 bg-subtle border-b border-line');
/**
 * The pinned actions column. Its header sticks to the top and the right, above the other
 * header cells; its body cells keep the row's fill (surface, or info-bg while selected).
 */
const pinThClass = cn(tablePinEnd, 'z-20');
const pinTdClass = cn(tablePinEnd, 'z-[1] bg-surface [tr[data-selected=true]>&]:bg-info-bg');
/** tableTd already pads 16px in comfortable density; the table's comfortable:text-15 sets the size. */
const tdClass = tableTd;
/** Checkbox column: just wide enough for the Checkbox's 24px target (32px comfortable). */
const checkCellClass = 'w-10 pr-0 comfortable:w-12 comfortable:pr-0';

function getId<Row>(row: Row): RowId {
  return (row as unknown as { id: RowId }).id;
}

function rawValue<Row>(row: Row, key: string): unknown {
  return (row as unknown as Record<string, unknown>)[key];
}

function isEmpty(value: unknown) {
  return value === null || value === undefined || value === '';
}

function compareValues(a: unknown, b: unknown) {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

function defaultCell(value: unknown): React.ReactNode {
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (React.isValidElement(value)) return value;
  return null;
}

export function DataTable<Row = Record<string, unknown>>({
  columns,
  rows,
  caption,
  defaultSort,
  selectable = false,
  defaultSelected,
  onSelectionChange,
  bulkActions,
  rowLabel,
  maxHeight,
  minWidth,
  density = 'default',
  total,
  footerEnd,
  footer,
  empty,
  loading = false,
  loadingLabel = 'Loading',
  className,
}: DataTableProps<Row>) {
  const [sort, setSort] = useState<{ key: string; dir: SortDir } | null>(defaultSort ?? null);
  const [selected, setSelected] = useState<Set<RowId>>(() => new Set(defaultSelected ?? []));

  const sortedRows = useMemo(() => {
    if (!sort) return rows;
    const column = columns.find((c) => c.key === sort.key);
    if (!column) return rows;
    const valueOf = (row: Row) => (column.sortValue ? column.sortValue(row) : rawValue(row, column.key));
    const sign = sort.dir === 'asc' ? 1 : -1;
    return rows
      .map((row, index) => ({ row, index, value: valueOf(row) }))
      .sort((a, b) => {
        const aEmpty = isEmpty(a.value);
        const bEmpty = isEmpty(b.value);
        if (aEmpty || bEmpty) return aEmpty === bEmpty ? a.index - b.index : aEmpty ? 1 : -1;
        return compareValues(a.value, b.value) * sign || a.index - b.index;
      })
      .map((entry) => entry.row);
  }, [rows, columns, sort]);

  // Only rows on screen count as selected, so a filtered-out row never rides along in a bulk action.
  const selectedIds = useMemo(() => rows.map(getId).filter((id) => selected.has(id)), [rows, selected]);
  const allSelected = rows.length > 0 && selectedIds.length === rows.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const commitSelection = (ids: RowId[]) => {
    setSelected(new Set(ids));
    onSelectionChange?.(ids);
  };

  const toggleRow = (id: RowId) => {
    commitSelection(selected.has(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  };

  const toggleAll = () => commitSelection(allSelected ? [] : rows.map(getId));

  const cycleSort = (key: string) => {
    setSort((current) => {
      if (!current || current.key !== key) return { key, dir: 'asc' };
      if (current.dir === 'asc') return { key, dir: 'desc' };
      return null;
    });
  };

  const colCount = columns.length + (selectable ? 1 : 0);
  const showBulkBar = selectable && selectedIds.length > 0;
  const scrolls = maxHeight !== undefined;

  return (
    <div
      data-density={density === 'comfortable' ? 'comfortable' : undefined}
      className={cn(card, 'overflow-hidden', className)}
    >
      {/*
        One status region, always mounted and outside the <table>, so it is never inside the
        aria-busy subtree: the loading label while loading, then the selection count.
      */}
      <div role="status" className="sr-only">
        {loading ? loadingLabel : selectable && selectedIds.length > 0 ? `${selectedIds.length} selected` : ''}
      </div>

      {showBulkBar && (
        <div className="print:hidden flex min-h-12 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-line bg-info-bg px-4 py-2">
          <p className="text-13 font-semibold text-ink comfortable:text-15">{selectedIds.length} selected</p>
          <div className="flex flex-wrap items-center gap-2">
            {bulkActions?.(selectedIds)}
            <Button size="sm" variant="ghost" onClick={() => commitSelection([])}>
              Clear
            </Button>
          </div>
        </div>
      )}

      <div
        className={cn(
          // Header is ~37px (51px comfortable); the padding keeps a focused row fully below it.
          // In print the cap is lifted so no rows are clipped.
          scrolls
            ? 'max-h-(--data-table-max-height) overflow-auto scroll-pt-11 comfortable:scroll-pt-14 print:max-h-none print:overflow-visible'
            : 'overflow-x-auto',
          scrolls && focusRingInset,
        )}
        style={
          scrolls
            ? ({ '--data-table-max-height': typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight } as React.CSSProperties)
            : undefined
        }
        {...(scrolls ? { role: 'region', 'aria-label': caption ?? 'Table', tabIndex: 0 } : {})}
      >
        <table
          aria-busy={loading || undefined}
          className="w-full border-separate border-spacing-0 text-left text-13 text-ink comfortable:text-15"
          style={minWidth ? { minWidth } : undefined}
        >
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className={tableHead}>
            <tr>
              {selectable && (
                <th scope="col" className={cn(thClass, checkCellClass)}>
                  <Checkbox
                    className="-my-1"
                    aria-label="Select all rows"
                    checked={allSelected}
                    indeterminate={someSelected}
                    disabled={rows.length === 0}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {columns.map((column) => {
                const align = column.align ?? 'left';
                const dir = sort?.key === column.key ? sort.dir : null;
                const Arrow = dir === 'asc' ? ArrowUp : dir === 'desc' ? ArrowDown : ArrowUpDown;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    className={cn(thClass, alignClass[align], column.pin === 'end' && pinThClass)}
                    aria-sort={column.sortable ? (dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none') : undefined}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => cycleSort(column.key)}
                        className={cn(
                          'group -mx-1 -my-1 inline-flex min-h-6 min-w-6 items-center gap-1 rounded-md px-1 font-semibold whitespace-nowrap cursor-pointer transition-colors hover:text-ink',
                          justifyClass[align],
                          // Inside: the sticky header cell would clip a ring drawn outside the button.
                          focusRingInset,
                        )}
                      >
                        {column.label}
                        <Arrow
                          className={cn('h-3.5 w-3.5 shrink-0', dir ? 'text-ink' : 'text-muted group-hover:text-ink-2')}
                          aria-hidden="true"
                        />
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonTableRows
                columns={colCount}
                align={[...(selectable ? (['left'] as const) : []), ...columns.map((c) => c.align ?? 'left')]}
              />
            ) : sortedRows.length === 0 ? (
              <tr>
                <td colSpan={colCount} className={tdClass}>
                  {empty}
                </td>
              </tr>
            ) : (
              sortedRows.map((row, index) => {
                const id = getId(row);
                const isSelected = selectable && selected.has(id);
                const rowRule = index > 0 && 'border-t border-line';
                return (
                  <tr
                    key={id}
                    data-selected={isSelected || undefined}
                    className={cn('print:break-inside-avoid', isSelected && 'bg-info-bg [&_.text-muted]:text-ink-2')}
                  >
                    {selectable && (
                      <td className={cn(tdClass, checkCellClass, rowRule)}>
                        <Checkbox
                          aria-label={`Select ${rowLabel ? rowLabel(row) : String(id)}`}
                          checked={isSelected}
                          onChange={() => toggleRow(id)}
                        />
                      </td>
                    )}
                    {columns.map((column) => {
                      const align = column.align ?? 'left';
                      return (
                        <td
                          key={column.key}
                          className={cn(tdClass, alignClass[align], align === 'right' && 'tabular-nums', column.pin === 'end' && pinTdClass, rowRule)}
                        >
                          {column.render ? column.render(row) : defaultCell(rawValue(row, column.key))}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {footer !== false && (
        <div className="flex min-h-12 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-line px-4 py-2">
          <p className="text-12 text-muted">
            Showing {rows.length} of {total ?? rows.length}
          </p>
          {footerEnd && <div className="flex flex-wrap items-center gap-2">{footerEnd}</div>}
        </div>
      )}
    </div>
  );
}
