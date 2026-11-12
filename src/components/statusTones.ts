import type { StatusTone } from './styles.js';
import type { PersonnelAuthorisationStatus, ReadinessStatus } from '../lib/statusTypes.js';

/*
 * One colour per status, everywhere. Screens must look a status up here instead of
 * writing their own ternary, so "Lapsed" or "Not Configured" can never be red on one
 * page and grey on the next. Green, amber and red only ever mean status.
 *
 * Each table maps the value as it is stored to `{ label, tone }`: the label is the one word
 * screens show for it, in sentence case, so a state has one name everywhere ("Non-compliant",
 * never "Not compliant" or "NON-COMPLIANT"). StatusBadge `kind` reads these tables.
 */

/** A status as it is shown: its sentence-case word and its tone. Every lookup table below holds these. */
export interface StatusEntry {
  label: string;
  tone: StatusTone;
}

/*
 * Matching a stored value to a table key ignores case, spaces, hyphens, underscores, commas
 * and slashes, so "PENDING VERIFICATION", "pending_verification" and "Pending verification"
 * are one status.
 */
const statusKey = (value: string) => value.toLowerCase().replace(/[\s_,/-]+/g, '');

/** `table[key]` for the table's own keys only, so "constructor" or "toString" never match. */
function own<V>(table: Record<string, V>, key: string): V | undefined {
  return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : undefined;
}

function lookup<K extends string>(table: Record<K, StatusEntry>, value: string | null | undefined): StatusEntry | undefined {
  if (!value) return undefined;
  const exact = own<StatusEntry>(table, value);
  if (exact) return exact;
  const key = statusKey(value);
  const match = (Object.keys(table) as K[]).find((k) => statusKey(k) === key);
  return match ? table[match] : undefined;
}

/**
 * Sentence case for a status the tables do not know: an all-caps value is lowered
 * ("ON HOLD" -> "On hold"); mixed case keeps its words (acronyms survive) and only gains a
 * capital first letter. Empty values read "Unknown".
 */
export function sentenceCase(value: string | null | undefined): string {
  const text = (value ?? '').trim().replace(/[_\s]+/g, ' ');
  if (!text) return 'Unknown';
  const lowered = /[a-z]/.test(text) ? text : text.toLowerCase();
  return lowered.charAt(0).toUpperCase() + lowered.slice(1);
}

/** Anything a table does not know: neutral, never a problem colour, its text in sentence case. */
const unknownStatus = (value: string | null | undefined): StatusEntry => ({ label: sentenceCase(value), tone: 'neutral' });

/** Personnel and department readiness. Not Configured cannot be evaluated, so it is neutral, never red. */
export const READINESS_TONE: Record<ReadinessStatus, StatusTone> = {
  Compliant: 'success',
  'Expiring Soon': 'warning',
  'Non-Compliant': 'danger',
  'Not Configured': 'neutral',
};

/**
 * The words shown for readiness, in sentence case. The stored values (ReadinessStatus) keep
 * their old capitals; screens show these labels, through StatusBadge kind="readiness" or
 * READINESS_LABEL[status] in text ("3 non-compliant" is the label lowered, never a new word).
 */
export const READINESS_LABEL: Record<ReadinessStatus, string> = {
  Compliant: 'Compliant',
  'Expiring Soon': 'Expiring soon',
  'Non-Compliant': 'Non-compliant',
  'Not Configured': 'Not configured',
};

/** Readiness as `{ label, tone }`, the shape of the other tables. */
export const READINESS_STATUS: Record<ReadinessStatus, StatusEntry> = {
  Compliant: { label: READINESS_LABEL.Compliant, tone: READINESS_TONE.Compliant },
  'Expiring Soon': { label: READINESS_LABEL['Expiring Soon'], tone: READINESS_TONE['Expiring Soon'] },
  'Non-Compliant': { label: READINESS_LABEL['Non-Compliant'], tone: READINESS_TONE['Non-Compliant'] },
  'Not Configured': { label: READINESS_LABEL['Not Configured'], tone: READINESS_TONE['Not Configured'] },
};

/** Old names for a readiness state, read from records and older screens. */
const READINESS_ALIASES: Record<string, ReadinessStatus> = {
  notcompliant: 'Non-Compliant',
  expiring: 'Expiring Soon',
};

/**
 * A readiness value written any old way ("Non-compliant", "NOT COMPLIANT", "expiring soon",
 * "Expiring") as its ReadinessStatus; undefined when it is not one.
 */
export function normaliseReadinessStatus(value: string | null | undefined): ReadinessStatus | undefined {
  if (!value) return undefined;
  const key = statusKey(value);
  const match = (Object.keys(READINESS_TONE) as ReadinessStatus[]).find((status) => statusKey(status) === key);
  return match ?? own(READINESS_ALIASES, key);
}

/** Readiness `{ label, tone }` for any stored value; unknown values are neutral. */
export function readinessStatus(value: string | null | undefined): StatusEntry {
  const known = normaliseReadinessStatus(value);
  return known ? READINESS_STATUS[known] : unknownStatus(value);
}

/** Company authorisations. Anything that stops a person exercising the authorisation is danger. */
export const AUTH_TONE: Record<PersonnelAuthorisationStatus, StatusTone> = {
  Draft: 'neutral',
  Issued: 'success',
  Valid: 'success',
  'Expiring Soon': 'warning',
  Expired: 'danger',
  Lapsed: 'danger',
  Suspended: 'danger',
  Revoked: 'danger',
};

/** The words shown for an authorisation status: the stored value, in sentence case. */
export const AUTH_LABEL: Record<PersonnelAuthorisationStatus, string> = {
  Draft: 'Draft',
  Issued: 'Issued',
  Valid: 'Valid',
  'Expiring Soon': 'Expiring soon',
  Expired: 'Expired',
  Lapsed: 'Lapsed',
  Suspended: 'Suspended',
  Revoked: 'Revoked',
};

const AUTH_STATUSES = Object.keys(AUTH_TONE) as PersonnelAuthorisationStatus[];

/** True when `value` is exactly one of the authorisation statuses. */
export function isAuthorisationStatus(value: unknown): value is PersonnelAuthorisationStatus {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(AUTH_TONE, value);
}

/**
 * An authorisation status read from a record that may hold a legacy free string: matched
 * ignoring case, spaces, hyphens and underscores ("valid", "EXPIRING_SOON" ->
 * "Expiring Soon"). Returns undefined for anything that is not a known status, so the
 * caller decides what to show (see `authorisationStatusBadge` in StatusBadge.tsx).
 */
export function normaliseAuthorisationStatus(value: string | null | undefined): PersonnelAuthorisationStatus | undefined {
  if (!value) return undefined;
  if (isAuthorisationStatus(value)) return value;
  const key = value.toLowerCase().replace(/[\s_-]+/g, '');
  return AUTH_STATUSES.find((status) => status.toLowerCase().replace(/[\s_-]+/g, '') === key);
}

/** Tone for an authorisation status that may come from older records as a free string; unknown values are neutral. */
export function authTone(status: string | null | undefined): StatusTone {
  const known = normaliseAuthorisationStatus(status);
  return known ? AUTH_TONE[known] : 'neutral';
}

/** Uploaded evidence documents: the review state, shown with its own name. */
export const DOCUMENT_REVIEW_STATUS: Record<'Verified' | 'Pending Verification' | 'Rejected', { tone: StatusTone; label: string }> = {
  Verified: { tone: 'success', label: 'Verified' },
  'Pending Verification': { tone: 'warning', label: 'Pending' },
  Rejected: { tone: 'danger', label: 'Rejected' },
};

/*
 * Compliance findings (lib/complianceOverview.ts, the `issue` of a ComplianceFinding): what
 * is wrong with one requirement for one person. Something that stops the person working is
 * danger; something on its way to being done (booked, uploaded and waiting for a check) is
 * warning, like a requirement that is still valid but expiring; a draft or a setup gap is
 * neutral, because nothing has failed yet.
 */
export type FindingIssue =
  | 'Expired'
  | 'Not completed'
  | 'Missing'
  | 'Revoked'
  | 'Suspended'
  | 'Lapsed'
  | 'Pending verification'
  | 'Scheduled, not yet completed'
  | 'Expiring'
  | 'Draft'
  | 'No position assigned in this department'
  | 'A required course has no department mapping'
  | 'No training, document or authorisation requirements apply';

export const FINDING_ISSUE_STATUS: Record<FindingIssue, StatusEntry> = {
  Expired: { label: 'Expired', tone: 'danger' },
  'Not completed': { label: 'Not completed', tone: 'danger' },
  Missing: { label: 'Missing', tone: 'danger' },
  Revoked: { label: 'Revoked', tone: 'danger' },
  Suspended: { label: 'Suspended', tone: 'danger' },
  Lapsed: { label: 'Lapsed', tone: 'danger' },
  'Pending verification': { label: 'Pending verification', tone: 'warning' },
  'Scheduled, not yet completed': { label: 'Scheduled, not yet completed', tone: 'warning' },
  Expiring: { label: 'Expiring soon', tone: 'warning' },
  Draft: { label: 'Draft', tone: 'neutral' },
  'No position assigned in this department': { label: 'No position assigned in this department', tone: 'neutral' },
  'A required course has no department mapping': { label: 'A required course has no department mapping', tone: 'neutral' },
  'No training, document or authorisation requirements apply': {
    label: 'No training, document or authorisation requirements apply',
    tone: 'neutral',
  },
};

/** A finding's issue as `{ label, tone }`; unknown issues are neutral. */
export function findingStatus(issue: string | null | undefined): StatusEntry {
  return lookup(FINDING_ISSUE_STATUS, issue) ?? unknownStatus(issue);
}

/*
 * Competency assessment outcomes: the final decision of an AES-CM-07 assessment
 * (FINAL_DECISION_OPTIONS in lib/competencyCatalog.ts, CompetencyAssessmentRecord.finalDecision),
 * the authorisation record's evaluation outcome ('COMPETENT', 'NOT COMPETENT') and the
 * form's suggested outcome (section 4). Deferred is a status, never a category Badge: it is
 * amber because the person is not yet cleared and something is owed.
 */
export type AssessmentOutcome =
  | 'Competent'
  | 'Competent with Limitations / Actions'
  | 'Deferred - Further Evidence Required'
  | 'Not Competent'
  | 'SATISFACTORY'
  | 'CONDITIONAL / ACTION REQUIRED'
  | 'NOT SATISFACTORY'
  | 'NOT ASSESSED';

export const ASSESSMENT_OUTCOME_STATUS: Record<AssessmentOutcome, StatusEntry> = {
  Competent: { label: 'Competent', tone: 'success' },
  'Competent with Limitations / Actions': { label: 'Competent with limitations or actions', tone: 'warning' },
  'Deferred - Further Evidence Required': { label: 'Deferred, further evidence required', tone: 'warning' },
  'Not Competent': { label: 'Not competent', tone: 'danger' },
  SATISFACTORY: { label: 'Satisfactory', tone: 'success' },
  'CONDITIONAL / ACTION REQUIRED': { label: 'Conditional, action required', tone: 'warning' },
  'NOT SATISFACTORY': { label: 'Not satisfactory', tone: 'danger' },
  'NOT ASSESSED': { label: 'Not assessed', tone: 'neutral' },
};

/** Old and short names for an outcome, read from records and filters. */
const OUTCOME_ALIASES: Record<string, AssessmentOutcome> = {
  deferred: 'Deferred - Further Evidence Required',
  furtherevidencerequired: 'Deferred - Further Evidence Required',
  competentwithlimitations: 'Competent with Limitations / Actions',
  competentwithactions: 'Competent with Limitations / Actions',
};

/** An assessment outcome as `{ label, tone }` ("COMPETENT" and "Competent" are one); unknown outcomes are neutral. */
export function outcomeStatus(outcome: string | null | undefined): StatusEntry {
  const alias = outcome ? own(OUTCOME_ALIASES, statusKey(outcome)) : undefined;
  return lookup(ASSESSMENT_OUTCOME_STATUS, alias ?? outcome) ?? unknownStatus(outcome);
}

/*
 * Activity log statuses (ActivityLog.status), stored in capitals. Shown in sentence case
 * like every other status: the capitals are a storage format, never a look.
 */
export type ActivityLogStatus = 'VERIFIED' | 'COMPLETED' | 'PENDING VERIFICATION' | 'ACTION REQUIRED';

export const ACTIVITY_STATUS: Record<ActivityLogStatus, StatusEntry> = {
  VERIFIED: { label: 'Verified', tone: 'success' },
  COMPLETED: { label: 'Completed', tone: 'success' },
  'PENDING VERIFICATION': { label: 'Pending verification', tone: 'warning' },
  'ACTION REQUIRED': { label: 'Action required', tone: 'danger' },
};

/** An activity log status as `{ label, tone }`; anything else is neutral, its text in sentence case. */
export function activityLogStatus(status: string | null | undefined): StatusEntry {
  return lookup(ACTIVITY_STATUS, status) ?? unknownStatus(status);
}

/*
 * Alerts (UrgentAlert.type) in an AlertList: the tone of the row's icon. Info is guidance,
 * so it takes the info icon colour, never a status pill.
 */
export const ALERT_TONE: Record<'critical' | 'warning' | 'info', StatusTone | 'info'> = {
  critical: 'danger',
  warning: 'warning',
  info: 'info',
};
