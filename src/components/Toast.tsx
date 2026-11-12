'use client';

/*
 * Toasts: a short message about something that just happened ("Course saved", "Could not
 * delete the record"), shown at the bottom right over everything else and gone again on its
 * own. Mount <ToastProvider> once (components/Providers.tsx); anywhere below it,
 *
 *   const { toast } = useToast();
 *   toast({ tone: 'success', title: 'Course saved' });
 *   toast({ tone: 'danger', title: 'Could not delete TRN-002', description: 'Check your access and try again.' });
 *
 * - Surface: the popover family (white, hairline, shadow-popover, radius xl), the tone's
 *   icon in its colour (the Notice icons), a 13px semibold title, an optional 12px line, an
 *   optional `action` (a LinkButton; choosing it closes the toast) and a close button.
 * - Timing: success, info and neutral close after 5 seconds; warning and danger stay until
 *   closed. `duration` (ms, or null to stay) overrides it. The timer pauses while the pointer
 *   is over the stack or focus is inside it, and resumes with the time that was left.
 * - Screen readers: two live regions that stay mounted, so every toast is announced. Danger
 *   goes to the assertive one (role="alert"), everything else to the polite one
 *   (role="status").
 * - Stack: newest at the bottom, at most four (the oldest goes first). Layer z-[90]: above
 *   dialogs (50 / 60 / 70) and Popover (80), under RowMenu (100) and Tooltip (110). The stack
 *   carries [data-modal-portal], so a ModalShell's focus trap lets focus reach its buttons.
 * - Motion: a quick slide up and fade (motion.fast), none under reduced motion.
 *
 * A toast reports; it never asks. Something the person must decide is a ConfirmDialog, and an
 * error that belongs to a form field or a dialog stays a Notice there.
 */

import React, { useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { IconButton, LinkButton } from './Button.js';
import { noticeIcon, noticeIconTone, type NoticeTone } from './Notice.js';
import { toastPanel, toastViewport } from './styles.js';
import { cn } from '../lib/utils.js';

export type ToastTone = NoticeTone;

export interface ToastOptions {
  /** success (default), info, neutral: close by themselves; warning, danger: stay until closed. */
  tone?: ToastTone;
  /** What happened, in a few words ("Course saved"). */
  title: React.ReactNode;
  /** One optional line: the detail or what to do next. */
  description?: React.ReactNode;
  /** One follow-up ("Undo", "View record"); choosing it also closes the toast. */
  action?: { label: string; onClick: () => void };
  /** Milliseconds before it closes, or null to stay until closed. Default 5000, or null for warning and danger. */
  duration?: number | null;
}

export interface ToastApi {
  /** Shows a toast and returns its id. */
  toast: (options: ToastOptions) => string;
  /** Closes a toast early. */
  dismiss: (id: string) => void;
}

/** Auto-close time for success, info and neutral, ms. */
export const TOAST_DURATION_MS = 5000;
/** Toasts on screen at once; a fifth pushes out the oldest. */
const MAX_TOASTS = 4;

interface ToastEntry extends ToastOptions {
  id: string;
  tone: ToastTone;
  duration: number | null;
}

const ToastContext = React.createContext<ToastApi | null>(null);

/** The toast functions. Needs a <ToastProvider> above (components/Providers.tsx). */
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast() needs a <ToastProvider> above it (components/Providers.tsx).');
  return api;
}

export interface ToastProviderProps {
  children: React.ReactNode;
}

let nextId = 0;
const subscribeNothing = () => () => {};

/** Holds the toasts and draws their stack. Mount once, near the root of the client tree. */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const [paused, setPaused] = useState(false);
  // The stack portals to <body>, which exists only in the browser: render it after hydration.
  const mounted = useSyncExternalStore(subscribeNothing, () => true, () => false);

  const dismiss = useCallback((id: string) => setToasts((list) => list.filter((t) => t.id !== id)), []);
  const toast = useCallback((options: ToastOptions) => {
    const id = `toast-${++nextId}`;
    const tone = options.tone ?? 'success';
    const stays = tone === 'danger' || tone === 'warning';
    const duration = options.duration === undefined ? (stays ? null : TOAST_DURATION_MS) : options.duration;
    setToasts((list) => [...list, { ...options, id, tone, duration }].slice(-MAX_TOASTS));
    return id;
  }, []);
  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  const renderList = (list: ToastEntry[]) =>
    list.map((t) => <ToastItem key={t.id} entry={t} paused={paused} onDismiss={dismiss} />);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {mounted &&
        createPortal(
          <section
            aria-label="Messages"
            data-modal-portal=""
            className={toastViewport}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
            }}
          >
            {/* Both regions stay mounted, so a toast added to either is announced. */}
            <div role="alert" className="flex flex-col gap-2">
              {renderList(toasts.filter((t) => t.tone === 'danger'))}
            </div>
            <div role="status" className="flex flex-col gap-2">
              {renderList(toasts.filter((t) => t.tone !== 'danger'))}
            </div>
          </section>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

function ToastItem({ entry, paused, onDismiss }: { entry: ToastEntry; paused: boolean; onDismiss: (id: string) => void }) {
  const remaining = useRef(entry.duration ?? 0);
  useEffect(() => {
    if (entry.duration === null || paused) return;
    const started = Date.now();
    const timer = window.setTimeout(() => onDismiss(entry.id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (Date.now() - started));
    };
  }, [entry.duration, entry.id, paused, onDismiss]);

  const Icon = noticeIcon[entry.tone];
  return (
    <div className={toastPanel}>
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', noticeIconTone[entry.tone])} aria-hidden="true" />
      <div className="min-w-0 flex-1 py-0.5">
        <p className="font-semibold text-ink">{entry.title}</p>
        {entry.description && <p className="mt-0.5 text-12 text-ink-2 comfortable:text-13">{entry.description}</p>}
        {entry.action && (
          <LinkButton
            className="mt-1"
            onClick={() => {
              onDismiss(entry.id);
              entry.action?.onClick();
            }}
          >
            {entry.action.label}
          </LinkButton>
        )}
      </div>
      <IconButton icon={X} label="Dismiss message" onClick={() => onDismiss(entry.id)} className="-my-1 shrink-0" />
    </div>
  );
}
