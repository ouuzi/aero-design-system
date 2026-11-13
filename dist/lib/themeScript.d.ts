/** The storage key prefix ThemeProvider uses when an app passes none. */
export declare const DEFAULT_THEME_STORAGE_KEY = "aero_theme_v1";
/** The key that holds the theme last applied in this browser, read before the first paint. */
export declare const lastThemeKey: (storageKey?: string) => string;
/** The theme a person sees before they have chosen one. */
export type DefaultTheme = 'light' | 'dark';
export interface ThemeInitOptions {
    /**
     * The theme for someone who has not chosen one in this browser: `light` (the default) or
     * `dark` for an app that starts dark. Pass the same value to ThemeProvider's `defaultTheme`.
     */
    defaultTheme?: DefaultTheme;
}
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
export declare function getThemeInitScript(storageKey?: string, options?: ThemeInitOptions): string;
