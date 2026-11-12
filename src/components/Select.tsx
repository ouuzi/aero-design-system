'use client';

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './Popover.js';
import { useFieldControl } from './Field.js';
import { parseSelectOptions, selectedOptionIndex, type SelectOptionItem } from './selectOptions.js';
import { useListbox } from './useListbox.js';
import {
  fieldInvalid,
  listboxPanel,
  listboxScroll,
  listGroupLabel,
  listOption,
  listOptionCheck,
  nativeSelectHidden,
  selectChevron,
  selectChevronInline,
  selectFilterTrigger,
  selectSizes,
  selectTrigger,
  selectValue,
  selectValueSizer,
  selectValueText,
  type ControlSize,
} from './styles.js';
import { cn } from '../lib/utils.js';

/*
 * Select and FilterSelect: the kit's dropdowns. Written like a native select, drawn by the kit.
 *
 *   <Field label="Department" required>
 *     <Select value={dept} onChange={(e) => setDept(e.target.value)} required>
 *       <option value="">Select a department</option>
 *       {departments.map((d) => <option key={d} value={d}>{d}</option>)}
 *     </Select>
 *   </Field>
 *
 *   <FilterSelect label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>…</FilterSelect>
 *
 * How it works: the children (<option>, <optgroup>, fragments, arrays, `{x && <option>}`) go
 * into a native <select> that is visually hidden (aria-hidden, out of the Tab order) but stays
 * in the form, so `name`, `required` validation, `form`, the ref and `value` / `defaultValue`
 * behave as before. On top sits a <button role="combobox"> on the select frame, and a listbox
 * popup drawn from the same children. Picking an option sets the native select's value and
 * dispatches a bubbling `change` event on it, so `onChange` receives a real change event and
 * `e.target.value` is the picked value. If the parent does not take the new value (a
 * controlled select that ignores it), React puts the old one back, as with a native select.
 *
 * The trigger is the control people and assistive technology use: it takes the `id` (so a
 * <Field> label or <label htmlFor> points at it), aria-label / aria-labelledby /
 * aria-describedby, aria-invalid and aria-required, `className`, `title` and the focus
 * handlers. Something that focuses the hidden select (the browser reporting a required
 * field, ref.current.focus()) has focus moved to the trigger.
 *
 * Shows like a native select: the option whose value is `value`, else the first option that
 * is not disabled. An empty value ("Select a position") is muted in Select. The trigger is as
 * wide as its longest option when its width is `w-auto`; a long value truncates, list rows
 * wrap. Keyboard and screen-reader behaviour: see useListbox.ts (select-only combobox).
 *
 * The list is the floating surface (Popover: portalled on body, z-[80] above every dialog
 * layer, Escape closes only the list, focus returns to the trigger), at least as wide as the
 * trigger, scrolling after nine rows, flipping above the trigger when there is no room below.
 * Recipes: selectTrigger, selectFilterTrigger, listboxPanel, listOption in styles.ts.
 */

export type { ControlSize };

type NativeSelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>;

export interface SelectProps extends NativeSelectProps {
  /** `lg` 40px (default, forms), `md` 36px (toolbars), `sm` 32px (table cells). */
  size?: ControlSize;
  invalid?: boolean;
}

export interface FilterSelectProps extends NativeSelectProps {
  /** Shown inside the box before the value: "Dept", "Status". */
  label: string;
}

type Look = { kind: 'field'; size: ControlSize; invalid?: boolean } | { kind: 'filter'; label: string };

/** Sets a select's value as the browser does for a pick, past React's value property wrapper. */
function setNativeValue(select: HTMLSelectElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
  if (setter) setter.call(select, value);
  else select.value = value;
}

/** Consecutive options of the same <optgroup> (or of none), in order. */
function sections(options: SelectOptionItem[]) {
  const out: Array<{ group: number; options: SelectOptionItem[] }> = [];
  for (const option of options) {
    if (option.hidden) continue;
    const last = out[out.length - 1];
    if (last && last.group === option.group) last.options.push(option);
    else out.push({ group: option.group, options: [option] });
  }
  return out;
}

const ListboxSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps & { look: Look }>(function ListboxSelect(
  {
    look,
    children,
    value,
    defaultValue,
    onChange,
    onInput,
    onInvalid,
    name,
    required,
    disabled = false,
    form,
    autoComplete,
    multiple: _multiple, // single select only: the listbox picks one value
    className,
    id: idProp,
    'aria-describedby': describedByProp,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    onKeyDown,
    ...triggerRest
  },
  ref,
) {
  const field = useFieldControl({
    id: idProp,
    invalid: look.kind === 'field' ? look.invalid : undefined,
    describedBy: describedByProp,
  });
  const baseId = useId();
  const triggerId = field.id ?? `${baseId}-trigger`;
  const filterLabelId = `${baseId}-label`;

  const { options, groups } = parseSelectOptions(children);
  const controlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(() =>
    defaultValue === undefined ? undefined : String(defaultValue),
  );
  const selectedIndex = selectedOptionIndex(options, controlled ? String(value) : uncontrolledValue);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const selectRef = useRef<HTMLSelectElement | null>(null);
  const setSelectRef = useCallback(
    (el: HTMLSelectElement | null) => {
      selectRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) ref.current = el;
    },
    [ref],
  );

  const { open, onOpenChange, triggerRef, listId, onTriggerKeyDown, listProps, optionProps, onOpenAutoFocus } = useListbox({
    items: options.map((o) => ({ label: o.label, disabled: o.disabled || o.hidden })),
    selectedIndex,
    disabled,
    onPick: (index) => {
      const option = options[index];
      const select = selectRef.current;
      if (!option || !select || option.value === selected?.value) return;
      setNativeValue(select, option.value);
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
      if (!controlled) setUncontrolledValue(option.value);
    },
  });

  // Uncontrolled: a form reset puts the native select back to its default; show that.
  useEffect(() => {
    const formEl = selectRef.current?.form;
    if (controlled || !formEl) return;
    const onReset = () => window.setTimeout(() => setUncontrolledValue(selectRef.current?.value), 0);
    formEl.addEventListener('reset', onReset);
    return () => formEl.removeEventListener('reset', onReset);
  }, [controlled]);

  const isFilter = look.kind === 'filter';
  const empty = !selected || selected.value === '';
  const listName = ariaLabelledBy
    ? { 'aria-labelledby': ariaLabelledBy }
    : ariaLabel
      ? { 'aria-label': ariaLabel }
      : isFilter
        ? { 'aria-labelledby': filterLabelId }
        : field.labelId
          ? { 'aria-labelledby': field.labelId }
          : {};
  const { ref: listRef, ...listRest } = listProps;
  // A Select labelled by a <label htmlFor> outside a Field: name the list after that label too.
  const setListRef = (el: HTMLDivElement | null) => {
    listRef.current = el;
    if (!el || el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby')) return;
    const trigger = document.getElementById(triggerId) as HTMLButtonElement | null;
    const text = trigger?.labels?.[0]?.textContent?.trim();
    if (text) el.setAttribute('aria-label', text);
    else el.setAttribute('aria-labelledby', triggerId);
  };

  return (
    <>
      <select
        ref={setSelectRef}
        aria-hidden="true"
        tabIndex={-1}
        className={nativeSelectHidden}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onInput={onInput}
        onInvalid={onInvalid}
        onFocus={() => triggerRef.current?.focus()}
        name={name}
        required={required}
        disabled={disabled}
        form={form}
        autoComplete={autoComplete}
      >
        {children}
      </select>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <button
            {...(triggerRest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
            ref={triggerRef}
            type="button"
            id={triggerId}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy ?? (isFilter && !ariaLabel ? filterLabelId : undefined)}
            aria-describedby={field.describedBy}
            aria-invalid={field.invalid || undefined}
            aria-required={required || undefined}
            disabled={disabled}
            onKeyDown={(e) => {
              (onKeyDown as React.KeyboardEventHandler<HTMLButtonElement> | undefined)?.(e);
              if (!e.defaultPrevented) onTriggerKeyDown(e);
            }}
            className={
              look.kind === 'field'
                ? cn(selectTrigger(look.size), field.invalid && fieldInvalid, className)
                : cn(selectFilterTrigger, className)
            }
          >
            {look.kind === 'filter' && (
              // Hidden from the content (the value), still the trigger's name through aria-labelledby.
              <span id={filterLabelId} aria-hidden="true" className="shrink-0 font-medium text-ink-2">
                {look.label}:
              </span>
            )}
            <span className={selectValue}>
              <span className={cn(selectValueText, isFilter ? 'font-medium text-ink' : empty && !disabled && 'text-muted')}>
                {selected?.label}
              </span>
              {options.map((o) => (
                <span key={o.index} aria-hidden="true" className={selectValueSizer}>
                  {o.label}
                </span>
              ))}
            </span>
            <ChevronDown className={isFilter ? selectChevronInline(open, disabled) : selectChevron(open, disabled)} aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          // Only a frame around the listbox: no dialog role, so a screen reader goes straight
          // from the combobox to its listbox.
          role="presentation"
          align="start"
          sideOffset={4}
          collisionPadding={8}
          className={listboxPanel}
          onOpenAutoFocus={onOpenAutoFocus}
        >
          <div {...listRest} ref={setListRef} {...listName} className={listboxScroll}>
            {sections(options).map((section) => {
              const rows = section.options.map((option) => {
                const isSelected = option.index === selectedIndex;
                return (
                  <div key={option.index} {...optionProps(option.index)} className={cn(listOption, isSelected && 'font-medium')}>
                    <Check className={listOptionCheck(isSelected)} aria-hidden="true" />
                    <span className="min-w-0 flex-1 break-words">{option.label}</span>
                  </div>
                );
              });
              if (section.group < 0) return <React.Fragment key={`o${section.options[0].index}`}>{rows}</React.Fragment>;
              const headingId = `${baseId}-group-${section.options[0].index}`;
              return (
                <div key={`g${section.options[0].index}`} role="group" aria-labelledby={headingId}>
                  <div id={headingId} role="presentation" className={listGroupLabel}>
                    {groups[section.group].label}
                  </div>
                  {rows}
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
});

/** A form dropdown: `<option>` / `<optgroup>` children, `value` / `onChange` as on a native select. */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select({ size = 'lg', invalid, ...rest }, ref) {
  return <ListboxSelect ref={ref} look={{ kind: 'field', size, invalid }} {...rest} />;
});

/** A toolbar filter with its label inside the box ("Dept: All departments"). */
export function FilterSelect({ label, ...rest }: FilterSelectProps) {
  return <ListboxSelect look={{ kind: 'filter', label }} {...rest} />;
}
