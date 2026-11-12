/**
 * valid: green. due: amber, valid but expiring soon. missing: red, anything that blocks
 * compliance (missing, expired, overdue, unverified, booked but not done, gap).
 * pending: not yet assessed. na: not applicable.
 */
export type ReadinessState = 'valid' | 'due' | 'missing' | 'pending' | 'na';
export interface ReadinessCell {
    key: string;
    /** Short label shown in the labelled panel (course code, category, Q ref). */
    code: string;
    /** Full requirement name, for the tooltip and screen readers. */
    name: string;
    state: ReadinessState;
    /** Second line in the labelled panel: "to Mar 2029", "Due in 25d", "Missing". */
    note?: string;
    /** Optional DOM id of the row this cell stands for, so a panel cell can jump to it. */
    targetId?: string;
}
export interface ReadinessGroup {
    key: string;
    label: string;
    cells: ReadinessCell[];
}
export declare const READINESS_LABELS: Record<ReadinessState, string>;
export interface ReadinessCounts {
    total: number;
    valid: number;
    due: number;
    missing: number;
    pending: number;
}
export declare function countReadiness(groups: ReadinessGroup[]): ReadinessCounts;
/** The single worst state across all cells (for a person's cell on a dashboard). */
export declare function worstReadinessState(groups: ReadinessGroup[]): ReadinessState;
export declare function readinessSentence(groups: ReadinessGroup[]): string;
