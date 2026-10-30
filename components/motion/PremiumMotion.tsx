"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  motion,
  useInView,
  useMotionTemplate,
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
  const toggleMode = useCallback(
    () => setMode((prev) => (prev === "plain" ? "technical" : "plain")),
    []
  );
  const value = useMemo(
    () => ({ mode, setMode, toggleMode }),
    [mode, toggleMode]
  );

  return (
    <ClarityContext.Provider value={value}>{children}</ClarityContext.Provider>
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
 * SSR-safe reduced motion hook that guarantees 100% bit-for-bit hydration parity.
 * Evaluates to `false` on the server and during the initial client hydration pass,
 * updating to `true` strictly post-mount when OS prefers-reduced-motion is active.
 * Prevents React #418 hydration mismatches while immediately halting/snapping
 * animations for reduced-motion visitors in 0ms.
 */
export function useMountedReducedMotion(): boolean {
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? Boolean(reduced) : false;
}

/**
 * Internal phrasing-only kinetic word stream (<span> + Fragment only, valid inside <p>).
 * Delivers an optical lens focus-pull (blur -> 0) + vertical rise on scroll & mode switch,
 * clearing `filter: "none"` at transition end so zero GPU blur layers persist at rest.
 */
function AnimatedPhraseStream({
  text,
  active,
  reduced,
  baseDelay = 0.02,
}: {
  text: string;
  active: boolean;
  reduced: boolean | null;
  baseDelay?: number;
}) {
  const words = useMemo(() => text.trim().split(/\s+/).filter(Boolean), [text]);
  if (words.length === 0) return <>{text}</>;

  const staggerStep = Math.min(0.02, 0.54 / Math.max(words.length, 1));

  return (
    <>
      {words.map((word, idx) => (
        <React.Fragment key={`${idx}-${word}`}>
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: "0.42em", filter: "blur(5.5px)" }}
            animate={
              active
                ? {
                    opacity: 1,
                    y: "0em",
                    filter: "blur(0px)",
                    transitionEnd: { filter: "none" },
                  }
                : {
                    opacity: 0,
                    y: "0.42em",
                    filter: "blur(5.5px)",
                  }
            }
            transition={{
              duration: reduced ? 0 : 0.52,
              delay: reduced ? 0 : baseDelay + idx * staggerStep,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
          {idx < words.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </>
  );
}

/**
 * Renders Beginner-friendly text by default and switches to Engineering text when toggled,
 * with word-by-word optical focus-pull typography on viewport arrival and Clarity Lens toggle.
 * Both perspectives remain in SSR HTML for AI/search crawlers without duplicate visible blocks.
 */
export function DualCopy({
  plain,
  technical,
  className = "",
  as = "p",
  animateWords = true,
}: {
  plain: React.ReactNode;
  technical: React.ReactNode;
  className?: string;
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4";
  animateWords?: boolean;
}) {
  const { mode } = useClarityMode();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.16 });
  const reduced = useMountedReducedMotion();
  const Tag = as;
  const typedRef = ref as React.Ref<
    HTMLParagraphElement & HTMLDivElement & HTMLHeadingElement & HTMLSpanElement
  >;

  if (!technical || plain === technical) {
    const singleActive = Boolean(reduced || inView);
    return (
      <Tag ref={typedRef} className={className}>
        {animateWords && typeof plain === "string" ? (
          <AnimatedPhraseStream
            text={plain}
            active={singleActive}
            reduced={reduced}
          />
        ) : (
          plain
        )}
      </Tag>
    );
  }

  const activeClass = as === "span" ? "inline" : "block";
  const plainActive = Boolean(reduced || (inView && mode === "plain"));
  const techActive = Boolean(reduced || (inView && mode === "technical"));

  return (
    <Tag ref={typedRef} className={className}>
      <span
        className={mode === "plain" ? activeClass : "hidden"}
        data-clarity="plain"
      >
        {animateWords && typeof plain === "string" ? (
          <AnimatedPhraseStream
            text={plain}
            active={plainActive}
            reduced={reduced}
          />
        ) : (
          plain
        )}
      </span>
      <span
        className={mode === "technical" ? activeClass : "hidden"}
        data-clarity="technical"
        title={typeof technical === "string" ? technical : undefined}
      >
        {animateWords && typeof technical === "string" ? (
          <AnimatedPhraseStream
            text={technical}
            active={techActive}
            reduced={reduced}
          />
        ) : (
          technical
        )}
      </span>
    </Tag>
  );
}

/**
 * Standalone kinetic paragraph reveal for single-perspective <p> copy.
 * Animates each word with optical lens focus-pull + subtle vertical rise on viewport entry.
 */
export function ParagraphReveal({
  text,
  className = "",
  as = "p",
  delay = 0.04,
}: {
  text: string;
  className?: string;
  as?: "p" | "span" | "div";
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.18 });
  const reduced = useMountedReducedMotion();
  const Tag = as;
  const typedRef = ref as React.Ref<
    HTMLParagraphElement & HTMLDivElement & HTMLSpanElement
  >;
  const showNow = Boolean(reduced || inView);

  return (
    <Tag ref={typedRef} className={className}>
      <AnimatedPhraseStream
        text={text}
        active={showNow}
        reduced={reduced}
        baseDelay={delay}
      />
    </Tag>
  );
}

/**
 * Quantum telemetry character decoder for eyebrows, badges, and status tags.
 * Preserves 100% SSR/Client hydration parity by rendering exact text initially
 * and running a 6-character left-to-right decryption wave via requestAnimationFrame.
 */
export function CipherText({
  text,
  className = "",
  delay = 0.05,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduced = useMountedReducedMotion();
  const [output, setOutput] = useState(text);

  useEffect(() => {
    if (!inView || reduced) return;

    const glyphs = "01/_▪◊×+<>";
    const durationMs = 540;
    let rafId = 0;
    let frame = 0;

    const timerId = window.setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        frame += 1;
        const progress = Math.min(1, (now - start) / durationMs);
        const lockedCount = Math.floor(progress * text.length);

        if (progress >= 1) {
          setOutput(text);
          return;
        }

        let next = "";
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (
            i < lockedCount ||
            ch === " " ||
            ch === "·" ||
            ch === "/" ||
            ch === "—" ||
            ch === "&"
          ) {
            next += ch;
          } else if (i < lockedCount + 6) {
            next += glyphs[(i * 3 + frame) % glyphs.length];
          } else {
            next += ch;
          }
        }
        setOutput(next);
        rafId = window.requestAnimationFrame(tick);
      };

      rafId = window.requestAnimationFrame(tick);
    }, delay * 1000);

    return () => {
      window.clearTimeout(timerId);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [inView, reduced, text, delay]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{output}</span>
    </span>
  );
}

/* ============================================================================
   2. CHOREOGRAPHED 3D PERSPECTIVE + OPTICAL DE-BLUR WORD REVEAL HEADLINE
   ============================================================================ */

export function WordReveal({
  text,
  mutedText,
  className = "",
  as = "span",
  delay = 0.04,
}: {
  text: string;
  mutedText?: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span";
  delay?: number;
}) {
  const ref = useRef<HTMLHeadingElement & HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.22 });
  const reduced = useMountedReducedMotion();

  const primaryWords = text.split(" ");
  const secondaryWords = mutedText ? mutedText.split(" ") : [];

  const Tag = as;
  const showNow = Boolean(reduced || inView);

  return (
    <Tag ref={ref} className={className} style={{ perspective: "850px" }}>
      <span className="inline">
        {primaryWords.map((word, idx) => (
          <span
            key={`p-${word}-${idx}`}
            className="inline-block overflow-hidden align-bottom pb-[0.08em] pt-[0.03em]"
          >
            <motion.span
              className="inline-block origin-bottom"
              initial={{
                y: "110%",
                rotateX: -26,
                opacity: 0,
                filter: "blur(6.5px)",
              }}
              animate={
                showNow
                  ? {
                      y: "0%",
                      rotateX: 0,
                      opacity: 1,
                      filter: "blur(0px)",
                      transitionEnd: { filter: "none" },
                    }
                  : {
                      y: "110%",
                      rotateX: -26,
                      opacity: 0,
                      filter: "blur(6.5px)",
                    }
              }
              transition={{
                duration: reduced ? 0 : 0.74,
                delay: reduced ? 0 : delay + idx * 0.04,
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
                className="inline-block overflow-hidden align-bottom pb-[0.08em] pt-[0.03em]"
              >
                <motion.span
                  className="inline-block origin-bottom"
                  initial={{
                    y: "110%",
                    rotateX: -26,
                    opacity: 0,
                    filter: "blur(6.5px)",
                  }}
                  animate={
                    showNow
                      ? {
                          y: "0%",
                          rotateX: 0,
                          opacity: 1,
                          filter: "blur(0px)",
                          transitionEnd: { filter: "none" },
                        }
                      : {
                          y: "110%",
                          rotateX: -26,
                          opacity: 0,
                          filter: "blur(6.5px)",
                        }
                  }
                  transition={{
                    duration: reduced ? 0 : 0.74,
                    delay:
                      reduced
                        ? 0
                        : delay + (primaryWords.length + idx) * 0.04,
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
   3. ZERO-RE-RENDER 3D PERSPECTIVE TILT CARD WITH PERIMETER SPECULAR GLARE
   ============================================================================ */

export function Tilt3DCard({
  children,
  className = "",
  maxTilt = 4.2,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const reduced = useMountedReducedMotion();

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const glareOpacity = useMotionValue(0);

  const springConfig = { stiffness: 260, damping: 26, mass: 0.55 };
  const rotateX = useSpring(
    useTransform(mouseY, [0, 1], [maxTilt, -maxTilt]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [0, 1], [-maxTilt, maxTilt]),
    springConfig
  );
  const smoothOpacity = useSpring(glareOpacity, { stiffness: 220, damping: 28 });

  const surfaceGlare = useMotionTemplate`radial-gradient(380px circle at ${glowX}px ${glowY}px, rgba(0, 240, 255, 0.13), rgba(139, 92, 246, 0.05) 45%, transparent 72%)`;
  const borderGlare = useMotionTemplate`radial-gradient(240px circle at ${glowX}px ${glowY}px, rgba(0, 240, 255, 0.75), rgba(139, 92, 246, 0.35) 55%, transparent 100%)`;

  const handleMouseEnter = () => {
    if (!cardRef.current || reduced) return;
    // Measure once on enter so mousemove never triggers layout reads
    rectRef.current = cardRef.current.getBoundingClientRect();
    glareOpacity.set(1);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect =
      rectRef.current ||
      (cardRef.current
        ? (rectRef.current = cardRef.current.getBoundingClientRect())
        : null);
    if (!rect || rect.width === 0 || rect.height === 0) return;

    const lx = e.clientX - rect.left;
    const ly = e.clientY - rect.top;
    glowX.set(lx);
    glowY.set(ly);
    mouseX.set(Math.max(0, Math.min(1, lx / rect.width)));
    mouseY.set(Math.max(0, Math.min(1, ly / rect.height)));
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    glareOpacity.set(0);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div style={{ perspective: "1100px" }} className="h-full">
      <motion.div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`group relative h-full overflow-hidden rounded-sm border border-el-border bg-el-bg-raised transition-[border-color,box-shadow] duration-300 hover:border-el-border-strong/90 hover:shadow-el-md ${className}`}
      >
        {/* Cursor-tracked surface holographic spotlight (0 React re-renders, opacity 0 at rest) */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px"
          style={{
            opacity: smoothOpacity,
            background: surfaceGlare,
          }}
        />

        {/* Cursor-tracked 1px anodized perimeter border beam */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] p-px [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]"
          style={{
            opacity: smoothOpacity,
            background: borderGlare,
          }}
        />

        {/* Top Accent Laser Hairline on Hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 left-0 h-[1.5px] origin-left scale-x-0 bg-gradient-to-r from-el-cyan via-el-violet to-el-lime opacity-0 transition-[transform,opacity] duration-300 ease-out group-hover:scale-x-100 group-hover:opacity-100"
        />

        <div className="relative z-10 h-full">{children}</div>
      </motion.div>
    </div>
  );
}

/* ============================================================================
   4. COMPOSITOR-ACCELERATED SPRING METRIC COUNTER (Viewport-Gated)
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
  const onceInView = useInView(ref, { once: true, amount: 0.4 });
  const activeInView = useInView(ref, { once: false, margin: "80px" });
  const reduced = useMountedReducedMotion();
  const formattedTarget = value.toFixed(decimals);
  const [display, setDisplay] = useState<string>(formattedTarget);

  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, {
    stiffness: 90,
    damping: 22,
    restDelta: 0.01,
  });

  useEffect(() => {
    if (reduced) return;
    if (onceInView) {
      motionVal.set(value);
    }
  }, [onceInView, value, motionVal, reduced]);

  useEffect(() => {
    if (reduced) return;
    const unsub = springVal.on("change", (latest) => {
      setDisplay(latest.toFixed(decimals));
    });
    return () => unsub();
  }, [springVal, decimals, reduced]);

  const canAnimate = activeInView && !reduced;
  const lower = label.toLowerCase();
  const isVoice = lower.includes("voice");
  const isSafety = lower.includes("safety") || lower.includes("checkpoint");
  const isMemory = lower.includes("memory");
  const isStop = lower.includes("stop");

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-sm border border-el-border/70 bg-el-bg-raised/45 p-3 sm:p-3.5 transition-all duration-300 hover:border-el-accent/50 hover:bg-el-bg-raised/80 hover:shadow-[0_0_20px_rgba(0,240,255,0.12)]"
    >
      {/* Corner Tech Reticle */}
      <span className="pointer-events-none absolute top-1 right-1.5 font-mono text-[8px] text-el-fg-faint/40">
        ⌜
      </span>
      <span className="pointer-events-none absolute bottom-1 left-1.5 font-mono text-[8px] text-el-fg-faint/40">
        ⌟
      </span>

      {/* Top Row: Numeric Value + Live Beacon */}
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-el-lg sm:text-el-xl font-bold tracking-[-0.02em] text-el-fg transition-colors group-hover:text-el-accent">
          {prefix}
          {display}
          {suffix}
        </p>

        <span className="relative flex h-2 w-2">
          {canAnimate && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-el-accent opacity-75" />
          )}
          <span className="relative inline-flex h-2 w-2 rounded-full bg-el-accent" />
        </span>
      </div>

      {/* Bespoke GPU-Only Micro-Gauges (scaleX / scaleY / translateX — zero layout thrash) */}
      <div className="my-1.5 h-3 flex items-center">
        {/* 1. Voice Reply: GPU scaleY Audio Equalizer */}
        {isVoice && (
          <div className="flex items-end gap-1 h-2.5">
            {[0.4, 0.92, 0.6, 1, 0.52].map((scale, i) => (
              <motion.span
                key={i}
                className="h-full w-1 origin-bottom rounded-xs bg-el-accent"
                animate={
                  canAnimate ? { scaleY: [0.22, scale, 0.22] } : { scaleY: 0.35 }
                }
                transition={{
                  duration: 0.8 + i * 0.14,
                  repeat: canAnimate ? Infinity : 0,
                  ease: "easeInOut",
                  delay: i * 0.1,
                }}
              />
            ))}
            <span className="ml-1.5 font-mono text-[9px] text-el-fg-faint">
              16kHz PCM
            </span>
          </div>
        )}

        {/* 2. Safety Checkpoints: 5 Sequential LED Dots */}
        {isSafety && (
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3, 4].map((idx) => (
              <motion.span
                key={idx}
                className="h-1.5 w-1.5 rounded-full bg-el-accent"
                animate={
                  canAnimate
                    ? { opacity: [0.3, 1, 0.3], scale: [0.95, 1.28, 0.95] }
                    : { opacity: 0.7, scale: 1 }
                }
                transition={{
                  duration: 1.9,
                  repeat: canAnimate ? Infinity : 0,
                  delay: idx * 0.26,
                  ease: "easeInOut",
                }}
              />
            ))}
            <span className="ml-1 font-mono text-[9px] text-el-fg-faint">
              5 GATES
            </span>
          </div>
        )}

        {/* 3. Private Memory: GPU scaleX + translateX Shimmer */}
        {isMemory && (
          <div className="relative w-full h-1.5 overflow-hidden rounded-full bg-el-border">
            <motion.div
              className="h-full w-full origin-left bg-gradient-to-r from-el-accent via-el-signal-lime to-el-accent"
              animate={canAnimate ? { scaleX: [0.72, 1, 0.72] } : { scaleX: 1 }}
              transition={{
                duration: 3.2,
                repeat: canAnimate ? Infinity : 0,
                ease: "easeInOut",
              }}
            />
            {canAnimate && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>
        )}

        {/* 4. Emergency Stop: GPU translateX Hardware Watchdog Spark */}
        {isStop && (
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-16 items-center overflow-hidden">
              <div className="h-[1px] w-full bg-el-border" />
              <motion.span
                className="absolute left-0 h-1.5 w-3 rounded-full bg-el-signal-lime shadow-[0_0_6px_#00FF9D]"
                animate={canAnimate ? { x: [0, 52, 0] } : { x: 24 }}
                transition={{
                  duration: 1.25,
                  repeat: canAnimate ? Infinity : 0,
                  ease: "easeInOut",
                }}
              />
            </div>
            <span className="font-mono text-[9px] text-el-fg-faint">
              RING-0
            </span>
          </div>
        )}
      </div>

      {/* Label and Sublabel */}
      <p className="mt-1 text-el-xs font-semibold text-el-fg leading-tight">
        {label}
      </p>
      <p className="mt-0.5 text-[11px] leading-snug text-el-fg-muted">
        {sublabel}
      </p>
    </div>
  );
}

/* ============================================================================
   5. COMPOSITOR-ACCELERATED FLOWING SIGNAL BEAM DIVIDER
   ============================================================================ */

export function SignalBeamDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "120px" });
  const reduced = useMountedReducedMotion();

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative h-[1px] w-full overflow-hidden bg-el-border"
    >
      {!reduced && inView && (
        <>
          <motion.div
            className="absolute top-0 left-0 h-full w-48 bg-gradient-to-r from-transparent via-el-accent/85 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100vw" }}
            transition={{
              duration: 3.6,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 0.9,
            }}
          />
          <motion.div
            className="absolute top-0 right-0 h-full w-36 bg-gradient-to-r from-transparent via-el-violet/65 to-transparent"
            initial={{ x: "100%" }}
            animate={{ x: "-100vw" }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.4,
              repeatDelay: 1.3,
            }}
          />
        </>
      )}
    </div>
  );
}
