# RiskMatrix

The 5×5 safety risk matrix: likelihood 5 (Frequent) to 1 (Extremely improbable) against severity A (Catastrophic) to E (Negligible), with initial and residual risk on one grid.

- **Use** in hazard reports, occurrence investigations and Management of Change, wherever a risk is assessed.
- **Bands** default to the ICAO Doc 9859 example: intolerable 5A, 5B, 5C, 4A, 4B, 3A; tolerable 5D, 5E, 4C, 4D, 4E, 3B, 3C, 3D, 2A, 2B, 2C, 1A; the rest acceptable. ICAO calls its table an example, so pass your SMS manual's `bands`, and store them with each assessment so old assessments keep the matrix they were scored on.
- **Never colour alone.** Every cell prints its index ("4B"), intolerable cells are hatched like red readiness cells, the legend names each band, and the summary reads "Initial 4B Intolerable → Residual 2D Acceptable".
- **Markers**: a filled "I" for initial, an outlined "R" for residual.
- **Keyboard**: one tab stop; arrow keys move, Enter or Space chooses. Each cell is announced with likelihood, severity, index and band. Cells are 56×44px.
- **Editable** with `onChange`; `mode` says whether a click sets the initial or the residual risk. Without `onChange` it is read-only, for reports and dashboards.
- Consumer provides `value`, `residual`, optional `onChange`, `mode`, `bands` and `caption`.

In `src/components/RiskMatrix.tsx`, exported from `aero-design-system`.
