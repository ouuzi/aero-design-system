# FormGrid

The one grid for form fields, so labels and controls line up across a row and down the form.

- `columns`: 1 to 4 from `md` up (default 2); one column below it. Gaps are 16px both ways.
- Rows start at the top, so a hint or an error under one field never moves the controls beside it.
- A wide field spans with `formSpan.two`, `formSpan.three` or `formSpan.full` as its `className`.
- Every child is a `Field`, or a `RadioGroup` / `CheckboxGroup` with a `legend`. Never a hand-written label.
- Every control in a row is the same size (the default `lg`). A button beside an input (Add, Choose) is `lg` too.
- Nothing in a row sits in its own tinted or bordered box. A value the form works out, such as a next review date, is a read-only control with a hint (dark text on a grey field), never a disabled one.
- A count or a link that belongs to a field goes in its `hint` or under the control, never beside the label.
- A horizontal `RadioGroup` or `CheckboxGroup` in a row takes `listClassName={choiceRowInForm}` (from `styles.ts`), so its options centre on the controls beside it.
- Consumer provides the fields. Sections of a long form are `Card`s with a `title`, each holding one grid.

Don't: mix a `Field` with a hand-written label in one row, put an `md` control beside an `lg` one, or space rows with your own margins.

In `src/components/FormGrid.tsx`, exported from `aero-design-system`.
