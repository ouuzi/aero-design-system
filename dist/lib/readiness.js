/*
 * Data shapes for the annunciator readiness strip (ReadinessStrip, AnnunciatorPanel,
 * ReadinessSummary, ReadinessCellButton): one cell per requirement, grouped, each lit by its
 * state. How a cell gets its state (compliance evaluation, expiry windows) is the app's own
 * logic: the app builds `ReadinessGroup[]` and passes them in.
 */
export const READINESS_LABELS = {
    valid: 'Valid',
    due: 'Due soon',
    missing: 'Missing, expired or unverified',
    pending: 'Not yet assessed',
    na: 'Not applicable',
};
export function countReadiness(groups) {
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
export function worstReadinessState(groups) {
    const c = countReadiness(groups);
    if (c.total === 0)
        return 'na';
    if (c.missing)
        return 'missing';
    if (c.due)
        return 'due';
    if (c.pending)
        return 'pending';
    return 'valid';
}
export function readinessSentence(groups) {
    const c = countReadiness(groups);
    if (c.total === 0)
        return 'No requirements configured';
    const parts = [`${c.valid} of ${c.total} valid`];
    if (c.due)
        parts.push(`${c.due} due soon`);
    if (c.missing)
        parts.push(`${c.missing} missing or expired`);
    if (c.pending)
        parts.push(`${c.pending} not yet assessed`);
    return parts.join(', ');
}
