import React from 'react';
import { type ControlSize } from './styles.js';
export interface DatePickerProps {
    /** The date as ISO YYYY-MM-DD ('' or undefined when empty). Other formats toIsoDate understands (DD-MMM-YYYY, DD/MM/YYYY) are read too. */
    value?: string;
    /** Called with the new ISO date (YYYY-MM-DD), or '' when cleared. */
    onChange: (value: string) => void;
    /** `lg` 40px (default, forms), `md` 36px (toolbars), `sm` 32px (table cells, dense rows). 48/44/40px comfortable. */
    size?: ControlSize;
    /** Marks the date as wrong or overdue: danger border, ring and text. Inside <Field error> it is on by itself. */
    invalid?: boolean;
    disabled?: boolean;
    /** Native form validation: an empty required date blocks submit and focus returns here. */
    required?: boolean;
    /** Earliest pickable date, ISO YYYY-MM-DD. */
    min?: string;
    /** Latest pickable date, ISO YYYY-MM-DD. */
    max?: string;
    /** Form field name: the ISO value is posted with the form. */
    name?: string;
    /** Id of a <form> elsewhere in the page this field belongs to. */
    form?: string;
    /** Id of the button. Inside <Field> it defaults to Field's, so Field's label points at it. */
    id?: string;
    autoFocus?: boolean;
    /** Use when there is no visible label (table cells): "Due date for Human factors". */
    'aria-label'?: string;
    'aria-labelledby'?: string;
    /** Hint or error ids; inside <Field> it defaults to Field's note. The spoken date is added in front. */
    'aria-describedby'?: string;
    onFocus?: React.FocusEventHandler<HTMLElement>;
    onBlur?: React.FocusEventHandler<HTMLElement>;
    /** For the dark PDF viewer only. */
    dark?: boolean;
    /** Layout only (width, margins, grid placement). The look comes from the component. Full width by default. */
    className?: string;
}
export declare const DatePicker: React.ForwardRefExoticComponent<DatePickerProps & React.RefAttributes<HTMLElement>>;
export default DatePicker;
