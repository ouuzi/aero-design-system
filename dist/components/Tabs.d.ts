import React from 'react';
export interface TabOption<T extends string> {
    value: T;
    label: React.ReactNode;
    /** Neutral count badge after the label. */
    count?: number;
    icon?: React.ElementType;
    /** Not selectable; skipped by the arrow keys, Home and End. */
    disabled?: boolean;
    /** Id of the button, e.g. for the panel's aria-labelledby. */
    id?: string;
    /** Id of the panel this option shows (aria-controls). */
    controls?: string;
}
export declare function Tabs<T extends string>({ options, value, onChange, label, className, }: {
    options: TabOption<T>[];
    value: T;
    onChange: (value: T) => void;
    /** Accessible name of the tab list. */
    label: string;
    className?: string;
}): React.JSX.Element;
export declare function SegmentedControl<T extends string>({ options, value, onChange, label, size, className, }: {
    options: TabOption<T>[];
    value: T;
    onChange: (value: T) => void;
    label: string;
    size?: 'md' | 'sm';
    className?: string;
}): React.JSX.Element;
