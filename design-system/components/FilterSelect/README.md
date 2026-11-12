# FilterSelect

A toolbar filter with its label inside the box ("Dept: All departments"), 36px (`control-md`, 44px comfortable), the same frame as every other control.

- `label`: the short name shown before the value.
- Children: `<option>` elements; `value`/`onChange` as on a native select (`onChange` gets a real change event).
- The whole box is one button: it opens the kit's list (the `Select` list: popover surface, tick on the current option, at least as wide as the box). Keyboard as on `Select`: Enter, Space, Up or Down open it, typing jumps to an option, Escape closes the list only.
- The box is as wide as its label and longest option, so it does not change width when the value changes.
- Focus and open show on the whole box (accent border and ring). Screen readers hear the label ("Status:") as its name, then the value.

Put filters, a `size="md"` search `Input` (or `md` Combobox and DatePicker) and `md` buttons on one row; they share the 36px height.
