import React from 'react';
import { type InputProps } from './Field.js';
export interface SearchInputProps extends Omit<InputProps, 'type' | 'value'> {
    value: string;
    /** Shows the clear button while the field has a value; set the value to '' here. */
    onClear?: () => void;
    /** The clear button's accessible name and tooltip. Default "Clear search". */
    clearLabel?: string;
}
export declare const SearchInput: React.ForwardRefExoticComponent<SearchInputProps & React.RefAttributes<HTMLInputElement>>;
