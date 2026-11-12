'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown, Paperclip, Layers, X } from 'lucide-react';
import { selectSmBase, codeChip } from './styles.js';
import { StatusBadge } from './StatusBadge.js';
import { IconButton } from './Button.js';
import { Tooltip } from './Tooltip.js';
export default function EvidenceField({ count, title, detail, onOpen, onClear, placeholder = 'Link evidence', id, }) {
    const Icon = count > 1 ? Layers : Paperclip;
    const summary = count === 0
        ? placeholder
        : count === 1
            ? title || detail || '1 record'
            : `${count} records`;
    const secondary = count === 0 ? undefined : count === 1 ? (title ? detail : undefined) : detail;
    return (_jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [_jsx(Tooltip, { content: [summary, secondary].filter(Boolean).join(' · '), asLabel: true, children: _jsxs("button", { type: "button", id: id, onClick: onOpen, "aria-haspopup": "dialog", className: `${selectSmBase} relative flex w-full min-w-0 items-center gap-2 pr-8 text-left`, children: [_jsx(Icon, { className: `h-3.5 w-3.5 shrink-0 ${count ? 'text-ink-2' : 'text-muted'}`, "aria-hidden": true }), _jsx("span", { className: `truncate ${count ? 'text-ink' : 'text-muted font-normal'}`, children: summary }), secondary && _jsx("span", { className: "truncate font-normal text-muted tabular-nums", children: secondary }), _jsx(ChevronDown, { className: "absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted", "aria-hidden": true })] }) }), count > 0 && onClear && _jsx(IconButton, { icon: X, label: "Clear evidence", variant: "danger", onClick: onClear, className: "shrink-0" })] }));
}
/** The records behind a multi-linked requirement: a quiet nested list under the row. */
export function LinkedEvidenceList({ rows, formatDate }) {
    const tone = (s = 'Valid') => /expir|overdue|invalid|missing/i.test(s) ? 'danger' : /due|soon|pending/i.test(s) ? 'warning' : 'success';
    return (_jsxs("div", { children: [_jsxs("p", { className: "mb-1.5 text-12 font-semibold text-ink-2 comfortable:text-13", children: ["Linked records (", rows.length, ")"] }), _jsx("ul", { className: "divide-y divide-line rounded-lg border border-line bg-surface", children: rows.map((r) => (_jsxs("li", { className: "flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 text-12 comfortable:py-3 comfortable:text-13", children: [r.code && _jsx("span", { className: codeChip, children: r.code }), _jsx("span", { className: "min-w-0 flex-1 truncate text-ink", title: r.title, children: r.title }), _jsx("span", { className: "whitespace-nowrap text-muted tabular-nums", children: r.completed ? `Completed ${formatDate(r.completed)}` : 'Completion date not recorded' }), _jsx("span", { className: "whitespace-nowrap text-muted tabular-nums", children: r.due ? `Due ${formatDate(r.due)}` : 'Does not expire' }), _jsx(StatusBadge, { tone: tone(r.status), children: r.status || 'Valid' })] }, r.key))) })] }));
}
