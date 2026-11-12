import React from 'react';
import { type StatusTone } from './styles.js';
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
export declare const DEFAULT_RISK_BANDS: RiskBands;
export declare const RISK_LIKELIHOOD: readonly [{
    readonly value: 5;
    readonly label: "Frequent";
}, {
    readonly value: 4;
    readonly label: "Occasional";
}, {
    readonly value: 3;
    readonly label: "Remote";
}, {
    readonly value: 2;
    readonly label: "Improbable";
}, {
    readonly value: 1;
    readonly label: "Extremely improbable";
}];
export declare const RISK_SEVERITY: readonly [{
    readonly value: "A";
    readonly label: "Catastrophic";
}, {
    readonly value: "B";
    readonly label: "Hazardous";
}, {
    readonly value: "C";
    readonly label: "Major";
}, {
    readonly value: "D";
    readonly label: "Minor";
}, {
    readonly value: "E";
    readonly label: "Negligible";
}];
export declare const RISK_BAND_LABELS: Record<RiskBand, string>;
export declare const RISK_BAND_TONE: Record<RiskBand, StatusTone>;
/** "4b" -> "4B"; anything that is not likelihood 1-5 plus severity A-E -> undefined. */
export declare function normalizeRiskCode(code: RiskCode | null | undefined): RiskCode | undefined;
/** The band a code falls in. Codes in neither list of `bands` are acceptable. */
export declare function riskBand(code: RiskCode, bands?: RiskBands): RiskBand;
export declare function RiskMatrix({ value, residual, onChange, mode, bands, caption }: RiskMatrixProps): React.JSX.Element;
export default RiskMatrix;
