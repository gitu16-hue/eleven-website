"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { Button } from "@/components/ui/Button";
import { usePortalTransition } from "@/components/ui/PortalTransition";
import { ClarityTogglePill, useMountedReducedMotion } from "@/components/motion/PremiumMotion";
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
  const [condensed, setCondensed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { enterComputationalMode } = usePortalTransition();
  const prevOverflowRef = useRef<string>("");
  const navRef = useRef<HTMLDivElement>(null);
  const glowFollowRef = useRef<HTMLSpanElement>(null);

  // GenesisFX scroll-condensed header (>80px scroll down condenses wings & scales center pill)
  useEffect(() => {
    let lastY = window.scrollY || document.documentElement.scrollTop || 0;
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setScrolled(y > 24);
      if (y <= 80) {
        setCondensed(false);
      } else if (y > lastY + 4) {
        setCondensed(true);
      } else if (y < lastY - 6) {
        setCondensed(false);
      }
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // GenesisFX GSAP quickTo pointer-following emerald glow inside .site-nav
  useEffect(() => {
    const navEl = navRef.current;
    const glowEl = glowFollowRef.current;
    if (!navEl || !glowEl) return;

    const getActiveOffset = () => {
      const activeItem = navEl.querySelector<HTMLElement>("[data-nav-active='true']");
      if (!activeItem) return 0;
      const navRect = navEl.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      return itemRect.left + itemRect.width / 2 - (navRect.left + navRect.width / 2);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(glowEl, { x: getActiveOffset() });
    if (reduced) return;

    const moveX = gsap.quickTo(glowEl, "x", { duration: 0.5, ease: "power3" });

    const onPointerMove = (e: PointerEvent) => {
      const rect = navEl.getBoundingClientRect();
      moveX(e.clientX - (rect.left + rect.width / 2));
    };
    const onPointerLeave = () => {
      moveX(getActiveOffset());
    };

    navEl.addEventListener("pointermove", onPointerMove);
    navEl.addEventListener("pointerleave", onPointerLeave);
    return () => {
      navEl.removeEventListener("pointermove", onPointerMove);
      navEl.removeEventListener("pointerleave", onPointerLeave);
      gsap.killTweensOf(glowEl);
    };
  }, [pathname]);

  // Body scroll lock for mobile drawer
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

  useEffect(() => {
    queueMicrotask(() => {
      setOpen(false);
      document.body.style.overflow = prevOverflowRef.current || "";
      document.documentElement.style.overflow = "";
    });
  }, [pathname]);

  useEffect(() => {
    const handlePopState = () => {
      setOpen(false);
      document.body.style.overflow = prevOverflowRef.current || "";
      document.documentElement.style.overflow = "";
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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
    if ("addEventListener" in mql) mql.addEventListener("change", handleMediaChange);
    return () => {
      if ("removeEventListener" in mql) mql.removeEventListener("change", handleMediaChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleNavClick = useCallback(
    (href: string, e?: React.MouseEvent) => {
      document.body.style.overflow = prevOverflowRef.current || "";
      document.documentElement.style.overflow = "";
      setOpen(false);
      if (pathname === href && e) {
        e.preventDefault();
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    },
    [pathname]
  );

  const reducedMotion = useMountedReducedMotion();

  return (
    <header
      className={`site-header sticky top-0 z-50 transition-[padding,transform,background-color] duration-300 ${
        condensed && !open ? "is-condensed" : ""
      } ${scrolled && !open ? "is-scrolled" : ""}`}
    >
      {/* Full-screen backdrop scrim behind open mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.22 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 -z-10 bg-[#020408]/75 backdrop-blur-md lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className="mx-auto flex max-w-[1380px] items-center justify-between gap-4 lg:grid lg:grid-cols-[1fr_max-content_1fr]">
        {/* Brand Left */}
        <div className="site-header__brand flex items-center gap-3 justify-self-start">
          <Link
            href="/"
            scroll={true}
            onClick={(e) => handleNavClick("/", e)}
            className="group flex items-center gap-2.5 shrink-0 transition-opacity duration-150 hover:opacity-85 rounded-full focus-visible:outline-2 focus-visible:outline-[#00b38c]"
          >
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-white/15 bg-[#0c1311] p-1">
              <Image
                src="/gishh-logo-icon.png"
                alt="GISHH Labs"
                width={32}
                height={32}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-normal tracking-[0.06em] text-[#e8ecf5]">
                ELEVEN
              </span>
              <span className="rounded-full border border-white/15 bg-[#021b13]/80 px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-[#cff2e6]">
                v3.1
              </span>
            </div>
          </Link>
        </div>

        {/* Center Floating Glass Pill Navigation (Desktop) */}
        <nav
          ref={navRef}
          aria-label="Primary"
          className="site-nav hidden lg:flex justify-self-center"
        >
          <span className="site-nav__glow-clip" aria-hidden="true">
            <span ref={glowFollowRef} className="site-nav__glow-follow">
              <span className="site-nav__glow block" />
            </span>
          </span>

          {desktopLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                scroll={true}
                onClick={(e) => handleNavClick(link.href, e)}
                data-nav-active={isActive ? "true" : undefined}
                className={`relative z-10 flex items-center px-3.5 text-[14px] font-normal whitespace-nowrap rounded-full transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#00b38c] ${
                  isActive
                    ? "text-white"
                    : "text-[#c4c4c4] hover:text-[#e8ecf5]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions (Desktop) */}
        <div className="site-header__actions hidden lg:flex items-center gap-2.5 justify-self-end">
          <AiCommandPalette />
          <div className="hidden 2xl:block">
            <ClarityTogglePill />
          </div>
          <Button
            type="button"
            variant="ghost"
            className="!h-[2.45rem] !px-4 !text-[13.5px]"
            onClick={enterComputationalMode}
          >
            Enter ELEVEN
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex flex-col items-center justify-center gap-1.5 p-2.5 min-w-[44px] min-h-[44px] lg:hidden cursor-pointer rounded-full border border-white/15 bg-[#121212]/70 backdrop-blur-xl active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-[#00b38c]"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <motion.span
            animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.18 }}
            className="h-[1.5px] w-5 rounded-full bg-[#e8ecf5]"
          />
          <motion.span
            animate={{ opacity: open ? 0 : 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.12 }}
            className="h-[1.5px] w-5 rounded-full bg-[#e8ecf5]"
          />
          <motion.span
            animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.18 }}
            className="h-[1.5px] w-5 rounded-full bg-[#e8ecf5]"
          />
        </button>
      </div>

      {/* GenesisFX Portrait Glassmorphic Mobile Menu Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.985 }}
            transition={{
              duration: reducedMotion ? 0 : 0.28,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-3 mx-auto max-w-[1380px] overflow-hidden rounded-[1.35rem] border border-white/12 bg-[#05070d]/95 backdrop-blur-2xl lg:hidden max-h-[calc(100dvh-5.5rem)] overflow-y-auto pb-safe shadow-[0_24px_60px_rgba(0,0,0,0.85)]"
          >
            <div className="px-5 pt-4 pb-3 border-b border-white/[0.07] flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-[#7c8c86]">
                  Explanation depth
                </p>
              </div>
              <ClarityTogglePill />
            </div>

            <ul className="flex flex-col px-3.5 py-2.5 gap-1">
              {mobileLinks.map((link, idx) => {
                const isActive = pathname === link.href;
                return (
                  <motion.li
                    key={link.href}
                    initial={reducedMotion ? false : { opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: reducedMotion ? 0 : 0.04 + idx * 0.03,
                      duration: reducedMotion ? 0 : 0.24,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      scroll={true}
                      onClick={(e) => handleNavClick(link.href, e)}
                      className={`flex min-h-[46px] items-center justify-between rounded-full px-4 text-[15px] font-normal transition-all active:scale-[0.985] ${
                        isActive
                          ? "border border-[#10bc83]/45 bg-[#021b13]/90 text-white shadow-[0_0_18px_rgba(16,188,131,0.16)]"
                          : "text-[#c4c4c4] hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`font-mono text-[10px] tabular-nums ${
                            isActive ? "text-[#38ffbd]" : "text-[#586862]"
                          }`}
                        >
                          0{idx + 1}
                        </span>
                        <span>{link.label}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#38ffbd] shadow-[0_0_8px_#38ffbd]" />
                        )}
                        <span className="text-[#10bc83] text-xs">→</span>
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            <div className="px-4 pb-4 pt-3 flex flex-col gap-2 border-t border-white/[0.07]">
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
                className="w-full"
              >
                Enter ELEVEN 3D Core
              </Button>
              <button
                type="button"
                onClick={() => {
                  document.body.style.overflow = "";
                  document.documentElement.style.overflow = "";
                  setOpen(false);
                  window.dispatchEvent(new CustomEvent("eleven:open-command-palette"));
                }}
                className="w-full min-h-[44px] cursor-pointer flex items-center justify-between rounded-full border border-white/15 bg-white/[0.03] px-5 text-xs text-[#e8ecf5] transition-all active:scale-[0.985] hover:border-[#00b38c]"
              >
                <span>AI Command Palette</span>
                <span className="rounded-full bg-[#021b13] px-2 py-0.5 text-[10px] text-[#10bc83] font-mono">
                  ⌘K
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
