"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView, type Variant } from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "none";

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  none: { x: 0, y: 0 },
};

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  stagger?: number;
  as?: "div" | "section" | "li" | "article" | "span";
}

export function ScrollReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.7,
  threshold = 0.15,
  once = true,
  stagger = 0,
  as = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const offset = offsets[direction];

  const hidden: Variant = {
    opacity: 0,
    x: offset.x,
    y: offset.y,
  };

  const visible: Variant = {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1] as const,
      ...(stagger > 0 && {
        staggerChildren: stagger,
      }),
    },
  };

  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{ hidden, visible }}
      className={className}
    >
      {children}
    </Component>
  );
}

/* ── Stagger child wrapper ─────────────────────────────── */

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  duration?: number;
}

export function RevealItem({
  children,
  className = "",
  direction = "up",
  duration = 0.6,
}: RevealItemProps) {
  const offset = offsets[direction];

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, x: offset.x, y: offset.y },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration, ease: [0.16, 1, 0.3, 1] as const },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
