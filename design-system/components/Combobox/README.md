# Combobox

A pick-or-type field: search as you type, choose with the keyboard, and add or tidy values in lists the organisation maintains.

- **Use** for long or organisation-maintained lists (positions, departments, categories, authorities, aircraft types). For four or fewer fixed options use `Select` or `SegmentedControl`.
- **Looks like `Select`** at every size: `lg` 40px in forms (the default), `md` 36px in toolbars, `sm` 32px in table cells; 48, 44 and 40px in comfortable density. Inside `Field` it takes the Field's id, hint and error by itself.
- **Keyboard**: Enter, Space or the arrow keys open it with focus in the search field; typing filters; Up and Down move; Enter selects; Escape closes the list without closing the dialog; focus returns to the field.
- **Add new value** (`allowCreate`): when the search matches nothing exactly, the list offers Add "<value>". `onCreate` may save it first; a failure shows inline.
- **Manage list** (`allowListEditing`): rename or delete entries, by keyboard, saved through `onPersistOptions` (for example the Firestore catalog) and reported through `onOptionsChange`.
- **States**: rest, open (accent border and ring), invalid (danger), disabled, saving (a spinner in the list while `onCreate` or `onPersistOptions` runs).
- Built on shadcn/ui's Combobox pattern (Radix Popover with cmdk) and styled with the tokens. `Popover` and `Command` are exported for other pickers.

In `src/components/Combobox.tsx`, exported from `aero-design-system`. The old size names map: `md` is now `lg` (still the default), `toolbar` is now `md`.
