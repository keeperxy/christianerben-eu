import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Register the custom type scale from globals.css so `text-small`, `text-body`
// and `text-title` are merged as font sizes instead of being mistaken for colors.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["small", "body", "title"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
