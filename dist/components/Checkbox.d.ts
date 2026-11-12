import React from 'react';
import { type ChoiceOrientation, type ChoiceSize, type ChoiceVariant } from './styles.js';
export type { ChoiceOrientation, ChoiceSize, ChoiceVariant };
/** Defaults a CheckboxGroup or RadioGroup hands to the options inside it. */
export interface ChoiceGroupDefaults {
    size?: ChoiceSize;
    variant?: ChoiceVariant;
    disabled?: boolean;
    invalid?: boolean;
    required?: boolean;
}
export declare const ChoiceGroupContext: React.Context<ChoiceGroupDefaults | null>;
interface ChoiceTextProps {
    label: React.ReactNode;
    labelId: string;
    note?: React.ReactNode;
    noteId: string;
    noteIsError: boolean;
    size: ChoiceSize;
    variant: ChoiceVariant;
    disabled: boolean;
    required?: boolean;
    /** Text colours for the dark viewer (Checkbox `dark`). */
    dark?: boolean;
}
/** The label line and the description or error under it. Ids are wired by the caller. */
export declare function ChoiceText({ label, labelId, note, noteId, noteIsError, size, variant, disabled, required, dark }: ChoiceTextProps): React.JSX.Element;
type NativeCheckbox = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'children'>;
interface CheckboxOwnProps {
    /**
     * The visible text, beside the box. Clicking it toggles the box, and it is the accessible
     * name. Keep links and buttons out of it (they would toggle the box too).
     */
    label?: React.ReactNode;
    /** One line under the label: what ticking it means. Read after the name (aria-describedby). */
    description?: React.ReactNode;
    /** Replaces the description in danger text and marks the box invalid. */
    error?: React.ReactNode;
    /** Some, not all (a "select all" box over a partly selected list): a dash, announced as mixed. */
    indeterminate?: boolean;
    /** Danger edge without a message (the message is shown elsewhere, e.g. by the group). */
    invalid?: boolean;
    /** Label text: `md` 13px (default), `sm` 12px for a field's aside ("Does not expire"). */
    size?: ChoiceSize;
    /** `plain` (default) or `card`, a bordered tile that fills while checked. */
    variant?: ChoiceVariant;
    /**
     * For the dark PDF viewer only (bg-viewer): accent-soft fill and focus, a viewer-dark glyph,
     * viewer-text label. Plain variant only.
     */
    dark?: boolean;
    /** Convenience: called with the new checked value, after `onChange`. */
    onCheckedChange?: (checked: boolean) => void;
    /** Classes for the outer <label> (layout only: margins, grid placement, width). */
    className?: string;
}
/** A checkbox must have a name: visible `label`, or `aria-label` / `aria-labelledby` when it has no text. */
type CheckboxName = {
    label: React.ReactNode;
} | {
    label?: undefined;
    'aria-label': string;
} | {
    label?: undefined;
    'aria-labelledby': string;
};
export type CheckboxProps = NativeCheckbox & CheckboxOwnProps & CheckboxName;
export declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;
export interface ChoiceGroupFrameProps {
    /** The question the options answer ("Relevant departments"). Rendered as the <legend>. */
    legend?: React.ReactNode;
    /** Keep the legend for screen readers but do not show it (a heading above already says it). */
    legendHidden?: boolean;
    /** One line under the options. */
    hint?: React.ReactNode;
    /** Replaces the hint in danger text and marks every option invalid. */
    error?: React.ReactNode;
    /** Shows the required asterisk on the legend. */
    required?: boolean;
    /** Disables every option (a disabled <fieldset>). */
    disabled?: boolean;
    /** `vertical` (default) stacks the options; `horizontal` wraps them in a row. */
    orientation?: ChoiceOrientation;
    /** Classes for the <fieldset> (layout only). */
    className?: string;
    /**
     * Replaces the list layout, e.g. a grid of cards:
     * `listClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"`.
     */
    listClassName?: string;
    /** Name for a group without a legend. */
    'aria-label'?: string;
    children: React.ReactNode;
}
interface ChoiceGroupFrameInternalProps extends ChoiceGroupFrameProps {
    role?: 'group' | 'radiogroup';
    variant: ChoiceVariant;
    /** aria-invalid / aria-required are valid on a radiogroup, not on a plain group. */
    ariaState?: {
        invalid?: boolean;
        required?: boolean;
    };
}
/** The <fieldset> + <legend> + list + hint shared by CheckboxGroup and RadioGroup. */
export declare function ChoiceGroupFrame({ legend, legendHidden, hint, error, required, disabled, orientation, className, listClassName, 'aria-label': ariaLabel, role, variant, ariaState, children, }: ChoiceGroupFrameInternalProps): React.JSX.Element;
export interface CheckboxGroupProps extends ChoiceGroupFrameProps {
    /** Label size for every checkbox inside (each may still override). */
    size?: ChoiceSize;
    /** `plain` (default) or `card` for every checkbox inside. */
    variant?: ChoiceVariant;
}
/**
 * A set of independent checkboxes that answer one question ("Relevant departments"):
 * a <fieldset> whose <legend> names the set, with the hint or error under it. Each
 * Checkbox inside keeps its own `checked` / `onChange`; the group only lays them out and
 * hands down size, variant, disabled and invalid.
 */
export declare function CheckboxGroup({ size, variant, disabled, error, required, children, ...frame }: CheckboxGroupProps): React.JSX.Element;
