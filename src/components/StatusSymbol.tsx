import React from 'react';
import { Check, TriangleAlert, X, type LucideIcon } from 'lucide-react';
import type { Tone } from './styles.js';
import { cn } from '../lib/utils.js';

/*
 * The symbol every status carries before its word: a check (success), a triangle
 * (warning), a cross (danger), the same as on printed reports. Success and danger are
 * only 1.12:1 apart in lightness, so the symbol is what tells them apart for colour-blind
 * readers and on black-and-white prints. Other tones have no symbol. The word carries the
 * meaning for screen readers, so the symbol is hidden from them.
 */

const SYMBOL: Partial<Record<Tone, LucideIcon>> = { success: Check, warning: TriangleAlert, danger: X };

export function hasStatusSymbol(tone: Tone) {
  return tone in SYMBOL;
}

export function StatusSymbol({ tone, className }: { tone: Tone; className?: string }) {
  const Icon = SYMBOL[tone];
  if (!Icon) return null;
  return <Icon className={cn('h-3 w-3 shrink-0', className)} strokeWidth={2.5} aria-hidden="true" />;
}
