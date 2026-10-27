"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  { bg: "#faf9f6", fg: "#11110e", status: "SEALING INSTITUTIONAL SURFACE" },
  { bg: "#e6e4dc", fg: "#11110e", status: "VERIFYING CONTROL PLANE BOUNDARIES" },
  { bg: "#1b2129", fg: "#f2f3ee", status: "COUPLING F.R.I.D.A.Y. ↔ J.A.R.V.I.S. BUS" },
  { bg: "#080a0f", fg: "#5fd0cf", status: "COMPUTATIONAL HUD // ONLINE" },
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

    setDirection("enter");
    setPhaseIdx(0);
    setActive(true);

    setTimeout(() => setPhaseIdx(1), 180);
    setTimeout(() => setPhaseIdx(2), 390);
    setTimeout(() => {
      setPhaseIdx(3);
      router.push("/enter");
    }, 640);
    // Safety fallback if already prefetched or route stalls
    setTimeout(() => setActive(false), 1350);
  }, [pathname, router]);

  const exitToInstitutionalMode = useCallback(
    (href: string = "/") => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        router.push(href);
        return;
      }

      setDirection("exit");
      setPhaseIdx(3);
      setActive(true);

      setTimeout(() => setPhaseIdx(2), 140);
      setTimeout(() => setPhaseIdx(1), 300);
      setTimeout(() => {
        setPhaseIdx(0);
        router.push(href);
      }, 460);
      setTimeout(() => setActive(false), 1050);
    },
    [router]
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
              color: currentPhase.fg,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6 pointer-events-auto"
            aria-live="polite"
          >
            {/* Subtle calibration frame */}
            <div className="relative flex flex-col items-center gap-5 max-w-md w-full">
              <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] uppercase opacity-80">
                <span
                  className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: currentPhase.fg }}
                />
                <span>ELEVEN v3.1 // CONTROL PLANE</span>
              </div>

              <div className="w-48 h-px bg-current/20 overflow-hidden relative">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 0.75,
                    ease: [0.16, 1, 0.3, 1],
                    repeat: Infinity,
                  }}
                  className="h-full w-1/2 bg-current"
                />
              </div>

              <p className="font-mono text-xs tracking-[0.12em] text-center opacity-90">
                {currentPhase.status}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PortalContext.Provider>
  );
}
