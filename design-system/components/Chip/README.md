# Chip

A value picked into a form (an aircraft type, an ATA chapter, an engine variant), usually with a × to take it out again.

- **Use** for the values a person has added to a list in a form. A category or count that is only read is a `Badge`; a code is a `CodeChip`; an option that turns on and off is a `ToggleChip`; a picked value in a problem state ("Not in register") is a `StatusBadge` with the same `onRemove`.
- **Props**: the value as children; `tone` (`neutral` default, `info`, `violet`, `brand` for a confirmed value); `icon` (a 12px leading icon, such as a check); `onRemove` (adds the ×); `removeLabel` (its accessible name, default "Remove <text>"); `disabled` (dims the × while the form saves).
- **Look**: the Badge shape one step up: 24px tall (32px comfortable), radius md, 12px medium text (13px comfortable), the tone's fill and ring. The × is a 16px glyph in a 24px target (32px comfortable) with the shared focus ring and a hover fill.

Don't: give a chip a status colour, make the whole chip a button, or draw a remove × by hand.
