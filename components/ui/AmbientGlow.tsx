"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";

/**
 * Single global pointer light. Soft, slow spring so it trails the cursor like
 * a stage light rather than snapping to it. Disabled on touch devices and for
 * reduced-motion users.
 */
export function AmbientGlow() {
  const [enabled, setEnabled] = useState(false);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 22, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 22, mass: 0.6 });

  const background = useMotionTemplate`radial-gradient(560px circle at ${springX}px ${springY}px, rgba(184, 243, 107, 0.035), rgba(245, 245, 240, 0.015) 40%, transparent 72%)`;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none)").matches;
    if (reduce || touch) return;

    const handleMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    // Defer enabling to avoid a synchronous setState inside the effect body.
    const raf = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", handleMove);
    };
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2]"
      style={{ background }}
    />
  );
}
