import React from 'react';
import { type ReadinessCell, type ReadinessGroup, type ReadinessState } from '../lib/readiness.js';
export declare const readinessCellClass: Record<ReadinessState, string>;
/** Compact strip: one small cell per requirement, groups separated by a gap. */
export declare function ReadinessStrip({ groups, size, className }: {
    groups: ReadinessGroup[];
    size?: 'sm' | 'md';
    className?: string;
}): React.JSX.Element;
export interface ReadinessCellButtonProps {
    state: ReadinessState;
    /** Accessible name and tooltip: the person or requirement, then the state. Required. */
    label: string;
    onSelect: () => void;
    className?: string;
}
/** One readiness cell that is a button: 24px square, lit in its state's colour. */
export declare function ReadinessCellButton({ state, label, onSelect, className }: ReadinessCellButtonProps): React.JSX.Element;
/** "10/13 valid, 1 due, 1 missing" */
export declare function ReadinessSummary({ groups, className }: {
    groups: ReadinessGroup[];
    className?: string;
}): React.JSX.Element | null;
/** Labelled annunciator: cells you can read across a room. Cells with a targetId scroll to their row. */
export declare function AnnunciatorPanel({ groups, onSelect }: {
    groups: ReadinessGroup[];
    onSelect?: (cell: ReadinessCell) => void;
}): React.JSX.Element;
export declare function ReadinessLegend({ states }: {
    states?: ReadinessState[];
}): React.JSX.Element;
