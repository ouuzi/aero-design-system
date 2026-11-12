'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { btn, input, motion } from './styles.js';
import { isTopModal, useFocusTrap } from './useFocusTrap.js';
import { cn } from '../lib/utils.js';

/*
 * Shared modal frame. Every dialog is a side sheet unless it passes placement="center".
 * - "sheet" (default): a full-height panel docked to the right edge, sliding in from
 *   the right. The header and the pinned footer are always ruled; the body scrolls
 *   between them. Width follows `size`: sm 480px, md 640px (default), lg 896px,
 *   xl min(1280px, 96vw); below the sm breakpoint the sheet is full width.
 * - "center" (explicit opt-out): the calm centred dialog. All white, no grey header
 *   or footer band and no rules: eyebrow, title and subtitle sit on white with the
 *   close button top right. When the body scrolls, a hairline appears under the
 *   header once the body has scrolled away from the top, and over the footer while
 *   there is more content below. The calm header shows no icon (the `icon` prop is
 *   accepted for compatibility and not rendered).
 * Both placements share the same backdrop (ink/40, no blur), Escape, backdrop,
 * close and focus behaviour, and layers stack across them.
 *
 * Stacked sheets: a dialog opened over another (layer="nested" z-[60], layer="top"
 * z-[70], above the base z-50) is its own panel. Its backdrop covers the whole
 * viewport, the parent sheet included, so the parent dims; the child docks to the
 * right edge on top of the parent with its own shadow-modal. Keep a nested sheet no
 * wider than its parent so the parent still shows beside it.
 *
 * Printable dialogs (`printable`) drop the frame when printing: backdrop and panel
 * become static blocks at full page width, with no fixed positioning, width cap,
 * shadow, radius, entry animation or transition; header and footer are hidden.
 *
 * Only the top-most open modal reacts to Escape, so nested dialogs close one at a
 * time. An Escape a child already handled (preventDefault: Radix popovers,
 * RowMenu) does not close the dialog.
 *
 * Focus (WAI-ARIA dialog pattern, see useFocusTrap):
 * - On open, focus moves into the dialog: a child's autoFocus is kept, else the
 *   first [data-autofocus] element, else the first focusable control in the
 *   body, else the dialog panel itself (tabIndex -1, no visible ring).
 * - Tab and Shift+Tab cycle inside the dialog; focus that strays to the page
 *   behind is brought back. Portal content opened from the dialog (popovers,
 *   listboxes, menus, [data-modal-portal]) is left alone.
 * - On close, focus returns to the element that opened the dialog, or to the
 *   dialog beneath if that element is gone.
 * - Nested dialogs (layer="nested" / "top") own Escape and the trap while open;
 *   the dialog underneath takes over again when they close.
 */

/*
 * Four widths, the same for a sheet and a centred dialog:
 * - sm 480px: a confirmation, a short form (a few fields).
 * - md 640px (default): an ordinary form or record.
 * - lg 896px: a two-column form, a form with a table.
 * - xl min(1280px, 96vw): large working forms (the AES-CM-07 assessment), printable cards.
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

/** Centred dialog: maximum width per size. */
const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'max-w-[480px]',
  md: 'max-w-[640px]',
  lg: 'max-w-[896px]',
  xl: 'max-w-[1280px]',
};

/** Side sheet: width per size from the sm breakpoint up (full width below; max-w-full caps it on narrow screens). */
const SHEET_SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'sm:w-[480px]',
  md: 'sm:w-[640px]',
  lg: 'sm:w-[896px]',
  xl: 'sm:w-[min(1280px,96vw)]',
};

const LAYER_CLASSES = {
  base: 'z-50',
  nested: 'z-[60]',
  top: 'z-[70]',
} as const;

export interface ModalShellProps {
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Small line above the title (codes, context). */
  eyebrow?: React.ReactNode;
  /** Accepted for compatibility; the calm header shows no icon. */
  icon?: React.ElementType;
  /** Rendered before the close button (a StatusBadge, header actions). */
  headerAside?: React.ReactNode;
  /** Rendered under the title row inside the header (tabs, chips, steppers). */
  headerExtra?: React.ReactNode;
  footer?: React.ReactNode;
  /** Left side of the footer (secondary links, destructive actions). */
  footerStart?: React.ReactNode;
  children: React.ReactNode;
  /**
   * Sheet: fixed width; centred: maximum width. sm 480px, md 640px (default), lg 896px,
   * xl min(1280px, 96vw).
   */
  size?: ModalSize;
  /**
   * Every dialog is a sheet unless it passes placement="center".
   * "sheet" (default): a full-height panel docked to the right edge (full width below
   * the sm breakpoint). Header and footer are always ruled; the body scrolls between them.
   * "center": explicit opt-out, the calm centred dialog.
   */
  placement?: 'center' | 'sheet';
  /**
   * Stacking: "base" (z-50, default), "nested" (z-[60]) for a dialog opened from a
   * dialog, "top" (z-[70]) for one opened from a nested dialog. A nested sheet docks
   * on top of its parent and its backdrop dims the parent.
   */
  layer?: keyof typeof LAYER_CLASSES;
  /** Body padding and layout. Default `px-6 pt-4 pb-6` (centred) or `px-6 py-6` (sheet). */
  bodyClassName?: string;
  className?: string;
  closeDisabled?: boolean;
  /** Accessible name of the close button, e.g. "Close aircraft types and privileges". Default "Close". */
  closeLabel?: string;
  /**
   * A click outside the dialog (on the backdrop) closes it. On by default; off by default for
   * `role="alertdialog"`, which must be answered. Only a press that starts on the backdrop
   * counts, so dragging a text selection out of a field does not close anything.
   */
  closeOnBackdrop?: boolean;
  /**
   * What a click outside does instead of `onClose`: for a long form with no draft of its own,
   * ask before closing (`useConfirmDialog`) and call `onClose` on yes.
   */
  onBackdropClose?: () => void;
  closeOnEscape?: boolean;
  /** When set, body and footer are wrapped in a <form> with these props. */
  formProps?: React.FormHTMLAttributes<HTMLFormElement>;
  /**
   * Render children directly in a flex column (flex-1 min-h-0) instead of the padded,
   * scrolling body. For content that manages its own scroll area and footer
   * (use `modalFooterClass` for that footer).
   */
  rawBody?: boolean;
  /**
   * The modal prints its body (for example an official form): when printing, the
   * backdrop, frame, header and footer drop away and the body flows onto the page at
   * full width (sheet or centred: static, no width cap, shadow or animation).
   */
  printable?: boolean;
  /** Id of the dialog element (role="dialog"), e.g. for a print stylesheet or a test. The title id is `${id}-title`. */
  id?: string;
  /**
   * `alertdialog` for a dialog that interrupts to ask before a consequential step (what
   * ConfirmDialog uses); `dialog` (default) for everything else.
   */
  role?: 'dialog' | 'alertdialog';
  /** Id of the element that describes the dialog (a confirmation's body), read after the title. */
  'aria-describedby'?: string;
}

/** Footer for rawBody content: surface, ruled on top. */
export const modalFooterClass =
  'shrink-0 border-t border-line bg-surface px-6 py-4 flex flex-wrap items-center justify-between gap-3';

export default function ModalShell({
  onClose,
  title,
  subtitle,
  eyebrow,
  headerAside,
  headerExtra,
  footer,
  footerStart,
  children,
  size = 'md',
  placement = 'sheet',
  layer = 'base',
  bodyClassName,
  className = '',
  closeDisabled = false,
  closeLabel = 'Close',
  closeOnBackdrop,
  onBackdropClose,
  closeOnEscape = true,
  formProps,
  rawBody = false,
  printable = false,
  id: dialogId,
  role = 'dialog',
  'aria-describedby': describedBy,
}: ModalShellProps) {
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

  const panelRef = useRef<HTMLDivElement>(null);
  // A click on the backdrop while a list, menu or popover is open closes that, not the dialog.
  const floatingOpenRef = useRef(false);
  const headerRef = useRef<HTMLDivElement>(null);
  // Registers this dialog in the shared stack (top-most check below) and manages focus.
  useFocusTrap({ id, layer, panelRef, headerRef });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented || !closeOnEscapeRef.current) return;
      if (!isTopModal(id) || closeDisabledRef.current) return;
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
  const bodyRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ above: false, below: false, scrollable: false });
  const hasForm = !!formProps;
  useEffect(() => {
    const body = bodyRef.current;
    if (!body || isSheet || typeof ResizeObserver === 'undefined') return;
    const update = () => {
      const overflow = body.scrollHeight - body.clientHeight;
      const next = {
        above: body.scrollTop > 1,
        below: overflow - body.scrollTop > 1,
        scrollable: overflow > 1,
      };
      setEdges((prev) =>
        prev.above === next.above && prev.below === next.below && prev.scrollable === next.scrollable ? prev : next
      );
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
    : cn(
        'shrink-0 bg-surface px-6 pb-6 flex flex-wrap items-center justify-between gap-3 border-t',
        edges.below ? 'border-line' : 'border-transparent',
        edges.scrollable ? 'pt-4' : 'pt-0'
      );

  const content = rawBody ? (
    <div className="flex-1 min-h-0 flex flex-col">{children}</div>
  ) : (
    <>
      <div
        ref={bodyRef}
        className={cn(
          'flex-1 min-h-0 overflow-y-auto custom-scrollbar',
          printable && 'print:overflow-visible',
          bodyClassName ?? (isSheet ? 'px-6 py-6' : 'px-6 pt-4 pb-6')
        )}
      >
        {children}
      </div>
      {hasFooter && (
        <div className={cn(footerFrame, printable && 'print:hidden')}>
          <div className="flex items-center gap-2 min-w-0">{footerStart}</div>
          <div className="flex flex-wrap items-center justify-end gap-2 ml-auto">{footer}</div>
        </div>
      )}
    </>
  );

  const headerFrame = isSheet
    ? 'px-6 py-5 border-b border-line'
    : cn('px-6 pt-6 pb-2 border-b', edges.above ? 'border-line' : 'border-transparent');

  return (
    <div
      className={cn(
        'fixed inset-0 bg-scrim animate-in fade-in',
        LAYER_CLASSES[layer],
        isSheet ? motion.slow : cn('flex items-center justify-center p-3 sm:p-4', motion.base),
        printable && 'print:static print:block print:p-0 print:bg-white print:animate-none print:transition-none'
      )}
      onPointerDownCapture={() => {
        // Read before the floating panel reacts to the same press and closes itself.
        floatingOpenRef.current = document.querySelector('[data-slot="popover-content"][data-state="open"], [role="menu"]') !== null;
      }}
      onMouseDown={(e) => {
        const dismissable = closeOnBackdrop ?? role !== 'alertdialog';
        if (floatingOpenRef.current) return;
        if (dismissable && !closeDisabled && e.target === e.currentTarget) (onBackdropClose ?? onClose)();
      }}
    >
      <div
        ref={panelRef}
        id={dialogId}
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={describedBy}
        tabIndex={-1}
        data-modal-shell=""
        data-placement={placement}
        className={cn(
          'flex flex-col overflow-hidden outline-none bg-surface shadow-modal',
          isSheet
            ? cn('fixed inset-y-0 right-0 w-full max-w-full animate-in slide-in-from-right', motion.slow, SHEET_SIZE_CLASSES[size])
            : cn('w-full max-h-[94vh] rounded-2xl animate-in zoom-in-95', motion.base, SIZE_CLASSES[size]),
          printable &&
            'print:static print:block print:w-full print:max-w-none print:max-h-none print:h-auto print:overflow-visible print:rounded-none print:shadow-none print:animate-none print:transition-none',
          className
        )}
      >
        <div ref={headerRef} className={cn('shrink-0', headerFrame, printable && 'print:hidden')}>
          {/* On phones the header actions drop to their own row under the title (the close
              button stays top-right) and the title may wrap; from sm up they share one row. */}
          <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
            <div className="order-1 min-w-0 flex-1">
              {eyebrow && <div className="mb-1 flex flex-wrap items-center gap-2 text-12 font-medium text-muted">{eyebrow}</div>}
              <h3 id={titleId} className="text-18 font-semibold leading-snug tracking-tight text-ink break-words sm:truncate">
                {title}
              </h3>
              {subtitle && <div className="mt-1 text-13 text-muted">{subtitle}</div>}
            </div>
            {headerAside && (
              <div className="order-3 flex w-full flex-wrap items-center gap-2 sm:order-2 sm:w-auto sm:shrink-0">{headerAside}</div>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={closeDisabled}
              aria-label={closeLabel}
              className={cn(btn.icon, 'order-2 -mr-2 -mt-1 shrink-0 sm:order-3')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {headerExtra && <div className="mt-3">{headerExtra}</div>}
        </div>

        {formProps ? (
          <form {...formProps} className={cn('flex-1 min-h-0 flex flex-col', formProps.className)}>
            {content}
          </form>
        ) : (
          content
        )}
      </div>
    </div>
  );
}

/* Shared control styles for modal content (aliases of components/ui/styles). */
export const modalInputClass = input;

export const modalButton = btn;
