/*
 * Data shapes for the annunciator readiness strip (ReadinessStrip, AnnunciatorPanel,
 * ReadinessSummary, ReadinessCellButton): one cell per requirement, grouped, each lit by its
 * state. How a cell gets its state (compliance evaluation, expiry windows) is the app's own
 * logic: the app builds `ReadinessGroup[]` and passes them in.
 */

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

export const READINESS_LABELS: Record<ReadinessState, string> = {
  valid: 'Valid',
  due: 'Due soon',
  missing: 'Missing, expired or unverified',
  pending: 'Not yet assessed',
  na: 'Not applicable',
};

export interface ReadinessCounts {
  total: number;
  valid: number;
  due: number;
  missing: number;
  pending: number;
}

export function countReadiness(groups: ReadinessGroup[]): ReadinessCounts {
  const cells = groups.flatMap((g) => g.cells).filter((c) => c.state !== 'na');
  return {
    total: cells.length,
    valid: cells.filter((c) => c.state === 'valid').length,
    due: cells.filter((c) => c.state === 'due').length,
    missing: cells.filter((c) => c.state === 'missing').length,
    pending: cells.filter((c) => c.state === 'pending').length,
  };
}

/** The single worst state across all cells (for a person's cell on a dashboard). */
export function worstReadinessState(groups: ReadinessGroup[]): ReadinessState {
  const c = countReadiness(groups);
  if (c.total === 0) return 'na';
  if (c.missing) return 'missing';
  if (c.due) return 'due';
  if (c.pending) return 'pending';
  return 'valid';
}

export function readinessSentence(groups: ReadinessGroup[]): string {
  const c = countReadiness(groups);
  if (c.total === 0) return 'No requirements configured';
  const parts = [`${c.valid} of ${c.total} valid`];
  if (c.due) parts.push(`${c.due} due soon`);
  if (c.missing) parts.push(`${c.missing} missing or expired`);
  if (c.pending) parts.push(`${c.pending} not yet assessed`);
  return parts.join(', ');
}
