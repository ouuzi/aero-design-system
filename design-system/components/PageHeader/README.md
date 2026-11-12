# PageHeader

The top of every page: the title, one line of description and the page's actions, laid out the same way on every screen.

- `title` (the page title, once per page), `description` (one plain sentence), `actions` (buttons, primary last), `back` (`{ label, onClick }`, a quiet link above the title for a page reached from another), `meta` (a line under the description).
- The title and the actions share one row while they fit. When they do not, the whole actions group moves under the title as one left-aligned row; a primary button never ends up alone on its own line.
- At most three buttons, with the primary action last. Anything more goes in one `RowMenu` at the start of the group.
- Sections of the page go in `Tabs` directly under the header.
- Consumer provides the text and the buttons. Screens never write their own title row.

Don't: put a status or a count in the title, use title case, or use a primary button to go back.

In `src/components/PageHeader.tsx`, exported from `aero-design-system`.
