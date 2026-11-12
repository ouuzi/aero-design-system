import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * AeroCompetence Hub mark: an aircraft (top view) inside a hexagon "hub".
 * Stroke-based like the lucide icons used across the app, so it takes `className`
 * for size and inherits `currentColor`. The favicon in `app/icon.svg` uses the same paths.
 */
export default function BrandMark({ className }) {
    return (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: className, "aria-hidden": "true", children: [_jsx("path", { d: "M12 2 20.66 7v10L12 22l-8.66-5V7z" }), _jsx("path", { d: "M12 6.5v10" }), _jsx("path", { d: "M6.5 13.5 12 10.5l5.5 3" }), _jsx("path", { d: "M9.75 16.5h4.5" })] }));
}
