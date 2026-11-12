const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function isValidDateParts(parts) {
    const candidate = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
    return (candidate.getUTCFullYear() === parts.year &&
        candidate.getUTCMonth() === parts.month - 1 &&
        candidate.getUTCDate() === parts.day);
}
function parseDateParts(value) {
    if (value instanceof Date) {
        if (Number.isNaN(value.getTime()))
            return null;
        return { year: value.getFullYear(), month: value.getMonth() + 1, day: value.getDate() };
    }
    const trimmed = value.trim();
    if (!trimmed)
        return null;
    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/);
    if (isoMatch) {
        const parts = { year: Number(isoMatch[1]), month: Number(isoMatch[2]), day: Number(isoMatch[3]) };
        return isValidDateParts(parts) ? parts : null;
    }
    const namedMonthMatch = trimmed.match(/^(\d{1,2})[-\s]([A-Za-z]{3,9})[-\s,]+(\d{4})$/);
    if (namedMonthMatch) {
        const monthToken = namedMonthMatch[2].slice(0, 3).toLowerCase();
        const month = MONTHS.findIndex((name) => name.toLowerCase() === monthToken) + 1;
        const parts = { year: Number(namedMonthMatch[3]), month, day: Number(namedMonthMatch[1]) };
        return month > 0 && isValidDateParts(parts) ? parts : null;
    }
    const numericMatch = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (numericMatch) {
        const parts = { year: Number(numericMatch[3]), month: Number(numericMatch[2]), day: Number(numericMatch[1]) };
        return isValidDateParts(parts) ? parts : null;
    }
    return null;
}
export function toIsoDate(value) {
    if (!value)
        return '';
    const parts = parseDateParts(value);
    if (!parts)
        return '';
    return `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`;
}
export function formatDate(value, emptyValue = '—') {
    if (!value)
        return emptyValue;
    const parts = parseDateParts(value);
    if (!parts)
        return typeof value === 'string' ? value : emptyValue;
    return `${String(parts.day).padStart(2, '0')}-${MONTHS[parts.month - 1]}-${parts.year}`;
}
