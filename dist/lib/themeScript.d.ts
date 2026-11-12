/** The storage key prefix ThemeProvider uses when an app passes none. */
export declare const DEFAULT_THEME_STORAGE_KEY = "aero_theme_v1";
/** The key that holds the theme last applied in this browser, read before the first paint. */
export declare const lastThemeKey: (storageKey?: string) => string;
/**
 * A tiny dependency-free script for <head>: applies the last-used theme before the page paints,
 * so a user who chose dark does not see a light page first. Pass the same `storageKey` as to
 * ThemeProvider.
 *
 *   <script dangerouslySetInnerHTML={{ __html: getThemeInitScript('aerometric_theme_v1') }} />
 */
export declare function getThemeInitScript(storageKey?: string): string;
