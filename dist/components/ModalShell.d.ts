import React from 'react';
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';
declare const LAYER_CLASSES: {
    readonly base: "z-50";
    readonly nested: "z-[60]";
    readonly top: "z-[70]";
};
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
export declare const modalFooterClass = "shrink-0 border-t border-line bg-surface px-6 py-4 flex flex-wrap items-center justify-between gap-3";
export default function ModalShell({ onClose, title, subtitle, eyebrow, headerAside, headerExtra, footer, footerStart, children, size, placement, layer, bodyClassName, className, closeDisabled, closeLabel, closeOnBackdrop, onBackdropClose, closeOnEscape, formProps, rawBody, printable, id: dialogId, role, 'aria-describedby': describedBy, }: ModalShellProps): React.JSX.Element;
export declare const modalInputClass = "w-full h-control-lg px-3 text-13 comfortable:text-15 rounded-lg border border-line-strong bg-surface text-ink shadow-xs transition-colors placeholder:text-muted focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent [&[readonly]]:bg-subtle [&[readonly]]:text-ink-2 [&[readonly]]:border-line [&[readonly]]:shadow-none [&[readonly]]:cursor-default disabled:bg-subtle disabled:text-disabled";
export declare const modalButton: {
    readonly primary: string;
    readonly secondary: string;
    readonly ghost: string;
    readonly danger: string;
    readonly dangerGhost: string;
    readonly link: "inline-flex min-h-6 items-center gap-1.5 rounded-md text-13 font-medium text-accent hover:text-brand transition-colors cursor-pointer disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent comfortable:text-15";
    readonly icon: "inline-flex items-center justify-center size-control-sm rounded-lg text-muted hover:text-ink hover:bg-subtle-2 aria-pressed:bg-subtle-2 aria-pressed:text-ink transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
    readonly iconDanger: "inline-flex items-center justify-center size-control-sm rounded-lg text-muted hover:text-danger hover:bg-danger-bg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
};
export {};
