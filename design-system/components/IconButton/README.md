# IconButton

An icon-only action, 32px square (40px in comfortable density), whose name shows as a tooltip on hover and keyboard focus.

- **Use** for frequent row and toolbar actions whose icon is unambiguous next to its neighbours: edit, download, print, delete. When the action needs words to be understood, or is the main action of a view, use a `Button` with a label.
- **Consumer provides** `icon` (a lucide icon component) and `label`, required: the accessible name ("Delete record") and, by default, the tooltip. Optional: `tooltip` (a longer hint, "Authorisation form (AES-PA-01) as PDF", or `false` for none on a trigger that opens its own menu), `variant`, `loading`, `disabled`, `onClick`.
- `variant`: `ghost` (default) in table rows and toolbars; `outline` beside other bordered controls; `danger` for a delete in a row, muted until hovered, then red.
- **States**: rest, hover (subtle-2 fill, or danger-bg for `danger`), focus (`focusRing` plus the tooltip), loading (the icon becomes a spinner, `aria-busy`, clicks ignored), disabled (40% opacity, no tooltip: a disabled button fires no events).
- The tooltip is the kit's `Tooltip` with `asLabel`, so screen readers hear the name once.
- `badge`: a count at the top-right corner (unread notifications): a number (0 hides it, above 99 shows "99+") or `true` for a dot, a 16px danger disc with a surface-coloured edge. The accessible name becomes "<label>, <n> new"; `badgeLabel` changes those words ("3 unread"). The tooltip still shows the label.
- A toggle is an IconButton with `aria-pressed`: ghost fills subtle-2, outline takes an accent edge.
- `dark`: for the document viewer only (viewer-muted icon, white on the viewer hover fill, outline on the raised viewer panel, danger in `danger-on-dark`, the accent-soft focus ring).

Don't: pass `title` (it is not accepted, and lint rejects it on kit buttons), shrink it below 32px, or use it for a destructive action without a `ConfirmDialog` behind it.
