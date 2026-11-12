import React from 'react';
import { type StatusBadgeWidth, type StatusTone } from './styles.js';
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
export declare function StatusSelect<V extends string = string>({ value, onChange, options, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, 'aria-describedby': describedBy, id, width, placeholder, dot, disabled, name, align, className, }: StatusSelectProps<V>): React.JSX.Element;
export default StatusSelect;
