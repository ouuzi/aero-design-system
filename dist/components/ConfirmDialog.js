'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button.js';
import ModalShell from './ModalShell.js';
import { Notice } from './Notice.js';
/* Portals need document.body: false on the server and during hydration, true after. */
const subscribeNothing = () => () => { };
const onClient = () => true;
const onServer = () => false;
export function ConfirmDialog({ open = true, title, body, children, confirmLabel = 'Confirm', cancelLabel = 'Cancel', tone = 'default', onConfirm, onCancel, busy = false, error, eyebrow, layer = 'top', }) {
    const bodyId = useId();
    const mounted = useSyncExternalStore(subscribeNothing, onClient, onServer);
    const [pending, setPending] = useState(false);
    const working = busy || pending;
    const hasBody = body !== undefined && body !== null && body !== false && body !== '';
    const handleConfirm = async () => {
        if (working)
            return;
        const result = onConfirm();
        if (!result || typeof result.then !== 'function')
            return;
        setPending(true);
        try {
            await result;
        }
        catch (err) {
            console.error('ConfirmDialog: the confirmed action failed', err);
        }
        finally {
            setPending(false);
        }
    };
    if (!open || !mounted)
        return null;
    const danger = tone === 'danger';
    return createPortal(_jsx(ModalShell, { placement: "center", size: "sm", role: "alertdialog", "aria-describedby": hasBody ? bodyId : undefined, layer: layer, title: title, eyebrow: eyebrow, onClose: onCancel, closeDisabled: working, footer: _jsxs(_Fragment, { children: [_jsx(Button, { variant: "secondary", onClick: onCancel, disabled: working, "data-autofocus": danger ? '' : undefined, children: cancelLabel }), _jsx(Button, { variant: danger ? 'danger' : 'primary', onClick: () => void handleConfirm(), loading: working, "data-autofocus": danger ? undefined : '', children: confirmLabel })] }), children: _jsxs("div", { className: "space-y-3", children: [hasBody && (_jsx("div", { id: bodyId, className: "space-y-2 text-13 text-ink-2 comfortable:text-15", children: body })), children, error && (_jsx(Notice, { tone: "danger", compact: true, live: true, children: error }))] }) }), document.body);
}
/**
 * Promise-based confirmation, a drop-in for `window.confirm` in an event handler. Render
 * `dialog` once in the component; `confirm(request)` opens it and resolves true (confirmed)
 * or false (cancelled, replaced by another request, or the component unmounted). The dialog
 * closes as soon as it is answered, so the action runs after it; for an action that should
 * show progress inside the dialog, use <ConfirmDialog busy> directly.
 */
export function useConfirmDialog() {
    const [request, setRequest] = useState(null);
    const resolveRef = useRef(null);
    const settle = useCallback((confirmed) => {
        const resolve = resolveRef.current;
        resolveRef.current = null;
        setRequest(null);
        resolve?.(confirmed);
    }, []);
    const confirm = useCallback((next) => {
        resolveRef.current?.(false);
        return new Promise((resolve) => {
            resolveRef.current = resolve;
            setRequest(next);
        });
    }, []);
    // An unanswered request resolves false when the component goes away.
    useEffect(() => () => {
        resolveRef.current?.(false);
        resolveRef.current = null;
    }, []);
    const dialog = request ? _jsx(ConfirmDialog, { ...request, onConfirm: () => settle(true), onCancel: () => settle(false) }) : null;
    return { confirm, dialog };
}
export default ConfirmDialog;
