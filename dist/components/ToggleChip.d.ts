import React from 'react';
export interface ToggleChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onChange'> {
    selected: boolean;
    onChange: (selected: boolean) => void;
    children: React.ReactNode;
}
export declare function ToggleChip({ selected, onChange, className, disabled, children, ...rest }: ToggleChipProps): React.JSX.Element;
