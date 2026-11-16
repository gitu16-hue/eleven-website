"use client";

import React, { ComponentPropsWithoutRef, useCallback, useRef } from "react";
import Link from "next/link";
import { GenesisSparkles } from "@/components/motion/GenesisMotionEngine";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group gfx-btn focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#00b38c] disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "glow-btn",
  secondary: "gfx-btn-secondary",
  ghost: "gfx-btn-ghost",
};

type ButtonProps = {
  variant?: Variant;
  arrow?: boolean;
} & (
  | ({ href: string } & ComponentPropsWithoutRef<typeof Link>)
  | ({ href?: undefined } & ComponentPropsWithoutRef<"button">)
);

export function Button({
  variant = "primary",
  arrow = false,
  className = "",
  children,
  href,
  ...props
}: ButtonProps) {
  const lightRef = useRef<HTMLSpanElement>(null);
  const ringRRef = useRef<HTMLSpanElement>(null);
  const ringLRef = useRef<HTMLSpanElement>(null);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (variant !== "primary") return;
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;

      if (lightRef.current) {
        const lx = Math.round(x - lightRef.current.offsetWidth / 2);
        lightRef.current.style.setProperty("--lx", String(lx));
      }

      const ratio = Math.min(1, Math.max(0, x / Math.max(rect.width, 1)));
      if (ringRRef.current) ringRRef.current.style.opacity = ratio.toFixed(3);
      if (ringLRef.current) ringLRef.current.style.opacity = (1 - ratio).toFixed(3);
    },
    [variant]
  );

  const classes = `${base} ${variants[variant]} ${className}`;

  const innerContent =
    variant === "primary" ? (
      <>
        <span ref={ringRRef} className="glow-btn__ring glow-btn__ring--r" aria-hidden="true" />
        <span ref={ringLRef} className="glow-btn__ring glow-btn__ring--l" aria-hidden="true" />
        <span className="glow-btn__fill" aria-hidden="true" />
        <span className="glow-btn__edge" aria-hidden="true" />
        <span className="glow-btn__clip" aria-hidden="true">
          <span ref={lightRef} className="glow-btn__light">
            <span className="glow-btn__spread" />
            <span className="glow-btn__core" />
          </span>
        </span>
        <span className="glow-btn__label inline-flex items-center gap-2.5 font-normal text-[#05070d]">
          <span>{children}</span>
          {arrow && <ArrowIcon />}
        </span>
      </>
    ) : (
      <>
        {variant === "ghost" && <GenesisSparkles />}
        <span className="relative z-10 inline-flex items-center gap-2.5">
          <span>{children}</span>
          {arrow && <ArrowIcon subtle />}
        </span>
      </>
    );

  if (href) {
    return (
      <Link
        href={href}
        onPointerMove={handlePointerMove}
        className={classes}
        {...(props as Omit<ComponentPropsWithoutRef<typeof Link>, "href">)}
      >
        {innerContent}
      </Link>
    );
  }

  return (
    <button
      onPointerMove={handlePointerMove}
      className={classes}
      {...(props as ComponentPropsWithoutRef<"button">)}
    >
      {innerContent}
    </button>
  );
}

function ArrowIcon({ subtle = false }: { subtle?: boolean }) {
  if (subtle) {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="motion-safe:transition-transform duration-200 group-hover:translate-x-1"
      >
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <span className="btn__icon motion-safe:transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
