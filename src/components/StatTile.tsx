import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { focusRing, statLabel, statTile, statTileCompact, statValue, statValueCompact } from './styles.js';
import { cn } from '../lib/utils.js';

/*
 * Stat tile: a label, an icon and one figure. Status shows in the icon and the figure
 * only, never a coloured border, tinted background or coloured label.
 *
 * `alert` is the colour the figure takes WHEN THERE IS SOMETHING TO ACT ON: a count of
 * expired records is red when it is 3 and ink when it is 0. The icon carries the tile's
 * meaning at all times (`iconTone`). Pass `onClick` to make the whole tile a filter
 * button, and `pressed` when its filter is on.
 */

export type StatAlert = 'danger' | 'warning';
type IconTone = 'muted' | 'success' | 'warning' | 'danger';

const alertClass: Record<StatAlert, string> = { danger: 'text-danger', warning: 'text-warning' };
const iconToneClass: Record<IconTone, string> = {
  muted: 'text-muted',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
};

export interface StatTileProps {
  label: React.ReactNode;
  value: number | string;
  /** Small text after the figure: "personnel", "of 42". */
  unit?: React.ReactNode;
  /** One muted line under the figure. */
  detail?: React.ReactNode;
  icon?: LucideIcon;
  iconTone?: IconTone;
  alert?: StatAlert;
  compact?: boolean;
  onClick?: () => void;
  pressed?: boolean;
  className?: string;
}

export function StatTile({
  label,
  value,
  unit,
  detail,
  icon: Icon,
  iconTone = 'muted',
  alert,
  compact = false,
  onClick,
  pressed,
  className,
}: StatTileProps) {
  const numeric = typeof value === 'number' ? value : Number(value);
  const showAlert = alert && Number.isFinite(numeric) && numeric > 0;
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className={compact ? 'text-12 font-medium text-ink-2 comfortable:text-13' : statLabel}>{label}</span>
        {Icon && <Icon className={cn(compact ? 'h-4 w-4' : 'h-5 w-5', 'shrink-0', iconToneClass[iconTone])} aria-hidden="true" />}
      </div>
      <div className={cn('flex items-baseline gap-2', compact ? 'mt-2' : 'mt-4')}>
        <span className={cn(compact ? statValueCompact : statValue, showAlert ? alertClass[alert] : 'text-ink')}>{value}</span>
        {unit && <span className="text-13 font-medium text-muted comfortable:text-15">{unit}</span>}
      </div>
      {detail && <p className="mt-2 text-12 text-muted comfortable:text-13">{detail}</p>}
    </>
  );
  const frame = cn(compact ? statTileCompact : statTile, className);
  if (!onClick) return <div className={frame}>{body}</div>;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={cn(
        frame,
        'flex w-full flex-col text-left transition-colors hover:border-line-strong',
        focusRing,
        pressed && 'border-line-strong',
      )}
    >
      {body}
    </button>
  );
}
