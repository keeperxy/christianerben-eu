import { useRef, useLayoutEffect, useState, useCallback, useEffect } from "react";

interface UseFitTextOptions {
  minFontSize?: number;
  maxFontSize?: number;
  resolution?: number; // px, how precise the fitting should be
  depKey?: unknown; // dependency to trigger recalculation (e.g. text)
}

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useFitText({
  minFontSize = 18,
  maxFontSize = 48,
  resolution = 1,
  depKey,
}: UseFitTextOptions = {}) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  const fit = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const el = containerRef.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    // Reset font size to max before measuring
    el.style.fontSize = `${maxFontSize}px`;
    el.style.whiteSpace = "nowrap";
    el.style.display = "inline-block";
    el.style.width = "auto";

    const parentWidth = parent.clientWidth;
    const parentHeight = parent.clientHeight;

    // Binary search for best font size
    let low = minFontSize;
    let high = maxFontSize;
    let best = minFontSize;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      el.style.fontSize = `${mid}px`;
      // Use scrollWidth/Height to check overflow
      if (el.scrollWidth <= parentWidth && el.scrollHeight <= parentHeight) {
        best = mid;
        low = mid + resolution;
      } else {
        high = mid - resolution;
      }
    }
    setFontSize(best);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- depKey is intentionally a dependency to allow external trigger
  }, [minFontSize, maxFontSize, resolution, depKey]);

  useIsomorphicLayoutEffect(() => {
    fit();

    if (typeof window === "undefined" || typeof window.ResizeObserver === "undefined") {
      return;
    }

    // Listen for container resize
    const parent = containerRef.current?.parentElement;
    if (!parent) return;
    const ro = new window.ResizeObserver(fit);
    ro.observe(parent);
    return () => {
      ro.disconnect();
    };
  }, [fit]);

  // Also refit on window resize (for safety)
  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [fit]);

  return { ref: containerRef, fontSize };
} 