import React from 'react';
declare const paddingClass: {
    readonly none: "";
    readonly sm: "p-4";
    readonly md: "p-5";
};
interface CardCommon {
    title?: React.ReactNode;
    description?: React.ReactNode;
    padding?: keyof typeof paddingClass;
    className?: string;
    children?: React.ReactNode;
}
export interface StaticCardProps extends CardCommon, Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'onSubmit' | 'onClick'> {
    /** With `as="form"`. */
    onSubmit?: React.FormEventHandler<HTMLFormElement>;
    actions?: React.ReactNode;
    as?: 'section' | 'div' | 'form';
    onClick?: never;
    pressed?: never;
}
export interface ButtonCardProps extends CardCommon, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title' | 'children'> {
    /** Makes the whole card a button. */
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    /** Selected (aria-pressed): the accent edge. Leave undefined for a card that is not a toggle. */
    pressed?: boolean;
    actions?: never;
    as?: never;
}
export type CardProps = StaticCardProps | ButtonCardProps;
export declare function Card(props: CardProps): React.JSX.Element;
export {};
