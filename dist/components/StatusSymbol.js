import { jsx as _jsx } from "react/jsx-runtime";
import { Check, TriangleAlert, X } from 'lucide-react';
import { cn } from '../lib/utils.js';
/*
 * The symbol every status carries before its word: a check (success), a triangle
 * (warning), a cross (danger), the same as on printed reports. Success and danger are
 * only 1.12:1 apart in lightness, so the symbol is what tells them apart for colour-blind
 * readers and on black-and-white prints. Other tones have no symbol. The word carries the
 * meaning for screen readers, so the symbol is hidden from them.
 */
const SYMBOL = { success: Check, warning: TriangleAlert, danger: X };
export function hasStatusSymbol(tone) {
    return tone in SYMBOL;
}
export function StatusSymbol({ tone, className }) {
    const Icon = SYMBOL[tone];
    if (!Icon)
        return null;
    return _jsx(Icon, { className: cn('h-3 w-3 shrink-0', className), strokeWidth: 2.5, "aria-hidden": "true" });
}
