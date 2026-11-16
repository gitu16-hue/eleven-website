"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

interface PortalContextValue {
  enterComputationalMode: () => void;
  exitToInstitutionalMode: (href?: string) => void;
  isTransitioning: boolean;
}

const PortalContext = createContext<PortalContextValue>({
  enterComputationalMode: () => {},
  exitToInstitutionalMode: () => {},
  isTransitioning: false,
});

export function usePortalTransition() {
  return useContext(PortalContext);
}

const PHASES = [
  {
    bg: "#05070D",
    accent: "#00B38C",
    code: "01",
    label: "SEALING SURFACE",
    status: "SEALING HOST CONTROL SURFACE",
    pct: 24,
  },
  {
    bg: "#06100D",
    accent: "#10BC83",
    code: "02",
    label: "L5 INVARIANTS",
    status: "VERIFYING L5 POLICY INVARIANTS",
    pct: 52,
  },
  {
    bg: "#040D0A",
    accent: "#38FFBD",
    code: "03",
    label: "S1 ↔ S2 BUS",
    status: "COUPLING F.R.I.D.A.Y. ↔ J.A.R.V.I.S. BUS",
    pct: 80,
  },
  {
    bg: "#05070D",
    accent: "#10BC83",
    code: "04",
    label: "CORE ONLINE",
    status: "QUANTUM HOLOGRAPHIC HUD // ONLINE",
    pct: 100,
  },
];

export function PortalTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [direction, setDirection] = useState<"enter" | "exit">("enter");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  // Clear transition veil cleanly once navigation lands
  useEffect(() => {
    if (!active) return;
    if (direction === "enter" && pathname === "/enter") {
      const t = setTimeout(() => setActive(false), 260);
      return () => clearTimeout(t);
    }
    if (direction === "exit" && pathname !== "/enter") {
      const t = setTimeout(() => setActive(false), 220);
      return () => clearTimeout(t);
    }
  }, [pathname, active, direction]);

  const enterComputationalMode = useCallback(() => {
    if (pathname === "/enter") return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      router.push("/enter");
      return;
    }

    clearTimers();
    setDirection("enter");
    setPhaseIdx(0);
    setActive(true);

    timersRef.current.push(
      setTimeout(() => setPhaseIdx(1), 170),
      setTimeout(() => setPhaseIdx(2), 360),
      setTimeout(() => {
        setPhaseIdx(3);
        router.push("/enter");
      }, 570),
      setTimeout(() => setActive(false), 1350)
    );
  }, [pathname, router, clearTimers]);

  const exitToInstitutionalMode = useCallback(
    (href: string = "/") => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        router.push(href);
        return;
      }

      clearTimers();
      setDirection("exit");
      setPhaseIdx(3);
      setActive(true);

      timersRef.current.push(
        setTimeout(() => setPhaseIdx(2), 140),
        setTimeout(() => setPhaseIdx(1), 290),
        setTimeout(() => {
          setPhaseIdx(0);
          router.push(href);
        }, 450),
        setTimeout(() => setActive(false), 1050)
      );
    },
    [router, clearTimers]
  );

  const currentPhase = PHASES[phaseIdx] ?? PHASES[0];

  return (
    <PortalContext.Provider
      value={{
        enterComputationalMode,
        exitToInstitutionalMode,
        isTransitioning: active,
      }}
    >
      {children}

      <AnimatePresence>
        {active && (
          <motion.div
            key="eleven-portal-veil"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              backgroundColor: currentPhase.bg,
            }}
            exit={{ opacity: 0, transition: { duration: 0.34, ease: [0.16, 1, 0.3, 1] } }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-6 text-el-fg pointer-events-auto"
            aria-live="polite"
          >
            {/* Radial Emerald Airlock Bloom */}
            <motion.div
              aria-hidden="true"
              initial={{ scale: 0.65, opacity: 0.25 }}
              animate={{ scale: 1.05 + phaseIdx * 0.14, opacity: 0.72 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute h-[540px] w-[540px] rounded-full blur-[90px]"
              style={{
                background: `radial-gradient(closest-side, ${currentPhase.accent}38, rgba(6,33,24,0.18) 60%, transparent 100%)`,
              }}
            />

            {/* Concentric Rotating HUD Gimbal Rings Behind Card */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute flex items-center justify-center"
            >
              <motion.svg
                viewBox="0 0 360 360"
                className="h-[340px] w-[340px] sm:h-[440px] sm:w-[440px] opacity-40"
                initial={{ rotate: 0, scale: 0.8 }}
                animate={{
                  rotate: direction === "enter" ? 90 : -90,
                  scale: 1 + phaseIdx * 0.05,
                }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <circle
                  cx="180"
                  cy="180"
                  r="156"
                  fill="none"
                  stroke={currentPhase.accent}
                  strokeWidth="1"
                  strokeDasharray="18 10 4 10"
                  opacity="0.55"
                />
                <circle
                  cx="180"
                  cy="180"
                  r="128"
                  fill="none"
                  stroke="#38FFBD"
                  strokeWidth="0.75"
                  strokeDasharray="6 8"
                  opacity="0.35"
                />
              </motion.svg>
            </div>

            <motion.div
              initial={{ y: 20, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: -12, scale: 1.02, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="gfx-frame relative z-10 max-w-md w-full"
            >
              <div className="gfx-frame__highlight" aria-hidden="true">
                <div className="gfx-frame__highlight-glow" />
              </div>
              <span className="gfx-frame__top-beam" aria-hidden="true" />

              <div className="relative z-[1] overflow-hidden rounded-[1.45rem] border border-white/10 bg-[#05070d]/92 flex flex-col items-center gap-5 px-7 py-7 backdrop-blur-xl">
                <div className="gfx-badge !py-1 !px-3.5 !text-xs">
                  <span
                    className="h-2 w-2 rounded-full animate-pulse motion-reduce:animate-none"
                    style={{
                      backgroundColor: currentPhase.accent,
                      boxShadow: `0 0 10px ${currentPhase.accent}`,
                    }}
                  />
                  <span>
                    {direction === "enter"
                      ? "ELEVEN v3.1 · Genesis Holographic Airlock"
                      : "Returning to Institutional Trust Layer"}
                  </span>
                </div>

                {/* Stage Pill Stepper */}
                <div className="grid w-full grid-cols-4 gap-1.5 font-mono text-[9.5px] tracking-[0.06em]">
                  {PHASES.map((p, idx) => {
                    const done =
                      direction === "enter" ? idx <= phaseIdx : idx >= phaseIdx;
                    return (
                      <div
                        key={p.code}
                        className="flex flex-col items-center gap-1 rounded-lg border px-1.5 py-1.5 transition-colors duration-200"
                        style={{
                          borderColor: done
                            ? `${currentPhase.accent}66`
                            : "rgba(255,255,255,0.08)",
                          backgroundColor: done
                            ? "rgba(16,188,131,0.12)"
                            : "rgba(5,7,13,0.7)",
                          color: done ? "#38FFBD" : "#686868",
                        }}
                      >
                        <span>{p.code}</span>
                        <span className="truncate max-w-full">{p.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Linear Smooth Determinate Airlock Bar */}
                <div className="w-full h-[3px] bg-white/[0.08] overflow-hidden relative rounded-full">
                  <motion.div
                    animate={{ width: `${currentPhase.pct}%` }}
                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: currentPhase.accent,
                      boxShadow: `0 0 14px ${currentPhase.accent}`,
                    }}
                  />
                </div>

                <p
                  className="font-mono text-xs tracking-[0.12em] text-center"
                  style={{ color: currentPhase.accent }}
                >
                  {currentPhase.status}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PortalContext.Provider>
  );
}
