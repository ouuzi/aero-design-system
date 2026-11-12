# SearchInput

The search field of a toolbar or a picker: the kit Input with the search icon inside on the left and, while it holds text, a clear button inside on the right.

- **Use** for every search box. It replaces the hand-built `<Search>` icon placed beside an `Input` with `pl-9`. A field that opens the command palette is still a SearchInput (`onClick`, `readOnly`).
- **Props**: `value` and `onChange` as on Input; `onClear` turns the clear button on (set the value to '' there); `clearLabel` (its name and tooltip, default "Clear search"); `size` (`md` 36px by default, beside toolbar buttons and filters; `lg` in a form, `sm` in a dense list); `className` lays out the wrapper (`w-64`, `flex-1`); every other prop goes to the input. Name it with `aria-label`, or put it in a `Field`, which wires it like any Input.
- **Behaviour**: an `<input type="search">` (a searchbox to screen readers) with the browser's own × hidden. The clear button is a 24px ghost IconButton (32px comfortable); after clearing, focus goes back to the field.

Don't: draw the search icon or a clear × yourself, or put a second button inside the field.
