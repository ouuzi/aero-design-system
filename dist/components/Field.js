import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useId } from 'react';
import { fieldInvalid, fieldLabel, fieldNote, inputSizes, textareaBase } from './styles.js';
import { cn } from '../lib/utils.js';
const inputSize = inputSizes;
const invalidFrame = fieldInvalid;
const FieldContext = React.createContext(null);
export function Field({ label, hint, error, required, className, children }) {
    const generatedId = useId();
    // A control that already has an id keeps it, and the label points at it.
    const childId = React.isValidElement(children) ? children.props.id : undefined;
    const id = childId ?? generatedId;
    const noteId = `${id}-note`;
    const labelId = `${id}-label`;
    const note = error || hint;
    return (_jsx(FieldContext.Provider, { value: { id, describedBy: note ? noteId : undefined, invalid: Boolean(error), labelId }, children: _jsxs("div", { className: className, children: [_jsxs("label", { id: labelId, htmlFor: id, className: fieldLabel, children: [label, required && _jsx("span", { className: "text-danger", children: " *" })] }), children, note && (_jsx("p", { id: noteId, className: fieldNote(Boolean(error)), children: note }))] }) }));
}
/**
 * For a kit control that is not a native input (Select, DatePicker, Combobox): reads the enclosing
 * <Field>, so `<Field label error>` wires its label, hint and error to the control with no
 * extra props. Explicit props win over the Field's.
 *
 *   const field = useFieldControl({ id, invalid, describedBy });
 *   <button id={field.id} aria-describedby={field.describedBy} …>  // field.invalid for the look
 */
export function useFieldControl({ id, invalid, describedBy }) {
    const field = React.useContext(FieldContext);
    return {
        id: id ?? field?.id,
        invalid: invalid ?? field?.invalid ?? false,
        describedBy: describedBy ?? field?.describedBy,
        /** The enclosing Field's label element id, if any. */
        labelId: field?.labelId,
    };
}
function useFieldProps(id, invalid, describedBy) {
    const field = useFieldControl({ id, invalid, describedBy });
    return {
        id: field.id,
        'aria-invalid': field.invalid || undefined,
        'aria-describedby': field.describedBy,
        isInvalid: field.invalid,
    };
}
export const Input = React.forwardRef(function Input({ size = 'lg', invalid, className, id, 'aria-describedby': describedBy, ...rest }, ref) {
    const { isInvalid, ...a11y } = useFieldProps(id, invalid, describedBy);
    return _jsx("input", { ref: ref, ...a11y, className: cn('w-full', inputSize[size], isInvalid && invalidFrame, className), ...rest });
});
export const Textarea = React.forwardRef(function Textarea({ invalid, className, id, rows = 3, 'aria-describedby': describedBy, ...rest }, ref) {
    const { isInvalid, ...a11y } = useFieldProps(id, invalid, describedBy);
    return _jsx("textarea", { ref: ref, rows: rows, ...a11y, className: cn('w-full', textareaBase, isInvalid && invalidFrame, className), ...rest });
});
