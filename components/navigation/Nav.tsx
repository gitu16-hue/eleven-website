"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { usePortalTransition } from "@/components/ui/PortalTransition";
import { ClarityTogglePill } from "@/components/motion/PremiumMotion";

const links = [
  { href: "/eleven", label: "How It Thinks" },
  { href: "/architecture", label: "How It Works" },
  { href: "/autonomy", label: "Safety & Control" },
  { href: "/research", label: "Our Promises" },
];

export function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { enterComputationalMode } = usePortalTransition();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        solid || open
          ? "bg-el-bg/88 backdrop-blur-xl border-b border-el-border/80 shadow-el-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 lg:px-10 lg:py-4.5">
        {/* Brand with GISHH Labs Emblem & ELEVEN v3 Identity */}
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity duration-[var(--el-duration-fast)] hover:opacity-85"
        >
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-sm border border-el-border-strong/50 bg-el-bg-raised p-0.5 shadow-el-sm transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/gishh-logo.png"
              alt="GISHH Labs"
              width={32}
              height={32}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-el-sm font-semibold tracking-[0.06em] text-el-fg">
                ELEVEN
              </span>
              <span className="border border-el-border-strong/70 bg-el-bg-raised px-1.5 py-0.2 font-mono text-[9px] tracking-[0.08em] text-el-fg-muted">
                v3.1
              </span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-el-fg-faint">
              GISHH LABS · PERSONAL AI
            </span>
          </div>
        </Link>

        {/* Desktop Nav with Active Pill Indicator */}
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative rounded-full px-3.5 py-1.5 text-el-sm transition-colors duration-200 ${
                    isActive
                      ? "font-medium text-el-fg"
                      : "text-el-fg-muted hover:text-el-fg"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full bg-el-border/55"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Controls: Simple/Engineer Toggle + Launch 3D Experience */}
        <div className="hidden items-center gap-3 md:flex">
          <ClarityTogglePill />
          <Button
            type="button"
            variant="ghost"
            arrow
            className="cursor-pointer"
            onClick={enterComputationalMode}
          >
            Live 3D Orb
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex flex-col gap-1.5 p-2 md:hidden"
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
            className="overflow-hidden border-t border-el-border/80 bg-el-bg/95 backdrop-blur-xl lg:hidden"
          >
            <div className="px-6 pt-5 pb-2">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-el-fg-faint">
                Explanation Style
              </p>
              <ClarityTogglePill />
            </div>

            <ul className="flex flex-col px-6 py-4">
              {links.map((link) => (
                <li
                  key={link.href}
                  className="border-b border-el-border/60 py-4 last:border-0"
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block text-el-base ${
                      pathname === link.href
                        ? "font-medium text-el-fg"
                        : "text-el-fg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-5">
                <Button
                  type="button"
                  variant="primary"
                  arrow
                  onClick={() => {
                    setOpen(false);
                    enterComputationalMode();
                  }}
                >
                  Open Live 3D Orb
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
