import React from 'react';
import { badgeClass, labelDot, type CategoryTone } from './styles.js';
import { cn } from '../lib/utils.js';

/*
 * A category chip or a count: what kind of thing something is ("B1", "Internal",
 * "3 new"), never what state it is in. Four tones: neutral (default), info (filled
 * blue), violet (outlined, so it differs from info by more than hue) and brand (navy).
 * A status (Valid, Expired, Pending...) is a <StatusBadge>, which draws the status
 * colours and symbols; Badge does not accept success, warning or danger.
 * `dot` adds a leading dot.
 */
export interface BadgeProps {
  tone?: CategoryTone;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function Badge({ tone = 'neutral', dot = false, className = '', children }: BadgeProps) {
  return (
    <span className={cn(badgeClass(tone), className)}>
      {dot && <span className={labelDot} aria-hidden="true" />}
      {children}
    </span>
  );
}
