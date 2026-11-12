import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { ArrowRight, CircleCheck, Lock, Pencil, Plus } from 'lucide-react';
import Badge from './Badge.js';
import { StatusBadge } from './StatusBadge.js';
import { cn } from '../lib/utils.js';
const NODE = {
    edit: { icon: Pencil, className: 'border border-line bg-surface text-muted' },
    sign: { icon: Lock, className: 'bg-brand text-on-solid' },
    status: { icon: CircleCheck, className: 'border border-info-line bg-info-bg text-info' },
    create: { icon: Plus, className: 'border border-line bg-surface text-muted' },
};
function Node({ kind }) {
    const node = kind ? NODE[kind] : undefined;
    if (!node) {
        return (_jsx("span", { className: "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-surface", "aria-hidden": "true", children: _jsx("span", { className: "h-2 w-2 rounded-full bg-line-strong" }) }));
    }
    const Icon = node.icon;
    return (_jsx("span", { className: cn('relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full', node.className), "aria-hidden": "true", children: _jsx(Icon, { className: "h-3.5 w-3.5", strokeWidth: 2 }) }));
}
function Meta({ event }) {
    const parts = [];
    if (event.by)
        parts.push(event.by);
    if (event.role)
        parts.push(event.role);
    if (event.authNo)
        parts.push(_jsx("span", { className: "tabular-nums", children: event.authNo }));
    if (event.at) {
        parts.push(_jsx("time", { dateTime: event.at, className: "tabular-nums", children: event.atLabel ?? event.at }));
    }
    else if (event.atLabel) {
        parts.push(_jsx("span", { className: "tabular-nums", children: event.atLabel }));
    }
    if (parts.length === 0)
        return null;
    return (_jsx("p", { className: "mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-12 text-muted comfortable:text-13", children: parts.map((part, i) => (_jsxs(React.Fragment, { children: [i > 0 && (_jsxs(_Fragment, { children: [_jsx("span", { "aria-hidden": "true", children: "\u00B7" }), _jsx("span", { className: "sr-only", children: ", " })] })), _jsx("span", { children: part })] }, i))) }));
}
function Changes({ changes }) {
    return (_jsx("ul", { className: "mt-2 space-y-1.5 rounded-lg border border-line bg-surface px-3 py-2.5 text-13 comfortable:text-15", children: changes.map((change, i) => (_jsxs("li", { className: "flex flex-wrap items-center gap-x-2 gap-y-0.5", children: [_jsx("span", { className: "mr-2 text-ink-2", children: change.field }), change.from !== undefined && change.from !== null && (_jsxs(_Fragment, { children: [_jsxs("del", { className: "text-muted line-through tabular-nums", children: [_jsx("span", { className: "sr-only", children: "Previous value: " }), change.from] }), _jsx(ArrowRight, { className: "h-3.5 w-3.5 shrink-0 text-muted", "aria-hidden": "true" })] })), _jsxs("ins", { className: "font-medium text-ink no-underline tabular-nums", children: [_jsx("span", { className: "sr-only", children: "New value: " }), change.to] })] }, i))) }));
}
function Signature({ signature }) {
    return (_jsxs("p", { className: "mt-2 inline-flex max-w-full flex-wrap items-center gap-x-1.5 gap-y-0.5 rounded-md border border-line bg-surface px-2 py-1 text-11 text-ink-2 comfortable:text-12", children: [_jsx(Lock, { className: "h-3 w-3 shrink-0 text-muted", "aria-hidden": "true" }), _jsx("span", { children: signature.meaning }), signature.hash && _jsx("span", { className: "text-muted tabular-nums", children: 'SHA-256 ' + signature.hash })] }));
}
export function HistoryTimeline({ events, label }) {
    return (_jsx("ol", { "aria-label": label, className: "relative", children: events.map((event, i) => {
            const last = i === events.length - 1;
            return (_jsxs("li", { className: cn('relative flex gap-3', !last && 'pb-6'), children: [!last && _jsx("span", { className: "absolute left-3.5 top-7 bottom-0 w-px -translate-x-1/2 bg-line", "aria-hidden": "true" }), _jsx(Node, { kind: event.kind }), _jsxs("div", { className: "min-w-0 flex-1 pt-1", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-x-2 gap-y-1", children: [_jsx("span", { className: "text-14 font-semibold text-ink comfortable:text-16", children: event.action }), event.status && _jsx(StatusBadge, { tone: event.status.tone, children: event.status.label }), event.badge && _jsx(Badge, { tone: event.badge.tone, children: event.badge.label })] }), _jsx(Meta, { event: event }), event.changes && event.changes.length > 0 && _jsx(Changes, { changes: event.changes }), event.reason && (_jsxs("p", { className: "mt-2 text-12 text-ink-2 comfortable:text-13", children: [_jsx("span", { className: "font-semibold text-ink", children: "Reason:" }), " ", event.reason] })), event.signature && (_jsx("div", { children: _jsx(Signature, { signature: event.signature }) }))] })] }, event.id ?? i));
        }) }));
}
export default HistoryTimeline;
