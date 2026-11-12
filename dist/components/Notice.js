import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertOctagon, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '../lib/utils.js';
const toneFrame = {
    info: 'bg-info-bg border-info-line',
    success: 'bg-success-bg border-success-line',
    warning: 'bg-warning-bg border-warning-line',
    danger: 'bg-danger-bg border-danger-line',
    neutral: 'bg-subtle border-line',
};
/** Icon colour per tone; shared with AlertRow. */
export const noticeIconTone = {
    info: 'text-info',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
    neutral: 'text-muted',
};
/** Icon per tone; shared with AlertRow. */
export const noticeIcon = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    danger: AlertOctagon,
    neutral: Info,
};
export function Notice({ tone = 'info', title, icon, action, compact = false, live = false, className, children }) {
    const Icon = icon === null ? null : icon ?? noticeIcon[tone];
    return (_jsxs("div", { role: live ? (tone === 'danger' || tone === 'warning' ? 'alert' : 'status') : undefined, className: cn('flex flex-wrap gap-3 rounded-lg border text-13 text-ink sm:flex-nowrap', children ? 'items-start' : 'items-center', compact ? 'px-3 py-2' : 'px-4 py-3', toneFrame[tone], className), children: [Icon && _jsx(Icon, { className: cn('h-4 w-4 shrink-0', children && 'mt-0.5', noticeIconTone[tone]), "aria-hidden": "true" }), _jsxs("div", { className: "min-w-0 flex-1", children: [title && _jsx("p", { className: "font-semibold text-ink", children: title }), children && _jsx("div", { className: cn('text-12 text-ink-2', title && 'mt-0.5'), children: children })] }), action && _jsx("div", { className: cn('shrink-0 basis-full sm:basis-auto', Icon && 'pl-7 sm:pl-0'), children: action })] }));
}
