import React from 'react';
import { type LucideIcon } from 'lucide-react';
export interface RowMenuItem {
    label: string;
    onSelect: () => void;
    icon?: LucideIcon;
    /** Destructive actions: shown last, in red, after a rule. */
    tone?: 'danger';
    disabled?: boolean;
    id?: string;
}
export interface RowMenuProps {
    /** Falsy entries are skipped, so items can be listed conditionally inline. */
    items: Array<RowMenuItem | false | null | undefined | ''>;
    /** Accessible name of the ⋯ button (and of the menu), e.g. "Actions for SMS & HF". */
    label?: string;
    /** Optional caption at the top of the menu (the record's name or code). */
    heading?: string;
    id?: string;
    /** Tone of the trigger: the default quiet icon button, or an outlined one beside other buttons. */
    variant?: 'ghost' | 'outline';
    /**
     * A labelled trigger instead of the ⋯ icon button: one kit Button,
     * `trigger={<Button icon={Download}>Export</Button>}`. RowMenu adds aria-haspopup,
     * aria-expanded, the click and Down-arrow handlers, `id` and its ref; `label` names the menu.
     */
    trigger?: React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>;
}
export default function RowMenu({ items, label, heading, id, variant, trigger }: RowMenuProps): React.JSX.Element | null;
