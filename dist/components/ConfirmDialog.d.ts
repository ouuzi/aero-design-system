import React from 'react';
import { type ModalShellProps } from './ModalShell.js';
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
export declare function ConfirmDialog({ open, title, body, children, confirmLabel, cancelLabel, tone, onConfirm, onCancel, busy, error, eyebrow, layer, }: ConfirmDialogProps): React.ReactPortal | null;
/** What `confirm()` from useConfirmDialog takes: the dialog's content, without the handlers. */
export type ConfirmRequest = Omit<ConfirmDialogProps, 'open' | 'onConfirm' | 'onCancel' | 'busy' | 'error'>;
/**
 * Promise-based confirmation, a drop-in for `window.confirm` in an event handler. Render
 * `dialog` once in the component; `confirm(request)` opens it and resolves true (confirmed)
 * or false (cancelled, replaced by another request, or the component unmounted). The dialog
 * closes as soon as it is answered, so the action runs after it; for an action that should
 * show progress inside the dialog, use <ConfirmDialog busy> directly.
 */
export declare function useConfirmDialog(): {
    confirm: (request: ConfirmRequest) => Promise<boolean>;
    dialog: React.ReactNode;
};
export default ConfirmDialog;
