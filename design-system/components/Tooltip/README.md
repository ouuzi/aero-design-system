# Tooltip

A short hint for a control that can take focus, on the popover surface: `color-surface`, a hairline, `shadow-popover`, 12px medium ink text.

- **Opens** on hover after 400ms and at once on keyboard focus; moving to the next trigger within 300ms skips the delay. A mouse click does not pop it. **Escape** closes it without closing a dialog underneath. **Touch** never opens it, so nothing a touch user needs may live only in a tooltip. The pointer can move onto it without it closing.
- **IconButton** shows its `label` as a tooltip by itself (`asLabel`, so screen readers hear the name once). Pass `tooltip="…"` for a longer hint, `tooltip={false}` for none. Icon buttons take no native `title`; lint rejects it.
- **Consumer provides** `content` (a few words in sentence case, no full stop, nothing interactive) and one child that can take focus and a ref: a native `<button>` or `<a>`, or any kit button. Optional: `side` (default `top`, flips when there is no room), `align`, `asLabel` (the content only repeats the trigger's name), `disabled` (hold it shut), `delayDuration`.
- **A disabled button** fires no events: wrap it in `<span tabIndex={0} className={tooltipAnchor}>` (from `styles.ts`: the shared focus ring and the button's radius) and put the tooltip on the span.
- Mount one `TooltipProvider` near the root (`components/Providers.tsx`); a Tooltip outside one supplies its own.
- Layer: z-[110], above dialogs, popovers and menus. It opens with a quick fade (`motion.fast`), none under reduced motion.

Don't: put essential information only in a tooltip, put a tooltip on a trigger whose click opens its own panel (menus, popovers), or import `@radix-ui/react-tooltip` in a screen. A native `title` stays only on non-interactive truncated text and chart marks.
