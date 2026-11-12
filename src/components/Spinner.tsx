import React from 'react';
import { LoaderCircle } from 'lucide-react';
import { emptyStateDetail, emptyStateFrame, emptyStateIcon, emptyStateTitle } from './styles.js';
import { cn } from '../lib/utils.js';

/*
 * Busy indicators: work is in progress and the time it takes is unknown.
 *
 * - Spinner: a turning ring at an icon size: 16px (beside 13px text, in buttons and menu
 *   rows; the default), 14px (a `sm` button's icon slot), 12px (inside a badge) or 20px (a
 *   panel or region on its own). It draws in currentColor, so it takes the colour of the
 *   text it sits in; `tone` sets one where there is no text.
 * - LoadingState: a whole panel, table body or dialog body that is waiting, the busy
 *   twin of EmptyState: spinner, a title that says what is loading, one line of why.
 *
 * For content whose shape is known in advance (a table, a list, a card), prefer the
 * skeletons in Skeleton.tsx: they hold the layout still while the data arrives.
 *
 * Screen readers. A standalone Spinner is a live region (role="status", polite) whose
 * name is `label` ("Loading" by default), read once when it appears. Inside something
 * that already says it is busy (a Button with `loading`, which sets aria-busy, or a row
 * whose text says "Adding…"), pass `decorative`: the ring is then hidden from assistive
 * technology and announces nothing, so the same news is not read twice.
 *
 * Motion. The ring keeps turning under prefers-reduced-motion: it is the only sign that
 * work is in progress, and app/globals.css exempts `.animate-spin` from the reduced-motion
 * rule for that reason. Everything else around it (fades, pulses) stops.
 *
 * Density: the ring keeps its size in both densities, like every icon; a visible label
 * or a LoadingState's text grows with comfortable density.
 */

/** Ring diameter in px, the kit's icon sizes: 16 inline (default), 14 in a `sm` button, 12 in a badge, 20 for a panel. */
export type SpinnerSize = 12 | 14 | 16 | 20;
/** `current` inherits the text colour (default); `muted` for meta rows; `accent` for a standalone busy panel. */
export type SpinnerTone = 'current' | 'muted' | 'accent';

const spinnerSize: Record<SpinnerSize, string> = { 12: 'h-3 w-3', 14: 'h-3.5 w-3.5', 16: 'h-4 w-4', 20: 'h-5 w-5' };
const spinnerTone: Record<SpinnerTone, string> = { current: 'text-current', muted: 'text-muted', accent: 'text-accent' };

/** The bare turning ring, sized and coloured; always hidden from assistive technology. */
function spinnerRingClass(size: SpinnerSize, tone: SpinnerTone) {
  return `${spinnerSize[size]} ${spinnerTone[tone]} shrink-0 animate-spin`;
}

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
export function Spinner({ size = 16, tone = 'current', label = 'Loading', children, decorative = false, className }: SpinnerProps) {
  const ring = <LoaderCircle className={spinnerRingClass(size, tone)} aria-hidden="true" focusable="false" />;

  if (decorative) {
    if (children == null) return <LoaderCircle className={cn(spinnerRingClass(size, tone), className)} aria-hidden="true" focusable="false" />;
    return (
      <span className={cn('inline-flex items-center gap-1.5', className)}>
        {ring}
        {children}
      </span>
    );
  }

  return (
    <span role="status" className={cn('inline-flex items-center gap-1.5', className)}>
      {ring}
      {children ?? <span className="sr-only">{label}</span>}
    </span>
  );
}

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
export function LoadingState({ title, children, size = 'md', surface = 'light', className }: LoadingStateProps) {
  const sm = size === 'sm';
  const dark = surface === 'dark';
  const frameSize = sm ? 'sm' : 'md';
  return (
    <div role="status" className={cn(emptyStateFrame(frameSize), className)}>
      <span className={emptyStateIcon(frameSize)} aria-hidden="true">
        {/* accent is too dark on the viewer canvas: accent-soft there, as for its focus rings. */}
        <LoaderCircle className={cn(spinnerRingClass(20, 'accent'), dark && 'text-accent-soft')} aria-hidden="true" focusable="false" />
      </span>
      {/* eslint-disable-next-line ds/no-off-system-classes -- the viewer's title text is white in both themes, like its other headings */}
      <p className={cn(emptyStateTitle(frameSize), dark ? 'text-white' : 'text-ink')}>{title}</p>
      {children && <div className={cn(emptyStateDetail, dark ? 'text-viewer-muted' : 'text-muted')}>{children}</div>}
    </div>
  );
}
