# StatTile

A label, an icon and one figure at the top of a page or tab. Status shows in the icon and the figure only.

- `alert`: the colour the figure takes when there is something to act on. It applies only while the value is above 0, so "Non-compliant 0" stays ink, never a red zero.
- `iconTone`: the tile's meaning, shown at all times on the icon (`muted`, `success`, `warning`, `danger`).
- `unit`, `detail`: small text after the figure and one muted line under it. Never coloured.
- `compact`: the 16px-padded tile used inside profile tabs.
- `onClick` + `pressed`: the whole tile becomes a filter toggle.

Don't: tint the tile, colour its border or label, or fade the icon with opacity.
