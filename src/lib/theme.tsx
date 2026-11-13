'use client';

import React, { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from 'react';
import { DEFAULT_THEME_STORAGE_KEY, lastThemeKey } from './themeScript.js';

/*
 * Colour theme. "light" is the default (an app that starts dark passes defaultTheme="dark");
 * the other theme is chosen by each user (a switch in the app's
 * settings) and never follows the operating system. It is set as data-theme="dark" on <html>,
 * which the dark block in theme.css reads (the same tokens, other values; print stays light).
 * The choice is remembered per user in this browser, like display density.
 *
 * Keys (localStorage): `${storageKey}_${userId}` per user, and `${storageKey}_last` for the
 * theme last applied in this browser.
 *
 * No flash on load: the per-user choice is only known once the user is, so the last theme
 * used in this browser is kept under the `_last` key, and getThemeInitScript(storageKey), an
 * inline script in <head>, sets data-theme from it before the first paint. Until the user is
 * known (`userId` undefined: auth loading, the sign-in screen, after signing out) the app
 * shows that last-used theme; once they are, their own choice applies (and becomes the
 * last-used one).
 */

export type Theme = 'light' | 'dark';

const CHANGE_EVENT = 'aero-theme-change';

function read(key: string): Theme | undefined {
  try {
    const stored = window.localStorage.getItem(key);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // Storage blocked (private mode, policy): the default theme.
  }
  return undefined;
}

function readTheme(storageKey: string, uid: string | undefined, fallback: Theme): Theme {
  if (!uid) return read(lastThemeKey(storageKey)) ?? fallback;
  return read(`${storageKey}_${uid}`) ?? fallback;
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange); // other tabs
  window.addEventListener(CHANGE_EVENT, onChange); // this tab
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

const ThemeContext = createContext<{ theme: Theme; setTheme: (theme: Theme) => void }>({
  theme: 'light',
  setTheme: () => {},
});

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

export function ThemeProvider({ children, userId, storageKey = DEFAULT_THEME_STORAGE_KEY, defaultTheme = 'light' }: ThemeProviderProps) {
  const uid = userId;
  const theme = useSyncExternalStore<Theme>(subscribe, () => readTheme(storageKey, uid, defaultTheme), () => defaultTheme);

  useEffect(() => {
    // Read the stored value, not `theme`: the hydration render holds the server snapshot
    // (the default), and applying that would undo the inline script for a frame (a flash).
    const current = readTheme(storageKey, uid, defaultTheme);
    const root = document.documentElement;
    if (current === 'dark') root.dataset.theme = 'dark';
    else delete root.dataset.theme;
    if (!uid) return;
    try {
      window.localStorage.setItem(lastThemeKey(storageKey), current);
    } catch {
      // Not remembered when storage is blocked.
    }
  }, [theme, uid, storageKey, defaultTheme]);

  const setTheme = useCallback(
    (next: Theme) => {
      try {
        if (uid) window.localStorage.setItem(`${storageKey}_${uid}`, next);
        window.localStorage.setItem(lastThemeKey(storageKey), next);
      } catch {
        // Not remembered when storage is blocked.
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [uid, storageKey],
  );

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
