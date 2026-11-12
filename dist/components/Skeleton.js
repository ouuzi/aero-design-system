import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { skeletonFill, tableTd } from './styles.js';
import { cn } from '../lib/utils.js';
const pulse = skeletonFill;
const shapeClass = {
    /** One text line's bar: 12px tall (14px comfortable), the cap height of body text. */
    line: 'block h-3 w-full rounded-md comfortable:h-3.5',
    /** A card, chart or image area: 80px tall unless `height` says otherwise. */
    block: 'block h-20 w-full rounded-lg',
    /** An avatar or round icon tile: 32px unless `width` says otherwise. */
    circle: 'block h-8 w-8 shrink-0 rounded-full',
};
/** The hidden status line a skeleton adds when it is given a `label`. */
function SkeletonStatus({ label }) {
    if (!label)
        return null;
    return (_jsx("span", { role: "status", className: "sr-only", children: label }));
}
/**
 * One placeholder.
 *
 *   <Skeleton shape="circle" width={32} label="Loading account" />
 *   <Skeleton shape="block" height={160} />
 *   <Skeleton width="40%" />
 */
export function Skeleton({ shape = 'line', width, height, label, className }) {
    const style = {};
    if (width !== undefined)
        style.width = width;
    if (height !== undefined)
        style.height = height;
    else if (shape === 'circle' && width !== undefined)
        style.height = width;
    const bar = _jsx("span", { "aria-hidden": "true", className: cn(pulse, shapeClass[shape], !label && className), style: style });
    if (!label)
        return bar;
    return (_jsxs("span", { className: cn('block', shape === 'circle' && 'w-fit shrink-0', className), children: [bar, _jsx(SkeletonStatus, { label: label })] }));
}
const textRow = {
    /** 13px body text (15px comfortable), line height 1.5: a 20px row (24px comfortable). */
    md: 'flex h-5 items-center comfortable:h-6',
    /** 12px meta text (13px comfortable): an 18px row (20px comfortable). */
    sm: 'flex h-4.5 items-center comfortable:h-5',
};
const textBar = {
    md: 'h-3 comfortable:h-3.5',
    sm: 'h-2.5 comfortable:h-3',
};
/**
 * A paragraph of text bars with the line height of real text, so the block is as tall
 * as the text that replaces it.
 *
 *   <SkeletonText lines={2} label="Loading description" />
 *   <SkeletonText lines={1} size="sm" width={160} />
 */
export function SkeletonText({ lines = 3, size = 'md', width, label, className }) {
    const count = Math.max(1, Math.floor(lines));
    return (_jsxs("div", { className: cn('w-full', className), style: width !== undefined ? { width } : undefined, children: [_jsx("div", { "aria-hidden": "true", children: Array.from({ length: count }, (_, i) => (_jsx("div", { className: textRow[size], children: _jsx("span", { className: cn(pulse, 'block rounded-md', textBar[size], count > 1 && i === count - 1 ? 'w-3/5' : 'w-full') }) }, i))) }), _jsx(SkeletonStatus, { label: label })] }));
}
/*
 * Column bar widths for table placeholders: the first column (usually a name) is the
 * widest, the rest vary a little so the rows read as data rather than stripes.
 */
const columnBarWidth = ['w-4/5', 'w-3/5', 'w-1/2', 'w-2/3', 'w-2/5'];
const cellAlign = { left: '', right: 'ml-auto', center: 'mx-auto' };
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
export function SkeletonTableRows({ columns, rows = 5, align, label, divided = true }) {
    const colCount = Math.max(1, Math.floor(columns));
    const rowCount = Math.max(1, Math.floor(rows));
    return (_jsx(_Fragment, { children: Array.from({ length: rowCount }, (_, r) => (_jsx("tr", { "aria-hidden": r === 0 && label ? undefined : true, children: Array.from({ length: colCount }, (_, c) => (
            // The rule sits on the cells, so it draws in border-separate tables (DataTable) too.
            _jsxs("td", { className: cn(tableTd, divided && r > 0 && 'border-t border-line'), children: [r === 0 && c === 0 && _jsx(SkeletonStatus, { label: label }), _jsx("div", { "aria-hidden": "true", className: textRow.md, children: _jsx("span", { className: cn(pulse, 'block rounded-md', textBar.md, columnBarWidth[c % columnBarWidth.length], cellAlign[align?.[c] ?? 'left']) }) })] }, c))) }, r))) }));
}
