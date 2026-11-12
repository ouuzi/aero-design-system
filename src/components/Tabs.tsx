import React, { useRef } from 'react';
import { badgeClass, segmentedGroup, segmentedItem, tabItem, tabList } from './styles.js';
import { cn } from '../lib/utils.js';

/*
 * Two ways to switch views, never mixed for the same job:
 * - Tabs: sections of ONE record or page (profile tabs, assessment steps). Underline, ink when active.
 * - SegmentedControl: two to four filters or modes of ONE list, never page navigation. Navy
 *   when active, whatever the option means: status colours never fill a filter.
 *
 * Keyboard (both, WAI-ARIA tabs pattern with automatic activation): the group is ONE tab stop.
 * Tab enters at the active option (or the first enabled one when `value` matches none) and Tab
 * again leaves the group. Left/Right move to the previous/next option and select it (onChange),
 * wrapping at the ends; Home/End jump to the first/last. Disabled options are skipped.
 * Tabs is a tablist of role="tab" buttons (aria-selected); give an option `id` and `controls`
 * to wire it to its panel (role="tabpanel" aria-labelledby={id}). SegmentedControl is a
 * role="group" of aria-pressed buttons with the same roving behaviour.
 */

export interface TabOption<T extends string> {
  value: T;
  label: React.ReactNode;
  /** Neutral count badge after the label. */
  count?: number;
  icon?: React.ElementType;
  /** Not selectable; skipped by the arrow keys, Home and End. */
  disabled?: boolean;
  /** Id of the button, e.g. for the panel's aria-labelledby. */
  id?: string;
  /** Id of the panel this option shows (aria-controls). */
  controls?: string;
}

/*
 * The tab and segmented recipes have no disabled state, so a disabled option is dimmed here and
 * its recipe hover is cancelled (cn merges the classes), so it never looks clickable.
 */
const disabledItem = 'opacity-40 cursor-not-allowed';
const disabledTabHover = 'hover:text-muted';
const disabledSegmentHover = 'hover:bg-transparent hover:text-ink-2 hover:shadow-none';

/** Roving tabindex + arrow/Home/End selection shared by Tabs and SegmentedControl. */
function useRovingOptions<T extends string>(options: TabOption<T>[], value: T, onChange: (value: T) => void) {
  const buttons = useRef(new Map<T, HTMLButtonElement>());

  const activeIndex = options.findIndex((option) => option.value === value && !option.disabled);
  const tabStop = activeIndex >= 0 ? options[activeIndex].value : options.find((option) => !option.disabled)?.value;

  const register = (optionValue: T) => (element: HTMLButtonElement | null) => {
    if (element) buttons.current.set(optionValue, element);
    else buttons.current.delete(optionValue);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, from: T) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const enabled = options.filter((option) => !option.disabled);
    if (enabled.length === 0) return;
    const current = enabled.findIndex((option) => option.value === from);
    let next: TabOption<T> | undefined;
    switch (event.key) {
      case 'ArrowRight':
        next = enabled[(current + 1) % enabled.length];
        break;
      case 'ArrowLeft':
        next = enabled[current <= 0 ? enabled.length - 1 : current - 1];
        break;
      case 'Home':
        next = enabled[0];
        break;
      case 'End':
        next = enabled[enabled.length - 1];
        break;
      default:
        return;
    }
    event.preventDefault();
    buttons.current.get(next.value)?.focus();
    if (next.value !== value) onChange(next.value);
  };

  return { tabStop, register, onKeyDown };
}

export function Tabs<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name of the tab list. */
  label: string;
  className?: string;
}) {
  const { tabStop, register, onKeyDown } = useRovingOptions(options, value, onChange);
  return (
    <div role="tablist" aria-label={label} className={cn(tabList, className)}>
      {options.map((option) => {
        const Icon = option.icon;
        const active = option.value === value;
        return (
          <button
            key={option.value}
            ref={register(option.value)}
            id={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={option.controls}
            tabIndex={option.value === tabStop ? 0 : -1}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => onKeyDown(event, option.value)}
            className={option.disabled ? cn(tabItem(active), disabledItem, !active && disabledTabHover) : tabItem(active)}
          >
            {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
            {option.label}
            {option.count !== undefined && <span className={badgeClass('neutral')}>{option.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  size = 'md',
  className,
}: {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  size?: 'md' | 'sm';
  className?: string;
}) {
  const { tabStop, register, onKeyDown } = useRovingOptions(options, value, onChange);
  return (
    <div role="group" aria-label={label} className={cn(segmentedGroup, className)}>
      {options.map((option) => {
        const Icon = option.icon;
        const active = option.value === value;
        return (
          <button
            key={option.value}
            ref={register(option.value)}
            id={option.id}
            type="button"
            aria-pressed={active}
            aria-controls={option.controls}
            tabIndex={option.value === tabStop ? 0 : -1}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => onKeyDown(event, option.value)}
            className={
              option.disabled ? cn(segmentedItem(active, size), disabledItem, !active && disabledSegmentHover) : segmentedItem(active, size)
            }
          >
            {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
            {option.label}
            {option.count !== undefined && <span className="tabular-nums opacity-80">{option.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
