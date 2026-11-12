import React from 'react';
import type { CategoryTone, StatusTone } from './styles.js';
export interface HistoryEvent {
    id?: string;
    kind?: 'create' | 'edit' | 'sign' | 'status';
    /** Sentence case: "Authorisation issued", "Expiry date corrected". */
    action: React.ReactNode;
    by?: string;
    role?: string;
    authNo?: string;
    /** ISO timestamp in UTC. */
    at?: string;
    /** "06 Nov 2026 09:30 UTC". */
    atLabel?: string;
    /** `from` is struck through, never deleted. */
    changes?: {
        field: React.ReactNode;
        from?: React.ReactNode;
        to: React.ReactNode;
    }[];
    /** Required for any change to a signed record. */
    reason?: React.ReactNode;
    signature?: {
        meaning: React.ReactNode;
        hash?: string;
    };
    /** The state the record moved to ("Issued", "Suspended"): a StatusBadge after the action. */
    status?: {
        tone: StatusTone;
        label: React.ReactNode;
    };
    /** A category or count beside the action ("Correction", "2 fields"): a Badge. */
    badge?: {
        tone: CategoryTone;
        label: React.ReactNode;
    };
}
export interface HistoryTimelineProps {
    /** Newest first. */
    events: HistoryEvent[];
    label?: string;
}
export declare function HistoryTimeline({ events, label }: HistoryTimelineProps): React.JSX.Element;
export default HistoryTimeline;
