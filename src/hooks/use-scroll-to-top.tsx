
import { useEffect } from "react";
import { useRouter } from "next/router";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export const useScrollToTop = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      const prefersReducedMotion = window.matchMedia?.(REDUCED_MOTION_QUERY).matches ?? false;
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    };

    router.events?.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events?.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
};
