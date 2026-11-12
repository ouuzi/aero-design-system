import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowLeft } from 'lucide-react';
import { linkButton, metaLine, pageTitle } from './styles.js';
import { cn } from '../lib/utils.js';
export function PageHeader({ title, description, actions, back, meta, as: Heading = 'h2', className }) {
    return (_jsxs("header", { className: cn('space-y-2', className), children: [back && (_jsxs("button", { type: "button", onClick: back.onClick, className: linkButton('md', 'muted'), children: [_jsx(ArrowLeft, { className: "h-3.5 w-3.5", "aria-hidden": "true" }), back.label] })), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-x-6 gap-y-3", children: [_jsxs("div", { className: "min-w-0 flex-[1_1_20rem]", children: [_jsx(Heading, { className: pageTitle, children: title }), description && _jsx("p", { className: "mt-1 text-13 text-muted comfortable:text-15", children: description }), meta && _jsx("div", { className: cn(metaLine, 'mt-1.5'), children: meta })] }), actions && _jsx("div", { className: "flex max-w-full flex-wrap items-center gap-2", children: actions })] })] }));
}
