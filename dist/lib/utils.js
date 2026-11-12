import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
/*
 * tailwind-merge only knows Tailwind's default scale. Our @theme (theme.css)
 * replaces the type scale with numeric sizes and adds named shadows, control heights
 * and motion tokens, so tell it about them: otherwise `text-13` is read as a colour and
 * silently dropped next to `text-ink`, and `h-control-md` / `duration-fast` would never
 * replace an earlier height or duration. Keep these lists in step with theme.css.
 */
const twMerge = extendTailwindMerge({
    extend: {
        theme: {
            text: ["10", "11", "12", "13", "14", "15", "16", "18", "22", "32"],
            shadow: ["popover", "modal"],
            /** h-control-sm, size-control-md, min-h-control-lg… (--spacing-control-*) */
            spacing: ["control-xs", "control-sm", "control-md", "control-lg"],
            /** ease-standard (--ease-standard) */
            ease: ["standard"],
        },
        classGroups: {
            /** duration-fast | base | slow (--transition-duration-*) */
            duration: [{ duration: ["fast", "base", "slow"] }],
        },
    },
});
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
