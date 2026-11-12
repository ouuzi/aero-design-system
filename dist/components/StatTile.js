import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { focusRing, statLabel, statTile, statTileCompact, statValue, statValueCompact } from './styles.js';
import { cn } from '../lib/utils.js';
const alertClass = { danger: 'text-danger', warning: 'text-warning' };
const iconToneClass = {
    muted: 'text-muted',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
};
export function StatTile({ label, value, unit, detail, icon: Icon, iconTone = 'muted', alert, compact = false, onClick, pressed, className, }) {
    const numeric = typeof value === 'number' ? value : Number(value);
    const showAlert = alert && Number.isFinite(numeric) && numeric > 0;
    const body = (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsx("span", { className: compact ? 'text-12 font-medium text-ink-2 comfortable:text-13' : statLabel, children: label }), Icon && _jsx(Icon, { className: cn(compact ? 'h-4 w-4' : 'h-5 w-5', 'shrink-0', iconToneClass[iconTone]), "aria-hidden": "true" })] }), _jsxs("div", { className: cn('flex items-baseline gap-2', compact ? 'mt-2' : 'mt-4'), children: [_jsx("span", { className: cn(compact ? statValueCompact : statValue, showAlert ? alertClass[alert] : 'text-ink'), children: value }), unit && _jsx("span", { className: "text-13 font-medium text-muted comfortable:text-15", children: unit })] }), detail && _jsx("p", { className: "mt-2 text-12 text-muted comfortable:text-13", children: detail })] }));
    const frame = cn(compact ? statTileCompact : statTile, className);
    if (!onClick)
        return _jsx("div", { className: frame, children: body });
    return (_jsx("button", { type: "button", onClick: onClick, "aria-pressed": pressed, className: cn(frame, 'flex w-full flex-col text-left transition-colors hover:border-line-strong', focusRing, pressed && 'border-line-strong'), children: body }));
}
