# Table

A data table in a card: grey header band, 12px semibold headers that never wrap, and one cell padding everywhere so rows keep the same rhythm across pages.

- `Table` (`minWidth` to scroll sideways on narrow screens), `THead`, `Th`, `Td`.
- `frame` says what the table sits in. `card` (the default) is the table as its own card. `inset` is a table inside a card or a dialog body: a `color-line` box at `radius-lg`, no shadow. `none` draws no box and no scroller, for a table inside a `Card` or a scroll region that already has them; a sticky header needs this, so it keeps its scroll parent.
- `tableClassName` is for the table's own layout only (`table-fixed`); `className` lays out the frame.
- Screens never write a raw `<table>`; lint rejects it. The one exception is a screen-reader-only table that is the text twin of a chart.
- **Actions column**: the last column is pinned with `pin="end"` on its `Th` and `Td`, so the row action stays in view when the table is wider than the screen. Its header is a screen-reader-only "Actions". A row with one action uses an `sm` `Button` or `IconButton`; a row with more than one uses one `RowMenu`.
- A table must fit at 1280 to 1440px: give columns widths, let long text truncate, and state a fact once per row.
- `align="right"` on number columns; it also switches to tabular figures.
- Consumer provides the `<tr>` rows and a `<tbody className="divide-y divide-line">`.
- Put `sm` (32px) controls in cells; a status column takes `StatusBadge`, or `StatusSelect` when it is editable.
- **Loading**: set `loading` and `loadingLabel` ("Loading personnel") and render `SkeletonTableRows` in the body, without a label: the table sets `aria-busy` and announces the label from a status region outside it.
- For sorting, bulk selection, a sticky header or a row count, use `DataTable`, which is built from these same cells.
