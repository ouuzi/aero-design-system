# SegmentedControl

Two to four peer views, or a single-choice filter: a grey track with a navy active option.

- The active option is always navy, whatever it means: status colours never fill a filter. Show a status in the count or a badge instead.
- `size`: `md` 36px (`control-md`, 44px comfortable) or `sm` 28px (`control-xs`, 36px comfortable).
- **Keyboard**: one tab stop (the active option). Left and Right move to and select the previous or next option, wrapping; Home and End jump to the ends; disabled options are skipped.
- Consumer provides `options` (`value`, `label`, optional `count`, `icon`, `disabled`), `value`, `onChange` and a `label` for screen readers.

For one choice that needs a sentence per option, use `RadioGroup`.
