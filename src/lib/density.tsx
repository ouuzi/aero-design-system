'use client';

import React, { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from 'react';

/*
 * Display density. "default" is the dense desktop layout; "comfortable" is for tablets on
 * the hangar floor and anyone working standing or gloved: bigger controls (36 to 48px),
 * 15px body text and roomier table cells. It is set as data-density on <html>, which the
 * `comfortable:` variant in theme.css reads. The choice is remembered per user in this
 * browser (localStorage `${storageKey}_${userId ?? 'anonymous'}`); without one, touch screens
 * start comfortable.
 */

export type Density = 'default' | 'comfortable';

/** The storage key prefix DensityProvider uses when an app passes none. */
export const DEFAULT_DENSITY_STORAGE_KEY = 'aero_density_v1';

const CHANGE_EVENT = 'aero-density-change';
const keyFor = (storageKey: string, uid: string | undefined) => `${storageKey}_${uid ?? 'anonymous'}`;

function readDensity(key: string): Density {
  try {
    const stored = window.localStorage.getItem(key);
    if (stored === 'default' || stored === 'comfortable') return stored;
  } catch {
    // Storage blocked (private mode, policy): fall through to the device default.
  }
  return window.matchMedia?.('(pointer: coarse)').matches ? 'comfortable' : 'default';
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange); // other tabs
  window.addEventListener(CHANGE_EVENT, onChange); // this tab
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

const DensityContext = createContext<{ density: Density; setDensity: (density: Density) => void }>({
  density: 'default',
  setDensity: () => {},
});

export interface DensityProviderProps {
  children: React.ReactNode;
  /** The signed-in user, so each person keeps their own choice. Undefined: one shared "anonymous" choice. */
  userId?: string;
  /**
   * localStorage key prefix; the key is `${storageKey}_${userId ?? 'anonymous'}`. Default
   * `aero_density_v1`. An app that already stored choices passes its old prefix so people
   * keep their setting (AeroMetric-Control: `aerometric_density_v1`).
   */
  storageKey?: string;
}

export function DensityProvider({ children, userId, storageKey = DEFAULT_DENSITY_STORAGE_KEY }: DensityProviderProps) {
  const key = keyFor(storageKey, userId);
  const density = useSyncExternalStore<Density>(subscribe, () => readDensity(key), () => 'default');

  useEffect(() => {
    const root = document.documentElement;
    if (density === 'comfortable') root.dataset.density = 'comfortable';
    else delete root.dataset.density;
  }, [density]);

  const setDensity = useCallback(
    (next: Density) => {
      try {
        window.localStorage.setItem(key, next);
      } catch {
        // Not remembered when storage is blocked.
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [key],
  );

  return <DensityContext.Provider value={{ density, setDensity }}>{children}</DensityContext.Provider>;
}

export const useDensity = () => useContext(DensityContext);
