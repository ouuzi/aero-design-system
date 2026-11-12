import React from 'react';
export interface PageHeaderProps {
    title: React.ReactNode;
    /** One muted line under the title. */
    description?: React.ReactNode;
    /** The page's buttons, primary last. */
    actions?: React.ReactNode;
    /** A quiet link above the title back to where the page was opened from. */
    back?: {
        label: React.ReactNode;
        onClick: () => void;
    };
    /** A meta line under the description (record code, owner, last updated); items separated by "·". */
    meta?: React.ReactNode;
    /** Heading level of the title. Default `h2`. */
    as?: 'h1' | 'h2';
    /** Layout only (margins). */
    className?: string;
}
export declare function PageHeader({ title, description, actions, back, meta, as: Heading, className }: PageHeaderProps): React.JSX.Element;
