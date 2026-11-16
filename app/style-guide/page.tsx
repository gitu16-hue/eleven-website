"use client";

import { useState } from "react";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { GenesisShowcaseFrame } from "@/components/motion/GenesisMotionEngine";

const swatches = [
  { name: "--bg (Obsidian Void)", hex: "#05070d", value: "#05070d" },
  { name: "--el-deck-raised", hex: "#0c1311", value: "#0c1311" },
  { name: "--text (Alabaster)", hex: "#e8ecf5", value: "#e8ecf5" },
  { name: "--text-gray", hex: "#a0a0a0", value: "#a0a0a0" },
  { name: "--text-muted", hex: "#686868", value: "#686868" },
  { name: "--color-primary-green-500", hex: "#00b38c", value: "#00b38c" },
  { name: "--green-number", hex: "#10bc83", value: "#10bc83" },
  { name: "--el-cyan (Mint Highlight)", hex: "#38ffbd", value: "#38ffbd" },
  { name: "--color-ai-coach-600", hex: "#8260cf", value: "#8260cf" },
  { name: "--v2-border (7%)", hex: "rgba(255,255,255,.07)", value: "rgba(255, 255, 255, 0.07)" },
];

const typeScale = [
  { label: "--fs-h1 (5 × --fs · 400 regular · 1.02 lh)", style: { fontSize: "var(--fs-h1)" } },
  { label: "--fs-h2 (3.75 × --fs · 400 regular · 1.05 lh)", style: { fontSize: "var(--fs-h2)" } },
  { label: "--fs-h3 (2.5 × --fs · 400 regular · 1.18 lh)", style: { fontSize: "var(--fs-h3)" } },
  { label: "--fs-h4 (1.5 × --fs · 400 regular · 1.32 lh)", style: { fontSize: "var(--fs-h4)" } },
  { label: "--fs-subtitle-1 (1.875 × --fs · 500)", style: { fontSize: "var(--fs-subtitle-1)" } },
  { label: "--fs-p3 (1.125 × --fs · 400 body)", style: { fontSize: "var(--fs-p3)" } },
];

export default function StyleGuide() {
  const [ambientBoost, setAmbientBoost] = useState(true);

  return (
    <div className="min-h-screen bg-[#05070d] text-[#e8ecf5]">
      <Nav />

      <Section className="relative overflow-hidden py-14 lg:py-20">
        {ambientBoost && (
          <div
            aria-hidden="true"
            className="el-aurora pointer-events-none absolute inset-x-0 -top-24 h-[420px]"
          />
        )}
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="gfx-badge">Design System · GenesisFX Obsidian + Emerald</span>
            <h1 className="mt-5 el-h1 heading-gradient">
              ELEVEN Design System
            </h1>
            <p className="mt-4 max-w-[60ch] el-body">
              Obsidian void canvas, regular-weight (400) fluid geometric typography with radial silver gradient ink, emerald spotlight buttons, and GSAP + Lenis smooth choreography.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setAmbientBoost((b) => !b)}
          >
            {ambientBoost ? "Ambient Halo: On" : "Ambient Halo: Off"}
          </Button>
        </div>
      </Section>

      {/* Type scale */}
      <Section className="border-t border-white/[0.07]">
        <h2 className="mb-10 el-h3 heading-gradient">Typography Scale (--fs Fluid Viewport System)</h2>
        <div className="space-y-7">
          {typeScale.map((t) => (
            <div
              key={t.label}
              className="flex flex-col gap-2 border-b border-white/[0.07] pb-6 last:border-0"
            >
              <span className="font-mono text-xs text-[#10bc83]">
                {t.label}
              </span>
              <span
                className="font-normal tracking-[-0.025em] leading-[1.06] heading-gradient"
                style={t.style}
              >
                Brilliant AI. Always under control.
              </span>
            </div>
          ))}
          <div className="pt-2">
            <span className="font-mono text-xs text-[#10bc83]">
              Monospace / Tabular Telemetry (Geist Mono · zero, ss02)
            </span>
            <p className="mt-2 font-mono text-sm text-[#e8ecf5] tabular-nums">
              PERCEPTION → REASONING → POLICY_GATE → EXECUTION · 0.05s HALT
            </p>
          </div>
        </div>
      </Section>

      {/* Color tokens */}
      <Section className="border-t border-white/[0.07]">
        <h2 className="mb-10 el-h3 heading-gradient">Obsidian & Emerald Color Tokens</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {swatches.map((s) => (
            <div key={s.name} className="gfx-card p-3">
              <span className="gfx-card__border" aria-hidden="true" />
              <div
                className="relative z-10 mb-3 h-20 w-full rounded-xl border border-white/10"
                style={{ background: s.value }}
              />
              <p className="relative z-10 font-mono text-[11px] text-[#e8ecf5]">
                {s.name}
              </p>
              <p className="relative z-10 mt-0.5 font-mono text-[11px] text-[#10bc83]">
                {s.hex}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Interactive Surface & Buttons */}
      <Section className="border-t border-white/[0.07]">
        <h2 className="mb-10 el-h3 heading-gradient">Interactive Buttons, Badges & Frames</h2>

        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" arrow>
            Primary Glow Button
          </Button>
          <Button variant="secondary">
            Secondary Gradient Ring
          </Button>
          <Button variant="ghost">
            Ghost Sparkle Button
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="gfx-badge">Standard Genesis Badge</span>
          <span className="gfx-bubble" style={{ ["--tint" as string]: "16, 188, 131" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            <span>Emerald Glass Bubble</span>
          </span>
          <span className="gfx-bubble" style={{ ["--tint" as string]: "130, 96, 207" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            <span>Violet AI Core Bubble</span>
          </span>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="gfx-card p-6">
            <span className="gfx-card__border" aria-hidden="true" />
            <span className="gfx-card__bloom" aria-hidden="true" />
            <div className="relative z-10 flex items-start gap-4">
              <span className="gfx-feature-bar" aria-hidden="true" />
              <div>
                <h3 className="text-xl font-normal heading-gradient">Chamfered Glass Card + Feature Bar</h3>
                <p className="mt-2 text-sm text-[#a0a0a0]">
                  Uses mask-composite perimeter borders, backdrop blur, corner bloom, and glowing vertical feature indicators.
                </p>
              </div>
            </div>
          </div>

          <GenesisShowcaseFrame innerClassName="p-6">
            <h3 className="text-xl font-normal heading-gradient">Showcase Frame</h3>
            <p className="mt-2 text-sm text-[#a0a0a0]">
              Centered emerald top beam and masked rim highlight rising smoothly on ScrollTrigger entry.
            </p>
          </GenesisShowcaseFrame>
        </div>
      </Section>

      <Footer />
    </div>
  );
}
