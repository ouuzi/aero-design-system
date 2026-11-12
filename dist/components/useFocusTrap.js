'use client';
import { useEffect, useState } from 'react';
/*
 * Focus management for ModalShell (WAI-ARIA dialog pattern).
 *
 * Every open ModalShell registers in one module-level stack, ordered by layer
 * (base < nested < top) and then by opening order, so the last entry is the
 * dialog drawn on top. Only that top-most dialog reacts to Escape and owns the
 * focus trap; when it closes, the dialog beneath it takes over again.
 *
 * - Open: the element that had focus while the dialog rendered is remembered as
 *   the opener. Focus then moves into the dialog: an element a child already
 *   focused (autoFocus) is kept; otherwise the first [data-autofocus] element,
 *   else the first focusable control in the body (not the header close
 *   button), else the dialog panel itself.
 * - Tab / Shift+Tab wrap from the last control to the first and back. If focus
 *   has left the dialog (backdrop click), Tab brings it back in.
 * - Focus that lands on the page behind or in a lower dialog is pulled back to
 *   the last control focused in the top dialog. Content the dialog opens in a
 *   portal (Radix popovers, listboxes, RowMenu menus, [data-modal-portal], or a
 *   separate non-ModalShell dialog) is left alone.
 * - Close: focus returns to the opener if it is still on the page and
 *   focusable. If the opener sat in a dialog that has closed as well (one dialog
 *   replaced by the next), that dialog's opener is used instead. Otherwise focus
 *   goes to the dialog now on top, if any. Nothing moves if
 *   something else has already taken focus (another dialog opening).
 */
export const MODAL_LAYER_RANK = { base: 0, nested: 1, top: 2 };
/** Content outside the panel that belongs to it (portals) or to another kind of dialog. */
const PORTAL_SELECTOR = [
    '[data-radix-popper-content-wrapper]',
    '[role="listbox"]',
    '[role="menu"]',
    '[data-modal-portal]',
    '[role="dialog"]:not([data-modal-shell])',
    '[role="alertdialog"]:not([data-modal-shell])',
].join(', ');
const TABBABLE_SELECTOR = [
    'a[href]',
    'area[href]',
    'button',
    'input',
    'select',
    'textarea',
    'iframe',
    'summary',
    '[tabindex]',
    '[contenteditable]:not([contenteditable="false"])',
].join(', ');
const modalStack = [];
/** Opener of every dialog that has been open, so a dialog opened from a dialog that closed with it can hand focus further back. */
const shellOpeners = new WeakMap();
/** True when the dialog with this id is the top-most open ModalShell. */
export function isTopModal(id) {
    return modalStack[modalStack.length - 1]?.id === id;
}
function isVisible(el) {
    if (el.offsetParent === null && el.getClientRects().length === 0)
        return false;
    return getComputedStyle(el).visibility !== 'hidden';
}
/** Can receive focus from script (tabindex="-1" allowed). */
function canFocus(el) {
    if (!(el instanceof HTMLElement) || !el.isConnected)
        return false;
    if (el === document.body || el === document.documentElement)
        return false;
    if (el.matches(':disabled') || el.closest('[inert]'))
        return false;
    return isVisible(el);
}
/** Reachable with Tab. */
function isTabbable(el) {
    if (el.tabIndex < 0 || el.getAttribute('tabindex') === '-1')
        return false;
    if (el instanceof HTMLInputElement && el.type === 'hidden')
        return false;
    return canFocus(el);
}
/** Tabbable elements inside root, in document order. Radio groups count once, as the browser does. */
function getTabbable(root) {
    const seenRadioGroups = [];
    const result = [];
    for (const el of Array.from(root.querySelectorAll(TABBABLE_SELECTOR))) {
        if (!isTabbable(el))
            continue;
        if (el instanceof HTMLInputElement && el.type === 'radio' && el.name) {
            if (seenRadioGroups.some(([form, name]) => form === el.form && name === el.name))
                continue;
            const group = Array.from(root.querySelectorAll('input[type="radio"]')).filter((r) => r.name === el.name && r.form === el.form && isTabbable(r));
            const checked = group.find((r) => r.checked);
            if (checked && checked !== el)
                continue;
            seenRadioGroups.push([el.form, el.name]);
        }
        result.push(el);
    }
    return result;
}
/** The panel itself is focused without scrolling; controls scroll into view as usual. */
function focusEl(el) {
    el.focus({ preventScroll: el.hasAttribute('data-modal-shell') });
}
/** Initial target: [data-autofocus], else the first control in the body, else the panel. */
function initialTarget(entry) {
    const { panel, header } = entry;
    const marked = panel.querySelector('[data-autofocus]');
    if (marked) {
        if (canFocus(marked))
            return marked;
        const inner = getTabbable(marked)[0];
        if (inner)
            return inner;
    }
    const first = getTabbable(panel).find((el) => !header?.contains(el));
    return first ?? panel;
}
/** Move focus into a dialog: the last control focused there, else its initial target. */
function focusInto(entry) {
    const last = entry.lastFocused;
    if (last && entry.panel.contains(last) && canFocus(last)) {
        focusEl(last);
        return;
    }
    focusEl(initialTarget(entry));
}
function isPortalContent(node) {
    return node instanceof Element && node.closest(PORTAL_SELECTOR) !== null;
}
/**
 * Registers the dialog in the shared stack and manages its focus: initial focus,
 * Tab trap while top-most, and focus return on close. See the comment above.
 */
export function useFocusTrap({ id, layer, panelRef, headerRef, }) {
    // Read while rendering, before any child's autoFocus runs in the commit.
    const [opener] = useState(() => (typeof document === 'undefined' ? null : document.activeElement));
    useEffect(() => {
        const panel = panelRef.current;
        if (!panel)
            return;
        const rank = MODAL_LAYER_RANK[layer];
        shellOpeners.set(panel, opener);
        const entry = { id, rank, panel, header: headerRef.current, lastFocused: null };
        // Insert above every dialog on the same or a lower layer.
        let index = modalStack.length;
        while (index > 0 && modalStack[index - 1].rank > rank)
            index -= 1;
        modalStack.splice(index, 0, entry);
        const active = document.activeElement;
        if (active instanceof HTMLElement && panel.contains(active)) {
            entry.lastFocused = active;
        }
        else if (isTopModal(id)) {
            focusEl(initialTarget(entry));
        }
        const onKeyDown = (e) => {
            if (e.key !== 'Tab' || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey)
                return;
            if (!isTopModal(id))
                return;
            const target = e.target;
            const inside = !!target && panel.contains(target);
            if (!inside && isPortalContent(target))
                return;
            const tabbable = getTabbable(panel);
            if (tabbable.length === 0) {
                e.preventDefault();
                focusEl(panel);
                return;
            }
            const first = tabbable[0];
            const last = tabbable[tabbable.length - 1];
            if (!inside) {
                e.preventDefault();
                focusEl(e.shiftKey ? last : first);
            }
            else if (e.shiftKey && (target === first || target === panel)) {
                e.preventDefault();
                focusEl(last);
            }
            else if (!e.shiftKey && (target === last || target === panel)) {
                e.preventDefault();
                focusEl(first);
            }
        };
        const onFocusIn = (e) => {
            if (!isTopModal(id))
                return;
            const target = e.target;
            if (!(target instanceof HTMLElement))
                return;
            if (panel.contains(target)) {
                entry.lastFocused = target;
                return;
            }
            if (isPortalContent(target))
                return;
            // A ModalShell that is mounting but not registered yet (its child autoFocus fired first).
            const shell = target.closest('[data-modal-shell]');
            if (shell && !modalStack.some((m) => m.panel === shell))
                return;
            focusInto(entry);
        };
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('focusin', onFocusIn);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('focusin', onFocusIn);
            const at = modalStack.indexOf(entry);
            if (at !== -1)
                modalStack.splice(at, 1);
            // After React has removed the dialog: give focus back.
            window.setTimeout(() => {
                if (panel.isConnected)
                    return; // still mounted (effect re-run, Strict Mode)
                const current = document.activeElement;
                if (current && current !== document.body && current.isConnected)
                    return; // focus already placed elsewhere
                const top = modalStack[modalStack.length - 1];
                // Opener gone because it sat in a dialog that closed too (dialog A replaced by dialog B):
                // fall back to that dialog's own opener.
                let target = opener;
                for (let hops = 0; hops < 5 && target && !canFocus(target); hops += 1) {
                    const shell = target.closest('[data-modal-shell]');
                    target = shell instanceof HTMLElement && shell !== panel ? (shellOpeners.get(shell) ?? null) : null;
                }
                if (canFocus(target) && (!top || top.panel.contains(target) || isPortalContent(target))) {
                    target.focus();
                }
                else if (top) {
                    focusInto(top);
                }
            }, 0);
        };
    }, [id, layer, panelRef, headerRef, opener]);
}
