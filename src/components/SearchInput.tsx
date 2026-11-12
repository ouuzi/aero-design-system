'use client';

import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';
import { IconButton } from './Button.js';
import { Input, type InputProps } from './Field.js';
import { cn } from '../lib/utils.js';

/*
 * SearchInput: the search field of a toolbar or a picker. The kit Input (same frame, focus
 * and sizes; `md` 36px by default, beside toolbar buttons and filters) with the 16px search
 * icon inside on the left and, while it holds text, a clear button inside on the right.
 *
 * - `onClear` turns the clear button on: a 24px ghost IconButton named `clearLabel`
 *   ("Clear search"). After clearing, focus goes back to the field, so it never drops to the
 *   page when the button disappears.
 * - It is an `<input type="search">` (a searchbox to screen readers); the browser's own
 *   clear button is hidden so there is only one.
 * - Give it a name: `aria-label`, or wrap it in `<Field label>`, which wires it as any Input.
 * - `className` sets the wrapper's layout (`w-64`, `flex-1`); every other prop goes to the input.
 */

export interface SearchInputProps extends Omit<InputProps, 'type' | 'value'> {
  value: string;
  /** Shows the clear button while the field has a value; set the value to '' here. */
  onClear?: () => void;
  /** The clear button's accessible name and tooltip. Default "Clear search". */
  clearLabel?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { value, onClear, clearLabel = 'Clear search', size = 'md', className, ...rest },
  forwardedRef,
) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };
  const canClear = Boolean(onClear) && value !== '';
  return (
    <div className={cn('relative min-w-0', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      <Input
        ref={setRef}
        type="search"
        size={size}
        value={value}
        className={cn('pl-9 [&::-webkit-search-cancel-button]:appearance-none', canClear && 'pr-9')}
        {...rest}
      />
      {canClear && (
        <IconButton
          icon={X}
          label={clearLabel}
          onClick={() => {
            onClear?.();
            inputRef.current?.focus();
          }}
          className="absolute right-1.5 top-1/2 size-6 -translate-y-1/2 rounded-md comfortable:size-8"
        />
      )}
    </div>
  );
});
