# ModalShell

Every dialog in the app: a right-hand side sheet on `shadow-modal` over a neutral `ink` 40% backdrop without blur, with a ruled header, a scrolling body and a pinned footer for actions, so the page stays in view.

- **Sheet** (default): full height, docked right, sliding in (`motion.slow`, none under reduced motion). Full width on phones, where header actions drop under the title and footer buttons wrap.
- **Four sizes**, the same for a sheet and a centred dialog: `sm` 480px (a short form), `md` 640px (the default: an ordinary form or record), `lg` 896px (two-column forms, a form with a table), `xl` min(1280px, 96vw) (large working forms such as the AES-CM-07 assessment, printable cards). Old sizes map: `sm`, `md` to `sm`; `lg`, `xl` to `md`; `2xl`, `3xl` to `lg`; `4xl`, `wide`, `full` to `xl`.
- **Stacking**: a dialog opened from another (`layer="nested"`, then `"top"`) slides in as its own sheet above it, with the one underneath dimmed. Keep a child no wider than its parent so the parent shows beside it. Escape and close step back one layer at a time.
- **Closing**: the close button, Escape and a click outside the dialog all close it. Only a press that starts on the backdrop counts, so dragging a selection out of a field does nothing, and a click outside a nested dialog closes that one only. A `ConfirmDialog` must be answered: outside clicks do nothing. A long form with no draft passes `onBackdropClose` and asks before closing (the AES-CM-07 assessment asks "Close the assessment?"). A dialog with an inline form open can pass `closeOnBackdrop={false}` while it is open. `closeDisabled` (a save in progress) blocks all three.
- **Centred** (`placement="center"`): kept for `ConfirmDialog`, its one sanctioned use. Screens do not pass it themselves.
- **Focus**: on open, focus goes to a child with `autoFocus`, then the first `data-autofocus` element, then the first control in the body, then the panel. Tab and Shift+Tab cycle inside the top-most sheet, and focus returns to the opener on close.
- **Print**: a `printable` dialog prints its body full width with no sheet chrome or animation.
- **`id`** sets the dialog element's id (the title is `${id}-title`), for a print stylesheet or a test.
- Props: `title`, `subtitle`, `eyebrow`, `headerAside`, `headerExtra`, `footer` (buttons, primary last; `lg` buttons line up with 40px inputs), `footerStart`, `size`, `placement`, `layer`, `closeLabel`, `closeOnEscape`, `closeOnBackdrop`, `onBackdropClose`, `formProps`, `rawBody`, `printable`, `id`, `role`, `aria-describedby`.
- Mark custom portal content opened from a dialog with `data-modal-portal` so focus is not pulled back from it.
- Don't build an overlay by hand, and don't build a confirmation from ModalShell: use `ConfirmDialog`.
