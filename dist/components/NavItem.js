'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import Badge from './Badge.js';
import { countAlert, focusRing, navGroupLabel, navItem } from './styles.js';
import { cn } from '../lib/utils.js';
export function NavItem({ icon: Icon, active = false, badge, badgeTone = 'neutral', badgeLabel, type = 'button', className, children, ...rest }) {
    const showBadge = badge !== undefined && badge !== 0 && badge !== '';
    return (_jsxs("button", { type: type, "aria-current": active ? 'page' : undefined, className: cn(navItem(active), className), ...rest, children: [Icon && _jsx(Icon, { className: cn('h-4 w-4 shrink-0', active ? 'text-brand' : 'text-muted'), "aria-hidden": "true" }), _jsx("span", { className: "min-w-0 flex-1 truncate", children: children }), showBadge && (_jsxs(_Fragment, { children: [badgeTone === 'alert' ? (_jsx("span", { className: countAlert, "aria-hidden": "true", children: badge })) : (_jsx("span", { "aria-hidden": "true", children: _jsx(Badge, { children: badge }) })), _jsxs("span", { className: "sr-only", children: [", ", badgeLabel ?? badge] })] }))] }));
}
export function NavList({ label, 'aria-label': ariaLabel, as = 'nav', className, children }) {
    const labelId = React.useId();
    const Tag = as;
    return (_jsxs(Tag, { className: className, "aria-labelledby": label ? labelId : undefined, "aria-label": label ? undefined : ariaLabel, children: [label && (_jsx("p", { id: labelId, className: navGroupLabel, children: label })), _jsx("ul", { className: "space-y-0.5", children: React.Children.map(children, (child) => (child ? _jsx("li", { children: child }) : null)) })] }));
}
/** The app's name at the top of the sidebar: a button that goes to the home page. */
export function NavBrand({ logo, name, type = 'button', className, ...rest }) {
    return (_jsxs("button", { type: type, className: cn('flex w-full min-w-0 items-center gap-2.5 rounded-lg px-2 text-left cursor-pointer', focusRing, className), ...rest, children: [_jsx("span", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand text-on-solid", "aria-hidden": "true", children: logo }), _jsx("span", { className: "truncate text-14 font-semibold leading-tight tracking-tight text-ink comfortable:text-16", children: name })] }));
}
