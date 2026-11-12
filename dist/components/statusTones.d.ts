import type { StatusTone } from './styles.js';
import type { PersonnelAuthorisationStatus, ReadinessStatus } from '../lib/statusTypes.js';
/** A status as it is shown: its sentence-case word and its tone. Every lookup table below holds these. */
export interface StatusEntry {
    label: string;
    tone: StatusTone;
}
/**
 * Sentence case for a status the tables do not know: an all-caps value is lowered
 * ("ON HOLD" -> "On hold"); mixed case keeps its words (acronyms survive) and only gains a
 * capital first letter. Empty values read "Unknown".
 */
export declare function sentenceCase(value: string | null | undefined): string;
/** Personnel and department readiness. Not Configured cannot be evaluated, so it is neutral, never red. */
export declare const READINESS_TONE: Record<ReadinessStatus, StatusTone>;
/**
 * The words shown for readiness, in sentence case. The stored values (ReadinessStatus) keep
 * their old capitals; screens show these labels, through StatusBadge kind="readiness" or
 * READINESS_LABEL[status] in text ("3 non-compliant" is the label lowered, never a new word).
 */
export declare const READINESS_LABEL: Record<ReadinessStatus, string>;
/** Readiness as `{ label, tone }`, the shape of the other tables. */
export declare const READINESS_STATUS: Record<ReadinessStatus, StatusEntry>;
/**
 * A readiness value written any old way ("Non-compliant", "NOT COMPLIANT", "expiring soon",
 * "Expiring") as its ReadinessStatus; undefined when it is not one.
 */
export declare function normaliseReadinessStatus(value: string | null | undefined): ReadinessStatus | undefined;
/** Readiness `{ label, tone }` for any stored value; unknown values are neutral. */
export declare function readinessStatus(value: string | null | undefined): StatusEntry;
/** Company authorisations. Anything that stops a person exercising the authorisation is danger. */
export declare const AUTH_TONE: Record<PersonnelAuthorisationStatus, StatusTone>;
/** The words shown for an authorisation status: the stored value, in sentence case. */
export declare const AUTH_LABEL: Record<PersonnelAuthorisationStatus, string>;
/** True when `value` is exactly one of the authorisation statuses. */
export declare function isAuthorisationStatus(value: unknown): value is PersonnelAuthorisationStatus;
/**
 * An authorisation status read from a record that may hold a legacy free string: matched
 * ignoring case, spaces, hyphens and underscores ("valid", "EXPIRING_SOON" ->
 * "Expiring Soon"). Returns undefined for anything that is not a known status, so the
 * caller decides what to show (see `authorisationStatusBadge` in StatusBadge.tsx).
 */
export declare function normaliseAuthorisationStatus(value: string | null | undefined): PersonnelAuthorisationStatus | undefined;
/** Tone for an authorisation status that may come from older records as a free string; unknown values are neutral. */
export declare function authTone(status: string | null | undefined): StatusTone;
/** Uploaded evidence documents: the review state, shown with its own name. */
export declare const DOCUMENT_REVIEW_STATUS: Record<'Verified' | 'Pending Verification' | 'Rejected', {
    tone: StatusTone;
    label: string;
}>;
export type FindingIssue = 'Expired' | 'Not completed' | 'Missing' | 'Revoked' | 'Suspended' | 'Lapsed' | 'Pending verification' | 'Scheduled, not yet completed' | 'Expiring' | 'Draft' | 'No position assigned in this department' | 'A required course has no department mapping' | 'No training, document or authorisation requirements apply';
export declare const FINDING_ISSUE_STATUS: Record<FindingIssue, StatusEntry>;
/** A finding's issue as `{ label, tone }`; unknown issues are neutral. */
export declare function findingStatus(issue: string | null | undefined): StatusEntry;
export type AssessmentOutcome = 'Competent' | 'Competent with Limitations / Actions' | 'Deferred - Further Evidence Required' | 'Not Competent' | 'SATISFACTORY' | 'CONDITIONAL / ACTION REQUIRED' | 'NOT SATISFACTORY' | 'NOT ASSESSED';
export declare const ASSESSMENT_OUTCOME_STATUS: Record<AssessmentOutcome, StatusEntry>;
/** An assessment outcome as `{ label, tone }` ("COMPETENT" and "Competent" are one); unknown outcomes are neutral. */
export declare function outcomeStatus(outcome: string | null | undefined): StatusEntry;
export type ActivityLogStatus = 'VERIFIED' | 'COMPLETED' | 'PENDING VERIFICATION' | 'ACTION REQUIRED';
export declare const ACTIVITY_STATUS: Record<ActivityLogStatus, StatusEntry>;
/** An activity log status as `{ label, tone }`; anything else is neutral, its text in sentence case. */
export declare function activityLogStatus(status: string | null | undefined): StatusEntry;
export declare const ALERT_TONE: Record<'critical' | 'warning' | 'info', StatusTone | 'info'>;
