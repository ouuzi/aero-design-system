import React from 'react';
import { type ChoiceGroupFrameProps } from './Checkbox.js';
import { type ChoiceSize, type ChoiceVariant } from './styles.js';
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
type RadioName = {
    label: React.ReactNode;
} | {
    label?: undefined;
    'aria-label': string;
} | {
    label?: undefined;
    'aria-labelledby': string;
};
export type RadioProps = NativeRadio & RadioOwnProps & RadioName;
export declare const Radio: React.ForwardRefExoticComponent<RadioProps & React.RefAttributes<HTMLInputElement>>;
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
export declare function RadioGroup<T extends string = string>({ value, onChange, name, size, variant, disabled, required, error, children, ...frame }: RadioGroupProps<T>): React.JSX.Element;
export {};
