'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';
import { commandOption } from './styles.js';
import { cn } from '../lib/utils.js';
/*
 * Command (shadcn/ui's command.tsx on our tokens): a search field over a filterable list,
 * built on cmdk. Up/Down move the highlight, Home/End jump, Enter picks the highlighted
 * item. Used inside a Popover by Combobox; can also sit in a card or dialog on its own.
 *
 * - Items share the list-option geometry (commandOption in styles.ts, the same row as
 *   StatusSelect's listOption and RowMenu's menuItem): 32px tall (40px comfortable), radius md,
 *   13px text (15px comfortable). The highlighted item (keyboard or pointer, cmdk's
 *   data-selected) is bg-subtle with a 2px inset accent outline, the only focus indicator
 *   while DOM focus stays in the search field.
 * - The search field is borderless with a hairline underneath, so the panel reads as one surface.
 * - Group headings are 12px muted.
 */
function Command({ className, ...props }) {
    return (_jsx(CommandPrimitive, { "data-slot": "command", className: cn('flex h-full w-full flex-col overflow-hidden rounded-xl bg-surface text-13 text-ink outline-none comfortable:text-15', className), ...props }));
}
function CommandInput({ className, ...props }) {
    return (_jsxs("div", { "data-slot": "command-input-wrapper", className: "flex h-control-lg items-center gap-2 border-b border-line px-3", children: [_jsx(Search, { className: "h-4 w-4 shrink-0 text-muted", "aria-hidden": "true" }), _jsx(CommandPrimitive.Input, { "data-slot": "command-input", className: cn('h-full w-full min-w-0 bg-transparent text-13 text-ink outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:text-disabled comfortable:text-15', className), ...props })] }));
}
function CommandList({ className, ...props }) {
    return (_jsx(CommandPrimitive.List, { "data-slot": "command-list", className: cn('max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto p-1 custom-scrollbar outline-none', className), ...props }));
}
/** Shown by cmdk when its own filter leaves nothing. With shouldFilter={false}, render your own empty line instead. */
function CommandEmpty({ className, ...props }) {
    return (_jsx(CommandPrimitive.Empty, { "data-slot": "command-empty", className: cn('px-3 py-6 text-center text-12 text-muted comfortable:text-13', className), ...props }));
}
function CommandGroup({ className, ...props }) {
    return (_jsx(CommandPrimitive.Group, { "data-slot": "command-group", className: cn('overflow-hidden text-ink [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-12 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted comfortable:[&_[cmdk-group-heading]]:text-13', className), ...props }));
}
function CommandSeparator({ className, ...props }) {
    return _jsx(CommandPrimitive.Separator, { "data-slot": "command-separator", className: cn('-mx-1 my-1 h-px bg-line', className), ...props });
}
function CommandItem({ className, ...props }) {
    return (_jsx(CommandPrimitive.Item, { "data-slot": "command-item", className: cn('relative', commandOption, className), ...props }));
}
export { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator };
