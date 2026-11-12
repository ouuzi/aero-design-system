'use client';

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
export function TooltipProvider({
  children,
  delayDuration = TOOLTIP_DELAY_MS,
  skipDelayDuration = TOOLTIP_SKIP_DELAY_MS,
}: TooltipProviderProps) {
  return (
    <InsideTooltipProvider.Provider value>
      <TooltipPrimitive.Provider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration}>
        {children}
      </TooltipPrimitive.Provider>
    </InsideTooltipProvider.Provider>
  );
}

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

/** Opens on focus only when the focus is visible: not after a click, nor on a focus return that follows one. */
function suppressPointerFocus(event: React.FocusEvent<HTMLElement>) {
  let visible = true;
  try {
    visible = event.currentTarget.matches(':focus-visible');
  } catch {
    // A browser without :focus-visible: keep Radix's own rule (no open after a pointer press).
  }
  // Radix composes its own onFocus after ours and skips it when the event is marked handled.
  if (!visible) event.preventDefault();
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
export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  asLabel = false,
  delayDuration,
  disabled = false,
  open,
  defaultOpen,
  onOpenChange,
  className,
}: TooltipProps) {
  const insideProvider = React.useContext(InsideTooltipProvider);
  // Always controlled, so `disabled` can hold it shut without swapping the element tree
  // (which would remount the trigger and lose its focus) or switching Radix between
  // controlled and uncontrolled.
  const [innerOpen, setInnerOpen] = React.useState(defaultOpen ?? false);
  const isOpen = !disabled && (open ?? innerOpen);
  const handleOpenChange = (next: boolean) => {
    if (disabled && next) return;
    if (open === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  };

  // No content at all: the child alone (a static choice at the call site, so the tree is stable).
  if (content == null || content === false || content === '') return children;

  const tooltip = (
    <TooltipPrimitive.Root open={isOpen} onOpenChange={handleOpenChange} delayDuration={delayDuration}>
      <TooltipPrimitive.Trigger
        asChild
        onFocus={suppressPointerFocus}
        // Radix sets aria-describedby before spreading these props, so an explicit
        // undefined here removes it; a trigger's own aria-describedby still wins.
        {...(asLabel ? { 'aria-describedby': undefined } : null)}
      >
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          data-slot="tooltip-content"
          side={side}
          align={align}
          sideOffset={TOOLTIP_OFFSET_PX}
          collisionPadding={TOOLTIP_COLLISION_PADDING_PX}
          className={cn(tooltipPanel, className)}
        >
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );

  if (insideProvider) return tooltip;
  return (
    <TooltipPrimitive.Provider delayDuration={TOOLTIP_DELAY_MS} skipDelayDuration={TOOLTIP_SKIP_DELAY_MS}>
      {tooltip}
    </TooltipPrimitive.Provider>
  );
}
