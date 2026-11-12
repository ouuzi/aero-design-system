import React from 'react';
interface EvidenceFieldProps {
    /** Number of linked records. */
    count: number;
    /** Main text: the record's title when one is linked. */
    title?: string;
    /** Secondary text: certificate or record reference(s). */
    detail?: string;
    onOpen: () => void;
    onClear?: () => void;
    placeholder?: string;
    id?: string;
}
export default function EvidenceField({ count, title, detail, onOpen, onClear, placeholder, id, }: EvidenceFieldProps): React.JSX.Element;
export interface LinkedEvidenceRow {
    key: string;
    title: string;
    code?: string;
    completed?: string;
    due?: string;
    status?: string;
}
/** The records behind a multi-linked requirement: a quiet nested list under the row. */
export declare function LinkedEvidenceList({ rows, formatDate }: {
    rows: LinkedEvidenceRow[];
    formatDate: (d: string) => string;
}): React.JSX.Element;
export {};
