import React from 'react';
/** Ring diameter in px, the kit's icon sizes: 16 inline (default), 14 in a `sm` button, 12 in a badge, 20 for a panel. */
export type SpinnerSize = 12 | 14 | 16 | 20;
/** `current` inherits the text colour (default); `muted` for meta rows; `accent` for a standalone busy panel. */
export type SpinnerTone = 'current' | 'muted' | 'accent';
export interface SpinnerProps {
    /** 16px (default) inline, beside text or in a button; 14px in a `sm` button; 12px in a badge; 20px for a panel or region. */
    size?: SpinnerSize;
    /** Ring colour. Defaults to `current` (the surrounding text colour). */
    tone?: SpinnerTone;
    /**
     * What is loading, for screen readers: "Loading records", "Saving assessment".
     * Sentence case, no trailing dots. Ignored when `children` gives a visible label or
     * when `decorative` is set. Defaults to "Loading".
     */
    label?: string;
    /**
     * Visible text beside the ring ("Scanning 3 files…"). It becomes the status text, so
     * no hidden label is added. It inherits the surrounding text size and colour.
     */
    children?: React.ReactNode;
    /**
     * Hide the ring from assistive technology and drop role="status". Use it when the
     * container already says it is busy: a Button's `loading` (aria-busy), a menu row
     * whose text reads "Adding…", a field with its own description.
     */
    decorative?: boolean;
    /** Layout only (margins, alignment). Size and colour come from `size` and `tone`. */
    className?: string;
}
/**
 * A turning ring that says "working on it".
 *
 *   <Spinner />                                    // 16px, "Loading" for screen readers
 *   <Spinner size={20} tone="accent" label="Loading records" />
 *   <Spinner tone="muted">Scanning 3 files…</Spinner>
 *   <Spinner decorative />                         // inside a busy button or row
 *   <Spinner decorative size={12} />               // inside a Badge
 */
export declare function Spinner({ size, tone, label, children, decorative, className }: SpinnerProps): React.JSX.Element;
export interface LoadingStateProps {
    /** What is loading, as a short sentence-case phrase: "Loading document". Also the status text read by screen readers. */
    title: React.ReactNode;
    /** One line of why or what happens next, 12px muted. */
    children?: React.ReactNode;
    /** `md` (default) for a page section or empty table; `sm` inside dense panels and dialogs. */
    size?: 'md' | 'sm';
    /** `light` (default) on white or canvas; `dark` on the document viewer's dark canvas (bg-viewer). */
    surface?: 'light' | 'dark';
    /** Layout only (margins, min height). */
    className?: string;
}
/**
 * A region that is waiting for its content: the busy twin of EmptyState, with the same
 * width, spacing and type, so a panel does not jump when it goes from loading to empty.
 * The whole block is one polite live region; its title is what gets announced.
 *
 *   {isLoading ? <LoadingState title="Loading document">Checking record ownership</LoadingState> : <Viewer />}
 */
export declare function LoadingState({ title, children, size, surface, className }: LoadingStateProps): React.JSX.Element;
