import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { badgeClass, labelDot } from './styles.js';
import { cn } from '../lib/utils.js';
export default function Badge({ tone = 'neutral', dot = false, className = '', children }) {
    return (_jsxs("span", { className: cn(badgeClass(tone), className), children: [dot && _jsx("span", { className: labelDot, "aria-hidden": "true" }), children] }));
}
