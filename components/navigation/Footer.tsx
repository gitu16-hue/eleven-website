"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Section";
import { usePortalTransition } from "@/components/ui/PortalTransition";
import {
  CipherText,
  DualCopy,
  WordReveal,
  useClarityMode,
} from "@/components/motion/PremiumMotion";

const columns = [
  {
    heading: "Core Platform",
    links: [
      { href: "/", label: "Overview" },
      { href: "/eleven", label: "How It Thinks" },
      { href: "/dashboard", label: "Voyage Pipeline Tracker" },
      { href: "/benchmarks/voice-latency", label: "Voice Latency (<0.05s)" },
      { href: "/enter", label: "3D Visualizer Core" },
      { href: "/presentation.html", label: "Executive Deck (16:9)" },
    ],
  },
  {
    heading: "Architecture & Specs",
    links: [
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
  const isPlain = mode === "plain";

  return (
    <footer className="relative overflow-hidden border-t border-el-border bg-el-bg">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--el-fg) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <Container className="relative py-20 lg:py-28">
        {/* Top Monumental Institutional Colophon */}
        <div className="grid grid-cols-1 gap-14 border-b border-el-border pb-16 lg:grid-cols-12 lg:items-end lg:pb-20">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-sm border border-el-border-strong/60 bg-el-bg-raised p-1 shadow-el-sm">
                <Image
                  src="/gishh-logo-icon.png"
                  alt="GISHH Labs"
                  width={44}
                  height={44}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-el-fg-faint">
                  <CipherText text="ELEVEN v3.1 · BUILT BY GISHH LABS" />
                </p>
                <p className="text-el-xl font-semibold tracking-[-0.02em] text-el-fg">
                  <WordReveal text="Brilliant AI. Always Under Your Control." />
                </p>
              </div>
            </div>

            <DualCopy
              className="mt-7 max-w-[52ch] text-el-lg leading-relaxed text-el-fg-muted"
              plain="Talk naturally, get deep work done in the background, keep your memories private on your own computer, and approve important actions before they happen."
              technical="Frontier intelligence. Human-owned authority. A local-first control plane separating untrusted model reasoning from deterministic real-world execution."
            />
          </div>

          <div className="flex flex-col items-start lg:col-span-5 lg:items-end">
            <button
              type="button"
              onClick={enterComputationalMode}
              className="group flex cursor-pointer items-center gap-4 border border-el-border-strong bg-el-bg-raised px-6 py-4 text-left shadow-el-sm transition-all duration-[var(--el-duration-base)] hover:border-el-fg hover:shadow-el-md"
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-el-fg-faint">
                  INTERACTIVE 3D EXPERIENCE
                </p>
                <p className="mt-0.5 text-el-sm font-medium text-el-fg transition-colors group-hover:text-el-accent">
                  Explore the Live 3D Holographic Orb
                </p>
              </div>
              <span className="font-mono text-el-sm text-el-fg-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-el-accent">
                →
              </span>
            </button>
          </div>
        </div>

        {/* Navigation & Summary Card */}
        <div className="mt-14 flex flex-col gap-12 md:flex-row md:justify-between lg:mt-16">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:gap-14">
            {columns.map((col) => (
              <div key={col.heading}>
                <p className="font-mono text-el-xs uppercase tracking-[0.12em] text-el-fg-faint">
                  {col.heading}
                </p>
                <ul className="mt-5 space-y-3.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="el-link-laser text-el-sm text-el-fg-muted transition-colors duration-[var(--el-duration-fast)] hover:text-el-fg"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* At-a-Glance Summary Card */}
          <div className="min-w-[295px] border border-el-border bg-el-bg-raised p-5 font-mono text-[11px] leading-relaxed text-el-fg-muted shadow-el-sm">
            <div className="flex items-center justify-between border-b border-el-border pb-2.5 text-el-fg">
              <span className="font-medium tracking-[0.08em]">
                {isPlain ? "AT A GLANCE" : "ARCHITECTURE LEDGER"}
              </span>
              <span className="flex items-center gap-1.5 text-el-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-el-accent" />
                <span>VERIFIED v3.1</span>
              </span>
            </div>
            <div className="mt-3 space-y-1.5 text-[10.5px]">
              <div className="flex justify-between gap-6">
                <span className="text-el-fg-faint">TWO MINDS</span>
                <span className="text-el-fg">
                  {isPlain ? "Quick Voice + Deep Planner" : "F.R.I.D.A.Y. · J.A.R.V.I.S."}
                </span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-el-fg-faint">SAFETY</span>
                <span className="text-el-fg">
                  {isPlain ? "5 Automatic Checkpoints" : "5-STAGE CONTROL PLANE"}
                </span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-el-fg-faint">APPROVALS</span>
                <span className="text-el-fg">
                  {isPlain ? "Honest 30s One-Time Pass" : "DEC-008 NONCE · SHA-256"}
                </span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-el-fg-faint">MEMORY</span>
                <span className="text-el-fg">
                  {isPlain ? "100% Private on Your PC" : "REDIS · NEO4J · QDRANT"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Motto Bar */}
        <div className="mt-16 flex flex-col-reverse items-start gap-4 border-t border-el-border pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-el-xs tracking-[0.02em] text-el-fg-faint">
            © {new Date().getFullYear()} GISHH Labs Pvt. Ltd. All rights reserved.
          </p>
          <p className="font-mono text-el-xs tracking-[0.04em] text-el-fg-faint">
            QUIET AUTHORITY · YOUR AI, YOUR RULES
          </p>
        </div>
      </Container>
    </footer>
  );
}
