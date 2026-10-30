"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useMountedReducedMotion } from "@/components/motion/PremiumMotion";
import { usePrefersReducedMotion } from "./useSecurityEnv";

/* ============================================================================
   1. OPTICAL DE-BLUR KINETIC TEXT REVEAL ("While Appearing Text Apply This")
   Splits text into words/phrases and animates each with an optical lens
   focus pull (blur -> 0) + vertical rise (translateY -> 0), clearing filter
   at completion so zero blur layers linger on GPU at rest.
   ============================================================================ */

interface SecurityTextRevealProps {
  text: string;
  className?: string;
  as?: "p" | "span" | "h2" | "h3" | "h4" | "div";
  delay?: number;
  stagger?: number;
}

export function SecurityTextReveal({
  text,
  className = "",
  as = "p",
  delay = 0.03,
  stagger = 0.018,
}: SecurityTextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });
  const reduced = useMountedReducedMotion();
  const Tag = as;

  const words = useMemo(() => {
    return text.trim().split(/\s+/).filter(Boolean);
  }, [text]);

  const showNow = Boolean(reduced || isInView);

  if (reduced || words.length === 0) {
    return <Tag className={className}>{text}</Tag>;
  }

  const effectiveStagger = Math.min(stagger, 0.42 / Math.max(words.length, 1));

  return (
    <Tag
      ref={containerRef as unknown as React.Ref<HTMLParagraphElement>}
      className={className}
    >
      {words.map((word, idx) => (
        <React.Fragment key={`${idx}-${word}`}>
          <motion.span
            className="inline-block"
            initial={{
              opacity: 0,
              y: "0.38em",
              filter: "blur(5px)",
            }}
            animate={
              showNow
                ? {
                    opacity: 1,
                    y: "0em",
                    filter: "blur(0px)",
                    transitionEnd: { filter: "none" },
                  }
                : {
                    opacity: 0,
                    y: "0.38em",
                    filter: "blur(5px)",
                  }
            }
            transition={{
              duration: 0.48,
              delay: delay + idx * effectiveStagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
          {idx < words.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </Tag>
  );
}

/* ============================================================================
   2. HIGH-PRECISION NUMERIC ROLLING COUNTER FOR DIAGRAMS & GRAPHS
   Interpolates from previous number to target number with smooth easing.
   Guarantees 100% SSR match by displaying target value initially.
   ============================================================================ */

interface SecurityNumberCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  durationMs?: number;
  className?: string;
}

export function SecurityNumberCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  durationMs = 600,
  className = "",
}: SecurityNumberCounterProps) {
  const reduced = usePrefersReducedMotion();
  const spanRef = useRef<HTMLSpanElement>(null);
  const prevValueRef = useRef<number>(value);
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    if (reduced || !isInView) {
      el.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
      prevValueRef.current = value;
      return;
    }

    const startVal = prevValueRef.current;
    const endVal = value;
    if (startVal === endVal) {
      el.textContent = `${prefix}${endVal.toFixed(decimals)}${suffix}`;
      return;
    }

    let rafId: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (endVal - startVal) * eased;

      el.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;

      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        el.textContent = `${prefix}${endVal.toFixed(decimals)}${suffix}`;
        prevValueRef.current = endVal;
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [value, durationMs, decimals, prefix, suffix, reduced, isInView]);

  return (
    <span
      ref={containerRef}
      className={`font-mono tabular-nums ${className}`}
      data-tabular="true"
    >
      <span ref={spanRef}>
        {prefix}
        {value.toFixed(decimals)}
        {suffix}
      </span>
    </span>
  );
}

/* ============================================================================
   3. ANIMATED TELEMETRY SPARKLINE & MINI GRAPH FOR DIAGRAM CELLS
   Renders a lightweight SVG frequency curve with animated stroke draw-in
   and responsive gradient fill.
   ============================================================================ */

interface SecuritySparklineProps {
  points?: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function SecuritySparkline({
  points = [12, 18, 14, 25, 22, 35, 28, 42, 38, 48],
  width = 120,
  height = 28,
  color = "#B8F36B",
  className = "",
}: SecuritySparklineProps) {
  const reduced = usePrefersReducedMotion();
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;

  const pathD = useMemo(() => {
    const stepX = width / (points.length - 1);
    return points
      .map((p, i) => {
        const x = i * stepX;
        const y = height - ((p - min) / range) * (height - 6) - 3;
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  }, [points, width, height, min, range]);

  const areaD = useMemo(() => {
    return `${pathD} L ${width} ${height} L 0 ${height} Z`;
  }, [pathD, width, height]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`overflow-visible select-none ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`spark-grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>

      <path d={areaD} fill={`url(#spark-grad-${color.replace("#", "")})`} />

      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: reduced ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduced ? 0 : 0.85, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Trailing live pulse beacon on last data point */}
      {points.length > 0 && (
        <circle
          cx={width}
          cy={height - ((points[points.length - 1] - min) / range) * (height - 6) - 3}
          r="2.5"
          fill={color}
        />
      )}
    </svg>
  );
}

/* ============================================================================
   4. LIVE COLD-ROOM NONCE COUNTDOWN WITH RADIAL RING & DIGITS
   Displays active 30s TTL ticking countdown during PENDING Hold states.
   ============================================================================ */

interface LiveNonceCountdownProps {
  initialSeconds?: number;
  active: boolean;
  onExpire?: () => void;
  className?: string;
}

export function LiveNonceCountdown({
  initialSeconds = 30,
  active,
  onExpire,
  className = "",
}: LiveNonceCountdownProps) {
  const [remaining, setRemaining] = useState<number>(initialSeconds);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!active) return;

    const interval = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [active, onExpire]);

  const currentSeconds = active ? remaining : initialSeconds;
  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const progress = currentSeconds / initialSeconds;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className={`inline-flex items-center gap-2 font-mono ${className}`}>
      <div className="relative flex h-7 w-7 items-center justify-center">
        <svg className="h-7 w-7 -rotate-90" viewBox="0 0 32 32" aria-hidden="true">
          <circle
            cx="16"
            cy="16"
            r={radius}
            fill="none"
            stroke="#171A18"
            strokeOpacity="0.2"
            strokeWidth="2.5"
          />
          <circle
            cx="16"
            cy="16"
            r={radius}
            fill="none"
            stroke="#171A18"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={reduced ? 0 : strokeDashoffset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <span className="absolute text-[10px] font-bold text-el-sec-graphite">
          {currentSeconds}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-wider text-el-sec-graphite">
          {active ? `30s Nonce TTL (${currentSeconds}s remaining)` : "30s Nonce Armed"}
        </span>
        <span className="text-[9px] text-el-sec-graphite/70">
          Single-Use Cryptographic Lease
        </span>
      </div>
    </div>
  );
}

/* ============================================================================
   5. GLOWING DIAGRAM STATION / LAYER NUMBER BADGE
   Renders an animated numeric station badge with an energetic radar ring.
   ============================================================================ */

interface DiagramNumberBadgeProps {
  number: string | number;
  label?: string;
  active?: boolean;
  tone?: "lime" | "porcelain" | "sage";
  className?: string;
}

export function DiagramNumberBadge({
  number,
  label,
  active = false,
  tone = "lime",
  className = "",
}: DiagramNumberBadgeProps) {
  const reduced = usePrefersReducedMotion();

  const colorMap = {
    lime: {
      bg: "bg-el-sec-lime/15",
      border: "border-el-sec-lime",
      text: "text-el-sec-lime",
      dot: "bg-el-sec-lime",
    },
    porcelain: {
      bg: "bg-el-sec-porcelain/15",
      border: "border-el-sec-porcelain",
      text: "text-el-sec-porcelain",
      dot: "bg-el-sec-porcelain",
    },
    sage: {
      bg: "bg-el-sec-sage/15",
      border: "border-el-sec-sage/50",
      text: "text-el-sec-sage-light",
      dot: "bg-el-sec-sage",
    },
  };

  const c = colorMap[tone];

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div
        className={`relative flex h-6 w-6 items-center justify-center rounded-xs border font-mono text-[11px] font-bold ${c.border} ${c.bg} ${c.text}`}
      >
        {active && !reduced && (
          <span
            className={`absolute -inset-1 animate-ping rounded-xs ${c.dot} opacity-30`}
            aria-hidden="true"
          />
        )}
        <span className="relative z-10">{number}</span>
      </div>
      {label && (
        <span className="font-mono text-[10.5px] uppercase tracking-wide text-el-sec-sage-light">
          {label}
        </span>
      )}
    </div>
  );
}
