import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, IconButton } from './Button.js';
import { pageWindow } from './pageWindow.js';
import { cn } from '../lib/utils.js';
export function Pagination({ page, pageSize, total, onPageChange, label = 'records', className }) {
    const pageCount = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
    const current = Math.min(Math.max(1, page), pageCount);
    const first = total === 0 ? 0 : (current - 1) * pageSize + 1;
    const last = Math.min(current * pageSize, total);
    return (_jsxs("div", { className: cn('flex flex-wrap items-center justify-between gap-3 text-13 text-ink-2 comfortable:text-15', className), children: [_jsx("p", { className: "tabular-nums", children: total === 0 ? `No ${label}` : `Showing ${first} to ${last} of ${total} ${label}` }), pageCount > 1 && (_jsxs("nav", { "aria-label": "Pagination", className: "flex items-center gap-1", children: [_jsx(IconButton, { icon: ChevronLeft, variant: "outline", label: "Previous page", disabled: current === 1, onClick: () => onPageChange(current - 1) }), pageWindow(current, pageCount).map((p, i) => p === 'gap' ? (_jsx("span", { className: "px-1 text-muted", "aria-hidden": "true", children: "\u2026" }, `gap-${i}`)) : (_jsx(Button, { size: "sm", variant: p === current ? 'primary' : 'secondary', "aria-current": p === current ? 'page' : undefined, "aria-label": `Page ${p}`, onClick: () => onPageChange(p), className: "min-w-control-sm px-2 tabular-nums", children: p }, p))), _jsx(IconButton, { icon: ChevronRight, variant: "outline", label: "Next page", disabled: current === pageCount, onClick: () => onPageChange(current + 1) })] }))] }));
}
