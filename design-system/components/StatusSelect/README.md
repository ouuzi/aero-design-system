# StatusSelect

A status a person sets, shown as the status pill itself: the `StatusBadge` pill with a chevron, opening a short list of the statuses drawn as their pills, the current one ticked.

- **Use** where a row's Status column is editable (the AES-CM-07 qualification checks). Everywhere else a status is read-only and is a `StatusBadge`. A status dropdown is always StatusSelect, never a native `<select>` styled as a pill.
- **Options** live in a module-level table, each `{ value, label, tone, description?, disabled? }`: `value` is what is stored ("Yes"), `label` the word on the pill ("Valid"), `tone` a `StatusTone`. Keep the tone in the table, never a ternary.
- **Consumer provides** `value`, `onChange(value)` (called only when it changes), `options` and an accessible name (`aria-label` such as "QC-3 status", or `aria-labelledby`). Optional: `width` (`column`, the 120px pill, by default; `auto` sized to its word), `placeholder` for an empty value (default "Not set"), `dot` for neutral statuses, `disabled`, `name` for a form post, `align`.
- **Keyboard** (select-only combobox): Enter, Space, Up or Down open it; typing a letter jumps to a status; Up, Down, Home, End move; Enter or Space picks; Escape closes without a change and without closing the dialog around it. Screen readers hear the name and then the current status.
- **States**: rest (the pill, identical to a read-only one), hover and open (a `shadow-xs` lift), focus (`focusRing`), disabled. The pill keeps its look and gets an invisible hit area so it reaches `target-min`.
- The list is the floating surface (`shadow-popover`, radius xl) with 32px option rows; the active row has an inset accent outline.
