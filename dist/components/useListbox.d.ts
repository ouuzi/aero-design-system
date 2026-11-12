import React from 'react';
export interface ListboxItem {
    /** The text type-ahead matches. */
    label: string;
    /** Shown but cannot be picked (also used for options that are not drawn). */
    disabled?: boolean;
}
/** Index of the next option (from `from`, stepping `step`) that can be picked, clamped to the ends (no wrap). */
export declare function nextEnabled(items: ReadonlyArray<ListboxItem>, from: number, step: number): number;
export declare function firstEnabled(items: ReadonlyArray<ListboxItem>): number;
export declare function lastEnabled(items: ReadonlyArray<ListboxItem>): number;
/**
 * The option a typed string points at, searching from `from`: the whole string matched
 * against the start of each label (case-insensitive); a string of one repeated letter cycles
 * through the options that start with it, starting after `from`.
 */
export declare function matchTypeahead(items: ReadonlyArray<ListboxItem>, query: string, from: number): number;
export interface UseListboxOptions {
    items: ReadonlyArray<ListboxItem>;
    /** The current option, or -1. */
    selectedIndex: number;
    disabled?: boolean;
    /** Called with the picked option's index (also when it is the current one); the list has closed. */
    onPick: (index: number) => void;
}
export declare function useListbox({ items, selectedIndex, disabled, onPick }: UseListboxOptions): {
    open: boolean;
    onOpenChange: (next: boolean) => void;
    active: number;
    triggerRef: React.RefObject<HTMLButtonElement | null>;
    listId: string;
    onTriggerKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
    listProps: {
        ref: React.RefObject<HTMLDivElement | null>;
        id: string;
        role: "listbox";
        tabIndex: number;
        'aria-activedescendant': string | undefined;
        onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    };
    optionProps: (index: number) => {
        id: string;
        role: "option";
        'data-index': number;
        'data-active': boolean;
        'aria-selected': boolean;
        'aria-disabled': true | undefined;
        onMouseMove: () => void;
        onClick: () => void;
    };
    onOpenAutoFocus: (e: Event) => void;
};
