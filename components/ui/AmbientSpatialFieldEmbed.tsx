"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const AmbientSpatialField3D = dynamic(
  () =>
    import("@/components/three/AmbientSpatialField3D").then(
      (mod) => mod.AmbientSpatialField3D
    ),
  { ssr: false }
);

/**
 * Deferred, zero-LCP-impact mount wrapper for the minimal 3D spatial backdrop.
 * - Waits for browser idle (`requestIdleCallback`) so FCP/LCP finish first
 * - Unmounts automatically on `/enter` (which runs its own full-viewport 3D HUD)
 * - Skips mounting entirely when `prefers-reduced-motion: reduce` is enabled
 */
export function AmbientSpatialFieldEmbed() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let idleHandle: number | null = null;
    let timeoutHandle: ReturnType<typeof setTimeout> | null = null;

    if ("requestIdleCallback" in window) {
      idleHandle = window.requestIdleCallback(
        () => setMounted(true),
        { timeout: 1200 }
      );
    } else {
      timeoutHandle = setTimeout(() => setMounted(true), 380);
    }

    return () => {
      if (idleHandle !== null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle !== null) {
        clearTimeout(timeoutHandle);
      }
    };
  }, []);

  if (!mounted || pathname === "/enter") {
    return null;
  }

  return <AmbientSpatialField3D />;
}
