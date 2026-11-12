import React from 'react';

/**
 * AeroCompetence Hub mark: an aircraft (top view) inside a hexagon "hub".
 * Stroke-based like the lucide icons used across the app, so it takes `className`
 * for size and inherits `currentColor`. The favicon in `app/icon.svg` uses the same paths.
 */
export default function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2 20.66 7v10L12 22l-8.66-5V7z" />
      <path d="M12 6.5v10" />
      <path d="M6.5 13.5 12 10.5l5.5 3" />
      <path d="M9.75 16.5h4.5" />
    </svg>
  );
}
