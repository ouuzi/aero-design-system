import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check } from 'lucide-react';
import { focusRing } from './styles.js';
import { cn } from '../lib/utils.js';
export function ToggleChip({ selected, onChange, className, disabled, children, ...rest }) {
    return (_jsxs("button", { type: "button", "aria-pressed": selected, disabled: disabled, onClick: () => onChange(!selected), className: cn('inline-flex h-control-xs items-center gap-1.5 rounded-lg border px-3 text-12 comfortable:px-4 comfortable:text-13 font-medium whitespace-nowrap transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40', focusRing, selected ? 'border-brand bg-brand text-on-solid shadow-xs' : 'border-line-strong bg-surface text-ink-2 hover:bg-subtle', className), ...rest, children: [selected && _jsx(Check, { className: "h-3.5 w-3.5", "aria-hidden": "true" }), children] }));
}
