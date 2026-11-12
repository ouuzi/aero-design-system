'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from 'react';
/** The storage key prefix DensityProvider uses when an app passes none. */
export const DEFAULT_DENSITY_STORAGE_KEY = 'aero_density_v1';
const CHANGE_EVENT = 'aero-density-change';
const keyFor = (storageKey, uid) => `${storageKey}_${uid ?? 'anonymous'}`;
function readDensity(key) {
    try {
        const stored = window.localStorage.getItem(key);
        if (stored === 'default' || stored === 'comfortable')
            return stored;
    }
    catch {
        // Storage blocked (private mode, policy): fall through to the device default.
    }
    return window.matchMedia?.('(pointer: coarse)').matches ? 'comfortable' : 'default';
}
function subscribe(onChange) {
    window.addEventListener('storage', onChange); // other tabs
    window.addEventListener(CHANGE_EVENT, onChange); // this tab
    return () => {
        window.removeEventListener('storage', onChange);
        window.removeEventListener(CHANGE_EVENT, onChange);
    };
}
const DensityContext = createContext({
    density: 'default',
    setDensity: () => { },
});
export function DensityProvider({ children, userId, storageKey = DEFAULT_DENSITY_STORAGE_KEY }) {
    const key = keyFor(storageKey, userId);
    const density = useSyncExternalStore(subscribe, () => readDensity(key), () => 'default');
    useEffect(() => {
        const root = document.documentElement;
        if (density === 'comfortable')
            root.dataset.density = 'comfortable';
        else
            delete root.dataset.density;
    }, [density]);
    const setDensity = useCallback((next) => {
        try {
            window.localStorage.setItem(key, next);
        }
        catch {
            // Not remembered when storage is blocked.
        }
        window.dispatchEvent(new Event(CHANGE_EVENT));
    }, [key]);
    return _jsx(DensityContext.Provider, { value: { density, setDensity }, children: children });
}
export const useDensity = () => useContext(DensityContext);
