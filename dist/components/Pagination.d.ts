import React from 'react';
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
export declare function Pagination({ page, pageSize, total, onPageChange, label, className }: PaginationProps): React.JSX.Element;
