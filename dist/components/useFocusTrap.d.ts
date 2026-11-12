import { type RefObject } from 'react';
export declare const MODAL_LAYER_RANK: {
    readonly base: 0;
    readonly nested: 1;
    readonly top: 2;
};
/** True when the dialog with this id is the top-most open ModalShell. */
export declare function isTopModal(id: string): boolean;
/**
 * Registers the dialog in the shared stack and manages its focus: initial focus,
 * Tab trap while top-most, and focus return on close. See the comment above.
 */
export declare function useFocusTrap({ id, layer, panelRef, headerRef, }: {
    id: string;
    layer: keyof typeof MODAL_LAYER_RANK;
    panelRef: RefObject<HTMLElement | null>;
    headerRef: RefObject<HTMLElement | null>;
}): void;
