'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Button } from './Button.js';
import { Checkbox } from './Checkbox.js';
import { SkeletonTableRows } from './Skeleton.js';
import { card, focusRingInset, tableHead, tablePinEnd, tableTd, tableTh } from './styles.js';
import { cn } from '../lib/utils.js';
const alignClass = { left: 'text-left', right: 'text-right', center: 'text-center' };
const justifyClass = { left: 'justify-start', right: 'justify-end', center: 'justify-center' };
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
function getId(row) {
    return row.id;
}
function rawValue(row, key) {
    return row[key];
}
function isEmpty(value) {
    return value === null || value === undefined || value === '';
}
function compareValues(a, b) {
    if (typeof a === 'number' && typeof b === 'number')
        return a - b;
    return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}
function defaultCell(value) {
    if (typeof value === 'string' || typeof value === 'number')
        return value;
    if (React.isValidElement(value))
        return value;
    return null;
}
export function DataTable({ columns, rows, caption, defaultSort, selectable = false, defaultSelected, onSelectionChange, bulkActions, rowLabel, maxHeight, minWidth, density = 'default', total, footerEnd, footer, empty, loading = false, loadingLabel = 'Loading', className, }) {
    const [sort, setSort] = useState(defaultSort ?? null);
    const [selected, setSelected] = useState(() => new Set(defaultSelected ?? []));
    const sortedRows = useMemo(() => {
        if (!sort)
            return rows;
        const column = columns.find((c) => c.key === sort.key);
        if (!column)
            return rows;
        const valueOf = (row) => (column.sortValue ? column.sortValue(row) : rawValue(row, column.key));
        const sign = sort.dir === 'asc' ? 1 : -1;
        return rows
            .map((row, index) => ({ row, index, value: valueOf(row) }))
            .sort((a, b) => {
            const aEmpty = isEmpty(a.value);
            const bEmpty = isEmpty(b.value);
            if (aEmpty || bEmpty)
                return aEmpty === bEmpty ? a.index - b.index : aEmpty ? 1 : -1;
            return compareValues(a.value, b.value) * sign || a.index - b.index;
        })
            .map((entry) => entry.row);
    }, [rows, columns, sort]);
    // Only rows on screen count as selected, so a filtered-out row never rides along in a bulk action.
    const selectedIds = useMemo(() => rows.map(getId).filter((id) => selected.has(id)), [rows, selected]);
    const allSelected = rows.length > 0 && selectedIds.length === rows.length;
    const someSelected = selectedIds.length > 0 && !allSelected;
    const commitSelection = (ids) => {
        setSelected(new Set(ids));
        onSelectionChange?.(ids);
    };
    const toggleRow = (id) => {
        commitSelection(selected.has(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
    };
    const toggleAll = () => commitSelection(allSelected ? [] : rows.map(getId));
    const cycleSort = (key) => {
        setSort((current) => {
            if (!current || current.key !== key)
                return { key, dir: 'asc' };
            if (current.dir === 'asc')
                return { key, dir: 'desc' };
            return null;
        });
    };
    const colCount = columns.length + (selectable ? 1 : 0);
    const showBulkBar = selectable && selectedIds.length > 0;
    const scrolls = maxHeight !== undefined;
    return (_jsxs("div", { "data-density": density === 'comfortable' ? 'comfortable' : undefined, className: cn(card, 'overflow-hidden', className), children: [_jsx("div", { role: "status", className: "sr-only", children: loading ? loadingLabel : selectable && selectedIds.length > 0 ? `${selectedIds.length} selected` : '' }), showBulkBar && (_jsxs("div", { className: "print:hidden flex min-h-12 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-line bg-info-bg px-4 py-2", children: [_jsxs("p", { className: "text-13 font-semibold text-ink comfortable:text-15", children: [selectedIds.length, " selected"] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [bulkActions?.(selectedIds), _jsx(Button, { size: "sm", variant: "ghost", onClick: () => commitSelection([]), children: "Clear" })] })] })), _jsx("div", { className: cn(
                // Header is ~37px (51px comfortable); the padding keeps a focused row fully below it.
                // In print the cap is lifted so no rows are clipped.
                scrolls
                    ? 'max-h-(--data-table-max-height) overflow-auto scroll-pt-11 comfortable:scroll-pt-14 print:max-h-none print:overflow-visible'
                    : 'overflow-x-auto', scrolls && focusRingInset), style: scrolls
                    ? { '--data-table-max-height': typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }
                    : undefined, ...(scrolls ? { role: 'region', 'aria-label': caption ?? 'Table', tabIndex: 0 } : {}), children: _jsxs("table", { "aria-busy": loading || undefined, className: "w-full border-separate border-spacing-0 text-left text-13 text-ink comfortable:text-15", style: minWidth ? { minWidth } : undefined, children: [caption && _jsx("caption", { className: "sr-only", children: caption }), _jsx("thead", { className: tableHead, children: _jsxs("tr", { children: [selectable && (_jsx("th", { scope: "col", className: cn(thClass, checkCellClass), children: _jsx(Checkbox, { className: "-my-1", "aria-label": "Select all rows", checked: allSelected, indeterminate: someSelected, disabled: rows.length === 0, onChange: toggleAll }) })), columns.map((column) => {
                                        const align = column.align ?? 'left';
                                        const dir = sort?.key === column.key ? sort.dir : null;
                                        const Arrow = dir === 'asc' ? ArrowUp : dir === 'desc' ? ArrowDown : ArrowUpDown;
                                        return (_jsx("th", { scope: "col", className: cn(thClass, alignClass[align], column.pin === 'end' && pinThClass), "aria-sort": column.sortable ? (dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none') : undefined, children: column.sortable ? (_jsxs("button", { type: "button", onClick: () => cycleSort(column.key), className: cn('group -mx-1 -my-1 inline-flex min-h-6 min-w-6 items-center gap-1 rounded-md px-1 font-semibold whitespace-nowrap cursor-pointer transition-colors hover:text-ink', justifyClass[align], 
                                                // Inside: the sticky header cell would clip a ring drawn outside the button.
                                                focusRingInset), children: [column.label, _jsx(Arrow, { className: cn('h-3.5 w-3.5 shrink-0', dir ? 'text-ink' : 'text-muted group-hover:text-ink-2'), "aria-hidden": "true" })] })) : (column.label) }, column.key));
                                    })] }) }), _jsx("tbody", { children: loading ? (_jsx(SkeletonTableRows, { columns: colCount, align: [...(selectable ? ['left'] : []), ...columns.map((c) => c.align ?? 'left')] })) : sortedRows.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: colCount, className: tdClass, children: empty }) })) : (sortedRows.map((row, index) => {
                                const id = getId(row);
                                const isSelected = selectable && selected.has(id);
                                const rowRule = index > 0 && 'border-t border-line';
                                return (_jsxs("tr", { "data-selected": isSelected || undefined, className: cn('print:break-inside-avoid', isSelected && 'bg-info-bg [&_.text-muted]:text-ink-2'), children: [selectable && (_jsx("td", { className: cn(tdClass, checkCellClass, rowRule), children: _jsx(Checkbox, { "aria-label": `Select ${rowLabel ? rowLabel(row) : String(id)}`, checked: isSelected, onChange: () => toggleRow(id) }) })), columns.map((column) => {
                                            const align = column.align ?? 'left';
                                            return (_jsx("td", { className: cn(tdClass, alignClass[align], align === 'right' && 'tabular-nums', column.pin === 'end' && pinTdClass, rowRule), children: column.render ? column.render(row) : defaultCell(rawValue(row, column.key)) }, column.key));
                                        })] }, id));
                            })) })] }) }), footer !== false && (_jsxs("div", { className: "flex min-h-12 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-line px-4 py-2", children: [_jsxs("p", { className: "text-12 text-muted", children: ["Showing ", rows.length, " of ", total ?? rows.length] }), footerEnd && _jsx("div", { className: "flex flex-wrap items-center gap-2", children: footerEnd })] }))] }));
}
