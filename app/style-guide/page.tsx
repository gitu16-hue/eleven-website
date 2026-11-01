"use client";

import { useState } from "react";
import { Nav } from "@/components/navigation/Nav";
import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

const swatches = [
  { name: "el-bg", var: "--el-bg" },
  { name: "el-bg-raised", var: "--el-bg-raised" },
  { name: "el-fg", var: "--el-fg" },
  { name: "el-fg-muted", var: "--el-fg-muted" },
  { name: "el-fg-faint", var: "--el-fg-faint" },
  { name: "el-border", var: "--el-border" },
  { name: "el-border-strong", var: "--el-border-strong" },
  { name: "el-accent", var: "--el-accent" },
  { name: "el-accent-soft", var: "--el-accent-soft" },
];

const typeScale = [
  { label: "5xl / Hero", cls: "text-el-5xl" },
  { label: "4xl / Section headline", cls: "text-el-4xl" },
  { label: "3xl", cls: "text-el-3xl" },
  { label: "2xl", cls: "text-el-2xl" },
  { label: "xl", cls: "text-el-xl" },
  { label: "lg", cls: "text-el-lg" },
  { label: "base / Body", cls: "text-el-base" },
  { label: "sm", cls: "text-el-sm" },
  { label: "xs", cls: "text-el-xs" },
];

export default function StyleGuide() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "mode-dark" : ""}>
      <div className="min-h-screen bg-el-bg text-el-fg transition-colors duration-[var(--el-duration-slow)] focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-el-signal-lime active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none">
        <Nav />

        <Section className="py-14 lg:py-16">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-el-xs text-el-fg-faint">
                Design foundation: Phase 1
              </p>
              <h1 className="mt-3 text-el-3xl font-semibold tracking-[-0.02em]">
                ELEVEN design system
              </h1>
            </div>
            <Button
              variant="secondary"
              onClick={() => setDark((d) => !d)}
              className="focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-el-signal-lime active:scale-[0.98] disabled:opacity-50"
            >
              {dark ? "Institutional mode" : "Computational mode"}
            </Button>
          </div>
        </Section>

        {/* Type scale */}
        <Section className="border-t border-el-border">
          <h2 className="mb-10 text-el-lg font-semibold">Type scale</h2>
          <div className="space-y-6">
            {typeScale.map((t) => (
              <div
                key={t.label}
                className="flex flex-col gap-1 border-b border-el-border pb-6 last:border-0"
              >
                <span className="font-mono text-el-xs text-el-fg-faint">
                  {t.label}
                </span>
                <span className={`${t.cls} font-semibold tracking-[-0.02em]`}>
                  Intelligence that works
                </span>
              </div>
            ))}
            <div className="pt-2">
              <span className="font-mono text-el-xs text-el-fg-faint">
                Technical / mono: used for system state, metrics, labels
              </span>
              <p className="mt-2 font-mono text-el-sm text-el-fg">
                PERCEPTION → REASONING → DECISION → EXECUTION
              </p>
            </div>
          </div>
        </Section>

        {/* Color tokens */}
        <Section className="border-t border-el-border">
          <h2 className="mb-10 text-el-lg font-semibold">Color tokens</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {swatches.map((s) => (
              <div key={s.name}>
                <div
                  className="mb-3 h-20 w-full border border-el-border"
                  style={{ background: `var(${s.var})` }}
                />
                <p className="font-mono text-el-xs text-el-fg-muted">
                  {s.name}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-[60ch] text-el-sm text-el-fg-muted">
            One accent, used sparingly. Institutional mode carries almost no
            color at all (restraint is the signal). Computational mode
            introduces cyan and violet only inside the system interface.
          </p>
        </Section>

        {/* Buttons */}
        <Section className="border-t border-el-border">
          <h2 className="mb-10 text-el-lg font-semibold">Buttons</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="primary"
              arrow
              className="focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-el-signal-lime active:scale-[0.98] disabled:opacity-50"
            >
              Explore ELEVEN
            </Button>
            <Button
              variant="secondary"
              className="focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-el-signal-lime active:scale-[0.98] disabled:opacity-50"
            >
              Explore the architecture
            </Button>
            <Button
              variant="ghost"
              className="focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-el-signal-lime active:scale-[0.98] disabled:opacity-50"
            >
              Read the research
            </Button>
          </div>
        </Section>

        {/* Spacing / layout note */}
        <Section className="border-t border-el-border">
          <h2 className="mb-6 text-el-lg font-semibold">Layout principles</h2>
          <ul className="max-w-[70ch] space-y-3 text-el-base text-el-fg-muted">
            <li>Content max-width 1280px, left-aligned by default.</li>
            <li>Body line length kept under 80 characters.</li>
            <li>Section rhythm: 10rem desktop / 5rem mobile between major sections.</li>
            <li>Motion answers user action first; one orchestrated moment per page beyond that.</li>
            <li>Every component reads correctly at 390px, 768px, 1024px, 1440px, 1920px.</li>
          </ul>
        </Section>

        <footer className="border-t border-el-border py-10">
          <Container>
            <p className="text-el-xs text-el-fg-faint">
              GISHH Labs · ELEVEN
            </p>
          </Container>
        </footer>
      </div>
    </div>
  );
}
