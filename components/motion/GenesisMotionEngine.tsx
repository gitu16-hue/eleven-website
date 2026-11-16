"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * GenesisSmoothScroll — Lenis smooth scrolling synchronized with GSAP ScrollTrigger.
 * Matches Genesis FX Markets scroll physics (lerp 0.1, smoothWheel, reduced-motion safe).
 */
export function GenesisSmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 0.95,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    ScrollTrigger.refresh();
  }, [pathname]);

  return <>{children}</>;
}

/**
 * GenesisHeroIntro — Orchestrated above-the-fold stagger matching GenesisFX intro.js:
 * 0.3s delay, children stagger 0.08s, y: 24 -> 0, duration: 0.8s, ease: "power3.out".
 */
export function GenesisHeroIntro({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = gsap.utils.toArray<HTMLElement>(el.children);
    if (!items.length) return;

    if (reduced || window.scrollY > 10) {
      gsap.set(items, { autoAlpha: 1, y: 0, clearProps: "transform" });
      return;
    }

    const tl = gsap.timeline({ delay: 0.18 });
    tl.fromTo(
      items,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform",
      }
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * GenesisSectionIntro — Section-intro staggered reveal matching GenesisFX reveal.js:
 * children rise vertically (y: 72 desktop / 36 mobile -> 0) with power3.out 0.85s and 0.08s stagger.
 */
export function GenesisSectionIntro({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = gsap.utils.toArray<HTMLElement>(el.children);
    if (!items.length) return;

    if (reduced) {
      gsap.set(items, { autoAlpha: 1, y: 0, clearProps: "transform" });
      return;
    }

    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    const rise = isPortrait ? 36 : 72;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 92%",
        once: true,
      },
    });

    tl.fromTo(
      items,
      { y: rise, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.85,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform",
      }
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div ref={ref} className={`section-intro ${className}`}>
      {children}
    </div>
  );
}

/**
 * GenesisShowcaseFrame — Signature GenesisFX media/interactive showcase container:
 * Masked emerald top-rim highlight border + centered top beam + GSAP 48px power2.out rise.
 */
export function GenesisShowcaseFrame({
  children,
  className = "",
  innerClassName = "",
  rise = 48,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  rise?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(el, { autoAlpha: 1, y: 0, clearProps: "transform" });
      return;
    }

    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, y: rise },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power2.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [rise]);

  return (
    <div ref={ref} className={`gfx-frame ${className}`}>
      <div className="gfx-frame__highlight" aria-hidden="true">
        <div className="gfx-frame__highlight-glow" />
      </div>
      <span className="gfx-frame__top-beam" aria-hidden="true" />
      <div
        className={`relative z-[1] overflow-hidden rounded-[1.45rem] border border-white/10 bg-[#05070d]/95 ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * GenesisSparkles — 8-point subtle starlight constellation activated on ghost button hover.
 */
export function GenesisSparkles() {
  return (
    <span className="sparkles" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <span key={i} className="sparkle" />
      ))}
    </span>
  );
}
