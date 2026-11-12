# Badge

A category chip or a count: what kind of thing something is ("Internal", "Part-147", "12 records"), never what state it is in. A slightly rounded chip (`radius-md`), medium weight.

- `tone`, the four category tones: `neutral` (default) for counts and plain categories; `info`, filled blue, for one kind of category; `violet`, outlined (surface fill, violet text and ring), for a second kind, so the two differ by more than hue; `brand`, navy, for a selected or own-organisation marker.
- `dot`: a leading dot in the text colour.
- Badge does not accept `success`, `warning` or `danger`. A status is a `StatusBadge`, which takes its colour and symbol from the shared map.

Don't: use green, amber or red for anything that is not a status ("Mandatory", "Cancelled", a count), or build a chip from `badgeClass()` in a screen.
