"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function AmbientGlow() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Smooth spring physics for fluid movement
  const springX = useSpring(mouseX, { stiffness: 45, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 25 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
      {/* Subtle interactive luxury ambient spotlight */}
      <motion.div
        className="absolute -top-48 -left-48 h-96 w-96 rounded-full opacity-40 blur-3xl mix-blend-multiply dark:mix-blend-screen transition-opacity duration-1000"
        style={{
          x: springX,
          y: springY,
          background:
            "radial-gradient(circle, rgba(43,77,71,0.08) 0%, rgba(43,77,71,0.02) 40%, transparent 70%)",
        }}
      />
    </div>
  );
}
