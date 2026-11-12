import React from 'react';

/*
 * Reads the <option> and <optgroup> children of a kit Select into plain data, so the styled
 * list can draw them while the same children still go into the hidden native <select>.
 *
 * Follows what the browser does with the same markup:
 * - an option's value is its `value` prop, else its text (whitespace collapsed);
 * - its text is its `label` prop, else its children's text (strings, numbers, arrays,
 *   nested elements; whitespace collapsed);
 * - a disabled <optgroup> disables its options; a `hidden` option can still be the value
 *   but is not drawn in the list or reached with the keyboard;
 * - fragments and arrays are walked, and false / null / undefined children (`{x && <option>}`)
 *   are skipped.
 * Anything else (a stray <div>) is ignored, as the browser ignores it inside a <select>.
 */

export interface SelectOptionItem {
  /** Position among the options (the index the listbox moves through). */
  index: number;
  value: string;
  /** The text shown in the trigger and the list. */
  label: string;
  disabled: boolean;
  /** Not drawn in the list (the `hidden` attribute). */
  hidden: boolean;
  /** Index of its group in `groups`, or -1 when it is not in an <optgroup>. */
  group: number;
}

export interface SelectGroupItem {
  label: string;
  disabled: boolean;
}

export interface ParsedSelectOptions {
  options: SelectOptionItem[];
  groups: SelectGroupItem[];
}

const collapse = (text: string) => text.replace(/[\t\n\f\r ]+/g, ' ').trim();

/** The text a node renders: strings and numbers joined, elements read through their children. */
export function textOf(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'bigint') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return textOf(node.props.children);
  return '';
}

/** Arrays and fragments flattened; empty children dropped. */
function flatten(children: React.ReactNode, out: React.ReactElement[] = []): React.ReactElement[] {
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) return;
    if (child.type === React.Fragment) flatten(child.props.children, out);
    else out.push(child);
  });
  return out;
}

interface OptionProps {
  value?: string | number | readonly string[];
  label?: string;
  disabled?: boolean;
  hidden?: boolean;
  children?: React.ReactNode;
}

export function parseSelectOptions(children: React.ReactNode): ParsedSelectOptions {
  const options: SelectOptionItem[] = [];
  const groups: SelectGroupItem[] = [];

  const addOption = (el: React.ReactElement<OptionProps>, group: number, groupDisabled: boolean) => {
    const { value, label, disabled, hidden, children: content } = el.props;
    const text = collapse(textOf(content));
    options.push({
      index: options.length,
      value: value === undefined ? text : String(value),
      label: label !== undefined ? collapse(String(label)) : text,
      disabled: Boolean(disabled) || groupDisabled,
      hidden: Boolean(hidden),
      group,
    });
  };

  for (const child of flatten(children)) {
    if (child.type === 'option') {
      addOption(child as React.ReactElement<OptionProps>, -1, false);
    } else if (child.type === 'optgroup') {
      const { label, disabled, children: groupChildren } = child.props as { label?: string; disabled?: boolean; children?: React.ReactNode };
      const group = groups.length;
      groups.push({ label: collapse(String(label ?? '')), disabled: Boolean(disabled) });
      for (const inner of flatten(groupChildren)) {
        if (inner.type === 'option') addOption(inner as React.ReactElement<OptionProps>, group, Boolean(disabled));
      }
    }
  }
  return { options, groups };
}

/**
 * The option a single select shows for `value`, as React and the browser pick it: the first
 * option with that value; when none has it (or no value is given), the first option that is
 * not disabled. -1 when there is nothing to show.
 */
export function selectedOptionIndex(options: readonly SelectOptionItem[], value: string | undefined): number {
  if (value !== undefined) {
    const match = options.findIndex((o) => o.value === value);
    if (match >= 0) return match;
  }
  return options.findIndex((o) => !o.disabled);
}
