# LinkButton

An inline text action ("View profile", "Clear filters"), or a name that opens its record: no box, underline on hover, the standard focus ring and a 24px minimum target.

- `tone`: `accent` (default) for actions and navigation; `muted` for resets; `ink` for a person's name or a record's title that opens it (ink text, accent and underlined on hover), so a table of names does not turn blue.
- `size`, a text size: `lg` 13px (body text: a name in a table row), `md` 12px (default), `sm` 11px; one step larger in comfortable density.
- `truncate`: a long name ends in an ellipsis on one line and never widens its cell.
- `icon`: an optional 14px leading icon.
- `dark`: for the document viewer only (accent-soft, viewer-muted or white text, the accent-soft focus ring).

Use a real `<a>`/`<Link>` with the same classes (`linkButton()` from styles) when it navigates to a URL.

Don't: write `hover:underline` on a `<button>` yourself (lint), or use a LinkButton for the main action of a view.
