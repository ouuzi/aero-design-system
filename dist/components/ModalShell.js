'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useId, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { btn, input, motion } from './styles.js';
import { isTopModal, useFocusTrap } from './useFocusTrap.js';
import { cn } from '../lib/utils.js';
/** Centred dialog: maximum width per size. */
const SIZE_CLASSES = {
    sm: 'max-w-[480px]',
    md: 'max-w-[640px]',
    lg: 'max-w-[896px]',
    xl: 'max-w-[1280px]',
};
/** Side sheet: width per size from the sm breakpoint up (full width below; max-w-full caps it on narrow screens). */
const SHEET_SIZE_CLASSES = {
    sm: 'sm:w-[480px]',
    md: 'sm:w-[640px]',
    lg: 'sm:w-[896px]',
    xl: 'sm:w-[min(1280px,96vw)]',
};
const LAYER_CLASSES = {
    base: 'z-50',
    nested: 'z-[60]',
    top: 'z-[70]',
};
/** Footer for rawBody content: surface, ruled on top. */
export const modalFooterClass = 'shrink-0 border-t border-line bg-surface px-6 py-4 flex flex-wrap items-center justify-between gap-3';
export default function ModalShell({ onClose, title, subtitle, eyebrow, headerAside, headerExtra, footer, footerStart, children, size = 'md', placement = 'sheet', layer = 'base', bodyClassName, className = '', closeDisabled = false, closeLabel = 'Close', closeOnBackdrop, onBackdropClose, closeOnEscape = true, formProps, rawBody = false, printable = false, id: dialogId, role = 'dialog', 'aria-describedby': describedBy, }) {
    const id = useId();
    const titleId = `${dialogId ?? id}-title`;
    const isSheet = placement === 'sheet';
    const onCloseRef = useRef(onClose);
    const closeDisabledRef = useRef(closeDisabled);
    const closeOnEscapeRef = useRef(closeOnEscape);
    useEffect(() => {
        onCloseRef.current = onClose;
        closeDisabledRef.current = closeDisabled;
        closeOnEscapeRef.current = closeOnEscape;
    });
    const panelRef = useRef(null);
    // A click on the backdrop while a list, menu or popover is open closes that, not the dialog.
    const floatingOpenRef = useRef(false);
    const headerRef = useRef(null);
    // Registers this dialog in the shared stack (top-most check below) and manages focus.
    useFocusTrap({ id, layer, panelRef, headerRef });
    useEffect(() => {
        const onKey = (e) => {
            if (e.key !== 'Escape' || e.defaultPrevented || !closeOnEscapeRef.current)
                return;
            if (!isTopModal(id) || closeDisabledRef.current)
                return;
            // Mark the Escape handled: a dialog beneath whose listener runs later in this same
            // dispatch (a parent mounted in the same commit as its nested dialog) then ignores it.
            e.preventDefault();
            e.stopPropagation();
            onCloseRef.current();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [id]);
    /*
     * Scroll hairlines (centred only): `above` once the body has scrolled away from the
     * top, `below` while more content sits under the fold, `scrollable` while the body
     * overflows at all. Measured in scroll and ResizeObserver callbacks (the observer
     * reports once on observe, which gives the first measurement).
     */
    const bodyRef = useRef(null);
    const [edges, setEdges] = useState({ above: false, below: false, scrollable: false });
    const hasForm = !!formProps;
    useEffect(() => {
        const body = bodyRef.current;
        if (!body || isSheet || typeof ResizeObserver === 'undefined')
            return;
        const update = () => {
            const overflow = body.scrollHeight - body.clientHeight;
            const next = {
                above: body.scrollTop > 1,
                below: overflow - body.scrollTop > 1,
                scrollable: overflow > 1,
            };
            setEdges((prev) => prev.above === next.above && prev.below === next.below && prev.scrollable === next.scrollable ? prev : next);
        };
        // The body and each direct child are observed, so content growing inside the body is noticed too.
        const resizeObserver = new ResizeObserver(update);
        const observeAll = () => {
            resizeObserver.disconnect();
            resizeObserver.observe(body);
            Array.from(body.children).forEach((child) => resizeObserver.observe(child));
        };
        observeAll();
        const mutationObserver = new MutationObserver(observeAll);
        mutationObserver.observe(body, { childList: true });
        body.addEventListener('scroll', update, { passive: true });
        return () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            body.removeEventListener('scroll', update);
        };
    }, [isSheet, rawBody, hasForm]);
    const hasFooter = !!(footer || footerStart);
    const footerFrame = isSheet
        ? modalFooterClass
        : cn('shrink-0 bg-surface px-6 pb-6 flex flex-wrap items-center justify-between gap-3 border-t', edges.below ? 'border-line' : 'border-transparent', edges.scrollable ? 'pt-4' : 'pt-0');
    const content = rawBody ? (_jsx("div", { className: "flex-1 min-h-0 flex flex-col", children: children })) : (_jsxs(_Fragment, { children: [_jsx("div", { ref: bodyRef, className: cn('flex-1 min-h-0 overflow-y-auto custom-scrollbar', printable && 'print:overflow-visible', bodyClassName ?? (isSheet ? 'px-6 py-6' : 'px-6 pt-4 pb-6')), children: children }), hasFooter && (_jsxs("div", { className: cn(footerFrame, printable && 'print:hidden'), children: [_jsx("div", { className: "flex items-center gap-2 min-w-0", children: footerStart }), _jsx("div", { className: "flex flex-wrap items-center justify-end gap-2 ml-auto", children: footer })] }))] }));
    const headerFrame = isSheet
        ? 'px-6 py-5 border-b border-line'
        : cn('px-6 pt-6 pb-2 border-b', edges.above ? 'border-line' : 'border-transparent');
    return (_jsx("div", { className: cn('fixed inset-0 bg-scrim animate-in fade-in', LAYER_CLASSES[layer], isSheet ? motion.slow : cn('flex items-center justify-center p-3 sm:p-4', motion.base), printable && 'print:static print:block print:p-0 print:bg-white print:animate-none print:transition-none'), onPointerDownCapture: () => {
            // Read before the floating panel reacts to the same press and closes itself.
            floatingOpenRef.current = document.querySelector('[data-slot="popover-content"][data-state="open"], [role="menu"]') !== null;
        }, onMouseDown: (e) => {
            const dismissable = closeOnBackdrop ?? role !== 'alertdialog';
            if (floatingOpenRef.current)
                return;
            if (dismissable && !closeDisabled && e.target === e.currentTarget)
                (onBackdropClose ?? onClose)();
        }, children: _jsxs("div", { ref: panelRef, id: dialogId, role: role, "aria-modal": "true", "aria-labelledby": titleId, "aria-describedby": describedBy, tabIndex: -1, "data-modal-shell": "", "data-placement": placement, className: cn('flex flex-col overflow-hidden outline-none bg-surface shadow-modal', isSheet
                ? cn('fixed inset-y-0 right-0 w-full max-w-full animate-in slide-in-from-right', motion.slow, SHEET_SIZE_CLASSES[size])
                : cn('w-full max-h-[94vh] rounded-2xl animate-in zoom-in-95', motion.base, SIZE_CLASSES[size]), printable &&
                'print:static print:block print:w-full print:max-w-none print:max-h-none print:h-auto print:overflow-visible print:rounded-none print:shadow-none print:animate-none print:transition-none', className), children: [_jsxs("div", { ref: headerRef, className: cn('shrink-0', headerFrame, printable && 'print:hidden'), children: [_jsxs("div", { className: "flex flex-wrap items-start gap-x-4 gap-y-3", children: [_jsxs("div", { className: "order-1 min-w-0 flex-1", children: [eyebrow && _jsx("div", { className: "mb-1 flex flex-wrap items-center gap-2 text-12 font-medium text-muted", children: eyebrow }), _jsx("h3", { id: titleId, className: "text-18 font-semibold leading-snug tracking-tight text-ink break-words sm:truncate", children: title }), subtitle && _jsx("div", { className: "mt-1 text-13 text-muted", children: subtitle })] }), headerAside && (_jsx("div", { className: "order-3 flex w-full flex-wrap items-center gap-2 sm:order-2 sm:w-auto sm:shrink-0", children: headerAside })), _jsx("button", { type: "button", onClick: onClose, disabled: closeDisabled, "aria-label": closeLabel, className: cn(btn.icon, 'order-2 -mr-2 -mt-1 shrink-0 sm:order-3'), children: _jsx(X, { className: "w-5 h-5" }) })] }), headerExtra && _jsx("div", { className: "mt-3", children: headerExtra })] }), formProps ? (_jsx("form", { ...formProps, className: cn('flex-1 min-h-0 flex flex-col', formProps.className), children: content })) : (content)] }) }));
}
/* Shared control styles for modal content (aliases of components/ui/styles). */
export const modalInputClass = input;
export const modalButton = btn;
