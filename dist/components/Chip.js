import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from 'lucide-react';
import { chipClass, chipRemove } from './styles.js';
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
export function ChipRemoveButton({ tone, label, onRemove, disabled }) {
    return (_jsx("button", { type: "button", "aria-label": label, onClick: onRemove, disabled: disabled, className: chipRemove(tone), children: _jsx(X, { className: "h-3 w-3", "aria-hidden": "true" }) }));
}
/** "Remove A320" from a chip's text, when the text is plain. */
export function defaultRemoveLabel(children) {
    return typeof children === 'string' || typeof children === 'number' ? `Remove ${children}` : 'Remove';
}
export function Chip({ tone = 'neutral', icon: Icon, onRemove, removeLabel, disabled, className, children }) {
    return (_jsxs("span", { className: cn(chipClass(tone), className), children: [Icon && _jsx(Icon, { className: "h-3 w-3 shrink-0", "aria-hidden": "true" }), _jsx("span", { className: "min-w-0 truncate", children: children }), onRemove && _jsx(ChipRemoveButton, { tone: tone, label: removeLabel ?? defaultRemoveLabel(children), onRemove: onRemove, disabled: disabled })] }));
}
