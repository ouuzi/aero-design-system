import React from 'react';
import { type ControlSize } from './styles.js';
export type { ControlSize };
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
export declare function Field({ label, hint, error, required, className, children }: FieldProps): React.JSX.Element;
/**
 * For a kit control that is not a native input (Select, DatePicker, Combobox): reads the enclosing
 * <Field>, so `<Field label error>` wires its label, hint and error to the control with no
 * extra props. Explicit props win over the Field's.
 *
 *   const field = useFieldControl({ id, invalid, describedBy });
 *   <button id={field.id} aria-describedby={field.describedBy} …>  // field.invalid for the look
 */
export declare function useFieldControl({ id, invalid, describedBy }: {
    id?: string;
    invalid?: boolean;
    describedBy?: string;
}): {
    id: string | undefined;
    invalid: boolean;
    describedBy: string | undefined;
    /** The enclosing Field's label element id, if any. */
    labelId: string | undefined;
};
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /** `lg` 40px (default, forms), `md` 36px (toolbars), `sm` 32px (table cells). */
    size?: ControlSize;
    invalid?: boolean;
}
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    invalid?: boolean;
}
export declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
