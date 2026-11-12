import * as React from 'react';
export interface TooltipProviderProps {
    children: React.ReactNode;
    /** Hover delay before a tooltip opens, in ms. Default 400. Keyboard focus always opens at once. */
    delayDuration?: number;
    /** After a tooltip closes, how long the next one opens without the delay, in ms. Default 300. */
    skipDelayDuration?: number;
}
/**
 * Shares one hover delay and skip-delay window across every Tooltip below it. Mount once,
 * near the root of the client tree (components/Providers.tsx).
 */
export declare function TooltipProvider({ children, delayDuration, skipDelayDuration, }: TooltipProviderProps): React.JSX.Element;
export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';
export type TooltipAlign = 'start' | 'center' | 'end';
export interface TooltipProps {
    /**
     * The hint: a few words in sentence case, no full stop ("Download as PDF"). Plain text is
     * best; inline formatting is fine, but nothing interactive (no links or buttons), since a
     * tooltip cannot take focus. Empty (null, undefined, false or '') renders the child alone.
     */
    content: React.ReactNode;
    /**
     * The trigger: ONE element that can take focus and accepts a ref and event props (a
     * native <button> or <a>, Button, IconButton, LinkButton). Its handlers are kept and
     * composed with the tooltip's.
     *
     * A disabled <button> fires no pointer or focus events, so it cannot show a tooltip:
     * wrap it in <span tabIndex={0} className={tooltipAnchor}> (from './styles.js':
     * the shared focus ring and the button's radius) and put the tooltip on the span.
     */
    children: React.ReactElement;
    /** Preferred side; flips when there is no room. Default 'top'. */
    side?: TooltipSide;
    /** Alignment along that side. Default 'center'. */
    align?: TooltipAlign;
    /**
     * True when the content only repeats the trigger's accessible name (an IconButton's
     * `label`, or a visible button text). The trigger then gets no aria-describedby, so a
     * screen reader does not read the same words twice. Default false: the content is a
     * description and is announced after the name.
     */
    asLabel?: boolean;
    /** Hover delay for this tooltip only, in ms; otherwise the provider's (400). */
    delayDuration?: number;
    /**
     * Keep the tooltip closed (for example while the trigger's own menu is open, or while a row
     * is being edited). The trigger stays mounted as it is, so focus and refs are not disturbed.
     */
    disabled?: boolean;
    /** Controlled open state. Leave unset in normal use. */
    open?: boolean;
    /** Initial open state when uncontrolled. */
    defaultOpen?: boolean;
    /** Called when the tooltip opens or closes. */
    onOpenChange?: (open: boolean) => void;
    /** Extra classes on the tooltip panel (a wider `max-w-*` for a long hint). Not for colour. */
    className?: string;
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
export declare function Tooltip({ content, children, side, align, asLabel, delayDuration, disabled, open, defaultOpen, onOpenChange, className, }: TooltipProps): React.JSX.Element;
