# Spinner

A turning ring that says work is in progress and its length is unknown; `LoadingState` is the same for a whole panel.

- **Spinner** sizes are the kit's icon sizes: 16px beside 13px text and in buttons (default), 14px in a `sm` button, 12px in a badge, 20px for a region on its own. It draws in `currentColor`; `tone` sets `muted` or `accent` where there is no text to inherit.
- **Screen readers**: a standalone Spinner is a polite status named by `label` ("Loading records"; default "Loading") or by its visible children ("Scanning 3 files…"). Inside something that already says it is busy (a loading Button, a row reading "Adding…") pass `decorative`, so the news is not read twice.
- **Buttons**: use `<Button loading>` or `<IconButton loading>`, never a Spinner placed in a button by hand. The spinner replaces the icon (or sits over the label), aria-busy is set, clicks are ignored and the width does not change.
- **LoadingState**: the busy twin of `EmptyState` on the same frame (`size` `md` or `sm`), with a title that says what is loading and one line of why; `surface="dark"` on the PDF viewer.
- **Motion**: the ring keeps turning under reduced motion, because it is the only sign of progress.
- For content whose shape is known (a table, a list, a card) use `Skeleton` instead.

Don't: build a spinner from `animate-spin` or the `Loader2` / `LoaderCircle` icons in a screen (lint rejects them), or change a button's label to "Saving…".
