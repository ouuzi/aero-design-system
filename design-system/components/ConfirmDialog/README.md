# ConfirmDialog

The small centred dialog that asks before a step that cannot be taken back: delete, archive, replace, revoke. It is the one sanctioned use of the centred dialog; every other dialog is a side sheet.

- **Shape**: `ModalShell` with `placement="center"`, `size="sm"` (480px), `role="alertdialog"`, described by its body, portalled to `<body>` on layer `top` so it sits above any sheet that opened it.
- **Words**: the `title` is a question in sentence case ("Delete course TRN-002?"); `body` says what happens and whether it can be undone; `confirmLabel` names the action ("Delete course", never "Yes" or "OK"). `cancelLabel` defaults to "Cancel".
- **`tone="danger"`** gives the red danger button and starts focus on Cancel, so a stray Enter does not delete. The default tone is the navy primary button with focus on it.
- **Busy**: `busy` (or a Promise returned by `onConfirm`) puts the confirm button in its loading state and locks Cancel, the close button and Escape. `error` shows why the action failed, above the buttons, and announces it.
- **Consumer provides** `title`, `onConfirm` (close the dialog from here), `onCancel`, and optionally `open`, `body`, `children` (a list of what is affected, a reason field), `eyebrow` (a record code), `tone`, `busy`, `error`.
- **In an event handler**, in place of `window.confirm`: `const { confirm, dialog } = useConfirmDialog();` then `if (!(await confirm({ tone: 'danger', title, confirmLabel }))) return;` and render `{dialog}` once.
- Focus moves in, Tab stays inside, Escape cancels, and focus returns to the control that opened it.

Don't: call `window.confirm()` (lint rejects it), build a confirmation from `ModalShell` by hand, or pass `placement="center"` for anything else.
