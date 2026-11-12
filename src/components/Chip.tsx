import React from 'react';
import { X, type LucideIcon } from 'lucide-react';
import { chipClass, chipRemove, type CategoryTone, type Tone } from './styles.js';
import { cn } from '../lib/utils.js';

/*
 * Chip: a value picked into a form (an aircraft type, an ATA chapter, an engine variant),
 * usually with a × to take it out again. The Badge shape one step up (24px tall, 32px
 * comfortable, 12px medium text), in the category tones only: neutral (default), info,
 * violet, brand. A value that is in a problem state ("Not in register") is a StatusBadge,
 * which takes the same `onRemove`.
 *
 * - `onRemove` adds the remove button: a 16px × with a 24px target (32px comfortable), the
 *   shared focus ring, and `removeLabel` as its name ("Remove A320"; default "Remove <text>").
 * - `icon`: an optional leading 12px icon (a check on a confirmed value).
 * - A chip that turns on and off is a ToggleChip; a chip never opens anything.
 */

/** The × inside a Chip or a removable StatusBadge. Kit-internal: screens pass `onRemove`. */
export function ChipRemoveButton({ tone, label, onRemove, disabled }: { tone: Tone; label: string; onRemove: () => void; disabled?: boolean }) {
  return (
    <button type="button" aria-label={label} onClick={onRemove} disabled={disabled} className={chipRemove(tone)}>
      <X className="h-3 w-3" aria-hidden="true" />
    </button>
  );
}

/** "Remove A320" from a chip's text, when the text is plain. */
export function defaultRemoveLabel(children: React.ReactNode) {
  return typeof children === 'string' || typeof children === 'number' ? `Remove ${children}` : 'Remove';
}

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

export function Chip({ tone = 'neutral', icon: Icon, onRemove, removeLabel, disabled, className, children }: ChipProps) {
  return (
    <span className={cn(chipClass(tone), className)}>
      {Icon && <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />}
      <span className="min-w-0 truncate">{children}</span>
      {onRemove && <ChipRemoveButton tone={tone} label={removeLabel ?? defaultRemoveLabel(children)} onRemove={onRemove} disabled={disabled} />}
    </span>
  );
}
