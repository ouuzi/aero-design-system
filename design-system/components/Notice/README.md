# Notice

A banner inside a page, card or dialog that explains a state: a lock, something missing, guidance, a confirmation.

- `tone`: `danger` only for something wrong or blocking, `warning` for something due, `info` for guidance, `success` to confirm, `neutral` for a quiet note. Tints are the full-strength `-bg` and `-line` tokens, never faded.
- `title`, children (one or two lines), `action` (a small button on the right), `icon` (override, or `null`), `compact`.
- Danger and warning notices are announced to screen readers (`role="alert"`).
