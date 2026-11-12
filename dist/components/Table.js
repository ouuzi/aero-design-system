import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { card, tableHead, tablePinEndTd, tablePinEndTh, tableTd, tableTh } from './styles.js';
import { cn } from '../lib/utils.js';
const frameClass = {
    card: `${card} overflow-x-auto`,
    inset: 'rounded-lg border border-line overflow-x-auto',
};
export function Table({ frame = 'card', className, tableClassName, minWidth, loading, loadingLabel = 'Loading', children, }) {
    const body = (_jsxs(_Fragment, { children: [_jsx("span", { role: "status", className: "sr-only", children: loading ? loadingLabel : '' }), _jsx("table", { "aria-busy": loading || undefined, className: cn('w-full text-left text-13 text-ink comfortable:text-15', tableClassName), style: minWidth ? { minWidth } : undefined, children: children })] }));
    if (frame === 'none')
        return body;
    return _jsx("div", { className: cn(frameClass[frame], className), children: body });
}
export function THead({ children }) {
    return _jsx("thead", { className: tableHead, children: children });
}
const alignClass = { left: 'text-left', right: 'text-right', center: 'text-center' };
export function Th({ align = 'left', pin, className, children, ...rest }) {
    return (_jsx("th", { scope: "col", className: cn(tableTh, alignClass[align], pin === 'end' && tablePinEndTh, className), ...rest, children: children }));
}
export function Td({ align = 'left', pin, className, children, ...rest }) {
    return (_jsx("td", { className: cn(tableTd, alignClass[align], align === 'right' && 'tabular-nums', pin === 'end' && tablePinEndTd, className), ...rest, children: children }));
}
