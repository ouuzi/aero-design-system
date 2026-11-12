'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/*
 * Toasts: a short message about something that just happened ("Course saved", "Could not
 * delete the record"), shown at the bottom right over everything else and gone again on its
 * own. Mount <ToastProvider> once (components/Providers.tsx); anywhere below it,
 *
 *   const { toast } = useToast();
 *   toast({ tone: 'success', title: 'Course saved' });
 *   toast({ tone: 'danger', title: 'Could not delete TRN-002', description: 'Check your access and try again.' });
 *
 * - Surface: the popover family (white, hairline, shadow-popover, radius xl), the tone's
 *   icon in its colour (the Notice icons), a 13px semibold title, an optional 12px line, an
 *   optional `action` (a LinkButton; choosing it closes the toast) and a close button.
 * - Timing: success, info and neutral close after 5 seconds; warning and danger stay until
 *   closed. `duration` (ms, or null to stay) overrides it. The timer pauses while the pointer
 *   is over the stack or focus is inside it, and resumes with the time that was left.
 * - Screen readers: two live regions that stay mounted, so every toast is announced. Danger
 *   goes to the assertive one (role="alert"), everything else to the polite one
 *   (role="status").
 * - Stack: newest at the bottom, at most four (the oldest goes first). Layer z-[90]: above
 *   dialogs (50 / 60 / 70) and Popover (80), under RowMenu (100) and Tooltip (110). The stack
 *   carries [data-modal-portal], so a ModalShell's focus trap lets focus reach its buttons.
 * - Motion: a quick slide up and fade (motion.fast), none under reduced motion.
 *
 * A toast reports; it never asks. Something the person must decide is a ConfirmDialog, and an
 * error that belongs to a form field or a dialog stays a Notice there.
 */
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { IconButton, LinkButton } from './Button.js';
import { noticeIcon, noticeIconTone } from './Notice.js';
import { toastPanel, toastViewport } from './styles.js';
import { cn } from '../lib/utils.js';
/** Auto-close time for success, info and neutral, ms. */
export const TOAST_DURATION_MS = 5000;
/** Toasts on screen at once; a fifth pushes out the oldest. */
const MAX_TOASTS = 4;
const ToastContext = React.createContext(null);
/** The toast functions. Needs a <ToastProvider> above (components/Providers.tsx). */
export function useToast() {
    const api = useContext(ToastContext);
    if (!api)
        throw new Error('useToast() needs a <ToastProvider> above it (components/Providers.tsx).');
    return api;
}
let nextId = 0;
const subscribeNothing = () => () => { };
/** Holds the toasts and draws their stack. Mount once, near the root of the client tree. */
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const [paused, setPaused] = useState(false);
    // The stack portals to <body>, which exists only in the browser: render it after hydration.
    const mounted = useSyncExternalStore(subscribeNothing, () => true, () => false);
    const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);
    const toast = useCallback((options) => {
        const id = `toast-${++nextId}`;
        const tone = options.tone ?? 'success';
        const stays = tone === 'danger' || tone === 'warning';
        const duration = options.duration === undefined ? (stays ? null : TOAST_DURATION_MS) : options.duration;
        setToasts((list) => [...list, { ...options, id, tone, duration }].slice(-MAX_TOASTS));
        return id;
    }, []);
    const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);
    const renderList = (list) => list.map((t) => _jsx(ToastItem, { entry: t, paused: paused, onDismiss: dismiss }, t.id));
    return (_jsxs(ToastContext.Provider, { value: api, children: [children, mounted &&
                createPortal(_jsxs("section", { "aria-label": "Messages", "data-modal-portal": "", className: toastViewport, onMouseEnter: () => setPaused(true), onMouseLeave: () => setPaused(false), onFocus: () => setPaused(true), onBlur: (e) => {
                        if (!e.currentTarget.contains(e.relatedTarget))
                            setPaused(false);
                    }, children: [_jsx("div", { role: "alert", className: "flex flex-col gap-2", children: renderList(toasts.filter((t) => t.tone === 'danger')) }), _jsx("div", { role: "status", className: "flex flex-col gap-2", children: renderList(toasts.filter((t) => t.tone !== 'danger')) })] }), document.body)] }));
}
function ToastItem({ entry, paused, onDismiss }) {
    const remaining = useRef(entry.duration ?? 0);
    useEffect(() => {
        if (entry.duration === null || paused)
            return;
        const started = Date.now();
        const timer = window.setTimeout(() => onDismiss(entry.id), remaining.current);
        return () => {
            window.clearTimeout(timer);
            remaining.current = Math.max(0, remaining.current - (Date.now() - started));
        };
    }, [entry.duration, entry.id, paused, onDismiss]);
    const Icon = noticeIcon[entry.tone];
    return (_jsxs("div", { className: toastPanel, children: [_jsx(Icon, { className: cn('mt-0.5 h-4 w-4 shrink-0', noticeIconTone[entry.tone]), "aria-hidden": "true" }), _jsxs("div", { className: "min-w-0 flex-1 py-0.5", children: [_jsx("p", { className: "font-semibold text-ink", children: entry.title }), entry.description && _jsx("p", { className: "mt-0.5 text-12 text-ink-2 comfortable:text-13", children: entry.description }), entry.action && (_jsx(LinkButton, { className: "mt-1", onClick: () => {
                            onDismiss(entry.id);
                            entry.action?.onClick();
                        }, children: entry.action.label }))] }), _jsx(IconButton, { icon: X, label: "Dismiss message", onClick: () => onDismiss(entry.id), className: "-my-1 shrink-0" })] }));
}
