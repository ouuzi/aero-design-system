# DatePicker

The one date field: the Select frame and size scale, the date shown as DD-MMM-YYYY in tabular figures, the value passed in and out as an ISO date.

- **Use** for every date a person enters or edits: issue and expiry dates, assessment dates, due-date filters. Never `<input type="date">` or `<Input type="date">` in a screen (lint rejects both).
- **Value**: `value` is `YYYY-MM-DD` (`''` when empty); `onChange` receives the new ISO string, or `''` when cleared.
- **Sizes** (`size`): `lg` 40px in forms (the default, so leave it out), `md` 36px beside toolbar buttons and filters, `sm` 32px in table cells; 48, 44 and 40px in comfortable density.
- **How it works**: the box is a `<button>` that opens the browser's own calendar. Enter, Space, Down or Up open it; Delete or Backspace clear it. A hidden native date input carries `name`, `required`, `min` and `max`, so forms post and validate it.
- **Inside `Field`** it takes the Field's id, hint and error by itself: `<Field label="Issue date" required><DatePicker value={d} onChange={setD} required /></Field>`. Without a visible label pass `aria-label` ("Due date for Human factors").
- **Screen readers** hear the label, "button", the date in words ("14 March 2026", or "No date set"), ", required" and ", invalid" when they apply, then the hint or error.
- **States**: empty (DD-MMM-YYYY placeholder in muted), filled, focus (accent border and ring), invalid (danger border, ring and text), disabled.
- `className` is layout only (width, grid placement); it is full width by default. `dark` is for the PDF viewer only.

Moved into the kit from `components/common/DatePickerField.tsx`, with the same behaviour; import it from `aero-design-system`.
