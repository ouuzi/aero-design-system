import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { card, focusRing, sectionTitle } from './styles.js';
import { cn } from '../lib/utils.js';
/*
 * Card: surface, line border, radius-xl, shadow-xs. Give it a title to get the standard
 * header (section title, one muted line, actions on the right, a rule underneath).
 * `padding` is for the body: `md` (20px) for content, `sm` (16px) for toolbars and filter
 * bars, `none` when a table or list runs edge to edge.
 *
 * Without a header the card is one box: the padding sits on the card itself and the
 * children are its direct children, so `className` can lay them out (`flex`, `grid`,
 * `space-y-4`). With a header the children sit in a padded body under the rule. `as="div"`
 * for a panel that is not a section of the page, `as="form"` for a form that is the card. Other props pass to the element.
 *
 * Interactive: `onClick` makes the whole card one <button> (a department card that filters
 * the page), left-aligned, with a line-strong edge on hover and the shared focusRing.
 * `pressed` is its selected state: aria-pressed, an accent edge 2px wide (the border plus a
 * 1px accent ring outside it, full strength). A button cannot hold other controls, so an
 * interactive card takes no `actions` and no `as`; its title, if any, is plain text.
 */
const paddingClass = { none: '', sm: 'p-4', md: 'p-5' };
const headerRow = 'flex flex-wrap items-center justify-between gap-3 border-b border-line p-4';
function ButtonCard({ title, description, padding = 'md', pressed, className, children, type = 'button', ...rest }) {
    const hasHeader = Boolean(title);
    return (_jsx("button", { type: type, "aria-pressed": pressed, className: cn(card, 'flex w-full flex-col items-stretch text-left cursor-pointer transition-colors hover:border-line-strong disabled:cursor-not-allowed disabled:opacity-40 aria-pressed:border-accent aria-pressed:ring-1 aria-pressed:ring-accent aria-pressed:hover:border-accent', focusRing, hasHeader ? 'overflow-hidden' : paddingClass[padding], className), ...rest, children: hasHeader ? (_jsxs(_Fragment, { children: [_jsxs("span", { className: cn(headerRow, 'block'), children: [_jsx("span", { className: cn(sectionTitle, 'block'), children: title }), description && _jsx("span", { className: "mt-0.5 block text-12 text-muted comfortable:text-13", children: description })] }), children !== undefined && _jsx("span", { className: cn('block', paddingClass[padding]), children: children })] })) : (children) }));
}
export function Card(props) {
    if (props.onClick)
        return _jsx(ButtonCard, { ...props });
    const { title, description, actions, padding = 'md', as = 'section', className, children, ...rest } = props;
    // One element type for the three tags: only `onSubmit` differs, and it is typed above.
    const Tag = as;
    const hasHeader = Boolean(title || actions);
    if (!hasHeader) {
        // Edge-to-edge content (a table, a list) is clipped to the rounded corners.
        return (_jsx(Tag, { className: cn(card, padding === 'none' ? 'overflow-hidden' : paddingClass[padding], className), ...rest, children: children }));
    }
    return (_jsxs(Tag, { className: cn(card, 'overflow-hidden', className), ...rest, children: [_jsxs("div", { className: headerRow, children: [_jsxs("div", { className: "min-w-0", children: [title && _jsx("h3", { className: sectionTitle, children: title }), description && _jsx("p", { className: "mt-0.5 text-12 text-muted comfortable:text-13", children: description })] }), actions && _jsx("div", { className: "flex flex-wrap items-center gap-2", children: actions })] }), children !== undefined && _jsx("div", { className: paddingClass[padding], children: children })] }));
}
