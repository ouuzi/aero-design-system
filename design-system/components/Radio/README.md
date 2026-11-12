# Radio

One choice from a short list that stays visible: `RadioGroup` with a `Radio` per option, on native radios sharing one name.

- **Use** for two to six options that each need a sentence or a description ("This position", "The whole department"). For two to four peer views or filters use `SegmentedControl`; for a long list use `Select` or `Combobox`; for independent options use `Checkbox`.
- **Keyboard** is the browser's: Tab enters on the chosen option (the first when none is chosen), the arrow keys move and choose, Space chooses.
- **Look**: the same 16px box and 24px target as Checkbox, round, filled brand with an on-solid dot when chosen; `variant="card"` makes each option a bordered tile that fills `color-info-bg` while chosen.
- **Consumer provides** on `RadioGroup`: `value` (controlled; `null` while nothing is chosen) and `onChange(value)`, a `legend`, and optionally `hint`, `error`, `required`, `disabled`, `orientation` (`vertical` or `horizontal`), `size`, `variant` and `name` for a form post. On each `Radio`: `value`, `label` and optionally `description` and `disabled`.
- **Values are strings** (the DOM's). Map booleans or numbers at the call site: `value={required ? 'yes' : 'no'}`.
- **States**: chosen, not chosen, invalid (every option takes the danger edge; the group's `error` is its description), disabled per option or for the whole group.
- The group is a `<fieldset role="radiogroup">` named by its legend, with `aria-required` and `aria-invalid`.

Don't: wrap a Radio in your own `<label>`, or write `<input type="radio">` in a screen (lint rejects it).
