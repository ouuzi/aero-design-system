# NavItem

A row in the side navigation: a 16px icon, a 13px label and an optional count, 36px tall, with the current page filled subtle-2 and marked `aria-current="page"`.

- **Use** for the app's pages in the sidebar (`active` on the current one), and for sidebar rows that open a dialog (Support, Settings), which are never `active`. Tabs of one page are `Tabs`; a page's own actions are `Button`s.
- **`NavItem`** takes `icon` (a lucide icon), the label as children, `active`, `badge` (a count; 0 or undefined shows nothing), `badgeTone` (`neutral`, the default grey `Badge`, or `alert`, the red count pill for something to act on, such as urgent alerts) and `badgeLabel` (what the count is, read after the label: "3 urgent alerts"). Other props, `onClick` and `id` included, go to the `<button>`.
- **`NavList`** is one group: `label` ("Workspace") draws the 11px muted heading and names the `nav` landmark; without a label give it `aria-label`. `as="div"` for a group of rows that open dialogs rather than pages. `className` is layout only (`flex-1 overflow-y-auto`, `mt-auto`).
- **`NavBrand`** is the app's name at the top of the sidebar, a button home: `logo` (drawn in on-solid on a 32px brand tile, e.g. `<BrandMark />`) and `name`.
- **Look**: 36px rows (`h-control-md`, 44px comfortable), radius lg, 13px text (15px comfortable). Current page: subtle-2 fill, ink text in medium weight, the icon in brand. The rest: ink-2 with a muted icon, subtle on hover. The shared `focusRing`.

Don't: colour a nav row, write the red count by hand (use `badgeTone="alert"`), mark more than one item `active`, or put a nav row outside a `NavList`.
