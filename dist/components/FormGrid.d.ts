import React from 'react';
declare const columnsClass: {
    readonly 1: "grid-cols-1";
    readonly 2: "grid-cols-1 md:grid-cols-2";
    readonly 3: "grid-cols-1 md:grid-cols-3";
    readonly 4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
};
/** `className` for a child that spans more than one column (from `md`, where the grid has columns). */
export declare const formSpan: {
    readonly two: "md:col-span-2";
    readonly three: "md:col-span-3";
    readonly full: "col-span-full";
};
export interface FormGridProps {
    /** Columns from `md` up; one column below it. Default 2. */
    columns?: keyof typeof columnsClass;
    /** Layout of the grid itself only (margins). */
    className?: string;
    children: React.ReactNode;
}
export declare function FormGrid({ columns, className, children }: FormGridProps): React.JSX.Element;
export {};
