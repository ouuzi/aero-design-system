import React from 'react';
import { Check } from 'lucide-react';
import { focusRing } from './styles.js';
import { cn } from '../lib/utils.js';

/*
 * ToggleChip: one option in a multi-select set (departments, positions, aircraft
 * types). Navy when selected, white with a line-strong edge when not, 28px tall
 * (h-control-xs: 36px in comfortable density).
 * For a single choice among two to four options use SegmentedControl instead.
 */

export interface ToggleChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onChange'> {
  selected: boolean;
  onChange: (selected: boolean) => void;
  children: React.ReactNode;
}

export function ToggleChip({ selected, onChange, className, disabled, children, ...rest }: ToggleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onChange(!selected)}
      className={cn(
        'inline-flex h-control-xs items-center gap-1.5 rounded-lg border px-3 text-12 comfortable:px-4 comfortable:text-13 font-medium whitespace-nowrap transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40',
        focusRing,
        selected ? 'border-brand bg-brand text-on-solid shadow-xs' : 'border-line-strong bg-surface text-ink-2 hover:bg-subtle',
        className,
      )}
      {...rest}
    >
      {selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
      {children}
    </button>
  );
}
