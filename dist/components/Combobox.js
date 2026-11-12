'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AlertOctagon, Check, ChevronDown, Pencil, Plus, Settings2, Trash2, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './Popover.js';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './Command.js';
import { useFieldControl } from './Field.js';
import { Spinner } from './Spinner.js';
import { ariaDisabled, btn, fieldInvalid, fieldOpen, inputSmBase, linkButton, selectSizes } from './styles.js';
import { cn } from '../lib/utils.js';
/*
 * Combobox: pick one value from a list by searching it (shadcn/ui's Combobox pattern: a
 * Popover holding a Command). The trigger is the same box as Select (same frame, heights
 * per size and chevron); opening it shows a search field and the filtered list.
 *
 *   <Field label="Category" required>
 *     <Combobox id="record-category" label="Category" value={v} onChange={setV} options={opts} required />
 *   </Field>
 *
 * Keyboard: Enter, Space, Up or Down on the trigger open it (typing a letter opens it and
 * starts the search); Up/Down move through the list, Enter picks, Escape closes (the dialog
 * around it stays open), Tab closes and moves on. Focus returns to the trigger.
 *
 * Organisation-maintained lists:
 * - `allowCreate`: when the search matches no option exactly, the list offers Add "<query>".
 *   It calls `onCreate(query)` if given (may return a Promise: the item shows a pending
 *   state and a rejection shows an inline error), otherwise saves the longer list through
 *   `onPersistOptions` / `onOptionsChange`. Then the new value is picked. If saving fails
 *   (no permission to edit the list), the list also offers Use "<query>" without saving, so
 *   a one-off value can still be entered, as the old free-text field allowed.
 * - `allowListEditing`: a "Manage list" item opens a panel where each option can be
 *   renamed or deleted (real buttons, reachable with Tab), saved the same way.
 *
 * Field: inside <Field> the trigger takes Field's id (so Field's label points at it), its
 * hint or error (aria-describedby) and its error state by itself; explicit props win.
 */
const triggerSize = selectSizes;
const invalidFrame = fieldInvalid;
const LIST_SAVE_ERROR = 'Unable to save this list. Check your access and try again.';
const CREATE_ITEM_PREFIX = '\u0000create:';
const USE_UNSAVED_ITEM_PREFIX = '\u0000use:';
const MANAGE_ITEM_VALUE = '\u0000manage';
/** Looks like a disabled button but stays focusable (see busyButton). */
const busyClass = ariaDisabled;
function sameText(a, b) {
    return a.trim().toLowerCase() === b.trim().toLowerCase();
}
export function Combobox({ value, onChange, options: suppliedOptions, label, placeholder = 'Select…', searchPlaceholder, emptyText = 'No matching options', size = 'lg', id: idProp, invalid: invalidProp, 'aria-describedby': describedByProp, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, required = false, disabled = false, name, className, allowCreate = false, onCreate, onOptionsChange, onPersistOptions, catalogId, allowListEditing = false, }) {
    const { id, invalid, describedBy } = useFieldControl({ id: idProp, invalid: invalidProp, describedBy: describedByProp });
    const baseId = useId();
    const popupId = `${baseId}-popup`;
    const manageHeadingId = `${baseId}-manage`;
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState('search');
    const [query, setQuery] = useState('');
    const [pending, setPending] = useState(false);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(null);
    const [newOption, setNewOption] = useState('');
    const [listId, setListId] = useState(undefined);
    /** A value whose Add failed to save: offered as "Use without saving" so the form can still go ahead. */
    const [unsaved, setUnsaved] = useState(null);
    // Editable copy of the list, reset when the parent supplies a new snapshot (guarded
    // render-time adjustment, as React recommends over a state-syncing effect).
    const [options, setOptions] = useState(suppliedOptions);
    const [optionsSource, setOptionsSource] = useState(suppliedOptions);
    if (optionsSource.length !== suppliedOptions.length || optionsSource.some((o, i) => o !== suppliedOptions[i])) {
        setOptionsSource(suppliedOptions);
        setOptions(suppliedOptions);
    }
    const triggerRef = useRef(null);
    const contentRef = useRef(null);
    const searchRef = useRef(null);
    /** A selector inside the popover to focus after the next render (manage mode moves). */
    const focusRequest = useRef(null);
    // cmdk sets its own list id; read it so the trigger's aria-controls can point at the listbox.
    const listRef = useCallback((el) => setListId(el?.id || undefined), []);
    useEffect(() => {
        if (!focusRequest.current || !contentRef.current)
            return;
        const target = contentRef.current.querySelector(focusRequest.current);
        focusRequest.current = null;
        target?.focus();
    });
    const setOpenState = (next) => {
        setOpen(next);
        if (!next) {
            setQuery('');
            setMode('search');
            setEditing(null);
            setNewOption('');
            setError(null);
            setPending(false);
            setUnsaved(null);
        }
    };
    const openWithQuery = (initial) => {
        setQuery(initial);
        setOpen(true);
    };
    const pick = (option) => {
        onChange(option);
        setOpenState(false);
    };
    const persist = async (updated) => {
        setError(null);
        setPending(true);
        try {
            await onPersistOptions?.(updated);
            setOptions(updated);
            onOptionsChange?.(updated);
            return true;
        }
        catch (err) {
            console.error(`Unable to save dropdown catalog${catalogId ? ` [${catalogId}]` : ''}:`, err);
            setError(LIST_SAVE_ERROR);
            return false;
        }
        finally {
            setPending(false);
        }
    };
    const create = async (raw) => {
        const clean = raw.trim();
        if (!allowCreate || !clean || pending)
            return false;
        const existing = options.find((o) => sameText(o, clean));
        if (existing)
            return true;
        const updated = [...options, clean];
        setUnsaved(null);
        if (onCreate) {
            setError(null);
            setPending(true);
            try {
                await onCreate(clean);
            }
            catch (err) {
                console.error(`Unable to add "${clean}"${catalogId ? ` to [${catalogId}]` : ''}:`, err);
                setError(`Could not add “${clean}”. Check your access and try again.`);
                setPending(false);
                setUnsaved(clean);
                return false;
            }
            setPending(false);
            setOptions(updated);
            return true;
        }
        const saved = await persist(updated);
        if (!saved)
            setUnsaved(clean);
        return saved;
    };
    const createAndPick = async (raw) => {
        const clean = raw.trim();
        if (!(await create(clean)))
            return;
        pick(options.find((o) => sameText(o, clean)) ?? clean);
    };
    const addFromManage = async () => {
        const clean = newOption.trim();
        if (!clean || pending)
            return;
        if (options.some((o) => sameText(o, clean))) {
            setError(`“${clean}” is already in the list.`);
            return;
        }
        if (await create(clean)) {
            setNewOption('');
            focusRequest.current = '[data-manage-add]';
        }
    };
    const startRename = (index) => {
        if (pending)
            return;
        setError(null);
        setEditing({ index, text: options[index] });
        focusRequest.current = '[data-rename-input]';
    };
    const cancelRename = () => {
        if (!editing || pending)
            return;
        focusRequest.current = `[data-rename="${editing.index}"]`;
        setEditing(null);
    };
    const saveRename = async () => {
        if (!editing || pending)
            return;
        const clean = editing.text.trim();
        const old = options[editing.index];
        if (!clean) {
            setError('Enter a name, or cancel.');
            return;
        }
        if (options.some((o, i) => i !== editing.index && sameText(o, clean))) {
            setError(`“${clean}” is already in the list.`);
            return;
        }
        if (clean !== old) {
            const updated = [...options];
            updated[editing.index] = clean;
            if (!(await persist(updated)))
                return;
            if (value === old)
                onChange(clean);
        }
        focusRequest.current = `[data-rename="${editing.index}"]`;
        setEditing(null);
    };
    const remove = async (index) => {
        if (pending)
            return;
        const target = options[index];
        const updated = options.filter((_, i) => i !== index);
        if (!(await persist(updated)))
            return;
        // A deleted value is cleared rather than swapped for another option.
        if (value === target)
            onChange('');
        focusRequest.current =
            updated.length === 0 ? '[data-manage-done]' : `[data-delete="${Math.min(index, updated.length - 1)}"]`;
    };
    const enterManage = () => {
        setError(null);
        setMode('manage');
        focusRequest.current = allowCreate ? '[data-manage-add]' : options.length ? '[data-rename="0"]' : '[data-manage-done]';
    };
    const leaveManage = () => {
        setEditing(null);
        setError(null);
        setNewOption('');
        setMode('search');
        focusRequest.current = '[cmdk-input]';
    };
    const onTriggerKeyDown = (e) => {
        if (disabled || open)
            return;
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            openWithQuery('');
        }
        else if (e.key.length === 1 && e.key !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            openWithQuery(e.key);
        }
    };
    const onContentKeyDown = (e) => {
        if (e.key !== 'Tab' || e.altKey || e.ctrlKey || e.metaKey)
            return;
        if (mode === 'search') {
            // Like a native select: Tab closes the list and moves on from the trigger.
            triggerRef.current?.focus();
            setOpenState(false);
            return;
        }
        // Manage panel: keep Tab inside it until Done or Escape.
        const root = contentRef.current;
        if (!root)
            return;
        const tabbable = Array.from(root.querySelectorAll('button:not(:disabled), input:not(:disabled)'));
        if (tabbable.length === 0)
            return;
        const first = tabbable[0];
        const last = tabbable[tabbable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        }
        else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    };
    // While a save is in flight the manage panel's controls are aria-disabled / read-only rather
    // than disabled, so the focused control keeps focus (a disabled one drops it to <body>,
    // and a failed save would leave keyboard users nowhere).
    const busyButton = pending ? { 'aria-disabled': true } : {};
    const trimmedQuery = query.trim();
    const filtered = trimmedQuery ? options.filter((o) => o.toLowerCase().includes(trimmedQuery.toLowerCase())) : options;
    const showCreate = allowCreate && trimmedQuery !== '' && !options.some((o) => sameText(o, trimmedQuery));
    const showUseUnsaved = showCreate && !pending && unsaved !== null && sameText(unsaved, trimmedQuery);
    const listName = label ? `${label} options` : 'Options';
    const selectedOption = options.find((o) => o === value) ?? options.find((o) => sameText(o, value));
    return (_jsxs("div", { className: cn('relative', className), children: [_jsxs(Popover, { open: open, onOpenChange: setOpenState, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs("button", { ref: triggerRef, type: "button", id: id, role: "combobox", "aria-haspopup": "listbox", "aria-expanded": open, "aria-controls": open ? (mode === 'search' && listId ? listId : popupId) : undefined, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": describedBy, "aria-required": required || undefined, "aria-invalid": invalid || undefined, disabled: disabled, onKeyDown: onTriggerKeyDown, className: cn('relative flex w-full items-center text-left', triggerSize[size], 
                            // After the size recipe: its px-* would otherwise win the merge and the text would run under the chevron.
                            'pr-9', fieldOpen, invalid && invalidFrame), children: [_jsx("span", { className: cn('min-w-0 flex-1 truncate', !value && 'text-muted'), children: value || placeholder }), _jsx(ChevronDown, { className: cn('pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-transform', disabled ? 'text-disabled' : 'text-muted', open && 'rotate-180'), "aria-hidden": "true" })] }) }), _jsxs(PopoverContent, { ref: contentRef, id: popupId, align: "start", "aria-label": label ? `Choose ${label}` : 'Choose an option', className: "w-(--radix-popover-trigger-width) min-w-56 overflow-hidden p-0", onKeyDown: onContentKeyDown, onOpenAutoFocus: (e) => {
                            // Focus the search field with the caret after any letter typed on the trigger.
                            e.preventDefault();
                            const input = searchRef.current;
                            if (!input)
                                return;
                            input.focus();
                            input.setSelectionRange(input.value.length, input.value.length);
                        }, onEscapeKeyDown: (e) => {
                            // Escape in a rename field cancels the rename, not the whole popover.
                            if (editing) {
                                e.preventDefault();
                                cancelRename();
                            }
                        }, children: [mode === 'search' ? (_jsxs(Command, { shouldFilter: false, defaultValue: selectedOption, label: label ? `Search ${label}` : 'Search options', children: [_jsx(CommandInput, { ref: searchRef, value: query, onValueChange: setQuery, placeholder: searchPlaceholder ?? (label ? `Search ${label.toLowerCase()}…` : 'Search…') }), _jsxs(CommandList, { ref: listRef, label: listName, "aria-busy": pending || undefined, children: [filtered.length === 0 && !showCreate && (_jsx("p", { role: "presentation", className: "px-3 py-6 text-center text-12 text-muted comfortable:text-13", children: options.length === 0 ? 'No options yet' : emptyText })), filtered.map((option) => (_jsxs(CommandItem, { value: option, onSelect: () => pick(option), children: [_jsx("span", { className: "min-w-0 flex-1 truncate", children: option }), selectedOption === option && _jsx(Check, { className: "h-4 w-4 text-accent", "aria-hidden": "true" })] }, option))), showCreate && (_jsxs(CommandItem, { value: `${CREATE_ITEM_PREFIX}${trimmedQuery}`, disabled: pending, onSelect: () => void createAndPick(trimmedQuery), className: "font-medium text-accent data-[disabled=true]:text-muted", children: [pending ? (_jsx(Spinner, { decorative: true })) : (_jsx(Plus, { className: "h-4 w-4", "aria-hidden": "true" })), _jsx("span", { className: "min-w-0 flex-1 truncate", children: pending ? `Adding “${trimmedQuery}”…` : `Add “${trimmedQuery}”` })] })), showUseUnsaved && (_jsxs(CommandItem, { value: `${USE_UNSAVED_ITEM_PREFIX}${trimmedQuery}`, onSelect: () => pick(trimmedQuery), children: [_jsx(Check, { className: "h-4 w-4 text-muted", "aria-hidden": "true" }), _jsxs("span", { className: "min-w-0 flex-1 truncate", children: ["Use \u201C", trimmedQuery, "\u201D without saving it to the list"] })] })), allowListEditing && !trimmedQuery && (_jsxs(_Fragment, { children: [_jsx(CommandSeparator, {}), _jsx(CommandGroup, { children: _jsxs(CommandItem, { value: MANAGE_ITEM_VALUE, onSelect: enterManage, className: "text-ink-2", children: [_jsx(Settings2, { className: "h-4 w-4 text-muted", "aria-hidden": "true" }), "Manage list"] }) })] }))] })] })) : (_jsxs("div", { className: "flex flex-col text-13 comfortable:text-15", "aria-busy": pending || undefined, children: [_jsxs("div", { className: "flex h-control-lg items-center justify-between gap-2 border-b border-line pl-3 pr-2", children: [_jsxs("p", { id: manageHeadingId, className: "text-12 font-semibold text-ink-2 comfortable:text-13", children: ["Manage ", label ? label.toLowerCase() : 'list'] }), _jsx("button", { type: "button", "data-manage-done": "", onClick: leaveManage, className: linkButton('md'), children: "Done" })] }), allowCreate && (_jsxs("div", { className: "flex items-center gap-1.5 border-b border-line p-2", children: [_jsx("input", { type: "text", "data-manage-add": "", "aria-label": label ? `New ${label.toLowerCase()} option` : 'New option', placeholder: "Add an option\u2026", value: newOption, readOnly: pending, onChange: (e) => setNewOption(e.target.value), onKeyDown: (e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        void addFromManage();
                                                    }
                                                }, className: cn(inputSmBase, 'min-w-0 flex-1') }), _jsx("button", { type: "button", onClick: () => void addFromManage(), disabled: !newOption.trim(), ...busyButton, className: cn(btn.icon, busyClass), "aria-label": "Add option", children: _jsx(Plus, { className: "h-4 w-4", "aria-hidden": "true" }) })] })), _jsxs("ul", { "aria-labelledby": manageHeadingId, className: "max-h-72 overflow-y-auto p-1 custom-scrollbar", children: [options.length === 0 && (_jsx("li", { className: "px-3 py-6 text-center text-12 text-muted comfortable:text-13", children: "No options yet" })), options.map((option, index) => editing?.index === index ? (_jsxs("li", { className: "flex items-center gap-1 rounded-lg bg-subtle p-1", children: [_jsx("input", { type: "text", "data-rename-input": "", "aria-label": `New name for ${option}`, value: editing.text, readOnly: pending, onChange: (e) => setEditing({ index, text: e.target.value }), onKeyDown: (e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                void saveRename();
                                                            }
                                                        }, className: cn(inputSmBase, 'min-w-0 flex-1') }), _jsx("button", { type: "button", onClick: () => void saveRename(), ...busyButton, className: cn(btn.icon, busyClass), "aria-label": `Save new name for ${option}`, children: _jsx(Check, { className: "h-4 w-4", "aria-hidden": "true" }) }), _jsx("button", { type: "button", onClick: cancelRename, ...busyButton, className: cn(btn.icon, busyClass), "aria-label": "Cancel rename", children: _jsx(X, { className: "h-4 w-4", "aria-hidden": "true" }) })] }, `${option}-edit`)) : (_jsxs("li", { className: "flex h-control-md items-center gap-0.5 rounded-lg pl-3 pr-0.5 hover:bg-subtle", children: [_jsx("span", { className: "min-w-0 flex-1 truncate", children: option }), _jsx("button", { type: "button", "data-rename": index, onClick: () => startRename(index), ...busyButton, className: cn(btn.icon, busyClass), "aria-label": `Rename ${option}`, children: _jsx(Pencil, { className: "h-3.5 w-3.5", "aria-hidden": "true" }) }), _jsx("button", { type: "button", "data-delete": index, onClick: () => void remove(index), ...busyButton, className: cn(btn.iconDanger, busyClass), "aria-label": `Delete ${option}`, children: _jsx(Trash2, { className: "h-3.5 w-3.5", "aria-hidden": "true" }) })] }, option)))] })] })), error && (_jsxs("p", { role: "alert", className: "flex items-start gap-2 border-t border-danger-line bg-danger-bg px-3 py-2 text-12 text-danger comfortable:text-13", children: [_jsx(AlertOctagon, { className: "mt-0.5 h-3.5 w-3.5 shrink-0", "aria-hidden": "true" }), _jsx("span", { className: "min-w-0 flex-1", children: error })] }))] })] }), (required || name) && (
            // Native form validation and posting: browsers check this hidden mirror of the value
            // and, when it is empty and required, focus moves on to the trigger.
            _jsx("input", { tabIndex: -1, "aria-hidden": "true", name: name, required: required, disabled: disabled, value: value, onChange: () => { }, onFocus: () => triggerRef.current?.focus(), className: "pointer-events-none absolute bottom-0 left-4 h-px w-px opacity-0" }))] }));
}
export default Combobox;
