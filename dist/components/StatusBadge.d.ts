import React from 'react';
import { type StatusBadgeWidth, type StatusTone } from './styles.js';
import { DOCUMENT_REVIEW_STATUS } from './statusTones.js';
import type { PersonnelAuthorisationStatus, ReadinessStatus } from '../lib/statusTypes.js';
interface StatusBadgeCommon {
    /** Leading dot for a neutral status; status colours show their symbol instead. */
    dot?: boolean;
    /** `auto` (default) an inline pill; `column` the 120px pill of a Status column. */
    width?: StatusBadgeWidth;
    /** Adds a × button (a picked value that can be taken out again, as on a Chip). */
    onRemove?: () => void;
    /** The remove button's accessible name. Default "Remove <label>" for plain text. */
    removeLabel?: string;
    className?: string;
}
type MappedStatus = {
    kind: 'readiness';
    status: ReadinessStatus;
} | {
    kind: 'authorisation';
    status: PersonnelAuthorisationStatus;
} | {
    kind: 'document';
    status: keyof typeof DOCUMENT_REVIEW_STATUS;
} | {
    kind: 'finding' | 'outcome' | 'activity';
    status: string | null | undefined;
};
type DirectStatus = {
    kind?: never;
    status?: never;
    tone: StatusTone;
    children: React.ReactNode;
};
export type StatusBadgeProps = StatusBadgeCommon & ((MappedStatus & {
    tone?: never;
    children?: never;
}) | DirectStatus);
export declare function StatusBadge(props: StatusBadgeProps): React.JSX.Element;
/**
 * StatusBadge props for an authorisation status read from a record that may hold a legacy
 * free string. A known status (matched ignoring case, spaces, hyphens, underscores) gets
 * the mapped badge; anything else a neutral badge with the raw text (or `fallbackLabel`).
 *
 *   <StatusBadge {...authorisationStatusBadge(a.status)} dot />
 */
export declare function authorisationStatusBadge(value: string | null | undefined, fallbackLabel?: string): StatusBadgeProps;
/** Regulator and record codes (B1.1, AES-CM-07, TRN-002): a quiet grey chip, never a status colour. */
export declare function CodeChip({ className, children }: {
    className?: string;
    children: React.ReactNode;
}): React.JSX.Element;
export {};
