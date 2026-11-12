# AlertList

A list of alerts inside a card: surface rows with the colour on the icon only, so a list of problems does not turn the page red.

- `AlertList`: `label` (the name read by screen readers), `limit` (show the first N rows, then a "View all (n)" link), `onViewAll` (where that link goes; without it the list opens in place and "Show fewer" folds it again).
- `AlertRow`: `tone` (`danger`, `warning`, `info`, `success`, `neutral`), `title`, `meta` (one muted line), `action` (one small link button), optional `icon`.
- Lead the title with the person or the record, then say what is wrong in plain words: "Giorgos Dimitriou has 5 blocking findings", never "5 overdue items".
- Put it in `<Card padding="none">` with the card's `title`; the count beside the title is a neutral `Badge`, not a status.
- A panel never cuts a row in half. Use `limit` so the list ends on a whole row.

Don't: tint the rows, give them a coloured border, or use it for a single message (that is `Notice`).

In `src/components/AlertList.tsx`, exported from `aero-design-system`.
