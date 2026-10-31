"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { usePortalTransition } from "@/components/ui/PortalTransition";
import { ClarityTogglePill } from "@/components/motion/PremiumMotion";
import { AiCommandPalette } from "@/components/navigation/AiCommandPalette";

const desktopLinks = [
  { href: "/eleven", label: "How It Thinks" },
  { href: "/architecture", label: "Architecture" },
  { href: "/dashboard", label: "Control Plane" },
  { href: "/autonomy", label: "Safety" },
  { href: "/solutions/developers", label: "Developers" },
  { href: "/research", label: "Research" },
  { href: "/docs", label: "Docs" },
];

const mobileLinks = [
  { href: "/eleven", label: "How It Thinks" },
  { href: "/architecture", label: "Architecture" },
  { href: "/dashboard", label: "Control Plane" },
  { href: "/autonomy", label: "Safety & Control" },
  { href: "/solutions/developers", label: "Developers" },
  { href: "/research", label: "Our Promises" },
  { href: "/docs", label: "Docs" },
];

export function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const pathname = usePathname();
  const { enterComputationalMode } = usePortalTransition();
  const prevOverflowRef = useRef<string>("");

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Safe overflow management: preserve previous style and reliably restore on unmount/close
  useEffect(() => {
    if (open) {
      prevOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prevOverflowRef.current || "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = prevOverflowRef.current || "";
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Close drawer on route change
  useEffect(() => {
    queueMicrotask(() => {
      setOpen(false);
      document.body.style.overflow = prevOverflowRef.current || "";
      document.documentElement.style.overflow = "";
    });
  }, [pathname]);

  // Handle browser back/forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      setOpen(false);
      document.body.style.overflow = prevOverflowRef.current || "";
      document.documentElement.style.overflow = "";
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Viewport breakpoint listener: close mobile drawer when crossing into desktop breakpoint (1024px lg)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(min-width: 1024px)");

    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setOpen(false);
        document.body.style.overflow = prevOverflowRef.current || "";
        document.documentElement.style.overflow = "";
      }
    };

    if (mql.matches && open) {
      queueMicrotask(() => {
        setOpen(false);
        document.body.style.overflow = prevOverflowRef.current || "";
        document.documentElement.style.overflow = "";
      });
    }

    if ("addEventListener" in mql) {
      mql.addEventListener("change", handleMediaChange);
    } else {
      // @ts-expect-error - legacy MediaQueryList fallback
      mql.addListener(handleMediaChange);
    }

    return () => {
      if ("removeEventListener" in mql) {
        mql.removeEventListener("change", handleMediaChange);
      } else {
        // @ts-expect-error - legacy MediaQueryList fallback
        mql.removeListener(handleMediaChange);
      }
    };
  }, [open]);

  // Escape key handler for keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleNavClick = useCallback((href: string, e?: React.MouseEvent) => {
    // 1. Immediately release body overflow so mobile viewport can freely jump to top
    document.body.style.overflow = prevOverflowRef.current || "";
    document.documentElement.style.overflow = "";
    setOpen(false);

    // 2. If clicking on the current route (e.g. user tapped "Architecture" while already on /architecture)
    if (pathname === href) {
      if (e) {
        e.preventDefault();
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      return;
    }

    // 3. For standard route transitions, enforce immediate top scroll coordinate
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        solid || open
          ? "bg-el-bg/88 backdrop-blur-xl border-b border-el-border/80 shadow-el-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1340px] items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8 lg:py-4">
        {/* Brand with GISHH Labs Emblem & ELEVEN v3 Identity */}
        <Link
          href="/"
          scroll={true}
          onClick={(e) => handleNavClick("/", e)}
          className="group flex items-center gap-2.5 shrink-0 transition-opacity duration-[var(--el-duration-fast)] hover:opacity-85"
        >
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-sm border border-el-border-strong/50 bg-el-bg-raised p-0.5 shadow-el-sm transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/gishh-logo-icon.png"
              alt="GISHH Labs"
              width={32}
              height={32}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-el-sm font-semibold tracking-[0.06em] text-el-fg">
                ELEVEN
              </span>
              <span className="border border-el-border-strong/70 bg-el-bg-raised px-1.5 py-0.2 font-mono text-[9px] tracking-[0.08em] text-el-fg-muted">
                v3.1
              </span>
            </div>
            <span className="hidden xl:block font-mono text-[9px] uppercase tracking-[0.14em] text-el-fg-faint">
              GISHH LABS · PERSONAL AI
            </span>
          </div>
        </Link>

        {/* Desktop Nav with Active + Gliding Hover Pill Indicator */}
        <ul
          onMouseLeave={() => setHoveredHref(null)}
          className="hidden items-center gap-0.5 xl:gap-1 lg:flex shrink-0"
        >
          {desktopLinks.map((link) => {
            const isActive = pathname === link.href;
            const isHovered = hoveredHref === link.href;
            return (
              <li key={link.href} className="shrink-0">
                <Link
                  href={link.href}
                  scroll={true}
                  onClick={(e) => handleNavClick(link.href, e)}
                  onMouseEnter={() => setHoveredHref(link.href)}
                  onFocus={() => setHoveredHref(link.href)}
                  className={`relative block rounded-full px-2.5 py-1.5 text-xs xl:px-3 xl:text-[13px] whitespace-nowrap transition-colors duration-200 shrink-0 ${
                    isActive
                      ? "font-medium text-el-fg"
                      : "text-el-fg-muted hover:text-el-fg"
                  }`}
                >
                  {isHovered && !isActive && (
                    <motion.span
                      layoutId="hoverNavIndicator"
                      className="pointer-events-none absolute inset-0 rounded-full bg-el-bg-raised/85 border border-el-border/70"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="pointer-events-none absolute inset-0 rounded-full bg-el-border/60 border border-el-accent/25"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Controls: AI Command Palette + Simple/Engineer Toggle (2xl+) + Launch 3D Experience */}
        <div className="hidden items-center gap-2 xl:gap-2.5 lg:flex shrink-0">
          <AiCommandPalette />
          <div className="hidden 2xl:block">
            <ClarityTogglePill />
          </div>
          <Button
            type="button"
            variant="ghost"
            arrow
            className="cursor-pointer whitespace-nowrap"
            onClick={enterComputationalMode}
          >
            Live 3D Orb
          </Button>
        </div>

        {/* Mobile Hamburger (Synchronized with lg breakpoint) */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex flex-col items-center justify-center gap-1.5 p-2.5 min-w-[44px] min-h-[44px] lg:hidden cursor-pointer"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <motion.span
            animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
            transition={{ duration: 0.18 }}
            className="h-px w-5 bg-el-fg"
          />
          <motion.span
            animate={{ opacity: open ? 0 : 1 }}
            transition={{ duration: 0.12 }}
            className="h-px w-5 bg-el-fg"
          />
          <motion.span
            animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
            transition={{ duration: 0.18 }}
            className="h-px w-5 bg-el-fg"
          />
        </button>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-el-border/80 bg-el-bg/95 backdrop-blur-xl lg:hidden max-h-[calc(100dvh-5rem)] overflow-y-auto pb-safe"
          >
            <div className="px-6 pt-5 pb-2">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-el-fg-faint">
                Explanation Style
              </p>
              <ClarityTogglePill />
            </div>

            <ul className="flex flex-col px-6 py-4">
              {mobileLinks.map((link) => (
                <li
                  key={link.href}
                  className="border-b border-el-border/60 py-3.5 last:border-0"
                >
                  <Link
                    href={link.href}
                    scroll={true}
                    onClick={(e) => handleNavClick(link.href, e)}
                    className={`block min-h-[44px] flex items-center text-el-base ${
                      pathname === link.href
                        ? "font-medium text-el-fg"
                        : "text-el-fg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-5 flex flex-col gap-2.5">
                <Button
                  type="button"
                  variant="primary"
                  arrow
                  onClick={() => {
                    document.body.style.overflow = "";
                    document.documentElement.style.overflow = "";
                    setOpen(false);
                    enterComputationalMode();
                  }}
                >
                  Open Live 3D Orb
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    document.body.style.overflow = "";
                    document.documentElement.style.overflow = "";
                    setOpen(false);
                    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
                  }}
                  className="w-full min-h-[44px] cursor-pointer flex items-center justify-between rounded-xs border border-el-border-strong bg-el-bg-raised px-4 py-2.5 font-mono text-el-xs text-el-fg transition-colors hover:border-el-accent hover:text-el-accent"
                >
                  <span>AI Command Palette</span>
                  <span className="rounded-xs bg-el-bg px-1.5 py-0.5 text-[10px] text-el-accent">⌘K</span>
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
