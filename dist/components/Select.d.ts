import React from 'react';
import { type ControlSize } from './styles.js';
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
/** A form dropdown: `<option>` / `<optgroup>` children, `value` / `onChange` as on a native select. */
export declare const Select: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLSelectElement>>;
/** A toolbar filter with its label inside the box ("Dept: All departments"). */
export declare function FilterSelect({ label, ...rest }: FilterSelectProps): React.JSX.Element;
