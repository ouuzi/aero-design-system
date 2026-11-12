# Skeleton

Placeholders that hold a layout still while its data arrives: `color-subtle-2` bars that pulse, and stop pulsing under reduced motion.

- **Use** where the shape of the content is known: table rows, a profile header, a list of cards. For a wait whose result has no known shape, use `Spinner` or `LoadingState`.
- **Skeleton** `shape`: `line` (a 12px text bar, 14px comfortable; full width unless `width`), `block` (an 80px card, chart or image area unless `height`), `circle` (a 32px avatar). `width` and `height` take px or any CSS length.
- **SkeletonText**: a paragraph of `lines` bars (default 3, the last 60% wide), `size` `md` for body text or `sm` for meta lines.
- **SkeletonTableRows**: placeholder rows for a table body; give `columns` (match the header), `rows` (about one screen, default 5) and `align` per column.
- **Screen readers**: give a `label` ("Loading notes") to one skeleton per region, never to one inside an element with `aria-busy`. For tables set `loading` and `loadingLabel` on `Table` or `DataTable` instead: they announce from a status region outside the busy table, so the rows inside take no label.
- `className` is layout only; fill, radius and motion come from the kit.

Don't: draw placeholders with `animate-pulse` by hand in a screen (lint rejects it), or show skeletons for longer than the data takes; replace them with the content or an `EmptyState`.
