import React from 'react';
import { type CategoryTone } from './styles.js';
export interface BadgeProps {
    tone?: CategoryTone;
    dot?: boolean;
    className?: string;
    children: React.ReactNode;
}
export default function Badge({ tone, dot, className, children }: BadgeProps): React.JSX.Element;
