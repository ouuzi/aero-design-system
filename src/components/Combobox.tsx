'use client';

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AlertOctagon, Check, ChevronDown, Pencil, Plus, Settings2, Trash2, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './Popover.js';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './Command.js';
import { useFieldControl } from './Field.js';
import { Spinner } from './Spinner.js';
import { ariaDisabled, btn, fieldInvalid, fieldOpen, inputSmBase, linkButton, selectSizes, type ControlSize } from './styles.js';
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

function sameText(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  /**
   * What the list holds ("Category"). Names the search field ("Search Category") and the
   * list ("Category options") for screen readers. The trigger takes its name from Field's label.
   */
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  /** Shown when the search matches nothing. */
  emptyText?: string;
  /** `lg` 40px (default, forms), `md` 36px (toolbars), `sm` 32px (table cells), like Select. */
  size?: ControlSize;
  id?: string;
  invalid?: boolean;
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  required?: boolean;
  disabled?: boolean;
  /** Form field name: the value is posted in a hidden input. */
  name?: string;
  /** Layout classes for the wrapper (width, grid placement). */
  className?: string;
  /** Offer Add "<query>" when the search matches no option exactly. */
  allowCreate?: boolean;
  /** Called with the new value when Add is picked. Rejecting shows an inline error and keeps the popover open. */
  onCreate?: (value: string) => Promise<void> | void;
  /** Called with the updated list after a successful add, rename or delete. */
  onOptionsChange?: (options: string[]) => void;
  /** Saves the updated list (e.g. to Firestore). Rejecting shows an inline error and leaves the list as it was. */
  onPersistOptions?: (options: string[]) => Promise<void> | void;
  /** Catalog the list is saved to; used in error logs. */
  catalogId?: string;
  /** Offer "Manage list" (rename and delete options). */
  allowListEditing?: boolean;
}

export function Combobox({
  value,
  onChange,
  options: suppliedOptions,
  label,
  placeholder = 'Select…',
  searchPlaceholder,
  emptyText = 'No matching options',
  size = 'lg',
  id: idProp,
  invalid: invalidProp,
  'aria-describedby': describedByProp,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  required = false,
  disabled = false,
  name,
  className,
  allowCreate = false,
  onCreate,
  onOptionsChange,
  onPersistOptions,
  catalogId,
  allowListEditing = false,
}: ComboboxProps) {
  const { id, invalid, describedBy } = useFieldControl({ id: idProp, invalid: invalidProp, describedBy: describedByProp });
  const baseId = useId();
  const popupId = `${baseId}-popup`;
  const manageHeadingId = `${baseId}-manage`;

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'search' | 'manage'>('search');
  const [query, setQuery] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ index: number; text: string } | null>(null);
  const [newOption, setNewOption] = useState('');
  const [listId, setListId] = useState<string | undefined>(undefined);
  /** A value whose Add failed to save: offered as "Use without saving" so the form can still go ahead. */
  const [unsaved, setUnsaved] = useState<string | null>(null);

  // Editable copy of the list, reset when the parent supplies a new snapshot (guarded
  // render-time adjustment, as React recommends over a state-syncing effect).
  const [options, setOptions] = useState<string[]>(suppliedOptions);
  const [optionsSource, setOptionsSource] = useState(suppliedOptions);
  if (optionsSource.length !== suppliedOptions.length || optionsSource.some((o, i) => o !== suppliedOptions[i])) {
    setOptionsSource(suppliedOptions);
    setOptions(suppliedOptions);
  }

  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  /** A selector inside the popover to focus after the next render (manage mode moves). */
  const focusRequest = useRef<string | null>(null);
  // cmdk sets its own list id; read it so the trigger's aria-controls can point at the listbox.
  const listRef = useCallback((el: HTMLDivElement | null) => setListId(el?.id || undefined), []);

  useEffect(() => {
    if (!focusRequest.current || !contentRef.current) return;
    const target = contentRef.current.querySelector<HTMLElement>(focusRequest.current);
    focusRequest.current = null;
    target?.focus();
  });

  const setOpenState = (next: boolean) => {
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

  const openWithQuery = (initial: string) => {
    setQuery(initial);
    setOpen(true);
  };

  const pick = (option: string) => {
    onChange(option);
    setOpenState(false);
  };

  const persist = async (updated: string[]): Promise<boolean> => {
    setError(null);
    setPending(true);
    try {
      await onPersistOptions?.(updated);
      setOptions(updated);
      onOptionsChange?.(updated);
      return true;
    } catch (err) {
      console.error(`Unable to save dropdown catalog${catalogId ? ` [${catalogId}]` : ''}:`, err);
      setError(LIST_SAVE_ERROR);
      return false;
    } finally {
      setPending(false);
    }
  };

  const create = async (raw: string): Promise<boolean> => {
    const clean = raw.trim();
    if (!allowCreate || !clean || pending) return false;
    const existing = options.find((o) => sameText(o, clean));
    if (existing) return true;
    const updated = [...options, clean];
    setUnsaved(null);
    if (onCreate) {
      setError(null);
      setPending(true);
      try {
        await onCreate(clean);
      } catch (err) {
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
    if (!saved) setUnsaved(clean);
    return saved;
  };

  const createAndPick = async (raw: string) => {
    const clean = raw.trim();
    if (!(await create(clean))) return;
    pick(options.find((o) => sameText(o, clean)) ?? clean);
  };

  const addFromManage = async () => {
    const clean = newOption.trim();
    if (!clean || pending) return;
    if (options.some((o) => sameText(o, clean))) {
      setError(`“${clean}” is already in the list.`);
      return;
    }
    if (await create(clean)) {
      setNewOption('');
      focusRequest.current = '[data-manage-add]';
    }
  };

  const startRename = (index: number) => {
    if (pending) return;
    setError(null);
    setEditing({ index, text: options[index] });
    focusRequest.current = '[data-rename-input]';
  };

  const cancelRename = () => {
    if (!editing || pending) return;
    focusRequest.current = `[data-rename="${editing.index}"]`;
    setEditing(null);
  };

  const saveRename = async () => {
    if (!editing || pending) return;
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
      if (!(await persist(updated))) return;
      if (value === old) onChange(clean);
    }
    focusRequest.current = `[data-rename="${editing.index}"]`;
    setEditing(null);
  };

  const remove = async (index: number) => {
    if (pending) return;
    const target = options[index];
    const updated = options.filter((_, i) => i !== index);
    if (!(await persist(updated))) return;
    // A deleted value is cleared rather than swapped for another option.
    if (value === target) onChange('');
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

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || open) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      openWithQuery('');
    } else if (e.key.length === 1 && e.key !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      openWithQuery(e.key);
    }
  };

  const onContentKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || e.altKey || e.ctrlKey || e.metaKey) return;
    if (mode === 'search') {
      // Like a native select: Tab closes the list and moves on from the trigger.
      triggerRef.current?.focus();
      setOpenState(false);
      return;
    }
    // Manage panel: keep Tab inside it until Done or Escape.
    const root = contentRef.current;
    if (!root) return;
    const tabbable = Array.from(root.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled)'));
    if (tabbable.length === 0) return;
    const first = tabbable[0];
    const last = tabbable[tabbable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // While a save is in flight the manage panel's controls are aria-disabled / read-only rather
  // than disabled, so the focused control keeps focus (a disabled one drops it to <body>,
  // and a failed save would leave keyboard users nowhere).
  const busyButton = pending ? ({ 'aria-disabled': true } as const) : {};

  const trimmedQuery = query.trim();
  const filtered = trimmedQuery ? options.filter((o) => o.toLowerCase().includes(trimmedQuery.toLowerCase())) : options;
  const showCreate = allowCreate && trimmedQuery !== '' && !options.some((o) => sameText(o, trimmedQuery));
  const showUseUnsaved = showCreate && !pending && unsaved !== null && sameText(unsaved, trimmedQuery);
  const listName = label ? `${label} options` : 'Options';
  const selectedOption = options.find((o) => o === value) ?? options.find((o) => sameText(o, value));

  return (
    <div className={cn('relative', className)}>
      <Popover open={open} onOpenChange={setOpenState}>
        <PopoverTrigger asChild>
          <button
            ref={triggerRef}
            type="button"
            id={id}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? (mode === 'search' && listId ? listId : popupId) : undefined}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={describedBy}
            aria-required={required || undefined}
            aria-invalid={invalid || undefined}
            disabled={disabled}
            onKeyDown={onTriggerKeyDown}
            className={cn(
              'relative flex w-full items-center text-left',
              triggerSize[size],
              // After the size recipe: its px-* would otherwise win the merge and the text would run under the chevron.
              'pr-9',
              fieldOpen,
              invalid && invalidFrame,
            )}
          >
            <span className={cn('min-w-0 flex-1 truncate', !value && 'text-muted')}>{value || placeholder}</span>
            <ChevronDown
              className={cn(
                'pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-transform',
                disabled ? 'text-disabled' : 'text-muted',
                open && 'rotate-180',
              )}
              aria-hidden="true"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          ref={contentRef}
          id={popupId}
          align="start"
          aria-label={label ? `Choose ${label}` : 'Choose an option'}
          className="w-(--radix-popover-trigger-width) min-w-56 overflow-hidden p-0"
          onKeyDown={onContentKeyDown}
          onOpenAutoFocus={(e) => {
            // Focus the search field with the caret after any letter typed on the trigger.
            e.preventDefault();
            const input = searchRef.current;
            if (!input) return;
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
          }}
          onEscapeKeyDown={(e) => {
            // Escape in a rename field cancels the rename, not the whole popover.
            if (editing) {
              e.preventDefault();
              cancelRename();
            }
          }}
        >
          {mode === 'search' ? (
            <Command shouldFilter={false} defaultValue={selectedOption} label={label ? `Search ${label}` : 'Search options'}>
              <CommandInput ref={searchRef} value={query} onValueChange={setQuery} placeholder={searchPlaceholder ?? (label ? `Search ${label.toLowerCase()}…` : 'Search…')} />
              <CommandList ref={listRef} label={listName} aria-busy={pending || undefined}>
                {filtered.length === 0 && !showCreate && (
                  <p role="presentation" className="px-3 py-6 text-center text-12 text-muted comfortable:text-13">
                    {options.length === 0 ? 'No options yet' : emptyText}
                  </p>
                )}
                {filtered.map((option) => (
                  <CommandItem key={option} value={option} onSelect={() => pick(option)}>
                    <span className="min-w-0 flex-1 truncate">{option}</span>
                    {selectedOption === option && <Check className="h-4 w-4 text-accent" aria-hidden="true" />}
                  </CommandItem>
                ))}
                {showCreate && (
                  <CommandItem
                    value={`${CREATE_ITEM_PREFIX}${trimmedQuery}`}
                    disabled={pending}
                    onSelect={() => void createAndPick(trimmedQuery)}
                    className="font-medium text-accent data-[disabled=true]:text-muted"
                  >
                    {pending ? (
                      <Spinner decorative />
                    ) : (
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="min-w-0 flex-1 truncate">
                      {pending ? `Adding “${trimmedQuery}”…` : `Add “${trimmedQuery}”`}
                    </span>
                  </CommandItem>
                )}
                {showUseUnsaved && (
                  <CommandItem value={`${USE_UNSAVED_ITEM_PREFIX}${trimmedQuery}`} onSelect={() => pick(trimmedQuery)}>
                    <Check className="h-4 w-4 text-muted" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate">Use “{trimmedQuery}” without saving it to the list</span>
                  </CommandItem>
                )}
                {allowListEditing && !trimmedQuery && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem value={MANAGE_ITEM_VALUE} onSelect={enterManage} className="text-ink-2">
                        <Settings2 className="h-4 w-4 text-muted" aria-hidden="true" />
                        Manage list
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          ) : (
            <div className="flex flex-col text-13 comfortable:text-15" aria-busy={pending || undefined}>
              <div className="flex h-control-lg items-center justify-between gap-2 border-b border-line pl-3 pr-2">
                <p id={manageHeadingId} className="text-12 font-semibold text-ink-2 comfortable:text-13">
                  Manage {label ? label.toLowerCase() : 'list'}
                </p>
                <button type="button" data-manage-done="" onClick={leaveManage} className={linkButton('md')}>
                  Done
                </button>
              </div>
              {allowCreate && (
                <div className="flex items-center gap-1.5 border-b border-line p-2">
                  <input
                    type="text"
                    data-manage-add=""
                    aria-label={label ? `New ${label.toLowerCase()} option` : 'New option'}
                    placeholder="Add an option…"
                    value={newOption}
                    readOnly={pending}
                    onChange={(e) => setNewOption(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        void addFromManage();
                      }
                    }}
                    className={cn(inputSmBase, 'min-w-0 flex-1')}
                  />
                  <button
                    type="button"
                    onClick={() => void addFromManage()}
                    disabled={!newOption.trim()}
                    {...busyButton}
                    className={cn(btn.icon, busyClass)}
                    aria-label="Add option"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              )}
              <ul aria-labelledby={manageHeadingId} className="max-h-72 overflow-y-auto p-1 custom-scrollbar">
                {options.length === 0 && (
                  <li className="px-3 py-6 text-center text-12 text-muted comfortable:text-13">No options yet</li>
                )}
                {options.map((option, index) =>
                  editing?.index === index ? (
                    <li key={`${option}-edit`} className="flex items-center gap-1 rounded-lg bg-subtle p-1">
                      <input
                        type="text"
                        data-rename-input=""
                        aria-label={`New name for ${option}`}
                        value={editing.text}
                        readOnly={pending}
                        onChange={(e) => setEditing({ index, text: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            void saveRename();
                          }
                        }}
                        className={cn(inputSmBase, 'min-w-0 flex-1')}
                      />
                      <button type="button" onClick={() => void saveRename()} {...busyButton} className={cn(btn.icon, busyClass)} aria-label={`Save new name for ${option}`}>
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button type="button" onClick={cancelRename} {...busyButton} className={cn(btn.icon, busyClass)} aria-label="Cancel rename">
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </li>
                  ) : (
                    <li key={option} className="flex h-control-md items-center gap-0.5 rounded-lg pl-3 pr-0.5 hover:bg-subtle">
                      <span className="min-w-0 flex-1 truncate">{option}</span>
                      <button
                        type="button"
                        data-rename={index}
                        onClick={() => startRename(index)}
                        {...busyButton}
                        className={cn(btn.icon, busyClass)}
                        aria-label={`Rename ${option}`}
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        data-delete={index}
                        onClick={() => void remove(index)}
                        {...busyButton}
                        className={cn(btn.iconDanger, busyClass)}
                        aria-label={`Delete ${option}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}
          {error && (
            <p role="alert" className="flex items-start gap-2 border-t border-danger-line bg-danger-bg px-3 py-2 text-12 text-danger comfortable:text-13">
              <AlertOctagon className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="min-w-0 flex-1">{error}</span>
            </p>
          )}
        </PopoverContent>
      </Popover>
      {(required || name) && (
        // Native form validation and posting: browsers check this hidden mirror of the value
        // and, when it is empty and required, focus moves on to the trigger.
        <input
          tabIndex={-1}
          aria-hidden="true"
          name={name}
          required={required}
          disabled={disabled}
          value={value}
          onChange={() => {}}
          onFocus={() => triggerRef.current?.focus()}
          className="pointer-events-none absolute bottom-0 left-4 h-px w-px opacity-0"
        />
      )}
    </div>
  );
}

export default Combobox;
