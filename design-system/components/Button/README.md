# Button

A labelled action: one height, radius, weight, focus ring and disabled look for every button in the app.

- `variant`: `primary` once per view for the main action; `secondary` for the rest; `ghost` in dense toolbars and dialog footers ("Cancel"); `danger` only to confirm a destructive step; `danger-ghost` for a quiet destructive action.
- `size`, on the kit's control scale: `md` 36px (the default) in toolbars and most places; `sm` 32px in cards and table rows; `lg` 40px in a form footer or row beside 40px inputs. 40, 44 and 48px in comfortable density.
- `icon`: an optional leading lucide icon, 16px (14px in `sm`).
- `loading`: the action is running. A spinner replaces the icon, or sits over the label when there is none, so the width never changes; `aria-busy` is set, clicks and form submits are ignored, and the button keeps focus. Keep the label as it is ("Save", not "Saving…").
- A toggle (a panel shown, a filter on) is a Button with `aria-pressed`: `secondary` shows an accent edge with the info fill, `ghost` the subtle-2 fill. Pass the attribute; never a class.
- `dark`: for the document viewer only, as Checkbox and DatePicker `dark`: viewer fills and hairlines, white text, the primary in viewer-primary (navy vanishes there), danger text in `danger-on-dark`, and the focus ring in accent-soft.
- Other props pass to the native `<button>`. `type` defaults to `button`.
- A screen never writes `<button>` (lint `ds/prefer-kit-components`): every clickable thing has a kit component, see the kit README's "Buttons and everything clickable".
- States: rest, hover, focus (the shared 2px accent `focusRing`, 2px out), loading, disabled (40% opacity).

Don't: colour a button green, amber or violet; write `bg-brand text-on-solid` by hand; add your own `disabled:opacity-*`; put a Spinner inside a button yourself; give a button a native `title` (wrap it in `Tooltip` instead).
