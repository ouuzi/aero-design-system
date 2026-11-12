# Reports

Reports are the records an auditor keeps: training orders and attendance sheets, AES-CM-07 competency assessments, personnel authorisations and training certificates. They are generated as A4 portrait PDFs from HTML, and they follow their own print rules, not the app's screen scale. The authorisation card's official form, assessment and stamp tabs are on-screen replicas of these documents and follow the same rules.

## Page

- A4 portrait. Margins 28mm top, 22mm bottom, 12mm left and right, so the running header and footer have room.
- Print colours exactly: keep `print-color-adjust: exact` so badge fills and table headers survive printing.
- Never split a table row, a signature block or a heading from the content after it.

## Running header and footer

- **Header**: the operator's wordmark at 14px tall on the left; on the right the report title in 16px semibold uppercase with 0.5px tracking, and the period or reference beneath in 10px `color-muted`. A 1px `color-line` rule closes the header.
- **Footer**, 8px `color-muted`, three parts: the document code with revision on the left (for example "AES-CM-07/AUG26/R3", "AES-TRN-ORD-01"), the confidentiality statement in the centre, and "Page n of m" on the right.
- The confidentiality statement names the operator and is never shortened or removed.

## Type

- Set reports in Inter, like the app, with Arial as the fallback. The PDF service image installs Inter so pages, headers and footers all use it; pages printed from the browser load it and wait for it before printing.
- Codes, dates and figures use tabular figures, never a monospace face. Weights are 400, 500 and 600; `strong`, `b` and table headers are 600.
- `h1` 18px semibold uppercase, 0.5px tracking. `h2` 12px uppercase with a 1.5px dark rule under it: one per numbered section. `h3` 11px. `h4` 10px uppercase.
- Body sections 10.5px with 1.45 line height; tables 9.5px; meta lines 10px grey; footer and confidentiality text 8px. These print sizes are deliberately below the app's 11px floor.

## Colour

Reports use the app's tokens, printed exactly, so screen and paper match.

| Role | Token | Value |
| --- | --- | --- |
| Text and heading rules | `color-ink` | #16202e |
| Secondary text | `color-ink-2` | #3d4654 |
| Meta and footer text | `color-muted` | #626c81 |
| Table and section rules, signature lines | `color-line` | #e4e7ec |
| Table header and panel fill | `color-subtle` (the canvas grey) | #f4f6f8 |
| Certificate frame, headings on certificates | `color-brand` | #0f2a4a |

## Tables

- Full-width, collapsed 1px `color-line` borders on every cell, 5.5px by 8px cell padding, header row semibold on `color-subtle`. The header row repeats on every page.
- Signature rows are 34px tall. Put Adobe Acrobat Sign text tags in white 8px text inside them so they become signature and date fields on upload but stay invisible on paper.
- Three-column signature grids sit at the end: name, role and date over a light signature line.

## Status badges

Badges are 9px semibold uppercase on a 4px-radius pill with a 1px border (print only; on screen status pills are fully rounded), and always carry a symbol and a word so they survive black-and-white printing. They use the app's status trios.

| Status | Tokens |
| --- | --- |
| Valid, pass, satisfactory (✓) | `color-success`, `color-success-bg`, `color-success-line` |
| Due soon, conditional (⚠) | `color-warning`, `color-warning-bg`, `color-warning-line` |
| Overdue, fail, missing, not satisfactory (✕) | `color-danger`, `color-danger-bg`, `color-danger-line` |
| Neutral | `color-ink-2`, `color-subtle`, `color-line` |
| Information | `color-info`, `color-info-bg`, `color-info-line` |

## Logos

- Use the operator's wordmark from Logos, on white only, never recoloured. The AeroCompetence mark does not appear on reports: the documents belong to the organisation, not the software.
- On replicas the organisation is shown with the same wordmark image, never typed out in a display face. Signature names are Inter italic.
