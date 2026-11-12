import React from 'react';
export type TableFrame = 'card' | 'inset' | 'none';
export declare function Table({ frame, className, tableClassName, minWidth, loading, loadingLabel, children, }: {
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
}): React.JSX.Element;
export declare function THead({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
type Align = 'left' | 'right' | 'center';
/** `end`: the cell sticks to the right edge of the table's scroller (the pinned actions column). */
export type TablePin = 'end';
export declare function Th({ align, pin, className, children, ...rest }: React.ThHTMLAttributes<HTMLTableCellElement> & {
    align?: Align;
    pin?: TablePin;
}): React.JSX.Element;
export declare function Td({ align, pin, className, children, ...rest }: React.TdHTMLAttributes<HTMLTableCellElement> & {
    align?: Align;
    pin?: TablePin;
}): React.JSX.Element;
export {};
