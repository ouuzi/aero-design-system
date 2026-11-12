import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
/*
 * FormGrid: the one grid for form fields, so labels and controls line up across a row and
 * down the form. Fields are the direct children; every row starts at the top (`items-start`),
 * so a field with a hint or an error never pushes its neighbours' controls out of line.
 *
 *   <FormGrid columns={3}>
 *     <Field label="Full name" required><Input … /></Field>
 *     <Field label="Employee ID"><Input … /></Field>
 *     <Field label="Department" required><Select … /></Field>
 *     <Field label="Notes" className={formSpan.full}><Textarea … /></Field>
 *   </FormGrid>
 *
 * Rules that keep a row aligned:
 * - Every child is a `Field` (or a `RadioGroup` / `CheckboxGroup` with a `legend`): the label
 *   sits on the same line and the control starts at the same height. Never a hand-written label.
 * - Every control in a row has the same size (the default `lg`).
 * - Nothing in a row sits in its own tinted or bordered box. A value the form works out
 *   (a next review date) is a read-only or disabled control with a hint under it.
 * - A link or count that belongs to a field goes in the Field's `hint`, not beside its label.
 * - A horizontal RadioGroup or CheckboxGroup in a row takes `listClassName={choiceRowInForm}`
 *   (styles.ts), so its options centre on the height of the controls beside it.
 */
const columnsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};
/** `className` for a child that spans more than one column (from `md`, where the grid has columns). */
export const formSpan = {
    two: 'md:col-span-2',
    three: 'md:col-span-3',
    full: 'col-span-full',
};
export function FormGrid({ columns = 2, className, children }) {
    return _jsx("div", { className: cn('grid items-start gap-x-4 gap-y-4', columnsClass[columns], className), children: children });
}
