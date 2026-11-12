# Toast

A short message about something that has just happened ("Course saved", "Could not delete TRN-002"), shown at the bottom right above everything else and gone again on its own.

- **Use** for the outcome of an action once its dialog has closed, or of an action with no dialog (delete from a row menu, archive, export). An error about a field, or inside a dialog that stays open, stays a `Notice` or the field's `error` there; a question is a `ConfirmDialog`; a validation message is never a toast.
- **Set up**: `<ToastProvider>` once, in `components/Providers.tsx`. Then `const { toast, dismiss } = useToast()` and `toast({ tone, title, description?, action?, duration? })`, which returns the toast's id.
- **Props of a toast**: `tone` (`success` default, `info`, `neutral`, `warning`, `danger`); `title`, a few words saying what happened; `description`, one optional line; `action`, one `{ label, onClick }` follow-up ("Undo", "View record"), which also closes it; `duration` in ms, or `null` to stay.
- **Timing**: success, info and neutral close after 5 seconds; warning and danger stay until closed. The timer pauses while the pointer is over the stack or focus is inside it. At most four show; a fifth pushes out the oldest.
- **Look**: the popover surface (`color-surface`, hairline, `shadow-popover`, radius xl), the tone's Notice icon in its colour, a 13px semibold title, a 12px line, the action as a LinkButton, a close IconButton. It slides up and fades in (`motion.fast`), with no motion under reduced motion.
- **Screen readers**: danger is announced at once (`role="alert"`), the rest politely (`role="status"`), from live regions that stay mounted.
- **Layer**: z-[90], above dialogs (50 / 60 / 70) and Popover (80), under RowMenu (100) and Tooltip (110). Focus can reach it from inside a dialog.

Don't: toast a validation message, stack several toasts for one action, or put the only copy of something important in a toast that closes by itself.
