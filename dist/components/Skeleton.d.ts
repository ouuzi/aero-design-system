import React from 'react';
/** A length: a number is px, a string is any CSS length ("60%", "12rem"). */
type Length = number | string;
declare const shapeClass: {
    /** One text line's bar: 12px tall (14px comfortable), the cap height of body text. */
    readonly line: "block h-3 w-full rounded-md comfortable:h-3.5";
    /** A card, chart or image area: 80px tall unless `height` says otherwise. */
    readonly block: "block h-20 w-full rounded-lg";
    /** An avatar or round icon tile: 32px unless `width` says otherwise. */
    readonly circle: "block h-8 w-8 shrink-0 rounded-full";
};
export type SkeletonShape = keyof typeof shapeClass;
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
export declare function Skeleton({ shape, width, height, label, className }: SkeletonProps): React.JSX.Element;
declare const textRow: {
    /** 13px body text (15px comfortable), line height 1.5: a 20px row (24px comfortable). */
    readonly md: "flex h-5 items-center comfortable:h-6";
    /** 12px meta text (13px comfortable): an 18px row (20px comfortable). */
    readonly sm: "flex h-4.5 items-center comfortable:h-5";
};
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
export declare function SkeletonText({ lines, size, width, label, className }: SkeletonTextProps): React.JSX.Element;
type CellAlign = 'left' | 'right' | 'center';
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
export declare function SkeletonTableRows({ columns, rows, align, label, divided }: SkeletonTableRowsProps): React.JSX.Element;
export {};
