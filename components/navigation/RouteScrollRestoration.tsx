"use client";

import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

const LEGACY_ANCHOR_MAP: Record<string, string> = {
  "threat-simulation": "flagship-security-showcase",
  "threats": "flagship-security-showcase",
  "security-simulation": "flagship-security-showcase",
  "solutions": "intelligence-in-motion",
  "tools": "live-control-showcase",
};

/**
 * Ensures that navigating to any route (especially on mobile devices where
 * body overflow toggles and viewport caching can retain previous scroll depth)
 * reliably scrolls to target anchors or to the top (0, 0), while never silently
 * wiping scroll if a valid anchor exists.
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

  const resolveTargetElement = useCallback((rawHash: string): HTMLElement | null => {
    if (!rawHash) return null;
    const cleanId = rawHash.replace(/^#/, "");
    const directEl = document.getElementById(cleanId);
    if (directEl) return directEl;

    const mappedId = LEGACY_ANCHOR_MAP[cleanId];
    if (mappedId) {
      const mappedEl = document.getElementById(mappedId);
      if (mappedEl) return mappedEl;
    }

    return document.querySelector(`[name="${cleanId}"]`);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let t1: NodeJS.Timeout | null = null;

    const resetScrollToTop = () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    const attemptScrollToAnchorOrTop = (retryCount = 0) => {
      if (cancelled || typeof window === "undefined") return;

      const hash = window.location.hash;
      if (hash) {
        const targetEl = resolveTargetElement(hash);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "instant", block: "start" });
          return;
        }

        // Retry up to 3 times (frame, 60ms, 150ms) to allow dynamic client components to mount
        if (retryCount < 2) {
          const delay = retryCount === 0 ? 60 : 150;
          t1 = setTimeout(() => attemptScrollToAnchorOrTop(retryCount + 1), delay);
          return;
        }
      }

      // No hash present or anchor target not found after retries -> reset to top
      resetScrollToTop();
    };

    // 1. Initial attempt
    attemptScrollToAnchorOrTop(0);

    // 2. Hash change listener for in-page anchor clicks
    const handleHashChange = () => {
      if (typeof window !== "undefined" && window.location.hash) {
        const el = resolveTargetElement(window.location.hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      cancelled = true;
      if (t1) clearTimeout(t1);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [pathname, resolveTargetElement]);

  return null;
}
