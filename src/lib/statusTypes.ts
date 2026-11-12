/*
 * The stored status values the kit's status tables understand (StatusBadge `kind`,
 * statusTones.ts). They are plain string unions so an app keeps its own records and logic:
 * an app whose types hold the same strings passes its values straight in.
 */

/** Personnel or department readiness, as a compliance evaluation stores it. */
export type ReadinessStatus = 'Compliant' | 'Expiring Soon' | 'Non-Compliant' | 'Not Configured';

/** A company authorisation's status, as stored. */
export type PersonnelAuthorisationStatus =
  | 'Draft'
  | 'Issued'
  | 'Valid'
  | 'Expiring Soon'
  | 'Expired'
  | 'Lapsed'
  | 'Suspended'
  | 'Revoked';
