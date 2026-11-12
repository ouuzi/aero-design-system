import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Spinner } from './Spinner.js';
import { Tooltip } from './Tooltip.js';
import { btn, buttonClass, iconButtonCount, iconButtonDark, iconButtonDot, iconButtonOutline, linkButton, } from './styles.js';
import { cn } from '../lib/utils.js';
const iconSize = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-4 w-4' };
/** Swallows clicks while busy: no handler, no form submit. */
function guardBusy(loading, onClick) {
    if (!loading)
        return onClick;
    return (event) => event.preventDefault();
}
export function Button({ variant = 'secondary', size = 'md', icon: Icon, loading = false, dark = false, type = 'button', className, children, onClick, 'aria-disabled': ariaDisabledProp, ...rest }) {
    const spinnerSize = size === 'sm' ? 14 : 16;
    // No icon: the spinner sits over the label, which stays in place (and in the accessibility
    // tree) at opacity 0, so the button keeps its width and its name.
    const overlay = loading && !Icon;
    return (_jsxs("button", { type: type, "aria-busy": loading || undefined, "aria-disabled": loading || ariaDisabledProp || undefined, onClick: guardBusy(loading, onClick), className: cn(buttonClass(variant, size, dark), loading && 'cursor-progress', overlay && 'relative', className), ...rest, children: [Icon && (loading ? _jsx(Spinner, { decorative: true, size: spinnerSize }) : _jsx(Icon, { className: iconSize[size], "aria-hidden": "true" })), overlay ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "absolute inset-0 flex items-center justify-center", children: _jsx(Spinner, { decorative: true, size: spinnerSize }) }), _jsx("span", { className: "inline-flex items-center gap-1.5 opacity-0", children: children })] })) : (children)] }));
}
const iconButtonVariant = { ghost: btn.icon, outline: iconButtonOutline, danger: btn.iconDanger };
/** The badge as shown ("99+") and as spoken, or null when there is nothing to show. */
function iconBadge(badge, badgeLabel) {
    if (badge === true)
        return { text: null, spoken: badgeLabel ?? 'new' };
    if (typeof badge !== 'number' || badge <= 0)
        return null;
    return { text: badge > 99 ? '99+' : String(badge), spoken: badgeLabel ?? `${badge} new` };
}
export function IconButton({ icon: Icon, label, tooltip, variant = 'ghost', loading = false, badge, badgeLabel, dark = false, type = 'button', className, onClick, 'aria-disabled': ariaDisabledProp, ...rest }) {
    const count = iconBadge(badge, badgeLabel);
    // Tooltip is a client component: the props reach the <button> through it unchanged.
    // The tooltip shows the label alone; the badge is spoken in the name, so asLabel still holds.
    return (_jsx(Tooltip, { content: tooltip === undefined ? label : tooltip, asLabel: tooltip === undefined, children: _jsxs("button", { type: type, "aria-label": count ? `${label}, ${count.spoken}` : label, "aria-busy": loading || undefined, "aria-disabled": loading || ariaDisabledProp || undefined, onClick: guardBusy(loading, onClick), className: cn(dark ? iconButtonDark[variant] : iconButtonVariant[variant], count && 'relative', loading && 'cursor-progress', className), ...rest, children: [loading ? _jsx(Spinner, { decorative: true }) : _jsx(Icon, { className: "h-4 w-4", "aria-hidden": "true" }), count &&
                    (count.text === null ? (_jsx("span", { className: iconButtonDot, "aria-hidden": "true" })) : (_jsx("span", { className: iconButtonCount, "aria-hidden": "true", children: count.text })))] }) }));
}
export function LinkButton({ size = 'md', tone = 'accent', icon: Icon, truncate = false, dark = false, type = 'button', className, children, ...rest }) {
    return (_jsxs("button", { type: type, className: cn(linkButton(size, tone, dark), truncate && 'min-w-0 max-w-full text-left', className), ...rest, children: [Icon && _jsx(Icon, { className: "h-3.5 w-3.5 shrink-0", "aria-hidden": "true" }), truncate ? _jsx("span", { className: "min-w-0 truncate", children: children }) : children] }));
}
