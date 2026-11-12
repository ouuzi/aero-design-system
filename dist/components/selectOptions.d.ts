import React from 'react';
export interface SelectOptionItem {
    /** Position among the options (the index the listbox moves through). */
    index: number;
    value: string;
    /** The text shown in the trigger and the list. */
    label: string;
    disabled: boolean;
    /** Not drawn in the list (the `hidden` attribute). */
    hidden: boolean;
    /** Index of its group in `groups`, or -1 when it is not in an <optgroup>. */
    group: number;
}
export interface SelectGroupItem {
    label: string;
    disabled: boolean;
}
export interface ParsedSelectOptions {
    options: SelectOptionItem[];
    groups: SelectGroupItem[];
}
/** The text a node renders: strings and numbers joined, elements read through their children. */
export declare function textOf(node: React.ReactNode): string;
export declare function parseSelectOptions(children: React.ReactNode): ParsedSelectOptions;
/**
 * The option a single select shows for `value`, as React and the browser pick it: the first
 * option with that value; when none has it (or no value is given), the first option that is
 * not disabled. -1 when there is nothing to show.
 */
export declare function selectedOptionIndex(options: readonly SelectOptionItem[], value: string | undefined): number;
