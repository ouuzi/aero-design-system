import React from 'react';
import { type ControlSize } from './styles.js';
export interface ComboboxProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    /**
     * What the list holds ("Category"). Names the search field ("Search Category") and the
     * list ("Category options") for screen readers. The trigger takes its name from Field's label.
     */
    label?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    /** Shown when the search matches nothing. */
    emptyText?: string;
    /** `lg` 40px (default, forms), `md` 36px (toolbars), `sm` 32px (table cells), like Select. */
    size?: ControlSize;
    id?: string;
    invalid?: boolean;
    'aria-describedby'?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    required?: boolean;
    disabled?: boolean;
    /** Form field name: the value is posted in a hidden input. */
    name?: string;
    /** Layout classes for the wrapper (width, grid placement). */
    className?: string;
    /** Offer Add "<query>" when the search matches no option exactly. */
    allowCreate?: boolean;
    /** Called with the new value when Add is picked. Rejecting shows an inline error and keeps the popover open. */
    onCreate?: (value: string) => Promise<void> | void;
    /** Called with the updated list after a successful add, rename or delete. */
    onOptionsChange?: (options: string[]) => void;
    /** Saves the updated list (e.g. to Firestore). Rejecting shows an inline error and leaves the list as it was. */
    onPersistOptions?: (options: string[]) => Promise<void> | void;
    /** Catalog the list is saved to; used in error logs. */
    catalogId?: string;
    /** Offer "Manage list" (rename and delete options). */
    allowListEditing?: boolean;
}
export declare function Combobox({ value, onChange, options: suppliedOptions, label, placeholder, searchPlaceholder, emptyText, size, id: idProp, invalid: invalidProp, 'aria-describedby': describedByProp, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, required, disabled, name, className, allowCreate, onCreate, onOptionsChange, onPersistOptions, catalogId, allowListEditing, }: ComboboxProps): React.JSX.Element;
export default Combobox;
