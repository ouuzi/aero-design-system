'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from 'react';
import { DEFAULT_THEME_STORAGE_KEY, lastThemeKey } from './themeScript.js';
const CHANGE_EVENT = 'aero-theme-change';
function read(key) {
    try {
        const stored = window.localStorage.getItem(key);
        if (stored === 'light' || stored === 'dark')
            return stored;
    }
    catch {
        // Storage blocked (private mode, policy): the default theme.
    }
    return undefined;
}
function readTheme(storageKey, uid, fallback) {
    if (!uid)
        return read(lastThemeKey(storageKey)) ?? fallback;
    return read(`${storageKey}_${uid}`) ?? fallback;
}
function subscribe(onChange) {
    window.addEventListener('storage', onChange); // other tabs
    window.addEventListener(CHANGE_EVENT, onChange); // this tab
    return () => {
        window.removeEventListener('storage', onChange);
        window.removeEventListener(CHANGE_EVENT, onChange);
    };
}
const ThemeContext = createContext({
    theme: 'light',
    setTheme: () => { },
});
export function ThemeProvider({ children, userId, storageKey = DEFAULT_THEME_STORAGE_KEY, defaultTheme = 'light' }) {
    const uid = userId;
    const theme = useSyncExternalStore(subscribe, () => readTheme(storageKey, uid, defaultTheme), () => defaultTheme);
    useEffect(() => {
        // Read the stored value, not `theme`: the hydration render holds the server snapshot
        // (the default), and applying that would undo the inline script for a frame (a flash).
        const current = readTheme(storageKey, uid, defaultTheme);
        const root = document.documentElement;
        if (current === 'dark')
            root.dataset.theme = 'dark';
        else
            delete root.dataset.theme;
        if (!uid)
            return;
        try {
            window.localStorage.setItem(lastThemeKey(storageKey), current);
        }
        catch {
            // Not remembered when storage is blocked.
        }
    }, [theme, uid, storageKey, defaultTheme]);
    const setTheme = useCallback((next) => {
        try {
            if (uid)
                window.localStorage.setItem(`${storageKey}_${uid}`, next);
            window.localStorage.setItem(lastThemeKey(storageKey), next);
        }
        catch {
            // Not remembered when storage is blocked.
        }
        window.dispatchEvent(new Event(CHANGE_EVENT));
    }, [uid, storageKey]);
    return _jsx(ThemeContext.Provider, { value: { theme, setTheme }, children: children });
}
export const useTheme = () => useContext(ThemeContext);
