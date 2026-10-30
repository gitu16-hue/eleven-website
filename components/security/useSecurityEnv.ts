"use client";

import { useSyncExternalStore } from "react";

function subscribeReducedMotion(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

/**
 * SSR-safe reduced-motion hook using useSyncExternalStore.
 * Prevents React #418 hydration mismatches while reacting live to OS preference changes.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

let cachedWebGLSupport: boolean | null = null;
let cachedSearchKey = "";

function detectWebGL(): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  const win = window as Window & { __ELEVEN_DISABLE_WEBGL__?: boolean };
  const searchKey = `${window.location.search}|${Boolean(win.__ELEVEN_DISABLE_WEBGL__)}`;
  if (cachedWebGLSupport !== null && cachedSearchKey === searchKey) {
    return cachedWebGLSupport;
  }
  cachedSearchKey = searchKey;

  if (win.__ELEVEN_DISABLE_WEBGL__) {
    cachedWebGLSupport = false;
    return false;
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const override = params.get("webgl");
    if (override === "0" || override === "off" || override === "false") {
      cachedWebGLSupport = false;
      return false;
    }

    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: false });
    cachedWebGLSupport = Boolean(gl);
    return cachedWebGLSupport;
  } catch {
    cachedWebGLSupport = false;
    return false;
  }
}

function subscribeWebGL(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener("popstate", callback);
  window.addEventListener("eleven:webgl-toggle", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("eleven:webgl-toggle", callback);
  };
}

function getWebGLServerSnapshot(): boolean {
  return true;
}

/**
 * SSR-safe WebGL capability detector with deterministic fallback override (?webgl=0).
 */
export function useWebGLAvailable(): boolean {
  return useSyncExternalStore(
    subscribeWebGL,
    detectWebGL,
    getWebGLServerSnapshot
  );
}
