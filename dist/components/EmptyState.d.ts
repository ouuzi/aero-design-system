import React from 'react';
export default function EmptyState({ title, children, icon: Icon, action, size, className, }: {
    title: React.ReactNode;
    children?: React.ReactNode;
    icon?: React.ElementType;
    action?: React.ReactNode;
    size?: 'md' | 'sm';
    className?: string;
}): React.JSX.Element;
