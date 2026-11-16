"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView, type Variant } from "framer-motion";
import { useMountedReducedMotion } from "@/components/motion/PremiumMotion";

type Direction = "up" | "down" | "left" | "right" | "none";

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 36 },
  down: { x: 0, y: -28 },
  left: { x: 36, y: 0 },
  right: { x: -36, y: 0 },
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
  duration = 0.78,
  threshold = 0.12,
  once = true,
  stagger = 0,
  as = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMountedReducedMotion();
  const isInView = useInView(ref, { once, amount: threshold });

  const Component = motion[as] as typeof motion.div;
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
      duration: reduced ? 0 : duration,
      delay: reduced ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as const,
      ...(stagger > 0 && {
        staggerChildren: reduced ? 0 : stagger,
      }),
    },
  };

  return (
    <Component
      ref={ref}
      initial="hidden"
      animate={reduced || isInView ? "visible" : "hidden"}
      variants={{ hidden, visible }}
      className={className}
    >
      {children}
    </Component>
  );
}

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
  duration = 0.68,
}: RevealItemProps) {
  const reduced = useMountedReducedMotion();
  const offset = offsets[direction];

  return (
    <motion.div
      className={className}
      variants={{
        hidden: {
          opacity: 0,
          x: offset.x,
          y: offset.y,
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: reduced ? 0 : duration,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
