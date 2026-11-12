# Menu

The rows of a menu that a screen opens itself (an account menu, a notification centre): `MenuList` is the `role="menu"` list and its keyboard, `MenuItem` one row, on the same look as `RowMenu`.

- **Use** inside a `PopoverContent` (it brings Escape, a click outside and focus return) or a panel the screen owns, when the menu holds more than plain actions (an account summary above, a filter beside). A ⋯ menu of actions for a row is `RowMenu`; a plain action menu behind a labelled button is `RowMenu trigger={<Button>…</Button>}`.
- **`MenuList`**: `label` (required, the menu's accessible name), `onClose(reason)` called on Escape (`'escape'`), on Tab (`'tab'`) and when an item is chosen (`'select'`, just before its `onSelect`), `autoFocus` (focus the first item when the list mounts). Other props go to the list element; `className` is layout (`p-1`, `max-h-96 overflow-y-auto`). `MenuSeparator` is the rule before the destructive rows.
- **`MenuItem`**: the label as children, `icon`, `iconTone` (`neutral` muted by default, or `info`, `success`, `warning`, `danger` for what the row is about; it colours the icon only), `danger` (a destructive action: red text, danger-bg hover, last), `description` (a 12px muted second line), `meta` (at the end of the label line: a time, a count, an unread dot), `onSelect`, `disabled`.
- **Keyboard**, shared with RowMenu (`useMenuKeyboard`): Up and Down move (wrapping), Home and End jump to the ends, Enter or Space chooses; Escape and Tab go to `onClose`.
- **Look**: `menuItem` rows, 32px (40px comfortable), radius md, 13px medium text, a 16px icon; a row with a `description` grows to fit. The focused row keeps its fill and adds the inset accent ring.

Don't: build menu rows from `<button>`s, put a form control inside a `MenuItem`, or colour a row's text by its tone (the icon carries it).
