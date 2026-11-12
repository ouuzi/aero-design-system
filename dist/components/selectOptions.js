import React from 'react';
const collapse = (text) => text.replace(/[\t\n\f\r ]+/g, ' ').trim();
/** The text a node renders: strings and numbers joined, elements read through their children. */
export function textOf(node) {
    if (node === null || node === undefined || typeof node === 'boolean')
        return '';
    if (typeof node === 'string' || typeof node === 'number' || typeof node === 'bigint')
        return String(node);
    if (Array.isArray(node))
        return node.map(textOf).join('');
    if (React.isValidElement(node))
        return textOf(node.props.children);
    return '';
}
/** Arrays and fragments flattened; empty children dropped. */
function flatten(children, out = []) {
    React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child))
            return;
        if (child.type === React.Fragment)
            flatten(child.props.children, out);
        else
            out.push(child);
    });
    return out;
}
export function parseSelectOptions(children) {
    const options = [];
    const groups = [];
    const addOption = (el, group, groupDisabled) => {
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
            addOption(child, -1, false);
        }
        else if (child.type === 'optgroup') {
            const { label, disabled, children: groupChildren } = child.props;
            const group = groups.length;
            groups.push({ label: collapse(String(label ?? '')), disabled: Boolean(disabled) });
            for (const inner of flatten(groupChildren)) {
                if (inner.type === 'option')
                    addOption(inner, group, Boolean(disabled));
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
export function selectedOptionIndex(options, value) {
    if (value !== undefined) {
        const match = options.findIndex((o) => o.value === value);
        if (match >= 0)
            return match;
    }
    return options.findIndex((o) => !o.disabled);
}
