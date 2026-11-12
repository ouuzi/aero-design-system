'use client';

import React, { useId } from 'react';
import { fieldInvalid, fieldLabel, fieldNote, inputSizes, textareaBase, type ControlSize } from './styles.js';
import { cn } from '../lib/utils.js';

/*
 * Form controls (Select and FilterSelect live in Select.tsx). Inputs and selects share one frame (white, line-strong border, shadow-xs)
 * and the kit's control-size scale: `lg` 40px in forms (the default), `md` 36px in toolbars
 * (beside buttons and filters), `sm` 32px in tables and dense lists; 48, 44 and 40px in
 * comfortable density, with 15px text in lg and md. Wrap a control in <Field> to get the
 * label, hint and error in the standard places, wired to the control for screen readers.
 */

export type { ControlSize };

const inputSize = inputSizes;
const invalidFrame = fieldInvalid;

interface FieldContextValue {
  id: string;
  describedBy?: string;
  invalid: boolean;
  /** Id of the Field's <label>, for a popup that is named after the field (Select's listbox). */
  labelId: string;
}
const FieldContext = React.createContext<FieldContextValue | null>(null);

export interface FieldProps {
  label: React.ReactNode;
  /** One line under the control: format, units, why it is needed. */
  hint?: React.ReactNode;
  /** Replaces the hint and turns the control red. */
  error?: React.ReactNode;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Field({ label, hint, error, required, className, children }: FieldProps) {
  const generatedId = useId();
  // A control that already has an id keeps it, and the label points at it.
  const childId = React.isValidElement<{ id?: string }>(children) ? children.props.id : undefined;
  const id = childId ?? generatedId;
  const noteId = `${id}-note`;
  const labelId = `${id}-label`;
  const note = error || hint;
  return (
    <FieldContext.Provider value={{ id, describedBy: note ? noteId : undefined, invalid: Boolean(error), labelId }}>
      <div className={className}>
        <label id={labelId} htmlFor={id} className={fieldLabel}>
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
        {children}
        {note && (
          <p id={noteId} className={fieldNote(Boolean(error))}>
            {note}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  );
}

/**
 * For a kit control that is not a native input (Select, DatePicker, Combobox): reads the enclosing
 * <Field>, so `<Field label error>` wires its label, hint and error to the control with no
 * extra props. Explicit props win over the Field's.
 *
 *   const field = useFieldControl({ id, invalid, describedBy });
 *   <button id={field.id} aria-describedby={field.describedBy} …>  // field.invalid for the look
 */
export function useFieldControl({ id, invalid, describedBy }: { id?: string; invalid?: boolean; describedBy?: string }) {
  const field = React.useContext(FieldContext);
  return {
    id: id ?? field?.id,
    invalid: invalid ?? field?.invalid ?? false,
    describedBy: describedBy ?? field?.describedBy,
    /** The enclosing Field's label element id, if any. */
    labelId: field?.labelId,
  };
}

function useFieldProps(id?: string, invalid?: boolean, describedBy?: string) {
  const field = useFieldControl({ id, invalid, describedBy });
  return {
    id: field.id,
    'aria-invalid': field.invalid || undefined,
    'aria-describedby': field.describedBy,
    isInvalid: field.invalid,
  };
}

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** `lg` 40px (default, forms), `md` 36px (toolbars), `sm` 32px (table cells). */
  size?: ControlSize;
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = 'lg', invalid, className, id, 'aria-describedby': describedBy, ...rest },
  ref,
) {
  const { isInvalid, ...a11y } = useFieldProps(id, invalid, describedBy);
  return <input ref={ref} {...a11y} className={cn('w-full', inputSize[size], isInvalid && invalidFrame, className)} {...rest} />;
});

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, id, rows = 3, 'aria-describedby': describedBy, ...rest },
  ref,
) {
  const { isInvalid, ...a11y } = useFieldProps(id, invalid, describedBy);
  return <textarea ref={ref} rows={rows} {...a11y} className={cn('w-full', textareaBase, isInvalid && invalidFrame, className)} {...rest} />;
});
