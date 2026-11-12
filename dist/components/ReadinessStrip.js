'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { READINESS_LABELS, countReadiness, readinessSentence, } from '../lib/readiness.js';
import { focusRing } from './styles.js';
import { Tooltip } from './Tooltip.js';
import { cn } from '../lib/utils.js';
export const readinessCellClass = {
    valid: 'bg-success',
    due: 'bg-warning-fill',
    missing: 'bg-danger annunciator-hatch',
    pending: 'bg-surface ring-1 ring-inset ring-line-strong',
    na: 'bg-subtle-2',
};
const litClass = {
    valid: 'bg-success-bg text-success ring-success-line',
    due: 'bg-warning-bg text-warning ring-warning-line',
    missing: 'bg-danger-bg text-danger ring-danger-line annunciator-hatch-soft',
    pending: 'bg-surface text-ink-2 ring-line-strong',
    na: 'bg-subtle text-muted ring-line',
};
function cellTitle(c) {
    return `${c.name}: ${READINESS_LABELS[c.state]}${c.note && c.note !== READINESS_LABELS[c.state] ? ` (${c.note})` : ''}`;
}
/** Compact strip: one small cell per requirement, groups separated by a gap. */
export function ReadinessStrip({ groups, size = 'md', className = '' }) {
    const dims = size === 'sm' ? 'h-3 w-2' : 'h-4 w-2.5';
    if (groups.length === 0)
        return _jsx("span", { className: "text-12 text-muted comfortable:text-13", children: "No requirements configured" });
    return (_jsx("div", { className: `flex flex-wrap items-center gap-x-2 gap-y-1 ${className}`, role: "img", "aria-label": `Readiness: ${readinessSentence(groups)}`, children: groups.map((g) => (_jsx("span", { className: "flex items-center gap-1", title: g.label, children: g.cells.map((c) => (_jsx("span", { className: `${dims} shrink-0 rounded-[2px] ${readinessCellClass[c.state]}`, title: cellTitle(c) }, c.key))) }, g.key))) }));
}
/** One readiness cell that is a button: 24px square, lit in its state's colour. */
export function ReadinessCellButton({ state, label, onSelect, className }) {
    return (_jsx(Tooltip, { content: label, asLabel: true, children: _jsx("button", { type: "button", "aria-label": label, onClick: onSelect, className: cn('size-6 shrink-0 rounded-sm cursor-pointer transition-transform hover:scale-110', focusRing, readinessCellClass[state], className) }) }));
}
/** "10/13 valid, 1 due, 1 missing" */
export function ReadinessSummary({ groups, className = '' }) {
    const n = countReadiness(groups);
    if (n.total === 0)
        return null;
    return (_jsxs("span", { className: `text-12 text-ink-2 tabular-nums whitespace-nowrap comfortable:text-13 ${className}`, children: [_jsx("strong", { className: "font-semibold text-ink", children: n.valid }), "/", n.total, " valid", n.due > 0 && _jsxs("span", { className: "font-medium text-warning", children: [", ", n.due, " due"] }), n.missing > 0 && _jsxs("span", { className: "font-medium text-danger", children: [", ", n.missing, " missing"] }), n.pending > 0 && _jsxs("span", { className: "text-muted", children: [", ", n.pending, " not assessed"] })] }));
}
/** Labelled annunciator: cells you can read across a room. Cells with a targetId scroll to their row. */
export function AnnunciatorPanel({ groups, onSelect }) {
    return (_jsx("div", { className: "grid gap-4 md:grid-cols-3", children: groups.map((g) => (_jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "mb-2 text-12 font-semibold text-ink-2 comfortable:text-13", children: g.label }), g.cells.length === 0 ? (_jsx("p", { className: "text-12 text-muted comfortable:text-13", children: "None required" })) : (_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-1.5", children: g.cells.map((c) => {
                        const content = (_jsxs(_Fragment, { children: [_jsx("span", { className: "block truncate text-12 font-semibold leading-tight comfortable:text-13", children: c.code }), _jsx("span", { className: "block truncate text-11 font-normal leading-tight comfortable:text-12", children: c.note || READINESS_LABELS[c.state] })] }));
                        const cls = `flex h-12 min-w-0 flex-col justify-center rounded-md px-2 text-left ring-1 ring-inset comfortable:h-14 ${litClass[c.state]}`;
                        return onSelect ? (_jsx(Tooltip, { content: cellTitle(c), asLabel: true, children: _jsx("button", { type: "button", "aria-label": cellTitle(c), onClick: () => onSelect(c), className: cn(cls, 'min-h-6 cursor-pointer transition-shadow hover:shadow-xs', focusRing), children: content }) }, c.key)) : (_jsx("div", { title: cellTitle(c), className: cls, children: content }, c.key));
                    }) }))] }, g.key))) }));
}
export function ReadinessLegend({ states = ['valid', 'due', 'missing', 'pending'] }) {
    return (_jsx("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-1 text-12 text-ink-2 comfortable:text-13", children: states.map((s) => (_jsxs("span", { className: "inline-flex items-center gap-1.5", children: [_jsx("span", { className: `h-3 w-2 rounded-[2px] ${readinessCellClass[s]}`, "aria-hidden": true }), READINESS_LABELS[s]] }, s))) }));
}
