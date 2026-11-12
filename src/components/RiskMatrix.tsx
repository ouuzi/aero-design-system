'use client';

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
import { focusRingGroup, type StatusTone } from './styles.js';
import { cn } from '../lib/utils.js';

/** Likelihood 1-5 and severity A-E, e.g. "4B". */
export type RiskCode = string;

export type RiskBand = 'intolerable' | 'tolerable' | 'acceptable';

export interface RiskBands {
  intolerable: RiskCode[];
  tolerable: RiskCode[];
}

export interface RiskMatrixProps {
  value?: RiskCode;
  residual?: RiskCode;
  /** Makes cells choosable; without it the matrix is read-only. */
  onChange?: (code: RiskCode) => void;
  /** Which of value or residual a choice sets. */
  mode?: 'initial' | 'residual';
  /** Defaults to the ICAO Doc 9859 example; codes not listed are acceptable. Store the bands with each assessment. */
  bands?: RiskBands;
  caption?: string;
}

/** ICAO Doc 9859 example safety risk tolerability bands. */
export const DEFAULT_RISK_BANDS: RiskBands = {
  intolerable: ['5A', '5B', '5C', '4A', '4B', '3A'],
  tolerable: ['5D', '5E', '4C', '4D', '4E', '3B', '3C', '3D', '2A', '2B', '2C', '1A'],
};

export const RISK_LIKELIHOOD = [
  { value: 5, label: 'Frequent' },
  { value: 4, label: 'Occasional' },
  { value: 3, label: 'Remote' },
  { value: 2, label: 'Improbable' },
  { value: 1, label: 'Extremely improbable' },
] as const;

export const RISK_SEVERITY = [
  { value: 'A', label: 'Catastrophic' },
  { value: 'B', label: 'Hazardous' },
  { value: 'C', label: 'Major' },
  { value: 'D', label: 'Minor' },
  { value: 'E', label: 'Negligible' },
] as const;

export const RISK_BAND_LABELS: Record<RiskBand, string> = {
  intolerable: 'Intolerable',
  tolerable: 'Tolerable',
  acceptable: 'Acceptable',
};

export const RISK_BAND_TONE: Record<RiskBand, StatusTone> = {
  intolerable: 'danger',
  tolerable: 'warning',
  acceptable: 'success',
};

const CODE_PATTERN = /^[1-5][A-E]$/;

/** "4b" -> "4B"; anything that is not likelihood 1-5 plus severity A-E -> undefined. */
export function normalizeRiskCode(code: RiskCode | null | undefined): RiskCode | undefined {
  if (!code) return undefined;
  const c = code.trim().toUpperCase();
  return CODE_PATTERN.test(c) ? c : undefined;
}

/** The band a code falls in. Codes in neither list of `bands` are acceptable. */
export function riskBand(code: RiskCode, bands: RiskBands = DEFAULT_RISK_BANDS): RiskBand {
  const c = code.trim().toUpperCase();
  const has = (list: RiskCode[]) => list.some((x) => x.trim().toUpperCase() === c);
  if (has(bands.intolerable)) return 'intolerable';
  if (has(bands.tolerable)) return 'tolerable';
  return 'acceptable';
}

/* Cell tones: band fill and line, index in the band's text colour. */
const cellTone: Record<RiskBand, string> = {
  intolerable: 'bg-danger-bg border-danger-line text-danger annunciator-hatch-soft',
  tolerable: 'bg-warning-bg border-warning-line text-warning',
  acceptable: 'bg-success-bg border-success-line text-success',
};

function Marker({ kind }: { kind: 'initial' | 'residual' }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-11 font-semibold leading-none',
        kind === 'initial' ? 'bg-ink text-surface' : 'border border-ink bg-surface text-ink',
      )}
    >
      {kind === 'initial' ? 'I' : 'R'}
    </span>
  );
}

type Pos = { row: number; col: number };

function posOf(code: RiskCode | undefined): Pos | undefined {
  if (!code) return undefined;
  const row = RISK_LIKELIHOOD.findIndex((l) => String(l.value) === code[0]);
  const col = RISK_SEVERITY.findIndex((s) => s.value === code[1]);
  return row < 0 || col < 0 ? undefined : { row, col };
}

function codeAt({ row, col }: Pos): RiskCode {
  return `${RISK_LIKELIHOOD[row].value}${RISK_SEVERITY[col].value}`;
}

function BandBadge({ band }: { band: RiskBand }) {
  return <StatusBadge tone={RISK_BAND_TONE[band]}>{RISK_BAND_LABELS[band]}</StatusBadge>;
}

export function RiskMatrix({ value, residual, onChange, mode = 'initial', bands = DEFAULT_RISK_BANDS, caption }: RiskMatrixProps) {
  const editable = typeof onChange === 'function';
  const initialCode = normalizeRiskCode(value);
  const residualCode = normalizeRiskCode(residual);
  const modeCode = mode === 'residual' ? residualCode : initialCode;
  const label = caption ?? 'Safety risk matrix';
  const captionId = React.useId();

  // Roving tab stop: the cell that takes Tab focus. Follows the code the current mode sets
  // until the user moves it with the keyboard or a click.
  const [active, setActive] = React.useState<Pos>(() => posOf(modeCode) ?? posOf(initialCode) ?? { row: 0, col: 0 });
  const [syncedFrom, setSyncedFrom] = React.useState(modeCode);
  if (syncedFrom !== modeCode) {
    setSyncedFrom(modeCode);
    const p = posOf(modeCode);
    if (p) setActive(p);
  }

  const cellRefs = React.useRef<(HTMLTableCellElement | null)[]>([]);

  const moveTo = (p: Pos) => {
    setActive(p);
    cellRefs.current[p.row * RISK_SEVERITY.length + p.col]?.focus();
  };

  const choose = (p: Pos) => {
    setActive(p);
    onChange?.(codeAt(p));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTableCellElement>, p: Pos) => {
    const last = RISK_SEVERITY.length - 1;
    const lastRow = RISK_LIKELIHOOD.length - 1;
    let next: Pos | undefined;
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

  return (
    <div className="flex flex-col gap-3 text-13 text-ink comfortable:text-15 [print-color-adjust:exact]">
      <div className="overflow-x-auto">
        <table
          role={editable ? 'grid' : undefined}
          aria-labelledby={captionId}
          className="w-full min-w-[28rem] border-separate border-spacing-y-1 text-left"
        >
          <caption id={captionId} className="sr-only">
            {label}
            {editable ? `. Choosing a cell sets the ${mode === 'residual' ? 'residual' : 'initial'} risk.` : ''}
          </caption>
          <thead>
            <tr>
              <td className="w-36 pb-1 pr-3 align-bottom text-11 leading-4 text-muted comfortable:text-12" aria-hidden="true">
                <span className="block">Likelihood ↓</span>
                <span className="block">Severity →</span>
              </td>
              {RISK_SEVERITY.map((s) => (
                <th key={s.value} scope="col" className="px-1 pb-1 text-center align-bottom font-normal">
                  <span className="block text-13 font-semibold text-ink comfortable:text-14">{s.value}</span>
                  <span className="block whitespace-nowrap text-12 text-ink-2 comfortable:text-13">{s.label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RISK_LIKELIHOOD.map((l, row) => (
              <tr key={l.value}>
                <th scope="row" className="pr-3 text-right align-middle font-normal">
                  <span className="block text-13 font-semibold leading-4 text-ink comfortable:text-14">{l.value}</span>
                  <span className="block whitespace-nowrap text-12 leading-4 text-ink-2 comfortable:text-13">{l.label}</span>
                </th>
                {RISK_SEVERITY.map((s, col) => {
                  const p = { row, col };
                  const code = codeAt(p);
                  const band = riskBand(code, bands);
                  const isInitial = code === initialCode;
                  const isResidual = code === residualCode;
                  const marked = isInitial || isResidual;
                  const isActive = active.row === row && active.col === col;
                  const markerText = [isInitial && 'initial risk', isResidual && 'residual risk'].filter(Boolean).join(' and ');
                  const cellLabel = `Likelihood ${l.value} ${l.label}, severity ${s.value} ${s.label}, ${code}, ${band}${markerText ? `, ${markerText}` : ''}`;
                  return (
                    <td
                      key={s.value}
                      ref={(el) => {
                        cellRefs.current[row * RISK_SEVERITY.length + col] = el;
                      }}
                      role={editable ? 'gridcell' : undefined}
                      aria-label={cellLabel}
                      aria-selected={editable ? code === modeCode : undefined}
                      tabIndex={editable ? (isActive ? 0 : -1) : undefined}
                      onClick={editable ? () => choose(p) : undefined}
                      onFocus={editable ? () => setActive(p) : undefined}
                      onKeyDown={editable ? (e) => onKeyDown(e, p) : undefined}
                      className={cn('group px-1 text-center align-middle', editable && 'cursor-pointer outline-none')}
                    >
                      <span
                        className={cn(
                          'mx-auto box-border flex h-11 w-14 flex-col items-center justify-center gap-0.5 rounded-md border text-12 font-semibold leading-4 tabular-nums transition-colors comfortable:text-13',
                          cellTone[band],
                          marked && 'border-2 border-current',
                          editable && cn('group-hover:border-current', focusRingGroup),
                        )}
                      >
                        <span aria-hidden="true">{code}</span>
                        {marked && (
                          <span className="flex items-center gap-0.5">
                            {isInitial && <Marker kind="initial" />}
                            {isResidual && <Marker kind="residual" />}
                          </span>
                        )}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-12 text-ink-2 comfortable:text-13">
        <span className="sr-only">Legend:</span>
        {(['intolerable', 'tolerable', 'acceptable'] as const).map((b) => (
          <BandBadge key={b} band={b} />
        ))}
        <span className="inline-flex items-center gap-1.5 pl-2">
          <Marker kind="initial" />
          Initial
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Marker kind="residual" />
          Residual
        </span>
      </div>

      {(initialCode || residualCode) && (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-13 text-ink comfortable:text-15">
          {initialCode && initialBand && (
            <span className="inline-flex items-center gap-2">
              Initial <span className="font-semibold tabular-nums">{initialCode}</span>
              <BandBadge band={initialBand} />
            </span>
          )}
          {initialCode && residualCode && <ArrowRight className="h-3.5 w-3.5 text-muted" aria-hidden="true" />}
          {residualCode && residualBand && (
            <span className="inline-flex items-center gap-2">
              Residual <span className="font-semibold tabular-nums">{residualCode}</span>
              <BandBadge band={residualBand} />
            </span>
          )}
        </p>
      )}
    </div>
  );
}

export default RiskMatrix;
