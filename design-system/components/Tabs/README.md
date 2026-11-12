# Tabs

Underline tabs for sections of one record or page (profile tabs, assessment steps). The active tab is ink with a `color-brand-2` underline; counts sit in neutral badges.

- `options`: `{ value, label, count?, icon? }[]`; `value` and `onChange` control it; `label` names the tab list.

Use `SegmentedControl` instead for peer views or a filter.

- **Keyboard**: one tab stop (the active tab). Left and Right move to and select the previous or next tab, wrapping; Home and End jump to the first and last; disabled tabs are skipped. Give an option `id` and `controls` to wire it to its panel.
