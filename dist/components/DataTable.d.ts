import React from 'react';
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
    defaultSort?: {
        key: string;
        dir: SortDir;
    };
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
export declare function DataTable<Row = Record<string, unknown>>({ columns, rows, caption, defaultSort, selectable, defaultSelected, onSelectionChange, bulkActions, rowLabel, maxHeight, minWidth, density, total, footerEnd, footer, empty, loading, loadingLabel, className, }: DataTableProps<Row>): React.JSX.Element;
export {};
