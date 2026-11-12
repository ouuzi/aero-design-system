'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';
import { IconButton } from './Button.js';
import { Input } from './Field.js';
import { cn } from '../lib/utils.js';
export const SearchInput = React.forwardRef(function SearchInput({ value, onClear, clearLabel = 'Clear search', size = 'md', className, ...rest }, forwardedRef) {
    const inputRef = useRef(null);
    const setRef = (node) => {
        inputRef.current = node;
        if (typeof forwardedRef === 'function')
            forwardedRef(node);
        else if (forwardedRef)
            forwardedRef.current = node;
    };
    const canClear = Boolean(onClear) && value !== '';
    return (_jsxs("div", { className: cn('relative min-w-0', className), children: [_jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted", "aria-hidden": "true" }), _jsx(Input, { ref: setRef, type: "search", size: size, value: value, className: cn('pl-9 [&::-webkit-search-cancel-button]:appearance-none', canClear && 'pr-9'), ...rest }), canClear && (_jsx(IconButton, { icon: X, label: clearLabel, onClick: () => {
                    onClear?.();
                    inputRef.current?.focus();
                }, className: "absolute right-1.5 top-1/2 size-6 -translate-y-1/2 rounded-md comfortable:size-8" }))] }));
});
