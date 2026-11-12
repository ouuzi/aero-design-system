import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LoaderCircle } from 'lucide-react';
import { emptyStateDetail, emptyStateFrame, emptyStateIcon, emptyStateTitle } from './styles.js';
import { cn } from '../lib/utils.js';
const spinnerSize = { 12: 'h-3 w-3', 14: 'h-3.5 w-3.5', 16: 'h-4 w-4', 20: 'h-5 w-5' };
const spinnerTone = { current: 'text-current', muted: 'text-muted', accent: 'text-accent' };
/** The bare turning ring, sized and coloured; always hidden from assistive technology. */
function spinnerRingClass(size, tone) {
    return `${spinnerSize[size]} ${spinnerTone[tone]} shrink-0 animate-spin`;
}
/**
 * A turning ring that says "working on it".
 *
 *   <Spinner />                                    // 16px, "Loading" for screen readers
 *   <Spinner size={20} tone="accent" label="Loading records" />
 *   <Spinner tone="muted">Scanning 3 files…</Spinner>
 *   <Spinner decorative />                         // inside a busy button or row
 *   <Spinner decorative size={12} />               // inside a Badge
 */
export function Spinner({ size = 16, tone = 'current', label = 'Loading', children, decorative = false, className }) {
    const ring = _jsx(LoaderCircle, { className: spinnerRingClass(size, tone), "aria-hidden": "true", focusable: "false" });
    if (decorative) {
        if (children == null)
            return _jsx(LoaderCircle, { className: cn(spinnerRingClass(size, tone), className), "aria-hidden": "true", focusable: "false" });
        return (_jsxs("span", { className: cn('inline-flex items-center gap-1.5', className), children: [ring, children] }));
    }
    return (_jsxs("span", { role: "status", className: cn('inline-flex items-center gap-1.5', className), children: [ring, children ?? _jsx("span", { className: "sr-only", children: label })] }));
}
/**
 * A region that is waiting for its content: the busy twin of EmptyState, with the same
 * width, spacing and type, so a panel does not jump when it goes from loading to empty.
 * The whole block is one polite live region; its title is what gets announced.
 *
 *   {isLoading ? <LoadingState title="Loading document">Checking record ownership</LoadingState> : <Viewer />}
 */
export function LoadingState({ title, children, size = 'md', surface = 'light', className }) {
    const sm = size === 'sm';
    const dark = surface === 'dark';
    const frameSize = sm ? 'sm' : 'md';
    return (_jsxs("div", { role: "status", className: cn(emptyStateFrame(frameSize), className), children: [_jsx("span", { className: emptyStateIcon(frameSize), "aria-hidden": "true", children: _jsx(LoaderCircle, { className: cn(spinnerRingClass(20, 'accent'), dark && 'text-accent-soft'), "aria-hidden": "true", focusable: "false" }) }), _jsx("p", { className: cn(emptyStateTitle(frameSize), dark ? 'text-white' : 'text-ink'), children: title }), children && _jsx("div", { className: cn(emptyStateDetail, dark ? 'text-viewer-muted' : 'text-muted'), children: children })] }));
}
