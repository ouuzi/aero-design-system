import React from 'react';
import { type LucideIcon } from 'lucide-react';
import { type CategoryTone, type Tone } from './styles.js';
/** The × inside a Chip or a removable StatusBadge. Kit-internal: screens pass `onRemove`. */
export declare function ChipRemoveButton({ tone, label, onRemove, disabled }: {
    tone: Tone;
    label: string;
    onRemove: () => void;
    disabled?: boolean;
}): React.JSX.Element;
/** "Remove A320" from a chip's text, when the text is plain. */
export declare function defaultRemoveLabel(children: React.ReactNode): string;
export interface ChipProps {
    tone?: CategoryTone;
    icon?: LucideIcon;
    /** Adds the × button; called when it is pressed. */
    onRemove?: () => void;
    /** The remove button's accessible name. Default "Remove <text>" for plain text, else "Remove". */
    removeLabel?: string;
    /** Dims the chip's remove button (the form is saving). */
    disabled?: boolean;
    className?: string;
    children: React.ReactNode;
}
export declare function Chip({ tone, icon: Icon, onRemove, removeLabel, disabled, className, children }: ChipProps): React.JSX.Element;
