'use client';

import React, { useId } from 'react';
import { ChoiceGroupContext, ChoiceGroupFrame, ChoiceText, type ChoiceGroupDefaults, type ChoiceGroupFrameProps } from './Checkbox.js';
import {
  choiceBox,
  choiceBoxInvalid,
  choiceGlyph,
  choiceRoot,
  choiceTarget,
  type ChoiceSize,
  type ChoiceVariant,
} from './styles.js';
import { cn } from '../lib/utils.js';

/*
 * Radio and RadioGroup: one choice from a short list that stays visible (two to six
 * options, each with a sentence or a description). For two to four peer views or filters
 * use SegmentedControl; for a long list use Select or Combobox.
 *
 * Native <input type="radio"> sharing one `name`, so the browser gives the keyboard model:
 * Tab enters the group on the chosen option (the first when none is chosen), the arrow keys
 * move and choose, Space chooses. RadioGroup is a <fieldset role="radiogroup"> named by its
 * <legend>, with aria-required / aria-invalid and the hint or error as its description.
 *
 * Look: the same 16px box as Checkbox, round, filled navy with a white dot when chosen, in a
 * 24px target (20px in 32px under comfortable density); `variant="card"` makes each option a
 * bordered tile that fills while chosen. Never wrap a Radio in your own <label>.
 */

/* ------------------------------------------------------------------------------------------
 * Group context
 * ---------------------------------------------------------------------------------------- */

interface RadioGroupContextValue extends ChoiceGroupDefaults {
  name: string;
  value: string | null | undefined;
  onChange: (value: string) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

/* ------------------------------------------------------------------------------------------
 * Radio
 * ---------------------------------------------------------------------------------------- */

type NativeRadio = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'children' | 'value'>;

interface RadioOwnProps {
  /** This option's value. Inside a RadioGroup it is chosen when it equals the group's `value`. */
  value: string;
  /** The visible text. Clicking it chooses the option, and it is the accessible name. Keep links and buttons out of it. */
  label?: React.ReactNode;
  /** One line under the label ("Applies to all active personnel"). Read after the name. */
  description?: React.ReactNode;
  /** Danger edge without a message (RadioGroup's `error` sets this on every option). */
  invalid?: boolean;
  /** Label text: `md` 13px (default), `sm` 12px. Defaults to the group's. */
  size?: ChoiceSize;
  /** `plain` (default) or `card`. Defaults to the group's. */
  variant?: ChoiceVariant;
  /** Classes for the outer <label> (layout only). */
  className?: string;
}

/** A radio must have a name: visible `label`, or `aria-label` / `aria-labelledby`. */
type RadioName =
  | { label: React.ReactNode }
  | { label?: undefined; 'aria-label': string }
  | { label?: undefined; 'aria-labelledby': string };

export type RadioProps = NativeRadio & RadioOwnProps & RadioName;

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(props, ref) {
  const {
    value,
    label,
    description,
    invalid,
    size,
    variant,
    className,
    id,
    name,
    checked,
    onChange,
    disabled,
    required,
    'aria-describedby': describedBy,
    'aria-labelledby': labelledBy,
    ...rest
  } = props;

  const group = React.useContext(RadioGroupContext);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = `${inputId}-label`;
  const noteId = `${inputId}-note`;

  const resolvedSize = size ?? group?.size ?? 'md';
  const resolvedVariant = variant ?? group?.variant ?? 'plain';
  const isDisabled = disabled ?? group?.disabled ?? false;
  const isInvalid = invalid ?? group?.invalid ?? false;
  const hasLabel = label !== undefined && label !== null && label !== false;

  // In a group the group owns name, checked and the change; alone, the native props do.
  const groupProps = group
    ? {
        name: name ?? group.name,
        checked: group.value === value,
        required: required ?? group.required,
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
          onChange?.(event);
          if (event.target.checked) group.onChange(value);
        },
      }
    : { name, checked, required, onChange };

  const describedByIds = [describedBy, description && hasLabel ? noteId : undefined].filter(Boolean).join(' ') || undefined;

  const input = (
    <input
      ref={ref}
      type="radio"
      id={inputId}
      value={value}
      disabled={isDisabled}
      // aria-invalid belongs on the radiogroup (RadioGroup sets it), not on a radio.
      aria-describedby={describedByIds}
      aria-labelledby={labelledBy ?? (hasLabel ? labelId : undefined)}
      className={cn(choiceBox, 'rounded-full', isInvalid && choiceBoxInvalid)}
      {...groupProps}
      {...rest}
    />
  );
  const dot = (
    <span
      className={cn(choiceGlyph, 'size-1.5 rounded-full bg-on-solid opacity-0 peer-checked:opacity-100 comfortable:size-2')}
      aria-hidden="true"
    />
  );

  if (!hasLabel) {
    return (
      <label className={cn(choiceTarget, 'cursor-pointer align-middle', isDisabled && 'cursor-not-allowed', className)}>
        {input}
        {dot}
      </label>
    );
  }

  return (
    <label htmlFor={inputId} className={cn(choiceRoot(resolvedVariant, { disabled: isDisabled, invalid: isInvalid }), className)}>
      <span className={choiceTarget}>
        {input}
        {dot}
      </span>
      <ChoiceText
        label={label}
        labelId={labelId}
        note={description}
        noteId={noteId}
        noteIsError={false}
        size={resolvedSize}
        variant={resolvedVariant}
        disabled={isDisabled}
      />
    </label>
  );
});

/* ------------------------------------------------------------------------------------------
 * RadioGroup
 * ---------------------------------------------------------------------------------------- */

export interface RadioGroupProps<T extends string = string> extends ChoiceGroupFrameProps {
  /** The chosen option's value; `null` or `undefined` when nothing is chosen yet. Controlled. */
  value: T | null | undefined;
  /** Called with the newly chosen option's value. */
  onChange: (value: T) => void;
  /** The radios' shared `name` (for a form post). Generated when omitted. */
  name?: string;
  /** Label size for every option. */
  size?: ChoiceSize;
  /** `plain` (default) or `card` for every option. */
  variant?: ChoiceVariant;
}

/**
 * One choice from a visible list. Controlled: pass `value` and `onChange`; each <Radio>
 * inside gives its own `value` and `label`. Values are strings (the DOM's); map booleans or
 * numbers at the call site, e.g. `value={required ? 'yes' : 'no'}`.
 */
export function RadioGroup<T extends string = string>({
  value,
  onChange,
  name,
  size,
  variant = 'plain',
  disabled,
  required,
  error,
  children,
  ...frame
}: RadioGroupProps<T>) {
  const generatedName = useId();
  const invalid = Boolean(error);
  const groupName = name ?? generatedName;
  const context = React.useMemo<RadioGroupContextValue>(
    () => ({
      name: groupName,
      value,
      // The DOM hands back the string of a Radio rendered with one of T's values.
      onChange: (next: string) => onChange(next as T),
      size,
      variant,
      disabled,
      invalid,
      required,
    }),
    [groupName, value, onChange, size, variant, disabled, invalid, required],
  );
  return (
    <RadioGroupContext.Provider value={context}>
      {/* A RadioGroup does not hand defaults to a Checkbox nested in a card's text. */}
      <ChoiceGroupContext.Provider value={null}>
        <ChoiceGroupFrame
          {...frame}
          role="radiogroup"
          error={error}
          required={required}
          disabled={disabled}
          variant={variant}
          ariaState={{ invalid, required }}
        >
          {children}
        </ChoiceGroupFrame>
      </ChoiceGroupContext.Provider>
    </RadioGroupContext.Provider>
  );
}
