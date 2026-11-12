'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/*
 * The 5x5 safety risk matrix for the SMS module: likelihood 5 (Frequent) to 1 (Extremely
 * improbable) against severity A (Catastrophic) to E (Negligible), with the initial and
 * the residual risk on one grid.
 *
 * - Bands default to the ICAO Doc 9859 example. ICAO calls its table an example, so pass
 *   the SMS manual's `bands`, and store them with each assessment so old assessments keep
 *   the matrix they were scored on. Codes not listed are acceptable.
 * - Never colour alone: every cell prints its index, intolerable cells are hatched like red
 *   readiness cells, the legend names each band (with its status symbol) and the summary
 *   reads "Initial 4B Intolerable -> Residual 2D Acceptable".
 * - Markers: a filled "I" for the initial risk, an outlined "R" for the residual risk. The
 *   cell holding a marker gets a 2px border in its band colour.
 * - Editable only with `onChange`: a role="grid" with one tab stop (roving tabindex); arrow
 *   keys move, Home/End jump within a row, Enter or Space chooses. `mode` says whether a
 *   choice sets the initial or the residual risk. Without `onChange` it is a read-only
 *   table for reports and dashboards.
 *
 *   <RiskMatrix value="4B" residual="2D" mode="residual" onChange={setCode} />
 */
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge.js';
import { focusRingGroup } from './styles.js';
import { cn } from '../lib/utils.js';
/** ICAO Doc 9859 example safety risk tolerability bands. */
export const DEFAULT_RISK_BANDS = {
    intolerable: ['5A', '5B', '5C', '4A', '4B', '3A'],
    tolerable: ['5D', '5E', '4C', '4D', '4E', '3B', '3C', '3D', '2A', '2B', '2C', '1A'],
};
export const RISK_LIKELIHOOD = [
    { value: 5, label: 'Frequent' },
    { value: 4, label: 'Occasional' },
    { value: 3, label: 'Remote' },
    { value: 2, label: 'Improbable' },
    { value: 1, label: 'Extremely improbable' },
];
export const RISK_SEVERITY = [
    { value: 'A', label: 'Catastrophic' },
    { value: 'B', label: 'Hazardous' },
    { value: 'C', label: 'Major' },
    { value: 'D', label: 'Minor' },
    { value: 'E', label: 'Negligible' },
];
export const RISK_BAND_LABELS = {
    intolerable: 'Intolerable',
    tolerable: 'Tolerable',
    acceptable: 'Acceptable',
};
export const RISK_BAND_TONE = {
    intolerable: 'danger',
    tolerable: 'warning',
    acceptable: 'success',
};
const CODE_PATTERN = /^[1-5][A-E]$/;
/** "4b" -> "4B"; anything that is not likelihood 1-5 plus severity A-E -> undefined. */
export function normalizeRiskCode(code) {
    if (!code)
        return undefined;
    const c = code.trim().toUpperCase();
    return CODE_PATTERN.test(c) ? c : undefined;
}
/** The band a code falls in. Codes in neither list of `bands` are acceptable. */
export function riskBand(code, bands = DEFAULT_RISK_BANDS) {
    const c = code.trim().toUpperCase();
    const has = (list) => list.some((x) => x.trim().toUpperCase() === c);
    if (has(bands.intolerable))
        return 'intolerable';
    if (has(bands.tolerable))
        return 'tolerable';
    return 'acceptable';
}
/* Cell tones: band fill and line, index in the band's text colour. */
const cellTone = {
    intolerable: 'bg-danger-bg border-danger-line text-danger annunciator-hatch-soft',
    tolerable: 'bg-warning-bg border-warning-line text-warning',
    acceptable: 'bg-success-bg border-success-line text-success',
};
function Marker({ kind }) {
    return (_jsx("span", { "aria-hidden": "true", className: cn('inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-11 font-semibold leading-none', kind === 'initial' ? 'bg-ink text-surface' : 'border border-ink bg-surface text-ink'), children: kind === 'initial' ? 'I' : 'R' }));
}
function posOf(code) {
    if (!code)
        return undefined;
    const row = RISK_LIKELIHOOD.findIndex((l) => String(l.value) === code[0]);
    const col = RISK_SEVERITY.findIndex((s) => s.value === code[1]);
    return row < 0 || col < 0 ? undefined : { row, col };
}
function codeAt({ row, col }) {
    return `${RISK_LIKELIHOOD[row].value}${RISK_SEVERITY[col].value}`;
}
function BandBadge({ band }) {
    return _jsx(StatusBadge, { tone: RISK_BAND_TONE[band], children: RISK_BAND_LABELS[band] });
}
export function RiskMatrix({ value, residual, onChange, mode = 'initial', bands = DEFAULT_RISK_BANDS, caption }) {
    const editable = typeof onChange === 'function';
    const initialCode = normalizeRiskCode(value);
    const residualCode = normalizeRiskCode(residual);
    const modeCode = mode === 'residual' ? residualCode : initialCode;
    const label = caption ?? 'Safety risk matrix';
    const captionId = React.useId();
    // Roving tab stop: the cell that takes Tab focus. Follows the code the current mode sets
    // until the user moves it with the keyboard or a click.
    const [active, setActive] = React.useState(() => posOf(modeCode) ?? posOf(initialCode) ?? { row: 0, col: 0 });
    const [syncedFrom, setSyncedFrom] = React.useState(modeCode);
    if (syncedFrom !== modeCode) {
        setSyncedFrom(modeCode);
        const p = posOf(modeCode);
        if (p)
            setActive(p);
    }
    const cellRefs = React.useRef([]);
    const moveTo = (p) => {
        setActive(p);
        cellRefs.current[p.row * RISK_SEVERITY.length + p.col]?.focus();
    };
    const choose = (p) => {
        setActive(p);
        onChange?.(codeAt(p));
    };
    const onKeyDown = (e, p) => {
        const last = RISK_SEVERITY.length - 1;
        const lastRow = RISK_LIKELIHOOD.length - 1;
        let next;
        switch (e.key) {
            case 'ArrowUp':
                next = { row: Math.max(0, p.row - 1), col: p.col };
                break;
            case 'ArrowDown':
                next = { row: Math.min(lastRow, p.row + 1), col: p.col };
                break;
            case 'ArrowLeft':
                next = { row: p.row, col: Math.max(0, p.col - 1) };
                break;
            case 'ArrowRight':
                next = { row: p.row, col: Math.min(last, p.col + 1) };
                break;
            case 'Home':
                next = e.ctrlKey ? { row: 0, col: 0 } : { row: p.row, col: 0 };
                break;
            case 'End':
                next = e.ctrlKey ? { row: lastRow, col: last } : { row: p.row, col: last };
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                choose(p);
                return;
            default:
                return;
        }
        e.preventDefault();
        moveTo(next);
    };
    const initialBand = initialCode ? riskBand(initialCode, bands) : undefined;
    const residualBand = residualCode ? riskBand(residualCode, bands) : undefined;
    return (_jsxs("div", { className: "flex flex-col gap-3 text-13 text-ink comfortable:text-15 [print-color-adjust:exact]", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { role: editable ? 'grid' : undefined, "aria-labelledby": captionId, className: "w-full min-w-[28rem] border-separate border-spacing-y-1 text-left", children: [_jsxs("caption", { id: captionId, className: "sr-only", children: [label, editable ? `. Choosing a cell sets the ${mode === 'residual' ? 'residual' : 'initial'} risk.` : ''] }), _jsx("thead", { children: _jsxs("tr", { children: [_jsxs("td", { className: "w-36 pb-1 pr-3 align-bottom text-11 leading-4 text-muted comfortable:text-12", "aria-hidden": "true", children: [_jsx("span", { className: "block", children: "Likelihood \u2193" }), _jsx("span", { className: "block", children: "Severity \u2192" })] }), RISK_SEVERITY.map((s) => (_jsxs("th", { scope: "col", className: "px-1 pb-1 text-center align-bottom font-normal", children: [_jsx("span", { className: "block text-13 font-semibold text-ink comfortable:text-14", children: s.value }), _jsx("span", { className: "block whitespace-nowrap text-12 text-ink-2 comfortable:text-13", children: s.label })] }, s.value)))] }) }), _jsx("tbody", { children: RISK_LIKELIHOOD.map((l, row) => (_jsxs("tr", { children: [_jsxs("th", { scope: "row", className: "pr-3 text-right align-middle font-normal", children: [_jsx("span", { className: "block text-13 font-semibold leading-4 text-ink comfortable:text-14", children: l.value }), _jsx("span", { className: "block whitespace-nowrap text-12 leading-4 text-ink-2 comfortable:text-13", children: l.label })] }), RISK_SEVERITY.map((s, col) => {
                                        const p = { row, col };
                                        const code = codeAt(p);
                                        const band = riskBand(code, bands);
                                        const isInitial = code === initialCode;
                                        const isResidual = code === residualCode;
                                        const marked = isInitial || isResidual;
                                        const isActive = active.row === row && active.col === col;
                                        const markerText = [isInitial && 'initial risk', isResidual && 'residual risk'].filter(Boolean).join(' and ');
                                        const cellLabel = `Likelihood ${l.value} ${l.label}, severity ${s.value} ${s.label}, ${code}, ${band}${markerText ? `, ${markerText}` : ''}`;
                                        return (_jsx("td", { ref: (el) => {
                                                cellRefs.current[row * RISK_SEVERITY.length + col] = el;
                                            }, role: editable ? 'gridcell' : undefined, "aria-label": cellLabel, "aria-selected": editable ? code === modeCode : undefined, tabIndex: editable ? (isActive ? 0 : -1) : undefined, onClick: editable ? () => choose(p) : undefined, onFocus: editable ? () => setActive(p) : undefined, onKeyDown: editable ? (e) => onKeyDown(e, p) : undefined, className: cn('group px-1 text-center align-middle', editable && 'cursor-pointer outline-none'), children: _jsxs("span", { className: cn('mx-auto box-border flex h-11 w-14 flex-col items-center justify-center gap-0.5 rounded-md border text-12 font-semibold leading-4 tabular-nums transition-colors comfortable:text-13', cellTone[band], marked && 'border-2 border-current', editable && cn('group-hover:border-current', focusRingGroup)), children: [_jsx("span", { "aria-hidden": "true", children: code }), marked && (_jsxs("span", { className: "flex items-center gap-0.5", children: [isInitial && _jsx(Marker, { kind: "initial" }), isResidual && _jsx(Marker, { kind: "residual" })] }))] }) }, s.value));
                                    })] }, l.value))) })] }) }), _jsxs("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-2 text-12 text-ink-2 comfortable:text-13", children: [_jsx("span", { className: "sr-only", children: "Legend:" }), ['intolerable', 'tolerable', 'acceptable'].map((b) => (_jsx(BandBadge, { band: b }, b))), _jsxs("span", { className: "inline-flex items-center gap-1.5 pl-2", children: [_jsx(Marker, { kind: "initial" }), "Initial"] }), _jsxs("span", { className: "inline-flex items-center gap-1.5", children: [_jsx(Marker, { kind: "residual" }), "Residual"] })] }), (initialCode || residualCode) && (_jsxs("p", { className: "flex flex-wrap items-center gap-x-2 gap-y-1 text-13 text-ink comfortable:text-15", children: [initialCode && initialBand && (_jsxs("span", { className: "inline-flex items-center gap-2", children: ["Initial ", _jsx("span", { className: "font-semibold tabular-nums", children: initialCode }), _jsx(BandBadge, { band: initialBand })] })), initialCode && residualCode && _jsx(ArrowRight, { className: "h-3.5 w-3.5 text-muted", "aria-hidden": "true" }), residualCode && residualBand && (_jsxs("span", { className: "inline-flex items-center gap-2", children: ["Residual ", _jsx("span", { className: "font-semibold tabular-nums", children: residualCode }), _jsx(BandBadge, { band: residualBand })] }))] }))] }));
}
export default RiskMatrix;
