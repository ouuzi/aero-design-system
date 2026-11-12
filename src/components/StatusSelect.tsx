'use client';

import React, { useId } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './Popover.js';
import { StatusBadge } from './StatusBadge.js';
import { StatusSymbol } from './StatusSymbol.js';
import { labelDot, listOption, statusBadgeClass, statusSelectTrigger, type StatusBadgeWidth, type StatusTone } from './styles.js';
import { useListbox } from './useListbox.js';
import { cn } from '../lib/utils.js';

/*
 * StatusSelect: a status the assessor sets, shown as the status pill itself. The trigger
 * is the StatusBadge pill (120px Status-column pill by default) with a chevron; it opens a
 * short list of the statuses, each drawn as its pill with its symbol, the current one
 * ticked. Use it where a row's Status column is editable (the AES-CM-07 qualification
 * checks); everywhere else a status is read-only and is a <StatusBadge>.
 *
 *   const QUAL_RESULT_OPTIONS = [
 *     { value: 'Not Assessed', label: 'Pending', tone: 'warning' },
 *     { value: 'Yes', label: 'Valid', tone: 'success' },
 *     { value: 'No', label: 'Gap', tone: 'danger' },
 *     { value: 'N/A', label: 'N/A', tone: 'neutral' },
 *   ] as const satisfies readonly StatusOption[];
 *
 *   <StatusSelect
 *     aria-label={`${q.ref} status`}
 *     value={q.result || 'Not Assessed'}
 *     options={QUAL_RESULT_OPTIONS}
 *     onChange={(v) => handleUpdateQualCheck(idx, 'result', v)}
 *   />
 *
 * Keyboard (WAI-ARIA select-only combobox): on the pill, Enter, Space, Down or Up open the
 * list (Home / End open it on the first / last status; typing a letter opens it on the
 * first status that starts with it). In the list, Up / Down / Home / End / PageUp /
 * PageDown move, typing jumps to a status by its first letters, Enter or Space picks,
 * Alt+Up picks and closes, Escape closes without a change (a dialog around it stays open),
 * Tab closes without a change and moves on. Focus returns to the pill.
 *
 * Screen readers: the pill is a combobox whose name is `aria-label` (or `aria-labelledby`)
 * followed by the current status word ("QC-3 status, Valid": aria-labelledby points at both,
 * as in the WAI-ARIA select-only combobox), so the value is heard on focus; the list is a
 * listbox whose active option is announced through aria-activedescendant, each option read
 * by its word (the symbol is decoration).
 *
 * Colour and shape come from the status pill (statusBadgeClass), so an editable status and
 * a read-only one look the same in a column. The pill keeps its look and gets an invisible
 * hit area 2px above and below by default (a 20px auto pill reaches target-min, 24px), 6px
 * under comfortable density (36px); list rows are h-control-sm (32 / 40px).
 * Recipes: statusSelectTrigger (over statusBadgeClass) and listOption in styles.ts.
 */

export interface StatusOption<V extends string = string> {
  /** The stored value ("Yes"). */
  value: V;
  /** The word on the pill ("Valid"). Sentence case. */
  label: string;
  /** Status colour; success, warning and danger carry their symbol. Keep it in this table, not a ternary. */
  tone: StatusTone;
  /** One short line beside the pill in the list ("Evidence seen and in date"). */
  description?: string;
  /** Shown but cannot be picked. */
  disabled?: boolean;
}

export interface StatusSelectProps<V extends string = string> {
  /** The current value. A value that matches no option shows as a neutral pill with that text (or `placeholder`). */
  value: V | null | undefined;
  /** Called with the picked value, only when it differs from the current one. */
  onChange: (value: V) => void;
  /** The statuses, in the order the list shows them. */
  options: ReadonlyArray<StatusOption<V>>;
  /** Accessible name of the pill, e.g. "QC-3 status". Required unless `aria-labelledby` is given. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  /** Id of the pill (the combobox), e.g. for a <label htmlFor>. */
  id?: string;
  /** `column` (default) the 120px Status-column pill, centred; `auto` an inline pill sized to its word. */
  width?: StatusBadgeWidth;
  /** Shown, neutral, when `value` is empty. Default "Not set". */
  placeholder?: string;
  /** Leading dot on neutral statuses (pill and list), as on StatusBadge. */
  dot?: boolean;
  disabled?: boolean;
  /** Form field name: the value is posted in a hidden input. */
  name?: string;
  /** Where the list lines up with the pill. Default: centred for `column`, start for `auto`. */
  align?: 'start' | 'center' | 'end';
  /** Layout classes for the pill (margins, placement). */
  className?: string;
}

export function StatusSelect<V extends string = string>({
  value,
  onChange,
  options,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': describedBy,
  id,
  width = 'column',
  placeholder = 'Not set',
  dot = false,
  disabled = false,
  name,
  align,
  className,
}: StatusSelectProps<V>) {
  const baseId = useId();
  const triggerId = id ?? `${baseId}-trigger`;
  const nameId = `${baseId}-name`;
  const valueId = `${baseId}-value`;
  // Name then value: "QC-3 status, Valid". aria-label alone would hide the status word.
  const triggerLabelledBy = `${ariaLabelledBy ?? (ariaLabel ? nameId : '')} ${valueId}`.trim();

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const tone: StatusTone = selected?.tone ?? 'neutral';
  const label = selected?.label ?? (value ? String(value) : placeholder);

  const { open, onOpenChange, triggerRef, listId, onTriggerKeyDown, listProps, optionProps, onOpenAutoFocus } = useListbox({
    items: options,
    selectedIndex,
    disabled,
    onPick: (index) => {
      if (options[index].value !== value) onChange(options[index].value);
    },
  });

  return (
    <>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <button
            ref={triggerRef}
            type="button"
            id={triggerId}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-labelledby={triggerLabelledBy}
            aria-describedby={describedBy}
            disabled={disabled}
            onKeyDown={onTriggerKeyDown}
            className={cn(statusBadgeClass(tone, width), statusSelectTrigger, className)}
          >
            {ariaLabel && !ariaLabelledBy && (
              <span id={nameId} className="sr-only">
                {ariaLabel}
              </span>
            )}
            {tone === 'neutral' ? (
              dot && <span className={labelDot} aria-hidden="true" />
            ) : (
              <StatusSymbol tone={tone} />
            )}
            <span id={valueId} className={cn('min-w-0 truncate', !selected && !value && 'font-medium')}>
              {label}
            </span>
            <ChevronDown
              className={cn('h-3.5 w-3.5 shrink-0 transition-transform', open && 'rotate-180')}
              strokeWidth={2.25}
              aria-hidden="true"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          // The panel is only a frame around the listbox: no dialog role, so a screen reader
          // goes straight from the combobox to its listbox.
          role="presentation"
          align={align ?? (width === 'column' ? 'center' : 'start')}
          sideOffset={4}
          className="w-auto min-w-48 max-w-80 p-1"
          onOpenAutoFocus={onOpenAutoFocus}
        >
          <div
            {...listProps}
            aria-labelledby={ariaLabelledBy ?? (ariaLabel ? nameId : triggerId)}
            className="max-h-72 overflow-y-auto outline-none custom-scrollbar"
          >
            {options.map((option, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div key={option.value} {...optionProps(index)} className={listOption}>
                  <StatusBadge tone={option.tone} dot={dot}>
                    {option.label}
                  </StatusBadge>
                  {option.description && (
                    <span className="min-w-0 flex-1 truncate text-12 text-muted comfortable:text-13">{option.description}</span>
                  )}
                  <Check
                    className={cn('ml-auto h-4 w-4 shrink-0 text-accent', !isSelected && 'invisible')}
                    aria-hidden="true"
                  />
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      {name && <input type="hidden" name={name} value={value ?? ''} disabled={disabled} />}
    </>
  );
}

export default StatusSelect;
