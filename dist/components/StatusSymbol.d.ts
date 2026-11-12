import React from 'react';
import type { Tone } from './styles.js';
export declare function hasStatusSymbol(tone: Tone): boolean;
export declare function StatusSymbol({ tone, className }: {
    tone: Tone;
    className?: string;
}): React.JSX.Element | null;
