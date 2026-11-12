'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { LinkButton } from './Button.js';
import { noticeIcon, noticeIconTone } from './Notice.js';
import { metaLine } from './styles.js';
import { cn } from '../lib/utils.js';
export function AlertList({ label, limit, onViewAll, className, children }) {
    const [expanded, setExpanded] = useState(false);
    const rows = React.Children.toArray(children).filter(Boolean);
    const clipped = limit !== undefined && rows.length > limit && !expanded;
    const shown = clipped ? rows.slice(0, limit) : rows;
    const canFold = limit !== undefined && rows.length > limit && expanded;
    return (_jsxs("div", { className: className, children: [_jsx("ul", { "aria-label": label, className: "divide-y divide-line", children: shown }), (clipped || canFold) && (_jsx("div", { className: "border-t border-line px-4 py-2", children: clipped ? (_jsxs(LinkButton, { size: "sm", onClick: onViewAll ?? (() => setExpanded(true)), children: ["View all (", rows.length, ")"] })) : (_jsx(LinkButton, { size: "sm", tone: "muted", onClick: () => setExpanded(false), children: "Show fewer" })) }))] }));
}
/** Said before the title, because the colour and the icon are not read out. */
const toneWord = { danger: 'Critical', warning: 'Warning', info: 'Note', success: 'Done', neutral: '' };
export function AlertRow({ tone, icon, title, meta, action, className }) {
    const Icon = icon ?? noticeIcon[tone];
    return (_jsxs("li", { className: cn('flex items-start gap-3 bg-surface px-4 py-3 comfortable:py-4', className), children: [_jsx(Icon, { className: cn('mt-0.5 h-4 w-4 shrink-0', noticeIconTone[tone]), "aria-hidden": "true" }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("p", { className: "text-13 font-semibold text-ink comfortable:text-15", children: [toneWord[tone] && _jsxs("span", { className: "sr-only", children: [toneWord[tone], ": "] }), title] }), meta && _jsx("div", { className: cn(metaLine, 'mt-0.5'), children: meta })] }), action && _jsx("div", { className: "flex shrink-0 items-center self-center", children: action })] }));
}
