"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/Section";
import { usePortalTransition } from "@/components/ui/PortalTransition";
import {
  DualCopy,
  useClarityMode,
  useMountedReducedMotion,
} from "@/components/motion/PremiumMotion";
import { Button } from "@/components/ui/Button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const columns = [
  {
    heading: "Core Platform",
    links: [
      { href: "/", label: "Overview" },
      { href: "/eleven", label: "How It Thinks" },
      { href: "/dashboard", label: "Voyage Pipeline Tracker" },
      { href: "/benchmarks/voice-latency", label: "Voice Latency (<0.5s)" },
      { href: "/enter", label: "3D Visualizer Core" },
      { href: "/presentation.html", label: "Executive Deck (16:9)" },
    ],
  },
  {
    heading: "Architecture & Specs",
    links: [
      { href: "/solutions", label: "Solutions Overview" },
      { href: "/architecture", label: "How It Works" },
      { href: "/solutions/developers", label: "For Software Engineers" },
      { href: "/solutions/enterprise", label: "Enterprise Sovereign Fleet" },
      { href: "/tools/dag-visualizer", label: "System 2 DAG Orchestrator" },
      { href: "/tools/inspector", label: "ActionProposal Inspector" },
      { href: "/docs", label: "Developer Blueprints & Specs" },
      { href: "/architecture#rooms", label: "4 Execution Rooms" },
      { href: "/autonomy", label: "Safety & Control" },
    ],
  },
  {
    heading: "Governance & Safety",
    links: [
      { href: "/security", label: "Security & Threat Model" },
      { href: "/autonomy#policy-gates", label: "5 Policy Checkpoints" },
      { href: "/research", label: "Our Promises" },
      { href: "/research#rules", label: "15 Invariant Rules" },
      { href: "/style-guide", label: "Design System" },
    ],
  },
  {
    heading: "Sovereignty & Trust",
    links: [
      { href: "/compare/cloud-vs-local", label: "Local vs Cloud Comparison" },
      { href: "/hardware", label: "Hardware Sizing & Benchmarks" },
      { href: "/tools/vault-calculator", label: "Vault Storage Estimator" },
      { href: "/research#audit-trail", label: "Cryptographic Receipts" },
      { href: "/eleven#memory-drawers", label: "Private Memory Vault" },
      { href: "/autonomy#killswitch", label: "Emergency Stop (<0.05s)" },
      { href: "https://gishh.com", label: "GISHH Labs" },
    ],
  },
];

export function Footer() {
  const { enterComputationalMode } = usePortalTransition();
  const { mode } = useClarityMode();
  const pathname = usePathname();
  const isPlain = mode === "plain";
  const reducedMotion = useMountedReducedMotion();
  const [openMobileCol, setOpenMobileCol] = useState<string | null>("Core Platform");

  const footerRef = useRef<HTMLElement>(null);
  const topRowRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footerEl = footerRef.current;
    if (!footerEl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktopCols = window.matchMedia("(min-width: 640px)").matches;
    const navColsParent = topRowRef.current?.children[isDesktopCols ? 1 : 2] as HTMLElement | undefined;
    const cols = topRowRef.current
      ? [
          topRowRef.current.children[0] as HTMLElement,
          ...(navColsParent ? (Array.from(navColsParent.children) as HTMLElement[]) : []),
        ].filter(Boolean)
      : [];
    const cards = cardsRef.current
      ? (Array.from(cardsRef.current.children) as HTMLElement[])
      : [];
    const watermark = watermarkRef.current;

    if (reduced) {
      if (cols.length) gsap.set(cols, { opacity: 1, y: 0 });
      if (cards.length) gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
      if (watermark) gsap.set(watermark, { opacity: 1, y: 0 });
      return;
    }

    const timelines: gsap.core.Timeline[] = [];

    if (cols.length && topRowRef.current) {
      const tlCols = gsap.timeline({
        scrollTrigger: {
          trigger: topRowRef.current,
          start: "top 92%",
          end: "bottom top",
          toggleActions: "play none none reverse",
        },
      });
      tlCols.fromTo(
        cols,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.78, stagger: 0.08, ease: "power3.out" }
      );
      timelines.push(tlCols);
    }

    if (cards.length && cardsRef.current) {
      const tlCards = gsap.timeline({
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 94%",
          end: "bottom top",
          toggleActions: "play none none reverse",
        },
      });
      tlCards.fromTo(
        cards,
        { opacity: 0, y: 34, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.72,
          stagger: { each: 0.1, from: "center" },
          ease: "power2.out",
        }
      );
      timelines.push(tlCards);
    }

    if (watermark) {
      const tlWatermark = gsap.timeline({
        scrollTrigger: {
          trigger: watermark,
          start: "top 96%",
          end: "bottom top",
          toggleActions: "play none none reverse",
        },
      });
      tlWatermark.fromTo(
        watermark,
        { opacity: 0, y: 52 },
        { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" }
      );
      timelines.push(tlWatermark);
    }

    const syncVisible = () => {
      for (const tl of timelines) {
        const triggerEl = tl.scrollTrigger?.trigger as HTMLElement | undefined;
        if (triggerEl && triggerEl.getBoundingClientRect().top <= window.innerHeight * 0.96) {
          tl.progress(1);
        }
      }
    };
    const raf = requestAnimationFrame(syncVisible);
    ScrollTrigger.addEventListener("refresh", syncVisible);

    return () => {
      cancelAnimationFrame(raf);
      ScrollTrigger.removeEventListener("refresh", syncVisible);
      for (const tl of timelines) {
        tl.scrollTrigger?.kill();
        tl.kill();
      }
    };
  }, [pathname]);

  const handleFooterLinkClick = (href: string, e: React.MouseEvent) => {
    if (pathname === href) {
      e.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  };

  const platformSpecs = [
    {
      kicker: "Two Minds",
      value: isPlain ? "Quick Voice + Deep Planner" : "F.R.I.D.A.Y. · J.A.R.V.I.S.",
      tag: "01",
    },
    {
      kicker: "Safety Gates",
      value: isPlain ? "5 Automatic Checkpoints" : "5-Stage Control Plane",
      tag: "02",
    },
    {
      kicker: "Approvals",
      value: isPlain ? "Honest 30s One-Time Pass" : "DEC-008 Nonce · SHA-256",
      tag: "03",
    },
    {
      kicker: "Local Memory",
      value: isPlain ? "100% Private on Your PC" : "Redis · Neo4j · Qdrant",
      tag: "04",
    },
  ];

  return (
    <footer
      ref={footerRef}
      className="site-footer relative w-full overflow-hidden border-t border-white/[0.07] bg-[#05070d] text-[#e8ecf5]"
    >
      {/* GenesisFX Centered Emerald Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[48%] h-[320px] w-[min(92vw,840px)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 blur-[90px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(16, 188, 131, 0.32), rgba(16, 188, 131, 0) 70%)",
        }}
      />

      <Container className="relative z-10 pt-12 pb-8 sm:pt-20 sm:pb-10 lg:pt-24">
        {/* Top Row: Brand Left + Columns Right */}
        <div
          ref={topRowRef}
          className="flex flex-col justify-between gap-8 sm:gap-14 lg:flex-row lg:gap-12"
        >
          {/* Brand Column */}
          <div className="max-w-[380px]">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/15 bg-[#0c1311] p-1">
                <Image
                  src="/gishh-logo-icon.png"
                  alt="GISHH Labs"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#10bc83]">
                  ELEVEN v3.1 · GISHH Labs
                </p>
                <p className="text-lg font-normal tracking-tight text-[#e8ecf5]">
                  Brilliant AI. Always Under Control.
                </p>
              </div>
            </div>

            <DualCopy
              className="mt-4 sm:mt-5 text-[14.5px] sm:text-[15px] leading-[1.5] text-[#a0a0a0]"
              plain="Talk naturally, get deep work done in the background, keep your memories private on your own computer, and approve important actions before they happen."
              technical="Frontier intelligence. Human-owned authority. A local-first control plane separating untrusted model reasoning from deterministic real-world execution."
            />

            <div className="mt-5 sm:mt-7">
              <Button
                type="button"
                variant="primary"
                arrow
                onClick={enterComputationalMode}
                className="w-full sm:w-auto"
              >
                Enter ELEVEN 3D Core
              </Button>
            </div>
          </div>

          {/* Desktop/Tablet 4-Column GenesisFX Footer Nav (#10bc83 emerald headings) */}
          <div className="hidden sm:grid sm:grid-cols-4 sm:gap-8 lg:gap-10">
            {columns.map((col) => (
              <div key={col.heading}>
                <p className="mb-3 sm:mb-4 text-[13.5px] font-normal text-[#10bc83]">
                  {col.heading}
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  {col.links.map((l) => {
                    const isExternal = l.href.startsWith("https://");
                    return (
                      <li key={l.label}>
                        {isExternal ? (
                          <a
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block py-0.5 lg:py-0 text-[13.5px] font-normal leading-snug text-[#8a8a8a] transition-colors duration-150 hover:text-[#e8ecf5] focus-visible:outline-2 focus-visible:outline-[#00b38c] rounded-xs"
                          >
                            {l.label}
                          </a>
                        ) : (
                          <Link
                            href={l.href}
                            scroll={true}
                            onClick={(e) => handleFooterLinkClick(l.href, e)}
                            className="inline-block py-0.5 lg:py-0 text-[13.5px] font-normal leading-snug text-[#8a8a8a] transition-colors duration-150 hover:text-[#e8ecf5] focus-visible:outline-2 focus-visible:outline-[#00b38c] rounded-xs"
                          >
                            {l.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile Accordion Navigation (< 640px) — Keeps footer compact and scannable */}
          <div className="sm:hidden border-t border-b border-white/[0.08] divide-y divide-white/[0.08]">
            {columns.map((col) => {
              const isOpen = openMobileCol === col.heading;
              const panelId = `footer-acc-${col.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
              return (
                <div key={col.heading}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() =>
                      setOpenMobileCol((prev) => (prev === col.heading ? null : col.heading))
                    }
                    className="flex min-h-[48px] w-full items-center justify-between gap-3 py-3 text-left active:opacity-80 cursor-pointer"
                  >
                    <span className="text-[13.5px] font-medium text-[#10bc83]">
                      {col.heading}
                    </span>
                    <span className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] text-[#686868]">
                        {String(col.links.length).padStart(2, "0")}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/10 text-xs text-[#a0a0a0] transition-transform duration-200 ${
                          isOpen ? "rotate-45 border-[#10bc83]/45 text-[#10bc83]" : ""
                        }`}
                      >
                        +
                      </span>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.ul
                        id={panelId}
                        initial={reducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{
                          duration: reducedMotion ? 0 : 0.24,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="overflow-hidden pb-3.5 space-y-1.5"
                      >
                        {col.links.map((l) => {
                          const isExternal = l.href.startsWith("https://");
                          return (
                            <li key={l.label}>
                              {isExternal ? (
                                <a
                                  href={l.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex min-h-[36px] items-center text-[13.5px] font-normal text-[#9a9a9a] active:text-[#e8ecf5] focus-visible:outline-2 focus-visible:outline-[#00b38c] rounded-xs"
                                >
                                  {l.label}
                                </a>
                              ) : (
                                <Link
                                  href={l.href}
                                  scroll={true}
                                  onClick={(e) => handleFooterLinkClick(l.href, e)}
                                  className="flex min-h-[36px] items-center text-[13.5px] font-normal text-[#9a9a9a] active:text-[#e8ecf5] focus-visible:outline-2 focus-visible:outline-[#00b38c] rounded-xs"
                                >
                                  {l.label}
                                </Link>
                              )}
                            </li>
                          );
                        })}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* GenesisFX Platform Cards Row */}
        <div
          ref={cardsRef}
          className="mt-8 sm:mt-14 grid grid-cols-1 gap-2.5 sm:gap-3.5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {platformSpecs.map((spec) => (
            <div key={spec.kicker} className="platform-card">
              <span className="platform-card__fill" aria-hidden="true" />
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#00b38c]/35 bg-[#021b13] font-mono text-[11px] text-[#10bc83]">
                {spec.tag}
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-[12px] font-normal text-[#a0a0a0]">
                  {spec.kicker}
                </span>
                <span className="mt-0.5 text-[14px] font-medium text-white">
                  {spec.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Giant Full-Width Edge-to-Edge GenesisFX Typographic Watermark */}
        <div
          ref={watermarkRef}
          aria-hidden="true"
          className="pointer-events-none select-none mt-8 sm:mt-12 -mb-2 sm:-mb-4 flex justify-center overflow-hidden"
        >
          <span
            className="block w-full text-center font-normal leading-[0.82] tracking-[-0.045em]"
            style={{
              fontSize: "clamp(4.5rem, 19vw, 17.5rem)",
              background:
                "linear-gradient(180deg, rgba(232, 236, 245, 0.14) 0%, rgba(16, 188, 131, 0.04) 68%, rgba(5, 7, 13, 0) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ELEVEN
          </span>
        </div>

        {/* Bottom Legal & Disclosure */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-[#686868]">
            © {new Date().getFullYear()} GISHH Labs Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-xs text-[#686868]">
            Local-First Sovereign Control Plane · Your AI, Your Rules
          </p>
        </div>
      </Container>
    </footer>
  );
}
