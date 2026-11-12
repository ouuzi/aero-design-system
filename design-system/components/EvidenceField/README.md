# EvidenceField

A form control that links training or document records as evidence for a requirement: it shows what is linked, opens your picker, and clears.

- **Use** in a requirement row or an assessment form wherever a record backs a claim ("Human Factors recurrent, CERT-2291"). It belongs to this app; another app would build its own.
- **Look**: the compact `sm` select frame (32px, 40px comfortable) with a paperclip (one record) or layers icon (several) and a chevron; once something is linked, a quiet danger icon button clears it. The full text of a truncated value shows as a tooltip on hover and keyboard focus.
- **Consumer provides** `count` (number of linked records), `title` (the record's title when one is linked), `detail` (certificate or record references), `onOpen` (opens your evidence picker, usually a sheet), and optionally `onClear`, `placeholder` (default "Link evidence") and `id` (so a `Field` label points at it).
- **States**: empty (muted placeholder), one record (title and reference), several records ("3 records" and their references), focus (`focusField`), with a clear button when `onClear` is given.
- `LinkedEvidenceList` shows the records behind a multi-linked requirement as a quiet nested list under the row, each with its status pill.

Don't: open the picker on hover, or clear without the person pressing the clear button.
