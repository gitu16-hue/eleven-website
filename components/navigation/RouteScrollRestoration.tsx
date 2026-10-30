"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Ensures that navigating to any route (especially on mobile devices where
 * body overflow toggles and viewport caching can retain previous scroll depth)
 * instantly and reliably scrolls the window to the very top (0, 0).
 */
export function RouteScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    // Prevent the mobile browser engine from automatically restoring stale scroll offsets
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      try {
        window.history.scrollRestoration = "manual";
      } catch {
        // Ignore if restricted in any iframe sandbox
      }
    }
  }, []);

  useEffect(() => {
    // If the URL has an anchor hash, do not hijack top scroll if the hash element exists
    if (typeof window !== "undefined" && window.location.hash) {
      const targetId = window.location.hash.slice(1);
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "instant" });
        return;
      }
    }

    const resetScroll = () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // 1. Immediate reset on pathname transition
    resetScroll();

    // 2. Animation frame after layout pass
    const rafId = requestAnimationFrame(resetScroll);

    // 3. Sequential timers to catch any delayed dynamic component hydration
    const t1 = setTimeout(resetScroll, 60);
    const t2 = setTimeout(resetScroll, 180);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
