'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { tooltipPanel } from './styles.js';
import { cn } from '../lib/utils.js';
/*
 * Tooltip: a short hint for a control, on the same white surface as Popover and menus
 * (hairline border, shadow-popover). Built on Radix Tooltip (the vendor of Popover), so:
 *
 * - Opens on hover after a short delay, and at once on keyboard focus. Moving from one
 *   trigger to the next within 300ms skips the delay.
 * - Focus only opens it when the focus is visible (keyboard, or a script after keyboard
 *   use). A mouse click, or focus handed back to an opener when a dialog closes after a
 *   click, does not pop a tooltip.
 * - Escape closes it and marks the event handled, so a ModalShell underneath stays open.
 *   Clicking the trigger closes it too. Touch never opens it: a tooltip is a hint, so
 *   nothing a touch user needs may live only in one.
 * - The pointer can move onto the tooltip without it closing (WCAG 1.4.13, hoverable).
 * - Screen readers: the trigger gets aria-describedby pointing at a hidden role="tooltip"
 *   copy of the content while open. With `asLabel` (the tooltip only repeats the
 *   trigger's accessible name, as on IconButton) that link is left off, so the name is
 *   not read twice.
 *
 * Layering: z-[110], above dialogs (50 / 60 / 70), Popover (80) and RowMenu (100). The
 * content is not focusable, and its wrapper carries [data-radix-popper-content-wrapper],
 * so ModalShell's focus trap ignores it.
 *
 * Motion: a quick fade and zoom (motion.fast, 120ms) when it opens after the hover delay;
 * no animation when it opens at once (focus, or skipping between triggers) and none on
 * close. prefers-reduced-motion switches the animation off (app/globals.css).
 *
 * Density: 12px text, 13px under comfortable, with a little more padding.
 *
 * Mount <TooltipProvider> once near the root (components/Providers.tsx) so every tooltip
 * shares one delay and skip-delay. A Tooltip rendered outside a provider (a test, a portal
 * outside the app tree) falls back to its own, so it never throws.
 */
/** Hover delay before a tooltip opens, ms. Radix defaults to 700, which reads as broken. */
const TOOLTIP_DELAY_MS = 400;
/** Window after one tooltip closes in which the next opens with no delay, ms. */
const TOOLTIP_SKIP_DELAY_MS = 300;
/** Gap between the trigger and the tooltip, px. */
const TOOLTIP_OFFSET_PX = 6;
/** Minimum distance kept from the viewport edge when the tooltip flips or shifts, px. */
const TOOLTIP_COLLISION_PADDING_PX = 8;
/** True inside a <TooltipProvider>, so a Tooltip knows whether to supply its own. */
const InsideTooltipProvider = React.createContext(false);
/**
 * Shares one hover delay and skip-delay window across every Tooltip below it. Mount once,
 * near the root of the client tree (components/Providers.tsx).
 */
export function TooltipProvider({ children, delayDuration = TOOLTIP_DELAY_MS, skipDelayDuration = TOOLTIP_SKIP_DELAY_MS, }) {
    return (_jsx(InsideTooltipProvider.Provider, { value: true, children: _jsx(TooltipPrimitive.Provider, { delayDuration: delayDuration, skipDelayDuration: skipDelayDuration, children: children }) }));
}
/** Opens on focus only when the focus is visible: not after a click, nor on a focus return that follows one. */
function suppressPointerFocus(event) {
    let visible = true;
    try {
        visible = event.currentTarget.matches(':focus-visible');
    }
    catch {
        // A browser without :focus-visible: keep Radix's own rule (no open after a pointer press).
    }
    // Radix composes its own onFocus after ours and skips it when the event is marked handled.
    if (!visible)
        event.preventDefault();
}
/**
 * A short hint on hover and keyboard focus.
 *
 * ```tsx
 * <Tooltip content="Authorisation form (AES-PA-01) as PDF">
 *   <Button size="sm" icon={FileText}>PDF</Button>
 * </Tooltip>
 * ```
 */
export function Tooltip({ content, children, side = 'top', align = 'center', asLabel = false, delayDuration, disabled = false, open, defaultOpen, onOpenChange, className, }) {
    const insideProvider = React.useContext(InsideTooltipProvider);
    // Always controlled, so `disabled` can hold it shut without swapping the element tree
    // (which would remount the trigger and lose its focus) or switching Radix between
    // controlled and uncontrolled.
    const [innerOpen, setInnerOpen] = React.useState(defaultOpen ?? false);
    const isOpen = !disabled && (open ?? innerOpen);
    const handleOpenChange = (next) => {
        if (disabled && next)
            return;
        if (open === undefined)
            setInnerOpen(next);
        onOpenChange?.(next);
    };
    // No content at all: the child alone (a static choice at the call site, so the tree is stable).
    if (content == null || content === false || content === '')
        return children;
    const tooltip = (_jsxs(TooltipPrimitive.Root, { open: isOpen, onOpenChange: handleOpenChange, delayDuration: delayDuration, children: [_jsx(TooltipPrimitive.Trigger, { asChild: true, onFocus: suppressPointerFocus, ...(asLabel ? { 'aria-describedby': undefined } : null), children: children }), _jsx(TooltipPrimitive.Portal, { children: _jsx(TooltipPrimitive.Content, { "data-slot": "tooltip-content", side: side, align: align, sideOffset: TOOLTIP_OFFSET_PX, collisionPadding: TOOLTIP_COLLISION_PADDING_PX, className: cn(tooltipPanel, className), children: content }) })] }));
    if (insideProvider)
        return tooltip;
    return (_jsx(TooltipPrimitive.Provider, { delayDuration: TOOLTIP_DELAY_MS, skipDelayDuration: TOOLTIP_SKIP_DELAY_MS, children: tooltip }));
}
