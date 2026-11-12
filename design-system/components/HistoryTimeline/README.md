# HistoryTimeline

The audit trail of one record: who did what, when, what changed and why, with signatures stamped in place.

- **Use** as the History tab on every record an auditor may ask about: an authorisation, a training record, a finding, a document revision.
- **Newest first.** Each event names the action in sentence case ("Expiry date corrected"), then the person, role, authorisation number and a UTC time.
- **Never a silent edit.** A change shows the old value struck through beside the new one, and both are read out ("Previous value", "New value"). Any change to a signed record carries its `reason`.
- **Signatures** (`kind: 'sign'`, a navy lock node) show the meaning statement the signer confirmed and the record hash, as EASA's guidelines on electronic records expect: traceability, integrity, correction of errors.
- **Status changes** (`kind: 'status'`) carry the state the record moved to as `status: { tone, label }`, drawn as a `StatusBadge` with its symbol. A category or count beside the action ("Correction", "2 fields") is `badge: { tone, label }` with a category tone, drawn as a `Badge`.
- **Read-only.** Corrections arrive as new events; nothing is edited or deleted.
- Consumer provides `events` and an optional `label`.

In `src/components/HistoryTimeline.tsx`, exported from `aero-design-system`.
