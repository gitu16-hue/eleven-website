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
  { bg: "#06080D", accent: "#00F0FF", status: "SEALING HOST CONTROL SURFACE" },
  { bg: "#080E1A", accent: "#8B5CF6", status: "VERIFYING L5 POLICY INVARIANTS" },
  { bg: "#050B14", accent: "#00FF9D", status: "COUPLING F.R.I.D.A.Y. ↔ J.A.R.V.I.S. BUS" },
  { bg: "#04060A", accent: "#00F0FF", status: "QUANTUM HOLOGRAPHIC HUD // ONLINE" },
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
      const t = setTimeout(() => setActive(false), 240);
      return () => clearTimeout(t);
    }
    if (direction === "exit" && pathname !== "/enter") {
      const t = setTimeout(() => setActive(false), 200);
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
      setTimeout(() => setPhaseIdx(1), 160),
      setTimeout(() => setPhaseIdx(2), 340),
      setTimeout(() => {
        setPhaseIdx(3);
        router.push("/enter");
      }, 540),
      setTimeout(() => setActive(false), 1250)
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
        setTimeout(() => setPhaseIdx(2), 130),
        setTimeout(() => setPhaseIdx(1), 270),
        setTimeout(() => {
          setPhaseIdx(0);
          router.push(href);
        }, 420),
        setTimeout(() => setActive(false), 1000)
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
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6 text-el-fg pointer-events-auto"
            aria-live="polite"
          >
            <div className="hud-frame relative flex flex-col items-center gap-5 rounded-sm border border-el-border-strong/70 bg-el-bg-raised/85 px-8 py-7 backdrop-blur-xl max-w-md w-full shadow-el-lg">
              <div className="flex items-center gap-3 text-xs text-el-fg-muted">
                <span
                  className="h-2 w-2 rounded-full animate-pulse motion-reduce:animate-none"
                  style={{
                    backgroundColor: currentPhase.accent,
                    boxShadow: `0 0 10px ${currentPhase.accent}`,
                  }}
                />
                <span>ELEVEN v3.1 · System airlock</span>
              </div>

              <div className="w-56 h-[2px] bg-el-border overflow-hidden relative rounded-full">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 0.65,
                    ease: [0.16, 1, 0.3, 1],
                    repeat: Infinity,
                  }}
                  className="h-full w-1/2"
                  style={{ backgroundColor: currentPhase.accent }}
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
        )}
      </AnimatePresence>
    </PortalContext.Provider>
  );
}
