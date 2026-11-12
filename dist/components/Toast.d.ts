import React from 'react';
import { type NoticeTone } from './Notice.js';
export type ToastTone = NoticeTone;
export interface ToastOptions {
    /** success (default), info, neutral: close by themselves; warning, danger: stay until closed. */
    tone?: ToastTone;
    /** What happened, in a few words ("Course saved"). */
    title: React.ReactNode;
    /** One optional line: the detail or what to do next. */
    description?: React.ReactNode;
    /** One follow-up ("Undo", "View record"); choosing it also closes the toast. */
    action?: {
        label: string;
        onClick: () => void;
    };
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
export declare const TOAST_DURATION_MS = 5000;
/** The toast functions. Needs a <ToastProvider> above (components/Providers.tsx). */
export declare function useToast(): ToastApi;
export interface ToastProviderProps {
    children: React.ReactNode;
}
/** Holds the toasts and draws their stack. Mount once, near the root of the client tree. */
export declare function ToastProvider({ children }: ToastProviderProps): React.JSX.Element;
