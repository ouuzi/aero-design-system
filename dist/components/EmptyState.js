import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Inbox } from 'lucide-react';
import { emptyStateDetail, emptyStateFrame, emptyStateIcon, emptyStateTitle } from './styles.js';
import { cn } from '../lib/utils.js';
/*
 * What a table, list or panel shows when it has nothing to show: an icon tile, a
 * title that says what is missing, one line of why, and the next step if the
 * person can take it. Use `size="sm"` inside dense panels and modals. LoadingState (in
 * Spinner.tsx) is its busy twin and shares the same frame recipes.
 */
export default function EmptyState({ title, children, icon: Icon = Inbox, action, size = 'md', className = '', }) {
    const sm = size === 'sm';
    return (_jsxs("div", { className: cn(emptyStateFrame(size), className), children: [_jsx("span", { className: cn(emptyStateIcon(size), 'rounded-xl bg-subtle-2 text-muted'), "aria-hidden": "true", children: _jsx(Icon, { className: sm ? 'h-4 w-4' : 'h-5 w-5' }) }), _jsx("p", { className: cn(emptyStateTitle(size), 'text-ink'), children: title }), children && _jsx("div", { className: cn(emptyStateDetail, 'text-muted'), children: children }), action && _jsx("div", { className: "mt-4 flex justify-center", children: action })] }));
}
