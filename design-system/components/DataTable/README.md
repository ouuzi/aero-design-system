# DataTable

The kit's `Table` cells with sorting, bulk selection, a sticky header, a screen-reader caption and a "Showing 12 of 140" footer.

- **Use** for long lists people scan and act on: personnel, authorisations, findings, training records. For a short fixed table, plain `Table` is enough.
- **Always give a `caption`** naming what the table lists ("Authorisations expiring in 60 days"). Screen readers read it; it is not shown.
- **Sort** columns people scan by with `sortable`. The header becomes a button that cycles ascending, descending, unsorted, shows an arrow and announces the order. Sort dates by their ISO value with `sortValue`. Empty values always sort last.
- **Long tables** scroll inside the card with `maxHeight`; the header stays put and the scroll leaves room under it, so a focused row is never hidden.
- **Bulk actions**: `selectable` adds a column of kit `Checkbox`es (24px targets, 32px comfortable), each named through `rowLabel` ("Select Eleni Georgiou"); the header box selects all and shows the indeterminate state for some. While rows are selected, a bar names the count and offers `bulkActions` (Assign, Send reminder, Export) and Clear. Selected rows take `color-info-bg`, and meta text in them turns `color-ink-2` for extra contrast (muted alone reads 4.73:1 there).
- **Loading**: `loading` shows placeholder rows (`SkeletonTableRows`) and sets `aria-busy`; `loadingLabel` ("Loading personnel") is announced from a status region outside the table.
- **Footer**: "Showing 12 of 140"; pass `total` when rows are one page and put pagination or Export in `footerEnd`.
- **Comfortable density**: 16px cell padding and 15px text, via `density` or `data-density="comfortable"` on an ancestor.
- **Empty**: pass an `EmptyState` as `empty`.
- Consumer provides `columns` (key, label, optional `align`, `sortable`, `sortValue`, `render`), `rows` with stable `id`s and a `caption`.

In `src/components/DataTable.tsx`, exported from `aero-design-system`.
