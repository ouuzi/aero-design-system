# Pagination

The footer of a paged table: what is shown ("Showing 1 to 15 of 140 records") on the left, previous, the page numbers and next on the right.

- **Use** under a table that shows one page of rows at a time. A short panel list uses `AlertList limit` ("View all") instead.
- **Props**: `page` (1-based), `pageSize`, `total` (all rows after filtering), `onPageChange(page)`; `label` the noun of the count (default "records"); `className` for layout, usually the card footer `border-t border-line p-4`. It keeps no state.
- **Look**: 13px ink-2 count in tabular figures; `sm` buttons (32px, 40px comfortable): outline IconButtons for previous and next, the current page a primary Button with `aria-current="page"`, the others secondary. Past seven pages it keeps the first, the last and the current page with its neighbours, with an ellipsis for each gap. With one page the buttons are hidden and only the count shows; with none it says "No records".

Don't: build page buttons by hand, or show a second count of the same rows elsewhere on the page.
