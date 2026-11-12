'use client';

import React, { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button.js';
import ModalShell, { type ModalShellProps } from './ModalShell.js';
import { Notice } from './Notice.js';

/*
 * ConfirmDialog: the small centred dialog that asks before a step that cannot be taken
 * back (delete, archive, replace, revoke). It replaces window.confirm and the confirmation
 * overlays screens used to build from ModalShell by hand.
 *
 *   <ConfirmDialog
 *     open={!!pending}
 *     tone="danger"
 *     title="Delete this department?"
 *     body="Its people keep their records but lose the department. This cannot be undone."
 *     confirmLabel="Delete department"
 *     busy={isSubmitting}
 *     onConfirm={() => deleteDept(pending!.id)}
 *     onCancel={() => setPending(null)}
 *   />
 *
 * Or, in place of `if (window.confirm(…))`, the hook (no provider needed):
 *
 *   const { confirm, dialog } = useConfirmDialog();
 *   const onDelete = async () => {
 *     if (!(await confirm({ tone: 'danger', title: 'Delete order TO-12?', confirmLabel: 'Delete order' }))) return;
 *     onDeleteOrder(order.id);
 *   };
 *   return <>{…}{dialog}</>;
 *
 * Shape: ModalShell placement="center", size sm (480px), no icon. Title is a question in
 * sentence case; the body says what happens and whether it can be undone; the confirm button
 * names the action ("Delete department", never "Yes" or "OK"). `tone="danger"` makes it the
 * red danger button.
 *
 * Layer: rendered in a portal on <body> on layer "top" (z-[70]) by default, so it sits above
 * whichever page, sheet or nested sheet opened it and is never clipped by a parent panel.
 *
 * Focus and keyboard (ModalShell's dialog pattern): focus moves to Cancel for `danger` (the
 * safe choice, so a stray Enter does not delete) and to the confirm button otherwise; Tab
 * cycles inside; Escape and the close button cancel; focus returns to the control that opened
 * it. It is an alertdialog described by its body (aria-describedby), so screen readers read
 * the consequence with the title.
 *
 * Busy: while `busy` is true, or while a Promise returned by `onConfirm` is pending, the
 * confirm button is a loading Button (spinner over its label, aria-busy, ignores clicks, keeps
 * focus), and Cancel, the close button and Escape are off.
 */

type ModalLayer = NonNullable<ModalShellProps['layer']>;

export interface ConfirmDialogProps {
  /** Show the dialog. Default true, so it can also be rendered conditionally (`{x && <ConfirmDialog …/>}`). */
  open?: boolean;
  /** A question in sentence case: "Delete this department?". */
  title: React.ReactNode;
  /** What will happen and whether it can be undone. Plain text or a few short paragraphs; it describes the dialog for screen readers. */
  body?: React.ReactNode;
  /** Extra content under the body: a list of what is affected, a reason field. */
  children?: React.ReactNode;
  /** Names the action: "Delete department", "Archive person", "Replace data". Default "Confirm". */
  confirmLabel?: string;
  /** Default "Cancel". */
  cancelLabel?: string;
  /** `danger` for a destructive step: red confirm button, initial focus on Cancel. Default `default` (navy primary button). */
  tone?: 'default' | 'danger';
  /**
   * Called when the confirm button is pressed. Close the dialog from here (set `open` false or
   * unmount it). If it returns a Promise, the dialog stays busy until it settles; a rejection is
   * logged and the dialog stays open, so catch it yourself and pass `error` to say what failed.
   */
  onConfirm: () => void | Promise<unknown>;
  /** Cancel, the close button and Escape. */
  onCancel: () => void;
  /** The confirmed action is running (e.g. `isSubmitting`). */
  busy?: boolean;
  /** Why the action failed, shown above the buttons and announced. */
  error?: React.ReactNode;
  /** Small line above the title (a record code). */
  eyebrow?: React.ReactNode;
  /** Stacking layer. Default "top", above any sheet; it is portalled to <body> either way. */
  layer?: ModalLayer;
}

/* Portals need document.body: false on the server and during hydration, true after. */
const subscribeNothing = () => () => {};
const onClient = () => true;
const onServer = () => false;

export function ConfirmDialog({
  open = true,
  title,
  body,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  onConfirm,
  onCancel,
  busy = false,
  error,
  eyebrow,
  layer = 'top',
}: ConfirmDialogProps) {
  const bodyId = useId();
  const mounted = useSyncExternalStore(subscribeNothing, onClient, onServer);
  const [pending, setPending] = useState(false);
  const working = busy || pending;
  const hasBody = body !== undefined && body !== null && body !== false && body !== '';

  const handleConfirm = async () => {
    if (working) return;
    const result = onConfirm();
    if (!result || typeof (result as Promise<unknown>).then !== 'function') return;
    setPending(true);
    try {
      await result;
    } catch (err) {
      console.error('ConfirmDialog: the confirmed action failed', err);
    } finally {
      setPending(false);
    }
  };

  if (!open || !mounted) return null;

  const danger = tone === 'danger';

  return createPortal(
    <ModalShell
      placement="center"
      size="sm"
      role="alertdialog"
      aria-describedby={hasBody ? bodyId : undefined}
      layer={layer}
      title={title}
      eyebrow={eyebrow}
      onClose={onCancel}
      closeDisabled={working}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={working} data-autofocus={danger ? '' : undefined}>
            {cancelLabel}
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            onClick={() => void handleConfirm()}
            loading={working}
            data-autofocus={danger ? undefined : ''}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        {hasBody && (
          <div id={bodyId} className="space-y-2 text-13 text-ink-2 comfortable:text-15">
            {body}
          </div>
        )}
        {children}
        {error && (
          <Notice tone="danger" compact live>
            {error}
          </Notice>
        )}
      </div>
    </ModalShell>,
    document.body,
  );
}

/** What `confirm()` from useConfirmDialog takes: the dialog's content, without the handlers. */
export type ConfirmRequest = Omit<ConfirmDialogProps, 'open' | 'onConfirm' | 'onCancel' | 'busy' | 'error'>;

/**
 * Promise-based confirmation, a drop-in for `window.confirm` in an event handler. Render
 * `dialog` once in the component; `confirm(request)` opens it and resolves true (confirmed)
 * or false (cancelled, replaced by another request, or the component unmounted). The dialog
 * closes as soon as it is answered, so the action runs after it; for an action that should
 * show progress inside the dialog, use <ConfirmDialog busy> directly.
 */
export function useConfirmDialog(): {
  confirm: (request: ConfirmRequest) => Promise<boolean>;
  dialog: React.ReactNode;
} {
  const [request, setRequest] = useState<ConfirmRequest | null>(null);
  const resolveRef = useRef<((confirmed: boolean) => void) | null>(null);

  const settle = useCallback((confirmed: boolean) => {
    const resolve = resolveRef.current;
    resolveRef.current = null;
    setRequest(null);
    resolve?.(confirmed);
  }, []);

  const confirm = useCallback((next: ConfirmRequest) => {
    resolveRef.current?.(false);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
      setRequest(next);
    });
  }, []);

  // An unanswered request resolves false when the component goes away.
  useEffect(
    () => () => {
      resolveRef.current?.(false);
      resolveRef.current = null;
    },
    [],
  );

  const dialog = request ? <ConfirmDialog {...request} onConfirm={() => settle(true)} onCancel={() => settle(false)} /> : null;
  return { confirm, dialog };
}

export default ConfirmDialog;
