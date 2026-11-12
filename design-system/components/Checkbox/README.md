# Checkbox

An independent yes or no ("Does not expire", "Mandatory requirement"), drawn on a native checkbox so Space, forms, `required` and screen readers work with no extra ARIA.

- **Use** for an option that stands on its own, or several options that answer one question (wrap them in `CheckboxGroup`). For one choice from a visible list use `RadioGroup`; for two to four peer views use `SegmentedControl`.
- **Look**: a 16px box with a `color-line-strong` edge on surface inside a 24px target (`target-min`); checked fills `color-brand` with an on-solid check, `indeterminate` shows a dash and is announced as mixed. Comfortable density: a 20px box in a 32px target, 15px label.
- **Consumer provides** `label` (the visible text, also the accessible name; or `aria-label` when there is no text, as in a table's selection column), `checked` and `onChange` or `onCheckedChange(checked)`, and optionally `description` (one line under the label), `error`, `invalid`, `disabled`, `required`, `size` (`md` 13px, `sm` 12px for a field's aside) and `variant`.
- **`variant="card"`**: a bordered tile that fills `color-info-bg` with an accent edge while checked, for option grids (departments, positions).
- **CheckboxGroup**: a `<fieldset>` whose `legend` names the set, with `hint` or `error` under it; hands `size`, `variant`, `disabled` and the invalid state to every box inside. `listClassName` replaces the layout (a grid of cards).
- **States**: unchecked, checked, indeterminate, invalid (danger edge and message), disabled (hairline on subtle, grey fill when checked). Focus is the shared `focusRing`.
- `dark` is for the PDF viewer only (accent-soft fill and focus).

Don't: wrap a Checkbox in your own `<label>` (it is one), put links or buttons in its label, give its container an `onClick` that toggles the same state, or put it inside `Field`. Screens never write `<input type="checkbox">`; lint rejects it.
