# StatusBadge

The one status label in the app: a rounded, semibold pill whose colour is looked up, not chosen, so the same status is the same colour on every screen.

- **Mapped** (preferred), colour and word from `src/components/statusTones.ts`:
  - `kind="readiness"`: Compliant, Expiring soon, Non-compliant, Not configured (neutral: it cannot be evaluated, so it is never red). Labels are sentence case whatever the stored value.
  - `kind="authorisation"`: takes a `PersonnelAuthorisationStatus`. Valid and Issued are success; Expiring Soon is warning; Expired, Lapsed, Suspended and Revoked are danger; Draft is neutral. A record that may hold a legacy free string goes through `authorisationStatusBadge(raw)` or `normaliseAuthorisationStatus(raw)`; an unknown value renders neutral with its text.
  - `kind="document"`: Verified, Pending (for Pending Verification), Rejected.
  - `kind="finding"`: a compliance finding's issue. Expired, Not completed, Missing, Revoked, Suspended and Lapsed are danger; Pending verification, Scheduled, not yet completed and Expiring soon are warning; Draft is neutral. Something that is waiting is never drawn as a failure.
  - `kind="outcome"`: a competency assessment outcome. Competent is success; Competent with limitations or actions, and Deferred, further evidence required, are warning; Not competent is danger.
  - `kind="activity"`: an activity-log status. Verified and Completed are success; Pending verification is warning; Action required is danger. Stored in capitals, shown in sentence case.
  - The three new kinds take any string, ignore case and punctuation, and render an unknown value neutral in sentence case.
- **Direct**, for a status outside those maps (an experience log, a checklist result): `<StatusBadge tone="success">Approved</StatusBadge>`, with `tone` (`success`, `warning`, `danger`, `neutral`) from a lookup table, never a ternary.
- **`width="column"`**: the 120px pill with 12px centred text for a requirement row's Status column, so statuses line up down the page. `auto` (default) is the inline pill.
- **Symbols**: success, warning and danger always show a check, a triangle or a cross before the word, the same as on printed reports. Success and danger are 1.12:1 apart in lightness, so the symbol is what tells them apart for colour-blind readers.
- **`onRemove`** (with `removeLabel`) adds a Chip's × for a picked value in a problem state, such as an aircraft type that is not in the register: the same 16px glyph in a 24px target.
- **`dot`** renders only for a neutral status (Not Configured, Draft); on a status tone it is ignored, because the symbol is already there.

Add a status to `statusTones.ts` once. A status a person sets is a `StatusSelect`; a category or a count is a `Badge`. `StatusPill` is gone: use `width="column"`.
