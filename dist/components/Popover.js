'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { motion } from './styles.js';
import { cn } from '../lib/utils.js';
/*
 * Popover (shadcn/ui's popover.tsx on our tokens): a floating white panel anchored to a
 * trigger, rendered in a portal on body. Built on Radix Popover, so it already handles
 * Escape (and marks the event handled, so a ModalShell underneath stays open), click
 * outside, and focus return to the trigger.
 *
 * - Sits above every dialog layer (z-[80]; ModalShell uses 50 / 60 / 70).
 * - Its wrapper carries [data-radix-popper-content-wrapper] and the panel carries
 *   [data-modal-portal], so ModalShell's focus trap leaves focus inside it alone.
 * - Opens with a short fade and zoom (motion.fast, 120ms); closes at once, so focus
 *   returns without a delay. Reduced motion: it simply appears.
 */
function Popover(props) {
    return _jsx(PopoverPrimitive.Root, { "data-slot": "popover", ...props });
}
function PopoverTrigger(props) {
    return _jsx(PopoverPrimitive.Trigger, { "data-slot": "popover-trigger", ...props });
}
function PopoverAnchor(props) {
    return _jsx(PopoverPrimitive.Anchor, { "data-slot": "popover-anchor", ...props });
}
function PopoverContent({ className, align = 'center', sideOffset = 6, ...props }) {
    return (_jsx(PopoverPrimitive.Portal, { children: _jsx(PopoverPrimitive.Content, { "data-slot": "popover-content", "data-modal-portal": "", align: align, sideOffset: sideOffset, className: cn('z-[80] w-72 origin-(--radix-popover-content-transform-origin) rounded-xl border border-line bg-surface p-4 text-13 text-ink shadow-popover outline-none comfortable:text-15', 'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95', motion.fast, 'data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1', className), ...props }) }));
}
export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent };
