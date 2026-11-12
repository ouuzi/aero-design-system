# ToggleChip

One option in a multi-select set (departments, positions, aircraft types): navy with a check when selected, surface with a `color-line-strong` edge when not, 28px tall (`control-xs`; 36px in comfortable density).

- `selected`, `onChange(selected)`; other props pass to the `<button>` (it sets `aria-pressed`). `disabled` dims it to 40%.
- An "add from the library" chip that is already in the list is a ToggleChip that is `selected` and `disabled` (navy with a check, dimmed); pressing an unselected one adds it.
- A value picked into a list with a × is a `Chip` (`onRemove`), not a ToggleChip.
- For one choice among two to four options use `SegmentedControl`; for options that need a description, a `CheckboxGroup` with `variant="card"`.
