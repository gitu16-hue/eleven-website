"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

/* ============================================================================
   1. CLARITY LENS CONTEXT ("plain" Beginner-First Default vs "technical" v3 Spec)
   ============================================================================ */

export type ClarityMode = "plain" | "technical";

interface ClarityContextValue {
  mode: ClarityMode;
  setMode: (m: ClarityMode) => void;
  toggleMode: () => void;
}

const ClarityContext = createContext<ClarityContextValue>({
  mode: "plain",
  setMode: () => {},
  toggleMode: () => {},
});

export function ClarityProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ClarityMode>("plain");
  return (
    <ClarityContext.Provider
      value={{
        mode,
        setMode,
        toggleMode: () =>
          setMode((prev) => (prev === "plain" ? "technical" : "plain")),
      }}
    >
      {children}
    </ClarityContext.Provider>
  );
}

export function useClarityMode() {
  return useContext(ClarityContext);
}

/**
 * Interactive segmented pill allowing visitors to read effortless Plain English
 * (default) or switch to full ELEVEN v3 engineering terminology at any time.
 */
export function ClarityTogglePill({ className = "" }: { className?: string }) {
  const { mode, setMode } = useClarityMode();

  return (
    <div
      role="group"
      aria-label="Explanation detail level"
      className={`inline-flex items-center rounded-full border border-el-border-strong bg-el-bg-raised p-1 shadow-el-sm ${className}`}
    >
      {(
        [
          { id: "plain", label: "Simple View" },
          { id: "technical", label: "Engineer Spec" },
        ] as const
      ).map((opt) => {
        const active = mode === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setMode(opt.id)}
            className={`relative cursor-pointer rounded-full px-3 py-1 text-el-xs font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-el-accent ${
              active ? "text-el-bg" : "text-el-fg-muted hover:text-el-fg"
            }`}
          >
            {active && (
              <motion.span
                layoutId="clarityActivePill"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className="absolute inset-0 rounded-full bg-el-fg"
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Renders Beginner-friendly text by default and crossfades to Engineering text when toggled.
 */
export function DualCopy({
  plain,
  technical,
  className = "",
  as = "p",
}: {
  plain: React.ReactNode;
  technical: React.ReactNode;
  className?: string;
  as?: "p" | "span" | "div";
}) {
  const { mode } = useClarityMode();
  const Tag = motion[as] as typeof motion.div;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Tag
        key={mode}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {mode === "plain" ? plain : technical}
      </Tag>
    </AnimatePresence>
  );
}

/* ============================================================================
   2. CHOREOGRAPHED MASKED WORD REVEAL HEADLINE
   ============================================================================ */

export function WordReveal({
  text,
  mutedText,
  className = "",
  as = "h1",
  delay = 0.05,
}: {
  text: string;
  mutedText?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const reduced = useReducedMotion();

  const primaryWords = text.split(" ");
  const secondaryWords = mutedText ? mutedText.split(" ") : [];

  const Tag = as;

  if (reduced) {
    return (
      <Tag ref={ref} className={className}>
        {text}
        {mutedText && (
          <>
            <br />
            <span className="text-el-fg-muted">{mutedText}</span>
          </>
        )}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={className}>
      <span className="inline">
        {primaryWords.map((word, idx) => (
          <span
            key={`p-${word}-${idx}`}
            className="inline-block overflow-hidden align-bottom pb-[0.06em]"
          >
            <motion.span
              className="inline-block"
              initial={{ y: "105%", opacity: 0 }}
              animate={inView ? { y: "0%", opacity: 1 } : { y: "105%", opacity: 0 }}
              transition={{
                duration: 0.68,
                delay: delay + idx * 0.045,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
              {idx < primaryWords.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </span>

      {secondaryWords.length > 0 && (
        <>
          <br />
          <span className="inline text-el-fg-muted">
            {secondaryWords.map((word, idx) => (
              <span
                key={`s-${word}-${idx}`}
                className="inline-block overflow-hidden align-bottom pb-[0.06em]"
              >
                <motion.span
                  className="inline-block"
                  initial={{ y: "105%", opacity: 0 }}
                  animate={
                    inView ? { y: "0%", opacity: 1 } : { y: "105%", opacity: 0 }
                  }
                  transition={{
                    duration: 0.68,
                    delay: delay + (primaryWords.length + idx) * 0.045,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {word}
                  {idx < secondaryWords.length - 1 ? "\u00A0" : ""}
                </motion.span>
              </span>
            ))}
          </span>
        </>
      )}
    </Tag>
  );
}

/* ============================================================================
   3. SPRING-PHYSICS 3D PERSPECTIVE TILT CARD
   ============================================================================ */

export function Tilt3DCard({
  children,
  className = "",
  maxTilt = 4.5,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const [hovered, setHovered] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });

  const springConfig = { stiffness: 260, damping: 24, mass: 0.6 };
  const rotateX = useSpring(
    useTransform(mouseY, [0, 1], [maxTilt, -maxTilt]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [0, 1], [-maxTilt, maxTilt]),
    springConfig
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || reduced) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mouseX.set(Math.max(0, Math.min(1, px)));
    mouseY.set(Math.max(0, Math.min(1, py)));
    setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div style={{ perspective: "1100px" }} className="h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={
          reduced
            ? undefined
            : {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }
        }
        whileTap={reduced ? undefined : { scale: 0.992 }}
        className={`group relative h-full overflow-hidden rounded-sm border border-el-border bg-el-bg-raised transition-colors duration-300 hover:border-el-border-strong hover:shadow-el-md ${className}`}
      >
        {/* Subtle Alabaster-Teal Specular Sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(380px circle at ${glowPos.x}px ${glowPos.y}px, rgba(43, 77, 71, 0.08), transparent 70%)`,
          }}
        />
        {/* Animated Top Accent Hairline on Hover */}
        <motion.div
          aria-hidden="true"
          initial={false}
          animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute top-0 right-0 left-0 h-[2px] origin-left bg-el-accent"
        />
        <div className="relative z-10 h-full">{children}</div>
      </motion.div>
    </div>
  );
}

/* ============================================================================
   4. ANIMATED SPRING METRIC COUNTER
   ============================================================================ */

export function AnimatedMetric({
  prefix = "",
  value,
  suffix = "",
  decimals = 0,
  label,
  sublabel,
}: {
  prefix?: string;
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
  sublabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState<string>(
    reduced ? value.toFixed(decimals) : (0).toFixed(decimals)
  );

  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, {
    stiffness: 90,
    damping: 22,
    restDelta: 0.01,
  });

  useEffect(() => {
    if (reduced) {
      setDisplay(value.toFixed(decimals));
      return;
    }
    if (inView) {
      motionVal.set(value);
    }
  }, [inView, value, decimals, motionVal, reduced]);

  useEffect(() => {
    const unsub = springVal.on("change", (latest) => {
      setDisplay(latest.toFixed(decimals));
    });
    return () => unsub();
  }, [springVal, decimals]);

  return (
    <div ref={ref} className="group">
      <p className="font-mono text-el-xl font-semibold tracking-[-0.02em] text-el-fg transition-colors group-hover:text-el-accent">
        {prefix}
        {display}
        {suffix}
      </p>
      <p className="mt-1 text-el-xs font-medium text-el-fg">{label}</p>
      <p className="mt-0.5 text-[11px] leading-snug text-el-fg-faint">
        {sublabel}
      </p>
    </div>
  );
}

/* ============================================================================
   5. FLOWING SIGNAL BEAM DIVIDER
   ============================================================================ */

export function SignalBeamDivider() {
  const reduced = useReducedMotion();
  return (
    <div
      aria-hidden="true"
      className="relative h-[1px] w-full overflow-hidden bg-el-border"
    >
      {!reduced && (
        <motion.div
          className="absolute top-0 h-full w-36 bg-gradient-to-r from-transparent via-el-accent/70 to-transparent"
          animate={{ left: ["-20%", "120%"] }}
          transition={{
            duration: 4.4,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 1.2,
          }}
        />
      )}
    </div>
  );
}
