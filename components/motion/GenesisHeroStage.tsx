"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { WaitlistActionButton } from "@/components/v3/WaitlistActionButton";
import { HeroOrbEmbed } from "@/components/v3/HeroOrbEmbed";
import { ClarityTogglePill, DualCopy } from "@/components/motion/PremiumMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STATS_METRICS = [
  {
    value: "0.42s",
    label: "Median Voice Reply Latency (p50)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#38ffbd]">
        <path
          d="M12 3v18M8 7v10M4 10v4M16 7v10M20 10v4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    value: "4 Rooms",
    label: "Isolated OS Process Domains (INV-01)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#38ffbd]">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    value: "5 Gates",
    label: "Pre-Execution Safety Checkpoints (INV-04)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#38ffbd]">
        <path
          d="M12 3l7 3v6c0 4.5-3 8.2-7 9-4-0.8-7-4.5-7-9V6l7-3z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M9 12l2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    value: "30s TTL",
    label: "Ed25519 Hardware Approval Lease (DEC-008)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#38ffbd]">
        <circle cx="8.5" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M13 12h8M18 12v3M21 12v2"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    value: "127.0.0.1",
    label: "Loopback-Only 3-Tier Memory Vault",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#38ffbd]">
        <ellipse cx="12" cy="6" rx="7.5" ry="3" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M4.5 6v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6M4.5 12v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    ),
  },
];

interface GatewayCardSpec {
  key: string;
  tone: "green" | "amber" | "blue";
  title: string;
  desc: string;
  btn: string;
  href: string;
  fill: boolean;
  sparkles: boolean;
  badge: string;
}

const LEFT_GATEWAY_CARDS: GatewayCardSpec[] = [
  {
    key: "voice",
    tone: "green",
    badge: "0.42s Loop",
    title: "Full-Duplex Voice Studio",
    desc: "Natural 16kHz PCM conversation with <50ms hardware barge-in interruption and zero cloud audio uploads.",
    btn: "Explore Voice Benchmarks",
    href: "/benchmarks/voice-latency",
    fill: true,
    sparkles: false,
  },
  {
    key: "dag",
    tone: "green",
    badge: "System 2",
    title: "Async DAG TaskCompiler",
    desc: "Breaks complex coding and research into parallel, budget-capped execution graphs while voice stays instant.",
    btn: "Open DAG Visualizer",
    href: "/tools/dag-visualizer",
    fill: false,
    sparkles: true,
  },
  {
    key: "gate",
    tone: "amber",
    badge: "INV-04",
    title: "5-Stage ActionGate",
    desc: "Every proposed file edit or terminal command passes 5 mandatory verification gates before touching your OS.",
    btn: "Inspect ActionGate",
    href: "/autonomy",
    fill: false,
    sparkles: true,
  },
];

const RIGHT_GATEWAY_CARDS: GatewayCardSpec[] = [
  {
    key: "vault",
    tone: "green",
    badge: "127.0.0.1",
    title: "3-Tier Local Memory Vault",
    desc: "Qdrant semantic vectors + SQLite WAL timeline bound strictly to local loopback with 0.85 deduplication.",
    btn: "Size Your Local Vault",
    href: "/tools/vault-calculator",
    fill: true,
    sparkles: false,
  },
  {
    key: "worktree",
    tone: "blue",
    badge: "INV-09",
    title: "Quarantined Git Worktrees",
    desc: "AI coding helpers build and run tests inside isolated worktree copies—your main branch stays untouched.",
    btn: "Developer Workflow",
    href: "/solutions/developers",
    fill: false,
    sparkles: true,
  },
  {
    key: "cockpit",
    tone: "green",
    badge: "WebGL HUD",
    title: "3D Holographic Control Plane",
    desc: "Step inside the live 54K-particle 3D cognitive core to test orbiting helper satellites and Ed25519 receipts.",
    btn: "Enter 3D Core (/enter)",
    href: "/enter",
    fill: true,
    sparkles: true,
  },
];

function GatewayCardItem({ card }: { card: GatewayCardSpec }) {
  return (
    <article className={`gateway-card gateway-card--${card.tone} w-full max-w-[420px]`}>
      <div
        className={`flex h-9 w-auto px-3 shrink-0 flex-row items-center justify-center gap-2 rounded-full sm:h-14 sm:w-14 sm:flex-col sm:gap-0 sm:px-0 sm:rounded-2xl border font-mono text-[10px] ${
          card.tone === "amber"
            ? "border-[#e29d58]/40 bg-gradient-to-br from-[#3d2e0d] to-[#1f1606] text-[#e29d58]"
            : card.tone === "blue"
            ? "border-[#4c6ef5]/45 bg-gradient-to-br from-[#0d152e] to-[#28429e] text-[#9eb4ff]"
            : "border-[#10bc83]/40 bg-gradient-to-br from-[#0d3d28] to-[#061f16] text-[#38ffbd]"
        }`}
      >
        <span className="h-2 w-2 rounded-full bg-current sm:mb-1 opacity-80" />
        <span className="whitespace-nowrap">{card.badge}</span>
      </div>
      <div className="flex w-full flex-col items-start gap-1.5">
        <h3 className="text-lg font-normal text-[#e8ecf5] leading-snug">
          {card.title}
        </h3>
        <p className="text-xs text-[#a0a0a0] leading-relaxed">
          {card.desc}
        </p>
        <div className="mt-2 w-full sm:w-auto">
          <Button
            href={card.href}
            variant={card.fill ? "secondary" : "ghost"}
            arrow={card.fill}
            className="w-full sm:w-auto"
          >
            {card.btn}
          </Button>
        </div>
      </div>
    </article>
  );
}

const ALL_GATEWAY_CARDS: GatewayCardSpec[] = [
  ...LEFT_GATEWAY_CARDS,
  ...RIGHT_GATEWAY_CARDS,
];

const MOBILE_DECK_ICONS: Record<string, React.ReactNode> = {
  voice: (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <path d="M12 4v16M8 8v8M4 11v2M16 8v8M20 11v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  dag: (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <circle cx="6" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="17" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.1 11.1L15.4 7.9M8.1 12.9l7.3 3.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  gate: (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <path d="M12 3.5l6.5 2.8v5.4c0 4.2-2.7 7.6-6.5 8.8-3.8-1.2-6.5-4.6-6.5-8.8V6.3L12 3.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9.5 12l1.8 1.8 3.4-3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  vault: (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <ellipse cx="12" cy="6.5" rx="6.5" ry="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.5 6.5v5.5c0 1.38 2.91 2.5 6.5 2.5s6.5-1.12 6.5-2.5V6.5M5.5 12v5.5c0 1.38 2.91 2.5 6.5 2.5s6.5-1.12 6.5-2.5V12" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  worktree: (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <circle cx="7" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="7" cy="17.5" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="10" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 8.5v7M7 14c0-2.2 2-3.5 5.5-3.8L15 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  cockpit: (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <ellipse cx="12" cy="12" rx="8.5" ry="3.4" transform="rotate(-24 12 12)" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="12" cy="12" rx="8.5" ry="3.4" transform="rotate(24 12 12)" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
};

function MobileGatewayCarousel({
  targetIdxRef,
  activeStep,
  onActiveStepChange,
  isPhaseActive,
  onManualInteract,
}: {
  targetIdxRef: React.MutableRefObject<number>;
  activeStep: number;
  onActiveStepChange: React.Dispatch<React.SetStateAction<number>>;
  isPhaseActive: boolean;
  onManualInteract: () => void;
}) {
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const strandARef = useRef<SVGPathElement | null>(null);
  const strandBRef = useRef<SVGPathElement | null>(null);
  const strandAGlowRef = useRef<SVGPathElement | null>(null);
  const strandBGlowRef = useRef<SVGPathElement | null>(null);
  const rungRefs = useRef<(SVGLineElement | null)[]>([]);
  const nodeARefs = useRef<(SVGCircleElement | null)[]>([]);
  const nodeBRefs = useRef<(SVGCircleElement | null)[]>([]);

  const smoothIdxRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const pointerTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pointerSmoothRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchStartRef = useRef<{ x: number; y: number; idx: number } | null>(null);
  const activeStepRef = useRef<number>(activeStep);
  const elapsedRef = useRef<number>(0);
  const total = ALL_GATEWAY_CARDS.length;

  useEffect(() => {
    activeStepRef.current = activeStep;
  }, [activeStep]);

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const isCurrent = i === activeStep;
      el.style.transform = "translate3d(0px, 0px, 0px) scale(1)";
      el.style.opacity = isCurrent ? "1" : "0";
      el.style.zIndex = isCurrent ? "50" : "10";
      el.style.pointerEvents = isCurrent ? "auto" : "none";
      el.classList.toggle("gateway-spiral-card--active", isCurrent);
    });
  }, [activeStep]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const applyHelixPose = (t: number) => {
      const vw = window.innerWidth || 390;
      const isTablet = vw >= 640;

      // Vertical DNA Double-Helix geometry: prominent vertical spacing + fluid S-curve weave
      const radiusX = isTablet ? 86 : 52;
      const stepY = isTablet ? 172 : 152;
      const radiusZ = isTablet ? 225 : 196;
      const zOffset = isTablet ? 165 : 144;
      const pitchAngle = 1.06;

      const sIdx = smoothIdxRef.current;
      const vel = velocityRef.current;

      const rounded = Math.min(total - 1, Math.max(0, Math.round(sIdx)));
      if (rounded !== activeStepRef.current) {
        activeStepRef.current = rounded;
        onActiveStepChange(rounded);
      }

      // 1. Update 3D vertical DNA cards
      for (let i = 0; i < total; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        const offset = i - sIdx;
        const absOff = Math.abs(offset);
        const theta = offset * pitchAngle;

        // Vertical helix coordinates (Y is primary climbing axis, X weaves smoothly left <-> right)
        const x = Math.sin(theta) * radiusX;
        const y = offset * stepY;
        const z = Math.cos(theta) * radiusZ - zOffset;

        // Organic harmonic suspension float (continuous phase, zero frame resets)
        const breathY = Math.sin(t * 1.15 + i * 1.1) * 3.2;
        const breathRx = Math.cos(t * 0.9 + i * 0.95) * 1.1;
        const breathRy = Math.sin(t * 0.78 + i * 1.25) * 1.4;
        const breathRz = Math.sin(t * 0.65 + i * 0.85) * 0.8;

        // Velocity-coupled banking so the helix leans fluidly into motion
        const velBank = Math.max(-7, Math.min(7, vel * 3.0));

        // 3-Axis helical orientation using smooth bounded trigonometry
        const rotY =
          -Math.sin(theta) * 22 +
          pointerSmoothRef.current.x * 5.5 +
          breathRy;
        const rotX =
          Math.max(-18, Math.min(18, offset * -8.5)) -
          pointerSmoothRef.current.y * 4.5 +
          velBank +
          breathRx;
        const rotZ = Math.sin(theta) * 3.8 + breathRz;

        const scale = Math.max(0.62, 1.0 - absOff * 0.19);

        // Keep front card opaque up to swap midpoint, gently dim distant neighbors for clarity
        let opacity = 0;
        if (absOff <= 2.35) {
          if (absOff <= 0.48) {
            opacity = 1;
          } else {
            const norm = (absOff - 0.48) / 1.87;
            opacity = Math.max(0, Math.pow(1 - norm, 1.55) * 0.78);
          }
        }

        const zIndex = Math.round(100 - absOff * 28);
        const isFront = absOff < 0.45;
        const isInteractive = absOff < 1.55;

        el.style.transform = `translate3d(${x.toFixed(1)}px, ${(y + breathY).toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = String(zIndex);
        el.style.pointerEvents = isInteractive ? "auto" : "none";
        el.setAttribute("aria-hidden", isFront ? "false" : "true");
        el.classList.toggle("gateway-spiral-card--active", isFront);
      }

      // 2. Sync vertical DNA Double-Helix SVG backbone (exact smooth cubic Bezier sine curves)
      if (strandARef.current && strandBRef.current) {
        const cx = 160;
        const amp = isTablet ? 94 : 78;
        const topY = 8;
        const heightY = 404;
        const omega = Math.PI * 3.15;
        const segs = 24;
        const du = 1 / segs;
        const dyStep = (heightY * du) / 3;
        const slopeScale = (amp * omega * du) / 3;
        const phaseShift = sIdx * pitchAngle - t * 0.48;

        const x0Offset = Math.sin(-0.5 * omega + phaseShift) * amp;
        let dA = `M${(cx + x0Offset).toFixed(1)},${topY.toFixed(1)}`;
        let dB = `M${(cx - x0Offset).toFixed(1)},${topY.toFixed(1)}`;

        for (let p = 0; p < segs; p++) {
          const u0 = p * du;
          const u1 = (p + 1) * du;
          const y0 = topY + u0 * heightY;
          const y1 = topY + u1 * heightY;
          const ang0 = (u0 - 0.5) * omega + phaseShift;
          const ang1 = (u1 - 0.5) * omega + phaseShift;

          const off0 = Math.sin(ang0) * amp;
          const off1 = Math.sin(ang1) * amp;
          const dOff0 = Math.cos(ang0) * slopeScale;
          const dOff1 = Math.cos(ang1) * slopeScale;

          dA += ` C${(cx + off0 + dOff0).toFixed(1)},${(y0 + dyStep).toFixed(1)} ${(cx + off1 - dOff1).toFixed(1)},${(y1 - dyStep).toFixed(1)} ${(cx + off1).toFixed(1)},${y1.toFixed(1)}`;
          dB += ` C${(cx - off0 - dOff0).toFixed(1)},${(y0 + dyStep).toFixed(1)} ${(cx - off1 + dOff1).toFixed(1)},${(y1 - dyStep).toFixed(1)} ${(cx - off1).toFixed(1)},${y1.toFixed(1)}`;
        }

        strandARef.current.setAttribute("d", dA);
        strandBRef.current.setAttribute("d", dB);
        strandAGlowRef.current?.setAttribute("d", dA);
        strandBGlowRef.current?.setAttribute("d", dB);

        const rungCount = rungRefs.current.length;
        for (let r = 0; r < rungCount; r++) {
          const line = rungRefs.current[r];
          const nA = nodeARefs.current[r];
          const nB = nodeBRefs.current[r];
          const u = (r + 0.5) / rungCount;
          const py = topY + u * heightY;
          const ang = (u - 0.5) * omega + phaseShift;
          const ax = cx + Math.sin(ang) * amp;
          const bx = cx - Math.sin(ang) * amp;
          const depth = Math.abs(Math.cos(ang));
          const op = (0.14 + 0.48 * depth).toFixed(2);

          if (line) {
            line.setAttribute("x1", ax.toFixed(1));
            line.setAttribute("y1", py.toFixed(1));
            line.setAttribute("x2", bx.toFixed(1));
            line.setAttribute("y2", py.toFixed(1));
            line.setAttribute("stroke-opacity", op);
          }
          if (nA) {
            nA.setAttribute("cx", ax.toFixed(1));
            nA.setAttribute("cy", py.toFixed(1));
            nA.setAttribute("fill-opacity", (0.38 + 0.58 * depth).toFixed(2));
          }
          if (nB) {
            nB.setAttribute("cx", bx.toFixed(1));
            nB.setAttribute("cy", py.toFixed(1));
            nB.setAttribute("fill-opacity", (0.38 + 0.58 * (1 - depth)).toFixed(2));
          }
        }
      }
    };

    if (!isPhaseActive) {
      smoothIdxRef.current = targetIdxRef.current;
      applyHelixPose(elapsedRef.current);
      return;
    }

    // Snap initial pose only if Phase 3 was jumped into far from current spring state
    if (Math.abs(targetIdxRef.current - smoothIdxRef.current) > 1.25) {
      smoothIdxRef.current = targetIdxRef.current;
    }
    applyHelixPose(elapsedRef.current);

    let rafId = 0;
    let lastNow = performance.now();

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      if (document.hidden) {
        lastNow = now;
        return;
      }

      // Clamped delta-time keeps motion identical across 60Hz, 90Hz, and 120Hz mobile screens
      const dt = Math.min((now - lastNow) / 1000, 0.05);
      lastNow = now;
      elapsedRef.current += dt;

      // Critically damped spring-lerp toward target index
      const prevSmooth = smoothIdxRef.current;
      const alpha = 1 - Math.exp(-8.5 * dt);
      const nextSmooth = prevSmooth + (targetIdxRef.current - prevSmooth) * alpha;
      velocityRef.current = (nextSmooth - prevSmooth) / Math.max(0.001, dt);
      smoothIdxRef.current = nextSmooth;

      const pAlpha = 1 - Math.exp(-9.0 * dt);
      pointerSmoothRef.current.x +=
        (pointerTargetRef.current.x - pointerSmoothRef.current.x) * pAlpha;
      pointerSmoothRef.current.y +=
        (pointerTargetRef.current.y - pointerSmoothRef.current.y) * pAlpha;

      applyHelixPose(elapsedRef.current);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPhaseActive, onActiveStepChange, targetIdxRef, total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    touchStartRef.current = { x: t.clientX, y: t.clientY, idx: targetIdxRef.current };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const t = e.touches[0];
    if (!t) return;
    const dx = touchStartRef.current.x - t.clientX;
    const dy = touchStartRef.current.y - t.clientY;
    // Respond smoothly to horizontal drags inside touch-pan-y container without locking vertical page scroll
    if (Math.abs(dx) > Math.abs(dy) * 0.85) {
      onManualInteract();
      const next = Math.min(
        total - 1,
        Math.max(0, touchStartRef.current.idx + dx / 115)
      );
      targetIdxRef.current = next;
      pointerTargetRef.current = {
        x: Math.max(-1, Math.min(1, -dx / 150)),
        y: Math.max(-1, Math.min(1, -dy / 160)),
      };
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;
    touchStartRef.current = null;
    const snapped = Math.min(
      total - 1,
      Math.max(0, Math.round(targetIdxRef.current))
    );
    targetIdxRef.current = snapped;
    onActiveStepChange(snapped);
    pointerTargetRef.current = { x: 0, y: 0 };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
    const ny = ((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1;
    pointerTargetRef.current = {
      x: Math.max(-1, Math.min(1, nx)),
      y: Math.max(-1, Math.min(1, ny)),
    };
  };

  const handlePointerLeave = () => {
    pointerTargetRef.current = { x: 0, y: 0 };
  };

  const stepTo = (nextIdx: number) => {
    onManualInteract();
    const wrapped = ((nextIdx % total) + total) % total;
    targetIdxRef.current = wrapped;
    onActiveStepChange(wrapped);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(0.999, (e.clientX - rect.left) / Math.max(1, rect.width)));
    stepTo(Math.floor(ratio * total));
  };

  const progressPct = ((activeStep + 1) / total) * 100;

  return (
    <div
      className="gateway-carousel pointer-events-auto touch-pan-y flex w-full flex-1 flex-col justify-between lg:hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Vertical 3D DNA Double-Helix Stage */}
      <div className="gateway-spiral-stage mx-auto flex-1 min-h-[372px] sm:min-h-[440px] w-full max-w-[440px]">
        {/* Flat backdrop layer keeps watermark and DNA strands strictly behind 3D cards */}
        <div className="gateway-spiral-backdrop" aria-hidden="true">
          <div className="gateway-spiral-watermark">ELEVEN</div>

          {/* Live Vertical DNA Double-Helix Strand & Base-Pair Rungs */}
          <svg
            viewBox="0 0 320 420"
            preserveAspectRatio="xMidYMid meet"
            className="h-full w-full opacity-90"
          >
            <defs>
              <linearGradient id="dnaStrandA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10bc83" stopOpacity="0" />
                <stop offset="20%" stopColor="#38ffbd" stopOpacity="0.88" />
                <stop offset="50%" stopColor="#8effdc" stopOpacity="1" />
                <stop offset="80%" stopColor="#10bc83" stopOpacity="0.88" />
                <stop offset="100%" stopColor="#10bc83" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="dnaStrandB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00b38c" stopOpacity="0" />
                <stop offset="22%" stopColor="#10bc83" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#6cf5c8" stopOpacity="0.9" />
                <stop offset="78%" stopColor="#00b38c" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#00b38c" stopOpacity="0" />
              </linearGradient>
            </defs>

            <line
              x1="160"
              y1="14"
              x2="160"
              y2="406"
              stroke="#10bc83"
              strokeOpacity="0.16"
              strokeWidth="1"
              strokeDasharray="3 6"
            />

            {Array.from({ length: 11 }).map((_, idx) => (
              <g key={idx}>
                <line
                  ref={(el) => {
                    rungRefs.current[idx] = el;
                  }}
                  x1="100"
                  y1={28 + idx * 36}
                  x2="220"
                  y2={28 + idx * 36}
                  stroke="#38ffbd"
                  strokeWidth="1"
                  strokeOpacity="0.25"
                />
                <circle
                  ref={(el) => {
                    nodeARefs.current[idx] = el;
                  }}
                  cx="100"
                  cy={28 + idx * 36}
                  r="2.6"
                  fill="#38ffbd"
                  fillOpacity="0.72"
                />
                <circle
                  ref={(el) => {
                    nodeBRefs.current[idx] = el;
                  }}
                  cx="220"
                  cy={28 + idx * 36}
                  r="2.1"
                  fill="#10bc83"
                  fillOpacity="0.58"
                />
              </g>
            ))}

            <path
              ref={strandAGlowRef}
              d="M160,8 L160,412"
              fill="none"
              stroke="#38ffbd"
              strokeOpacity="0.16"
              strokeWidth="6.5"
              strokeLinecap="round"
            />
            <path
              ref={strandBGlowRef}
              d="M160,8 L160,412"
              fill="none"
              stroke="#10bc83"
              strokeOpacity="0.11"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
            <path
              ref={strandARef}
              d="M160,8 L160,412"
              fill="none"
              stroke="url(#dnaStrandA)"
              strokeWidth="1.95"
              strokeLinecap="round"
            />
            <path
              ref={strandBRef}
              d="M160,8 L160,412"
              fill="none"
              stroke="url(#dnaStrandB)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Dedicated 3D Perspective Card Plane */}
        <div className="gateway-spiral-3d">
          {ALL_GATEWAY_CARDS.map((card, i) => {
            const isFront = i === activeStep;
            const accentClass =
              card.tone === "amber"
                ? "text-[#e29d58]"
                : card.tone === "blue"
                ? "text-[#9eb4ff]"
                : "text-[#38ffbd]";

            return (
              <article
                key={card.key}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                onClick={() => {
                  if (!isFront) {
                    stepTo(i);
                  }
                }}
                className={`gateway-spiral-card gateway-spiral-card--${card.tone} flex cursor-pointer flex-col justify-between p-3.5 sm:p-4 active:scale-[0.985]`}
              >
                {/* Top Tag + Top-Right Square Icon Chip */}
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.14em] ${accentClass}`}
                  >
                    0{i + 1} / {card.badge}
                  </span>
                  <span
                    className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] ${accentClass}`}
                  >
                    {MOBILE_DECK_ICONS[card.key]}
                  </span>
                </div>

                {/* Card Body: Title + Description + Direct Arrow CTA */}
                <div className="mt-2 flex flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[0.98rem] sm:text-[1.08rem] font-normal uppercase tracking-[0.01em] text-white leading-tight">
                      {card.title}
                    </h3>
                    <span
                      className={`shrink-0 text-sm leading-none pt-0.5 ${accentClass}`}
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-[11.5px] text-[#a0b0ac] leading-[1.38] line-clamp-3">
                    {card.desc}
                  </p>
                  <div
                    className={`mt-1 pt-2 border-t border-white/[0.08] ${
                      isFront ? "pointer-events-auto" : "pointer-events-none"
                    }`}
                    onClick={(e) => {
                      if (isFront) e.stopPropagation();
                    }}
                  >
                    <Button
                      href={card.href}
                      variant={card.fill ? "secondary" : "ghost"}
                      arrow={card.fill}
                      className="w-full max-sm:!min-h-[2.2rem] max-sm:!text-[12.5px]"
                    >
                      {card.btn}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Interactive Step Dots + Emerald Progress Bar + Accessible Prev/Next Controls */}
      <div className="relative z-[120] mx-auto mt-1 flex w-full max-w-[360px] flex-col gap-2 px-1">
        <div
          className="flex items-center justify-center gap-1.5"
          role="tablist"
          aria-label="Capabilities slides"
        >
          {ALL_GATEWAY_CARDS.map((card, idx) => {
            const isActive = idx === activeStep;
            return (
              <button
                key={card.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Jump to ${card.title}`}
                onClick={() => stepTo(idx)}
                className="flex h-6 items-center justify-center px-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#38ffbd] rounded-full"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-5 bg-[#38ffbd] shadow-[0_0_10px_rgba(56,255,189,0.65)]"
                      : "w-1.5 bg-white/25 hover:bg-white/45"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="flex w-full items-center gap-2.5">
          <button
            type="button"
            aria-label="Previous capability"
            onClick={() => stepTo(Math.round(targetIdxRef.current) - 1)}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-[#05070d]/90 text-sm text-[#cff2e6] transition-colors hover:border-[#10bc83]/60 active:scale-95"
          >
            ←
          </button>
          <div
            onClick={handleProgressClick}
            className="carousel-progress flex-1 cursor-pointer"
            title="Tap to jump between capabilities"
          >
            <div
              className="carousel-progress__bar"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="shrink-0 font-mono text-[10px] tracking-[0.08em] text-[#8ab8a8] tabular-nums">
            0{activeStep + 1}/0{total}
          </span>
          <button
            type="button"
            aria-label="Next capability"
            onClick={() => stepTo(Math.round(targetIdxRef.current) + 1)}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-[#05070d]/90 text-sm text-[#cff2e6] transition-colors hover:border-[#10bc83]/60 active:scale-95"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

export function GenesisHeroStage() {
  const spiralTargetRef = useRef<number>(0);
  const manualInteractAtRef = useRef<number>(0);
  const [mobileDeckStep, setMobileDeckStep] = React.useState(0);
  const [mobilePhase3Active, setMobilePhase3Active] = React.useState(false);
  const handleManualInteract = React.useCallback(() => {
    manualInteractAtRef.current = performance.now();
  }, []);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dashboardPinRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const statsSectionRef = useRef<HTMLDivElement>(null);
  const gatewaySectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // 1. Entrance Choreography (intro-BlFLy4tE.js + ue() in Index-CXzxOG14.js)
    const siteHeader = document.querySelector(".site-header");
    const glowImgs = gsap.utils.toArray<HTMLElement>(".hero-glow__img");
    const heroIntroItems = heroContentRef.current
      ? gsap.utils.toArray<HTMLElement>(
          heroContentRef.current.querySelectorAll("[data-hero-item]")
        )
      : [];

    const introTl = gsap.timeline({ delay: 0.25 });
    if (!prefersReduced && window.scrollY <= 10) {
      canvas.classList.add("is-entering");
      const removeEntering = () => canvas.classList.remove("is-entering");
      canvas.addEventListener("animationend", removeEntering, { once: true });

      if (glowImgs.length) {
        introTl.fromTo(
          glowImgs,
          { autoAlpha: 0, scale: 0.9 },
          { autoAlpha: 1, scale: 1, duration: 1.0, ease: "power2.out" },
          0
        );
      }
      if (siteHeader) {
        introTl.fromTo(
          siteHeader,
          { autoAlpha: 0, y: -12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            clearProps: "transform",
          },
          0
        );
      }
      if (heroIntroItems.length) {
        introTl.fromTo(
          heroIntroItems,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "transform",
          },
          0.05
        );
      }
    }

    // 2. Three.js WebGL Globe + Water Mirror Reflection + Hologram Morph Scene (globe-DSO9VUks.js)
    let renderer: THREE.WebGLRenderer | null = null;
    let animId: number | null = null;
    let disposed = false;
    let cleanupWebGL: () => void = () => {};

    // Shared animation state driven by ScrollTrigger
    const sceneState = {
      morph: 0.0,
      globeScale: 0.9,
      globeY: -0.18,
      waterAlpha: 0.85,
      colorMix: 0.0,
      canvasOpacity: 1.0,
    };

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        powerPreference: "high-performance",
        antialias: false,
        alpha: true,
      });
      const width = window.innerWidth || 1280;
      const height = window.innerHeight || 800;
      const isMobile = width < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      renderer.setPixelRatio(dpr);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.setSize(width, height, false);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
      camera.position.set(0, 0, 5.2);

      // Camera & Globe Scale Initial Entrance (globe-DSO9VUks.js intro timeline)
      const rootGroup = new THREE.Group();
      scene.add(rootGroup);

      if (!prefersReduced && window.scrollY <= 10) {
        gsap.fromTo(
          camera.position,
          { z: 6.8, y: 0.25 },
          { z: 5.2, y: 0, duration: 1.4, ease: "power2.out", delay: 0.25 }
        );
        gsap.fromTo(
          sceneState,
          { globeScale: 0.76 },
          { globeScale: 0.92, duration: 1.4, ease: "power3.out", delay: 0.25 }
        );
      }

      // Build 3D Emerald Particle Globe with Morph Target (Hologram Core)
      const particleCount = isMobile ? 12000 : 32000;
      const geo = new THREE.BufferGeometry();
      const posArr = new Float32Array(particleCount * 3);
      const morphArr = new Float32Array(particleCount * 3);
      const randArr = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        // 1. Earth/Globe Spherical shell with continent/band clustering
        const u = Math.random();
        const v = Math.random();
        const theta = u * Math.PI * 2;
        const phi = Math.acos(2 * v - 1);
        const radius = 1.38 + (Math.random() - 0.5) * 0.04;

        const gx = radius * Math.sin(phi) * Math.cos(theta);
        const gy = radius * Math.cos(phi);
        const gz = radius * Math.sin(phi) * Math.sin(theta);

        posArr[i * 3] = gx;
        posArr[i * 3 + 1] = gy;
        posArr[i * 3 + 2] = gz;

        // 2. Morph Target: Radiant Emerald Cognitive Core / Hologram Sculpture in Phase 3
        const ringBand = i % 5;
        if (ringBand === 0) {
          // Inner dense cognitive nucleus
          const rCore = 0.55 * Math.cbrt(Math.random());
          morphArr[i * 3] = rCore * Math.sin(phi) * Math.cos(theta);
          morphArr[i * 3 + 1] = rCore * Math.cos(phi);
          morphArr[i * 3 + 2] = rCore * Math.sin(phi) * Math.sin(theta);
        } else {
          // 4 Gyroscopic orbital rings around the core
          const ringR = 0.72 + ringBand * 0.22;
          const tilt = (ringBand - 2.5) * 0.42;
          const rx = ringR * Math.cos(theta);
          const rz = ringR * Math.sin(theta);
          const ry = (Math.random() - 0.5) * 0.08 + rx * Math.sin(tilt);
          morphArr[i * 3] = rx * Math.cos(tilt);
          morphArr[i * 3 + 1] = ry;
          morphArr[i * 3 + 2] = rz;
        }

        randArr[i * 3] = Math.random();
        randArr[i * 3 + 1] = Math.random();
        randArr[i * 3 + 2] = Math.random();
      }

      geo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
      geo.setAttribute("aMorph", new THREE.BufferAttribute(morphArr, 3));
      geo.setAttribute("aRand", new THREE.BufferAttribute(randArr, 3));

      const globeUniforms = {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uColorMix: { value: 0 },
        uWaterY: { value: -1.18 },
        uPointer: { value: new THREE.Vector3(0, 0, 10) },
        uPointerActive: { value: 0 },
        uPx: { value: dpr * (height / 900) },
      };

      const globeMat = new THREE.ShaderMaterial({
        uniforms: globeUniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexShader: `
          attribute vec3 aMorph;
          attribute vec3 aRand;
          uniform float uTime;
          uniform float uMorph;
          uniform float uWaterY;
          uniform vec3 uPointer;
          uniform float uPointerActive;
          uniform float uPx;
          varying float vDepthT;
          varying float vSubmerged;
          varying float vTwinkle;

          void main() {
            vec3 basePos = mix(position, aMorph, uMorph);

            // Subtle organic wave wobble
            float wobble = sin(uTime * 1.4 + aRand.x * 6.2831) * (0.012 + uMorph * 0.025);
            basePos += normalize(basePos + vec3(0.0001)) * wobble;

            // Pointer interactive repulsion
            vec4 worldPos = modelMatrix * vec4(basePos, 1.0);
            float pDist = distance(worldPos.xyz, uPointer);
            float repulse = smoothstep(0.85, 0.0, pDist) * uPointerActive;
            worldPos.xyz += normalize(worldPos.xyz - uPointer + vec3(0.001)) * repulse * 0.22;

            vec4 mvPosition = viewMatrix * worldPos;
            gl_Position = projectionMatrix * mvPosition;

            // Depth shading (vEarthDepthT from globe-DSO9VUks.js)
            vDepthT = smoothstep(-1.45, 1.45, worldPos.z);

            // Water submersion dimming (earthSubmerged from globe-DSO9VUks.js)
            vSubmerged = smoothstep(uWaterY, uWaterY - 0.35, worldPos.y);

            vTwinkle = 0.65 + 0.35 * sin(uTime * (1.2 + aRand.y * 2.0) + aRand.z * 25.0);
            float sizeBoost = mix(1.0, 1.45, uMorph) + repulse * 1.4;
            gl_PointSize = (1.35 + aRand.x * 1.55) * sizeBoost * uPx * (5.2 / max(1.0, -mvPosition.z));
          }
        `,
        fragmentShader: `
          uniform float uColorMix;
          varying float vDepthT;
          varying float vSubmerged;
          varying float vTwinkle;

          void main() {
            vec2 d = gl_PointCoord - 0.5;
            float dist = length(d);
            if (dist > 0.5) discard;
            float mask = smoothstep(0.5, 0.0, dist);
            float core = smoothstep(0.18, 0.0, dist);

            vec3 colFar = mix(vec3(0.024, 0.13, 0.094), vec3(0.0, 0.45, 0.25), uColorMix);
            vec3 colNear = mix(vec3(0.063, 0.737, 0.514), vec3(0.22, 1.0, 0.74), uColorMix);
            vec3 col = mix(colFar, colNear, vDepthT) + vec3(core * 0.38);

            // Dim particles below the water plane
            float subDim = mix(1.0, 0.22, vSubmerged);
            float alpha = mask * mask * vTwinkle * (0.28 + 0.68 * vDepthT) * subDim;
            gl_FragColor = vec4(col * subDim, alpha);
          }
        `,
      });

      const globePoints = new THREE.Points(geo, globeMat);
      rootGroup.add(globePoints);

      // Background Ambient Star/Data Particles (bgParticles from globe-DSO9VUks.js)
      const bgCount = isMobile ? 600 : 1400;
      const bgGeo = new THREE.BufferGeometry();
      const bgPos = new Float32Array(bgCount * 3);
      for (let i = 0; i < bgCount; i++) {
        bgPos[i * 3] = (Math.random() - 0.5) * 12;
        bgPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
        bgPos[i * 3 + 2] = -1.5 - Math.random() * 4.5;
      }
      bgGeo.setAttribute("position", new THREE.BufferAttribute(bgPos, 3));
      const bgMat = new THREE.PointsMaterial({
        color: 0x10bc83,
        size: 0.022,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const bgStars = new THREE.Points(bgGeo, bgMat);
      scene.add(bgStars);

      // Water Mirror Reflection Surface (MirrorShader equivalent in globe-DSO9VUks.js)
      const waterGeo = new THREE.PlaneGeometry(16, 10, 72, 72);
      const waterUniforms = {
        uTime: globeUniforms.uTime,
        uAlpha: { value: 0.85 },
      };
      const waterMat = new THREE.ShaderMaterial({
        uniforms: waterUniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexShader: `
          uniform float uTime;
          varying vec2 vUv;
          varying float vRipple;
          void main() {
            vUv = uv;
            vec3 p = position;
            float w1 = sin(p.x * 2.8 + uTime * 1.35) * cos(p.y * 3.2 - uTime * 1.05) * 0.055;
            float w2 = sin(p.x * 5.4 - uTime * 1.9) * 0.025;
            p.z += w1 + w2;
            vRipple = w1 + w2;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uAlpha;
          varying vec2 vUv;
          varying float vRipple;
          void main() {
            vec2 c = vUv - vec2(0.5, 0.52);
            float dist = length(c * vec2(0.95, 1.55));
            float radial = smoothstep(0.46, 0.0, dist);
            float caustic = 0.5 + 0.5 * sin(dist * 52.0 - vRipple * 35.0);
            vec3 waterCol = mix(vec3(0.02, 0.16, 0.11), vec3(0.063, 0.737, 0.514), caustic * 0.75);
            float a = radial * radial * (0.12 + 0.18 * caustic) * uAlpha;
            gl_FragColor = vec4(waterCol, a);
          }
        `,
      });
      const waterMesh = new THREE.Mesh(waterGeo, waterMat);
      waterMesh.rotation.x = -Math.PI / 2;
      waterMesh.position.set(0, -1.18, 0);
      scene.add(waterMesh);

      // Scroll velocity rotation boost (exact formula from globe-DSO9VUks.js: n.rotation.y += h * (_ * s + D * b))
      let scrollDir = 1;
      let scrollBoost = 0;
      let lastScrollY = window.scrollY;
      const onScroll = () => {
        const y = window.scrollY;
        const delta = y - lastScrollY;
        if (delta > 0) scrollDir = 1;
        else if (delta < 0) scrollDir = -1;
        scrollBoost += delta;
        lastScrollY = y;
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      // Pointer raycast & parallax
      const raycaster = new THREE.Raycaster();
      const pointerNdc = new THREE.Vector2();
      const hitSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 1.45);
      const hitPoint = new THREE.Vector3();

      const onPointerMove = (e: PointerEvent) => {
        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;
        pointerNdc.x = (e.clientX / w) * 2 - 1;
        pointerNdc.y = -(e.clientY / h) * 2 + 1;

        bgStars.position.x = pointerNdc.x * 0.18;
        bgStars.position.y = pointerNdc.y * 0.12;

        raycaster.setFromCamera(pointerNdc, camera);
        if (raycaster.ray.intersectSphere(hitSphere, hitPoint)) {
          globeUniforms.uPointer.value.copy(hitPoint);
          globeUniforms.uPointerActive.value = 1;
        } else {
          globeUniforms.uPointerActive.value *= 0.85;
        }
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });

      const onResize = () => {
        if (disposed || !renderer) return;
        const w = window.innerWidth || 1280;
        const h = window.innerHeight || 800;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        globeUniforms.uPx.value = dpr * (h / 900);
      };
      window.addEventListener("resize", onResize);

      let lastT = performance.now();
      const renderLoop = () => {
        if (disposed || !renderer) return;
        animId = requestAnimationFrame(renderLoop);

        const targetOpacity =
          sceneState.canvasOpacity <= 0.005 ? 0 : sceneState.canvasOpacity;
        canvas.style.opacity = String(targetOpacity);

        if (targetOpacity === 0 || document.hidden) return;

        const now = performance.now();
        const dt = Math.min((now - lastT) / 1000, 0.05);
        lastT = now;

        globeUniforms.uTime.value += dt;
        globeUniforms.uMorph.value +=
          (sceneState.morph - globeUniforms.uMorph.value) * 0.1;
        globeUniforms.uColorMix.value +=
          (sceneState.colorMix - globeUniforms.uColorMix.value) * 0.1;
        waterUniforms.uAlpha.value +=
          (sceneState.waterAlpha - waterUniforms.uAlpha.value) * 0.1;

        rootGroup.rotation.y += dt * (scrollDir * 0.16 + scrollBoost * 0.0025);
        scrollBoost *= Math.exp(-dt * 6.0);

        rootGroup.scale.setScalar(sceneState.globeScale);
        rootGroup.position.y = sceneState.globeY;

        renderer.render(scene, camera);
      };
      animId = requestAnimationFrame(renderLoop);
      cleanupWebGL = () => {
        disposed = true;
        if (animId) cancelAnimationFrame(animId);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("resize", onResize);
        geo.dispose();
        globeMat.dispose();
        bgGeo.dispose();
        bgMat.dispose();
        waterGeo.dispose();
        waterMat.dispose();
        renderer?.dispose();
      };
    } catch {
      // Proceed cleanly with GSAP 3-phase choreography even on environments without WebGL
    }

    // 3. GSAP ScrollTrigger 3-Phase Beginning Choreography (scroll-Bq4C5b4-.js)
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const heroBars = gsap.utils.toArray<HTMLElement>(".hero-bar");
      const dashboardPin = dashboardPinRef.current;
      const heroContent = heroContentRef.current;
      const statsSection = statsSectionRef.current;
      const gatewaySection = gatewaySectionRef.current;

      // Master scrub timeline across #hero-section
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      // Phase 1 (0.0 -> 0.22): Dashboard slides down, Hero content & bars fade out, Globe rises to center
      if (dashboardPin) {
        masterTl.fromTo(
          dashboardPin,
          { y: 0, autoAlpha: 1 },
          { y: 180, autoAlpha: 0, ease: "power1.in", duration: 0.16, immediateRender: false },
          0
        );
      }
      if (heroContent) {
        masterTl.to(
          heroContent,
          { autoAlpha: 0, y: -48, duration: 0.16, ease: "power1.in" },
          0.02
        );
      }
      if (heroBars.length) {
        masterTl.to(
          heroBars,
          { autoAlpha: 0, duration: 0.12, ease: "none" },
          0.1
        );
      }
      masterTl.to(
        sceneState,
        {
          globeY: 0.05,
          globeScale: 1.02,
          duration: 0.22,
          ease: "power1.out",
        },
        0
      );

      // Phase 2 (0.22 -> 0.56): #stats-section reveals over rotating 3D Globe
      if (statsSection) {
        const statsIntroItems = statsSection.querySelectorAll(".stats-intro > *");
        const metricRows = statsSection.querySelectorAll(".metric-row");

        gsap.set(statsSection, { autoAlpha: 0 });
        gsap.set(statsIntroItems, { opacity: 0, x: -60 });
        gsap.set(metricRows, { opacity: 0, x: 60 });

        masterTl.to(
          statsSection,
          { autoAlpha: 1, duration: 0.04, ease: "none" },
          0.22
        );
        masterTl.to(
          statsIntroItems,
          {
            opacity: 1,
            x: 0,
            duration: 0.12,
            stagger: 0.02,
            ease: "power2.out",
          },
          0.24
        );
        masterTl.to(
          metricRows,
          {
            opacity: 1,
            x: 0,
            duration: 0.14,
            stagger: 0.025,
            ease: "power2.out",
          },
          0.26
        );
        // Fade out #stats-section at end of Phase 2
        masterTl.to(
          statsSection,
          { autoAlpha: 0, y: -24, duration: 0.08, ease: "power2.in" },
          0.50
        );
      }

      // Phase 3 (0.54 -> 0.92): Globe morphs into Emerald Hologram Core + #gateway-section reveals
      masterTl.to(
        sceneState,
        {
          morph: 1.0,
          colorMix: 1.0,
          globeScale: 0.92,
          waterAlpha: 0.35,
          duration: 0.22,
          ease: "power2.inOut",
        },
        0.52
      );

      if (gatewaySection) {
        const gwHeading = gatewaySection.querySelector(".gateway-heading");
        const leftCards = gatewaySection.querySelectorAll(".gateway-col-left .gateway-card");
        const rightCards = gatewaySection.querySelectorAll(".gateway-col-right .gateway-card");

        gsap.set(gatewaySection, { autoAlpha: 0 });
        if (gwHeading) gsap.set(gwHeading, { opacity: 0, y: 40 });
        gsap.set(leftCards, { opacity: 0, x: -60 });
        gsap.set(rightCards, { opacity: 0, x: 60 });

        masterTl.to(
          gatewaySection,
          { autoAlpha: 1, duration: 0.04, ease: "none" },
          0.56
        );
        if (gwHeading) {
          masterTl.to(
            gwHeading,
            { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" },
            0.58
          );
        }
        masterTl.to(
          leftCards,
          {
            opacity: 1,
            x: 0,
            duration: 0.14,
            stagger: 0.025,
            ease: "power2.out",
          },
          0.60
        );
        masterTl.to(
          rightCards,
          {
            opacity: 1,
            x: 0,
            duration: 0.14,
            stagger: 0.025,
            ease: "power2.out",
          },
          0.60
        );
      }

      // Leaving #hero-section (0.92 -> 1.0): Fade out background #globe-canvas cleanly
      masterTl.to(
        sceneState,
        {
          canvasOpacity: 0,
          globeY: 0.85,
          duration: 0.08,
          ease: "none",
        },
        0.92
      );
    });

    // Mobile & Tablet 3-Phase Choreography (<1024px): identical scrubbed 3-phase arc as desktop
    // (Rising dashboard exit -> Pinned #stats-section left/right reveal over rotating 3D Globe ->
    //  Morph into Emerald Hologram Core in #gateway-section with mobile swipe carousel -> Clean exit).
    mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      const heroBars = gsap.utils.toArray<HTMLElement>(".hero-bar");
      const dashboardPin = dashboardPinRef.current;
      const heroContent = heroContentRef.current;
      const statsSection = statsSectionRef.current;
      const gatewaySection = gatewaySectionRef.current;
      let lastScrollProg = -1;
      let phase3Open = false;

      const mobileMasterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.45,
          onUpdate: (self) => {
            const nextPhase3Open = self.progress >= 0.50 && self.progress <= 0.99;
            if (nextPhase3Open !== phase3Open) {
              phase3Open = nextPhase3Open;
              setMobilePhase3Active(nextPhase3Open);
            }
            const manualRecent = performance.now() - manualInteractAtRef.current < 900;
            if (manualRecent && Math.abs(self.progress - lastScrollProg) < 0.015) {
              return;
            }
            if (self.progress >= 0.56) {
              if (Math.abs(self.progress - lastScrollProg) > 0.0005) {
                lastScrollProg = self.progress;
                const frac = Math.min(
                  1,
                  Math.max(0, (self.progress - 0.57) / 0.33)
                );
                spiralTargetRef.current = frac * (ALL_GATEWAY_CARDS.length - 1);
              }
            } else if (lastScrollProg >= 0.56 || lastScrollProg < 0) {
              lastScrollProg = self.progress;
              spiralTargetRef.current = 0;
            }
          },
        },
      });

      // Phase 1 (0.0 -> 0.22): Rising dashboard slides down, hero copy & bars fade out, Globe rises to center
      if (dashboardPin) {
        mobileMasterTl.fromTo(
          dashboardPin,
          { y: 0, autoAlpha: 1 },
          {
            y: 160,
            autoAlpha: 0,
            ease: "power1.in",
            duration: 0.16,
            immediateRender: false,
          },
          0
        );
      }
      if (heroContent) {
        mobileMasterTl.to(
          heroContent,
          { autoAlpha: 0, y: -42, duration: 0.16, ease: "power1.in" },
          0.02
        );
      }
      if (heroBars.length) {
        mobileMasterTl.to(
          heroBars,
          { autoAlpha: 0, duration: 0.12, ease: "none" },
          0.1
        );
      }
      mobileMasterTl.to(
        sceneState,
        {
          globeY: 0.04,
          globeScale: 0.94,
          duration: 0.22,
          ease: "power1.out",
        },
        0
      );

      // Phase 2 (0.21 -> 0.56): #stats-section reveals cleanly over rotating 3D Globe
      if (statsSection) {
        const statsIntroItems = statsSection.querySelectorAll(".stats-intro > *");
        const metricRows = statsSection.querySelectorAll(".metric-row");

        gsap.set(statsSection, { autoAlpha: 0 });
        gsap.set(statsIntroItems, { opacity: 0, x: -32 });
        gsap.set(metricRows, { opacity: 0, x: 32 });

        mobileMasterTl.to(
          statsSection,
          { autoAlpha: 1, duration: 0.03, ease: "none" },
          0.21
        );
        mobileMasterTl.to(
          statsIntroItems,
          {
            opacity: 1,
            x: 0,
            duration: 0.09,
            stagger: 0.015,
            ease: "power2.out",
          },
          0.22
        );
        mobileMasterTl.to(
          metricRows,
          {
            opacity: 1,
            x: 0,
            duration: 0.08,
            stagger: 0.015,
            ease: "power2.out",
          },
          0.23
        );
        mobileMasterTl.to(
          statsSection,
          { autoAlpha: 0, y: -24, duration: 0.08, ease: "power2.in" },
          0.50
        );
      }

      // Phase 3 (0.52 -> 0.92): 3D Globe morphs to Emerald Hologram Core + #gateway-section 3D Cylindrical Spiral
      mobileMasterTl.to(
        sceneState,
        {
          morph: 1.0,
          colorMix: 1.0,
          globeScale: 0.8,
          globeY: 0.06,
          waterAlpha: 0.35,
          duration: 0.18,
          ease: "power2.inOut",
        },
        0.52
      );

      if (gatewaySection) {
        const gwHeading = gatewaySection.querySelector(".gateway-heading");
        const gwCenterTag = gatewaySection.querySelector(".gateway-mobile-core-tag");
        const gwCarousel = gatewaySection.querySelector(".gateway-carousel");

        gsap.set(gatewaySection, { autoAlpha: 0 });
        if (gwHeading) gsap.set(gwHeading, { opacity: 0, y: 24 });
        if (gwCenterTag) gsap.set(gwCenterTag, { opacity: 0, scale: 0.92 });
        if (gwCarousel) gsap.set(gwCarousel, { opacity: 0 });

        mobileMasterTl.to(
          gatewaySection,
          { autoAlpha: 1, duration: 0.03, ease: "none" },
          0.55
        );
        if (gwHeading) {
          mobileMasterTl.to(
            gwHeading,
            { opacity: 1, y: 0, duration: 0.07, ease: "power2.out" },
            0.56
          );
        }
        if (gwCenterTag) {
          mobileMasterTl.to(
            gwCenterTag,
            { opacity: 1, scale: 1, duration: 0.06, ease: "power2.out" },
            0.57
          );
        }
        if (gwCarousel) {
          mobileMasterTl.to(
            gwCarousel,
            { opacity: 1, duration: 0.07, ease: "power2.out" },
            0.57
          );
        }
      }

      // Leaving #hero-section (0.92 -> 1.0): Fade out background #globe-canvas cleanly
      mobileMasterTl.to(
        sceneState,
        {
          canvasOpacity: 0,
          globeY: 0.75,
          duration: 0.08,
          ease: "none",
        },
        0.92
      );

      return () => {
        setMobilePhase3Active(false);
        mobileMasterTl.scrollTrigger?.kill();
        mobileMasterTl.kill();
      };
    });

    return () => {
      introTl.kill();
      mm.revert();
      cleanupWebGL();
    };
  }, []);

  return (
    <>
      {/* FIXED GENESISFX 3D GLOBE + WATER MIRROR STAGE (.globe-stage) */}
      <div ref={stageRef} className="globe-stage" aria-hidden="true">
        <canvas ref={canvasRef} id="globe-canvas" />
        <span className="hero-bar hero-bar--outer" />
        <span className="hero-bar hero-bar--inner" />
        <span className="hero-bar hero-bar--inner" />
        <span className="hero-bar hero-bar--outer" />
      </div>

      {/* 3-PHASE GENESISFX BEGINNING HERO SECTION (#hero-section) */}
      <section
        ref={sectionRef}
        id="hero-section"
        aria-labelledby="hero-heading"
        className="relative isolate w-full h-[330svh] lg:h-[340vh]"
      >
        {/* Sticky Viewport Container on both Mobile & Desktop for 3-Phase Choreography */}
        <div className="sticky top-0 flex h-[100svh] w-full flex-col items-center overflow-hidden lg:h-screen">
          {/* Top Radial Emerald HeroGlow Ellipses (HeroGlow-BLVG_dxt.js) */}
          <div className="hero-glow" aria-hidden="true">
            <div className="hero-glow__img" />
            <div className="hero-glow__img hero-glow__img--lg" />
          </div>

          {/* ============================================================
              PHASE 1: CENTERED HERO CONTENT + RISING HERO DASHBOARD
              ============================================================ */}
          <div
            ref={heroContentRef}
            className="hero-content relative z-10 mx-auto flex max-w-[1060px] shrink-0 flex-col items-center px-3.5 sm:px-5 pt-0.5 sm:pt-3 pb-1 sm:pb-2 text-center lg:pt-6"
          >
            {/* GenesisFX Hero Badge */}
            <div data-hero-item className="gfx-badge mb-1.5 sm:mb-3">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#10bc83] animate-pulse" />
              <DualCopy
                as="span"
                plain="Private AI for Your Computer · 100% On-Device"
                technical="Synexis AGI-OS · 4 OS Processes · 12 Constitutional Invariants"
              />
            </div>

            {/* GenesisFX Display H1 (font-weight: 400 + .heading-gradient) */}
            <h1
              id="hero-heading"
              data-hero-item
              className="max-w-[20ch] text-[1.48rem] sm:text-[clamp(2rem,4.1vw,3.9rem)] font-normal leading-[1.06] sm:leading-[1.04] tracking-[-0.03em] heading-gradient"
            >
              Private AI that thinks, speaks, and works—only with your permission.
            </h1>

            {/* GenesisFX Hero Subtitle */}
            <div data-hero-item className="mt-1 sm:mt-3">
              <DualCopy
                className="text-[13px] sm:text-lg font-medium text-[#e8ecf5]"
                plain="Built like a vault. Effortless like a conversation."
                technical="Sub-500ms Full-Duplex Voice · System 2 DAG Compiler · 5-Stage ActionGate (INV-04)"
              />
            </div>

            {/* GenesisFX Hero Description */}
            <div data-hero-item className="mt-1 sm:mt-2">
              <DualCopy
                className="max-w-[38rem] text-[12px] sm:text-[15px] leading-[1.38] sm:leading-[1.55] text-[#a0a0a0]"
                plain="Speak naturally, automate complex work across your files and apps, and review every important action before it happens. Everything stays 100% private on your own computer."
                technical="Runs across four isolated OS process rooms with loopback-only Qdrant + SQLite WAL memory (127.0.0.1) and 30-second Ed25519 hardware-signed approval leases."
              />
            </div>

            {/* GenesisFX Hero CTA Row */}
            <div
              data-hero-item
              className="mt-2.5 sm:mt-5 grid w-full max-w-[348px] grid-cols-2 sm:flex sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-1.5 sm:gap-3.5"
            >
              <WaitlistActionButton
                tier="general"
                variant="primary"
                arrow
                className="col-span-2 w-full sm:w-auto"
              >
                Get Early Access
              </WaitlistActionButton>
              <Button
                href="#how-it-works"
                variant="secondary"
                arrow
                className="w-full sm:w-auto max-sm:!min-h-[2.3rem] max-sm:!px-2.5 max-sm:!text-[12.5px]"
              >
                See How It Works
              </Button>
              <Button
                href="/enter"
                variant="ghost"
                className="w-full sm:w-auto max-sm:!min-h-[2.3rem] max-sm:!px-2.5 max-sm:!text-[12.5px]"
              >
                <span className="sm:hidden">Open 3D Core</span>
                <span className="hidden sm:inline">Open 3D Core (/enter)</span>
              </Button>
            </div>
          </div>

          {/* Rising Hero Dashboard Showcase Pin (Single unified card on both Mobile & Desktop) */}
          <div ref={dashboardPinRef} className="hero-dashboard-pin mt-2 sm:mt-5 lg:mt-7 flex flex-col items-center">
            <div ref={dashboardRef} className="hero-dashboard gfx-frame">
              <div className="gfx-frame__highlight" aria-hidden="true">
                <div className="gfx-frame__highlight-glow" />
              </div>
              <span className="gfx-frame__top-beam" aria-hidden="true" />
              <div className="relative z-[1] overflow-hidden rounded-[1.45rem] border border-white/10 bg-[#05070d]/95 p-2.5 sm:p-4 lg:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 border-b border-white/[0.07] pb-2 sm:pb-3 mb-2 sm:mb-3.5 font-mono text-[10px] sm:text-xs text-[#a0a0a0]">
                  <span className="flex items-center gap-2 text-white">
                    <span className="h-2 w-2 rounded-full bg-[#10bc83] animate-pulse" />
                    <span className="lg:hidden">LIVE 3D CORE PREVIEW</span>
                    <span className="hidden lg:inline">
                      ELEVEN SOVEREIGN CONTROL PLANE · LIVE 3D CORE PREVIEW
                    </span>
                  </span>
                  <div className="flex items-center gap-4">
                    <ClarityTogglePill />
                    <span className="text-[#38ffbd] hidden xl:inline">
                      SCROLL TO EXPLORE 3D STAGE ↓
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-center">
                  <div className="lg:col-span-6">
                    <HeroOrbEmbed />
                  </div>
                  <div className="hidden lg:block lg:col-span-6 space-y-3 text-left">
                    <div className="rounded-xl border border-white/[0.07] bg-[#080c14] p-4">
                      <div className="font-mono text-[10px] text-[#10bc83]">
                        SYSTEM 1 + SYSTEM 2 COGNITION
                      </div>
                      <div className="mt-1 text-base font-normal heading-gradient">
                        Instant 0.42s Voice + Deep DAG Planning
                      </div>
                      <p className="mt-1 text-xs text-[#a0a0a0]">
                        While you talk naturally, background helper agents compile and verify tasks in quarantined git worktrees.
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/[0.07] bg-[#080c14] p-4">
                      <div className="font-mono text-[10px] text-[#38ffbd]">
                        5-STAGE ACTIONGATE (INV-04)
                      </div>
                      <div className="mt-1 text-base font-normal heading-gradient">
                        Ed25519 Signed Human Consent
                      </div>
                      <p className="mt-1 text-xs text-[#a0a0a0]">
                        Every high-impact action pauses for your 30-second cryptographic approval with instant one-click rollback.
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/[0.07] bg-[#080c14] p-4">
                      <div className="font-mono text-[10px] text-[#10bc83]">
                        SOVEREIGN LOCAL MEMORY (127.0.0.1)
                      </div>
                      <div className="mt-1 text-base font-normal heading-gradient">
                        4 AES-256 Encrypted Drawers On-Device
                      </div>
                      <p className="mt-1 text-xs text-[#a0a0a0]">
                        Zero cloud memory uploads—your timeline, vector index, and cryptographic receipts remain on your PC.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#38ffbd]/80 lg:hidden">
              <span className="h-1 w-1 rounded-full bg-[#38ffbd] motion-safe:animate-ping" />
              <span>Scroll to explore 3D stage ↓</span>
            </div>
          </div>

          {/* ============================================================
              PHASE 2: #stats-section PINNED REVEAL OVER 3D GLOBE
              ============================================================ */}
          <div
            ref={statsSectionRef}
            id="stats-section"
            className="pointer-events-none absolute inset-0 z-20 mx-auto flex max-w-[1280px] items-center justify-center px-4 sm:px-5 pt-12 pb-4 lg:py-12"
          >
            <div className="pointer-events-auto grid w-full grid-cols-1 items-center gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-12">
              {/* Left: .stats-intro */}
              <div className="stats-intro space-y-2.5 sm:space-y-4 text-center lg:text-left lg:col-span-5">
                <div className="flex justify-center lg:justify-start">
                  <span className="gfx-badge">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#10bc83] animate-pulse" />
                    <span>Verified Local Telemetry · Zero Cloud Egress</span>
                  </span>
                </div>
                <h2 className="text-[1.45rem] sm:text-4xl lg:text-[2.75rem] font-normal leading-[1.08] heading-gradient">
                  Engineered for instant voice and zero-trust execution.
                </h2>
                <p className="mx-auto max-w-[34rem] lg:mx-0 text-xs sm:text-base text-[#a0a0a0] leading-relaxed">
                  Every millisecond of voice latency, every quarantined git worktree, and every Ed25519 approval receipt is enforced directly on your own hardware.
                </p>
                <div className="hidden sm:flex w-full sm:w-auto flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
                  <WaitlistActionButton
                    tier="technical"
                    variant="primary"
                    arrow
                    className="w-full sm:w-auto"
                  >
                    Request Technical Access
                  </WaitlistActionButton>
                  <Button href="/architecture" variant="ghost" className="w-full sm:w-auto">
                    Read Architecture Specs
                  </Button>
                </div>
              </div>

              {/* Center Spacer so 3D Globe shines through on Desktop */}
              <div className="hidden lg:block lg:col-span-2" />

              {/* Right: 5 GenesisFX Metric Rows (.metrics) */}
              <ul className="metrics overflow-hidden divide-y divide-white/[0.08] rounded-2xl border border-white/[0.08] bg-[#05070d]/80 px-3.5 py-2.5 sm:p-4 backdrop-blur-xl lg:col-span-5">
                {STATS_METRICS.map((m) => (
                  <li
                    key={m.label}
                    className="metric-row flex items-center justify-between gap-2.5 sm:gap-3 py-2 px-0.5 sm:py-3.5 sm:px-2 first:pt-1 last:pb-1"
                  >
                    <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
                      <span className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-[#10bc83]/30 bg-[#062118]/70">
                        {m.icon}
                      </span>
                      <span className="whitespace-nowrap text-lg sm:text-3xl font-normal heading-gradient">
                        {m.value}
                      </span>
                    </div>
                    <span className="min-w-0 text-right text-[10.5px] sm:text-sm leading-snug font-normal text-[#10bc83]">
                      {m.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ============================================================
              PHASE 3: #gateway-section 6-CARD SPLIT GRID / MOBILE CAROUSEL AROUND 3D HOLOGRAM
              ============================================================ */}
          <div
            ref={gatewaySectionRef}
            id="gateway-section"
            className="pointer-events-none absolute inset-0 z-20 mx-auto flex max-w-[1360px] flex-col justify-between px-4 sm:px-5 pt-[4.75rem] pb-4 lg:justify-center lg:py-12"
          >
            <h2 className="gateway-heading mb-1 sm:mb-4 lg:mb-8 text-center text-[1.28rem] sm:text-4xl lg:text-[2.75rem] font-normal leading-[1.08] heading-gradient">
              One sovereign operating system. Six core capabilities.
            </h2>

            {/* Mobile/Tablet Core Indicator Above the Vertical 3D DNA Helix */}
            <div className="mt-0.5 mb-1 flex justify-center lg:hidden pointer-events-none">
              <div className="gateway-mobile-core-tag rounded-full border border-[#10bc83]/35 bg-[#062118]/65 px-3 py-0.5 font-mono text-[10px] tracking-[0.1em] text-[#38ffbd] backdrop-blur-md">
                3D CORE ACTIVE
              </div>
            </div>

            {/* Mobile Scroll-Driven Vertical 3D DNA Double-Helix Carousel */}
            <MobileGatewayCarousel
              targetIdxRef={spiralTargetRef}
              activeStep={mobileDeckStep}
              onActiveStepChange={setMobileDeckStep}
              isPhaseActive={mobilePhase3Active}
              onManualInteract={handleManualInteract}
            />

            {/* Desktop Split 3-Column Grid Around Morphed 3D Hologram */}
            <div className="pointer-events-auto hidden lg:grid lg:grid-cols-12 lg:items-center lg:gap-6">
              {/* Left 3 Gateway Cards */}
              <div className="gateway-col-left flex flex-col items-start gap-4 lg:col-span-5">
                {LEFT_GATEWAY_CARDS.map((card) => (
                  <GatewayCardItem key={card.key} card={card} />
                ))}
              </div>

              {/* Center Hologram Stage Window on Desktop */}
              <div className="flex lg:col-span-2 flex-col items-center justify-center text-center pointer-events-none">
                <div className="rounded-full border border-[#10bc83]/35 bg-[#062118]/60 px-3 py-1 font-mono text-[10px] text-[#38ffbd] backdrop-blur-md">
                  3D CORE ACTIVE
                </div>
              </div>

              {/* Right 3 Gateway Cards */}
              <div className="gateway-col-right flex flex-col items-end gap-4 lg:col-span-5">
                {RIGHT_GATEWAY_CARDS.map((card) => (
                  <GatewayCardItem key={card.key} card={card} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
