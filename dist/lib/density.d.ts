import React from 'react';
export type Density = 'default' | 'comfortable';
/** The storage key prefix DensityProvider uses when an app passes none. */
export declare const DEFAULT_DENSITY_STORAGE_KEY = "aero_density_v1";
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
export declare function DensityProvider({ children, userId, storageKey }: DensityProviderProps): React.JSX.Element;
export declare const useDensity: () => {
    density: Density;
    setDensity: (density: Density) => void;
};
