import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { codeChip, labelDot, statusBadgeClass } from './styles.js';
import { AUTH_LABEL, AUTH_TONE, DOCUMENT_REVIEW_STATUS, activityLogStatus, findingStatus, isAuthorisationStatus, normaliseAuthorisationStatus, outcomeStatus, readinessStatus, } from './statusTones.js';
import { cn } from '../lib/utils.js';
import { StatusSymbol } from './StatusSymbol.js';
import { ChipRemoveButton, defaultRemoveLabel } from './Chip.js';
function resolve(props) {
    switch (props.kind) {
        case 'readiness':
            // Typed to the known statuses, but screens cast stored strings: loose spellings are matched, unknown values show neutral.
            return readinessStatus(props.status);
        case 'finding':
            return findingStatus(props.status);
        case 'outcome':
            return outcomeStatus(props.status);
        case 'activity':
            return activityLogStatus(props.status);
        case 'document':
            return DOCUMENT_REVIEW_STATUS[props.status] ?? { tone: 'neutral', label: props.status };
        case 'authorisation':
            // Typed to the known statuses, but older records may still hold a free string: unknown values show neutral.
            return isAuthorisationStatus(props.status)
                ? { tone: AUTH_TONE[props.status], label: AUTH_LABEL[props.status] }
                : { tone: 'neutral', label: props.status || 'Unknown' };
        default:
            return { tone: props.tone, label: props.children };
    }
}
export function StatusBadge(props) {
    const { tone, label } = resolve(props);
    return (_jsxs("span", { className: cn(statusBadgeClass(tone, props.width), props.className), children: [tone === 'neutral' ? (props.dot && _jsx("span", { className: labelDot, "aria-hidden": "true" })) : (_jsx(StatusSymbol, { tone: tone })), label, props.onRemove && _jsx(ChipRemoveButton, { tone: tone, label: props.removeLabel ?? defaultRemoveLabel(label), onRemove: props.onRemove })] }));
}
/**
 * StatusBadge props for an authorisation status read from a record that may hold a legacy
 * free string. A known status (matched ignoring case, spaces, hyphens, underscores) gets
 * the mapped badge; anything else a neutral badge with the raw text (or `fallbackLabel`).
 *
 *   <StatusBadge {...authorisationStatusBadge(a.status)} dot />
 */
export function authorisationStatusBadge(value, fallbackLabel = 'Unknown') {
    const status = normaliseAuthorisationStatus(value);
    return status ? { kind: 'authorisation', status } : { tone: 'neutral', children: value?.trim() || fallbackLabel };
}
/** Regulator and record codes (B1.1, AES-CM-07, TRN-002): a quiet grey chip, never a status colour. */
export function CodeChip({ className, children }) {
    return _jsx("span", { className: cn(codeChip, className), children: children });
}
