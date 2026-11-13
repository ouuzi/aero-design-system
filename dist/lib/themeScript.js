/*
 * The no-flash snippet for the theme switch. No 'use client' here on purpose: a server
 * component (Next's root layout) calls it to write an inline <script> in <head>.
 */
/** The storage key prefix ThemeProvider uses when an app passes none. */
export const DEFAULT_THEME_STORAGE_KEY = 'aero_theme_v1';
/** The key that holds the theme last applied in this browser, read before the first paint. */
export const lastThemeKey = (storageKey = DEFAULT_THEME_STORAGE_KEY) => `${storageKey}_last`;
/**
 * A tiny dependency-free script for <head>: applies the last-used theme before the page paints,
 * so a user who chose dark does not see a light page first. Pass the same `storageKey` (and
 * `defaultTheme`) as to ThemeProvider.
 *
 *   <script dangerouslySetInnerHTML={{ __html: getThemeInitScript('aerometric_theme_v1') }} />
 *   <script dangerouslySetInnerHTML={{ __html: getThemeInitScript('hangarvisit_theme_v1', { defaultTheme: 'dark' }) }} />
 *
 * With `defaultTheme: 'dark'` the page is dark unless 'light' was stored, and dark when storage
 * is blocked.
 */
export function getThemeInitScript(storageKey = DEFAULT_THEME_STORAGE_KEY, options = {}) {
    const key = JSON.stringify(lastThemeKey(storageKey));
    if (options.defaultTheme === 'dark') {
        return `try{if(localStorage.getItem(${key})!=='light')document.documentElement.dataset.theme='dark'}catch(e){document.documentElement.dataset.theme='dark'}`;
    }
    return `try{if(localStorage.getItem(${key})==='dark')document.documentElement.dataset.theme='dark'}catch(e){}`;
}
