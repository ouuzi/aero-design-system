import React from 'react';
export type Theme = 'light' | 'dark';
export interface ThemeProviderProps {
    children: React.ReactNode;
    /**
     * The signed-in user. Pass undefined while auth is still restoring the session (the user is
     * not known yet), so the last-used theme stays on screen.
     */
    userId?: string;
    /**
     * localStorage key prefix. Default `aero_theme_v1`. Pass the same value to
     * getThemeInitScript. AeroMetric-Control passes `aerometric_theme_v1` so people keep their
     * setting.
     */
    storageKey?: string;
    /**
     * The theme for someone who has not chosen one: `light` (default) or `dark` for an app that
     * starts dark. Pass the same value to getThemeInitScript's `defaultTheme`.
     */
    defaultTheme?: Theme;
}
export declare function ThemeProvider({ children, userId, storageKey, defaultTheme }: ThemeProviderProps): React.JSX.Element;
export declare const useTheme: () => {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};
