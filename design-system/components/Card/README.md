# Card

The surface panel every section sits in (`color-surface`: white in light, navy-grey in dark): `color-line` border, `radius-xl`, `shadow-xs`.

- `title`, `description`, `actions`: the standard header, a section title with one muted line and actions on the right, ruled off from the body.
- `padding`: `md` (20px) for content, `sm` (16px) for toolbars and filter bars, `none` when a table or list runs edge to edge. There are no other paddings.
- Without a header the card is one box: the padding sits on the card and its children are direct children, so `className` lays them out (`flex`, `grid`, `space-y-4`). With a header the children sit in a padded body under the rule.
- `as`: `section` (the default), `div` for a panel that is not a section of the page, `form` for a form that is the card (with `onSubmit`). Other props pass to the element.
- `onClick` makes the whole card one `<button>` (a department card that filters the page): content left-aligned, a `color-line-strong` edge on hover, the shared focus ring. `pressed` is its selected state: `aria-pressed` and a 2px accent edge (the border plus a 1px accent ring, full strength). A button holds no other controls, so an interactive card takes no `actions` and no `as`; its `title` is plain text. `disabled` passes through.
- Screens never write the card surface by hand (`bg-surface border border-line rounded-xl`); lint rejects it. A server component cannot import the kit, so it takes the `card` recipe from `styles.ts` instead.

Don't: tint a card, give it a coloured left border, or swap its shadow.
