# RowMenu

The "more actions" menu at the end of a table row, card or record: a ghost or outline icon button that opens a short list of actions on the popover surface.

- **Use** when a row has more than one or two secondary actions. Keep the action people use most as a visible button beside it and put the rest here.
- **Consumer provides** `items`, each `{ label, onSelect, icon?, tone?: 'danger', disabled?, id? }`; falsy entries are skipped, so items can be listed conditionally inline. Optional: `label` (the trigger's accessible name and tooltip, e.g. "Actions for SMS & HF"; default "More actions"), `heading` (the record's name or code at the top of the menu), `variant` (`ghost` in rows, `outline` beside other bordered controls), `id`.
- **`trigger`**: a labelled trigger instead of the ⋯ button, for a plain action menu ("Export ▾"): one kit Button, `trigger={<Button icon={Download}>Export</Button>}`. RowMenu adds `aria-haspopup`, `aria-expanded`, the click and Down-arrow handlers and its ref; `label` still names the menu.
- **Built from** `MenuList` and `MenuItem` (see Menu), the same rows and keyboard a screen uses for a menu it opens itself (an account menu in a Popover).
- **Order**: regular actions first; destructive ones last, in red, after a rule. A destructive item opens a `ConfirmDialog` before it acts.
- **Look**: `menuPanel` (radius xl, hairline, `shadow-popover`), 32px rows (40px comfortable) inset 4px. It renders in a portal with fixed positioning, so a scrolling table never clips it, and flips upwards near the bottom of the screen.
- **Keyboard**: Enter, Space or Down open it with focus on the first item; Up and Down move (wrapping), Home and End jump to the ends; Enter chooses; Tab closes it; Escape closes without closing a dialog underneath, and focus returns to the trigger. The focused item keeps its fill plus an inset accent ring.
- **States**: closed (the trigger shows its name as a tooltip), open (the tooltip closes), disabled items at 40%.
