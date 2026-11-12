# Field

A labelled form control: `<Field>` draws the label, an optional hint and the error, and wires them to the control inside it (`id`, `aria-describedby`, `aria-invalid`).

- `Input`, `Select`, `Textarea`, `DatePicker` and `Combobox` share one frame: `color-surface`, `color-line-strong` border (3:1), `shadow-xs`, `radius-lg`.
- `size` on Input, Select, DatePicker and Combobox, on the kit's control scale: `lg` 40px in form rows (the default, so leave it out), `md` 36px in toolbars beside buttons and filters, `sm` 32px in table cells and dense lists; 48, 44 and 40px in comfortable density. The old `md` is now `lg` and the old `toolbar` is now `md`.
- Focus: the border turns `color-accent` with a full-strength 2px accent ring around it.
- `error` replaces the hint and turns the control's border, ring and text `color-danger`.
- Disabled controls fill `color-subtle` with `color-disabled` text; never dim them with opacity. Disabled means the control does not apply right now.
- Read-only (`<Input readOnly>`) is for a value to be read, such as a calculated date or "No expiry": `color-subtle` fill, `color-line` edge, no shadow, `color-ink-2` text (8.8:1). Never show a value in a disabled control.

- Fields in a form sit in a `FormGrid`, which keeps a row's labels and controls on one line. A count or link for a field goes in `hint`, not beside the label.

- `Select` keeps the native select's API (`<option>` children, `value` / `onChange`) but opens the kit's own list; see its page.

A search box is a `SearchInput` (the Input with the search icon and a clear button); it goes in a Field like any Input.

Consumer provides: the control as the only child, plus `value`/`onChange` as on the native element. A Checkbox or a set of radios does not go in a Field: use `CheckboxGroup` or `RadioGroup`, which carry their own legend, hint and error.
