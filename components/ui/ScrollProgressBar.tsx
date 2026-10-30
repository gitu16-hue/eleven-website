"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

const emptySubscribe = () => () => {};

function ProgressBarInner() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-50 h-[2px] origin-left bg-gradient-to-r from-el-cyan via-el-violet to-el-lime shadow-[0_0_12px_rgba(0,240,255,0.55)]"
      style={{ scaleX: reduced ? scrollYProgress : scaleX }}
    />
  );
}

export function ScrollProgressBar() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isClient) return null;
  return <ProgressBarInner />;
}
