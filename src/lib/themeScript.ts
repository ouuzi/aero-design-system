/*
 * The no-flash snippet for the theme switch. No 'use client' here on purpose: a server
 * component (Next's root layout) calls it to write an inline <script> in <head>.
 */

/** The storage key prefix ThemeProvider uses when an app passes none. */
export const DEFAULT_THEME_STORAGE_KEY = 'aero_theme_v1';

/** The key that holds the theme last applied in this browser, read before the first paint. */
export const lastThemeKey = (storageKey: string = DEFAULT_THEME_STORAGE_KEY) => `${storageKey}_last`;

/**
 * A tiny dependency-free script for <head>: applies the last-used theme before the page paints,
 * so a user who chose dark does not see a light page first. Pass the same `storageKey` as to
 * ThemeProvider.
 *
 *   <script dangerouslySetInnerHTML={{ __html: getThemeInitScript('aerometric_theme_v1') }} />
 */
export function getThemeInitScript(storageKey: string = DEFAULT_THEME_STORAGE_KEY): string {
  return `try{if(localStorage.getItem(${JSON.stringify(lastThemeKey(storageKey))})==='dark')document.documentElement.dataset.theme='dark'}catch(e){}`;
}
