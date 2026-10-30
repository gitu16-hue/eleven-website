"use client";

import React, { ComponentPropsWithoutRef, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group relative overflow-hidden inline-flex items-center justify-center gap-2 text-el-sm font-medium tracking-[-0.01em] " +
  "transition-[box-shadow,border-color,background-color,color,filter] duration-[var(--el-duration-fast)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 disabled:opacity-40 disabled:pointer-events-none " +
  "active:scale-[0.97] rounded-xs cursor-pointer";

const variants: Record<Variant, string> = {
  primary:
    "bg-el-accent text-[#04060A] font-semibold px-5 py-2.5 sm:px-5.5 sm:py-2.5 min-h-[44px] hover:shadow-[0_0_28px_rgba(0,240,255,0.48)] hover:brightness-105",
  secondary:
    "border border-el-border-strong text-el-fg bg-el-bg-raised/75 px-5 py-2.5 sm:px-5.5 sm:py-2.5 min-h-[44px] hover:border-el-accent hover:text-el-fg hover:shadow-[0_0_20px_rgba(0,240,255,0.16)] hover:bg-el-bg-raised",
  ghost:
    "text-el-fg-muted hover:text-el-accent px-3 py-2 min-h-[44px]",
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
  const wrapRef = useRef<HTMLSpanElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const reduced = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 320, damping: 22, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 320, damping: 22, mass: 0.4 });

  const onEnter = () => {
    if (reduced || !wrapRef.current) return;
    if (window.matchMedia("(hover: none)").matches) return;
    rectRef.current = wrapRef.current.getBoundingClientRect();
  };

  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (reduced || !rectRef.current) return;
    const r = rectRef.current;
    const dx = (e.clientX - (r.left + r.width * 0.5)) * 0.14;
    const dy = (e.clientY - (r.top + r.height * 0.5)) * 0.2;
    mx.set(Math.max(-4.5, Math.min(4.5, dx)));
    my.set(Math.max(-3.5, Math.min(3.5, dy)));
  };

  const onLeave = () => {
    rectRef.current = null;
    mx.set(0);
    my.set(0);
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  const innerContent = (
    <>
      {/* Optical specular sweep on hover */}
      {variant !== "ghost" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {arrow && <ArrowIcon />}
      </span>
    </>
  );

  return (
    <motion.span
      ref={wrapRef}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy }}
      className="inline-flex"
    >
      {href ? (
        <Link
          href={href}
          className={classes}
          {...(props as Omit<ComponentPropsWithoutRef<typeof Link>, "href">)}
        >
          {innerContent}
        </Link>
      ) : (
        <button
          className={classes}
          {...(props as ComponentPropsWithoutRef<"button">)}
        >
          {innerContent}
        </button>
      )}
    </motion.span>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-[var(--el-duration-fast)] group-hover:translate-x-1"
    >
      <path
        d="M3 8H13M13 8L9 4M13 8L9 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
