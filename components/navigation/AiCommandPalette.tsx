"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useClarityMode } from "@/components/motion/PremiumMotion";

interface CommandItem {
  id: string;
  category: "AI Control" | "Navigation" | "Telemetry";
  title: string;
  subtitle: string;
  shortcut?: string;
  badge?: string;
  action: () => void;
}

export function AiCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { mode, toggleMode } = useClarityMode();
  const router = useRouter();

  const navigateTo = useCallback(
    (path: string) => {
      setIsOpen(false);
      router.push(path);
    },
    [router]
  );

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const scrollToSection = useCallback((id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const commands: CommandItem[] = useMemo(
    () => [
      {
        id: "clarity_toggle",
        category: "AI Control",
        title: mode === "plain" ? "Switch to Engineer Spec View" : "Switch to Simple English View",
        subtitle: "Change terminology depth across all explanations",
        shortcut: "T",
        badge: mode === "plain" ? "CURRENT: SIMPLE" : "CURRENT: SPEC",
        action: () => {
          toggleMode();
          setIsOpen(false);
        },
      },
      {
        id: "sim_e_stop",
        category: "AI Control",
        title: "How Emergency Stop works (<0.05s target)",
        subtitle: "Jump to the Ring 0 watchdog explanation",
        shortcut: "HALT",
        badge: "RING 0",
        action: () => {
          scrollToSection("control-plane-preview");
        },
      },
      {
        id: "nav_developers",
        category: "Navigation",
        title: "Developer Solutions: Terminal, DAG & Quarantined Git",
        subtitle: "Deterministic code execution and Ed25519 action diff approvals",
        shortcut: "DEV",
        badge: "SOLUTIONS",
        action: () => {
          navigateTo("/solutions/developers");
        },
      },
      {
        id: "nav_enterprise",
        category: "Navigation",
        title: "Enterprise Sovereign AI Fleet & Zero-Trust Governance",
        subtitle: "Air-gapped deployment, MDM policies, Merkle audit trails & SAML/FIDO2",
        shortcut: "ENT",
        badge: "ENTERPRISE",
        action: () => {
          navigateTo("/solutions/enterprise");
        },
      },
      {
        id: "nav_compare",
        category: "Navigation",
        title: "Local Control Plane vs Cloud Assistants Comparison",
        subtitle: "Interactive 6-dimensional audit and TCO calculator",
        shortcut: "CMP",
        badge: "AUDIT",
        action: () => {
          navigateTo("/compare/cloud-vs-local");
        },
      },
      {
        id: "nav_security",
        category: "Navigation",
        title: "Security Center: Threat Model & Invariant Rules",
        subtitle: "15 fail-closed safety invariants, PGP keys & threat vectors",
        shortcut: "SEC",
        badge: "ZERO-TRUST",
        action: () => {
          navigateTo("/security");
        },
      },
      {
        id: "nav_inspector",
        category: "Navigation",
        title: "ActionProposal Protocol Inspector & Policy Gates",
        subtitle: "Interactive simulator for JSON-RPC tool calls & 5 security gates",
        shortcut: "INS",
        badge: "TOOLS",
        action: () => {
          navigateTo("/tools/inspector");
        },
      },
      {
        id: "nav_dashboard",
        category: "Navigation",
        title: "Sovereign Voyage Dashboard & Curved SVG Stepper",
        subtitle: "Tangent-aligned milestone route tracker and fluid actuarial tweening",
        shortcut: "DSH",
        badge: "DASHBOARD",
        action: () => {
          navigateTo("/dashboard");
        },
      },
      {
        id: "nav_dag_visualizer",
        category: "Navigation",
        title: "System 2 DAG Orchestrator & Worktree Visualizer",
        subtitle: "Interactive graph visualizer for parallel quarantined git worktrees",
        shortcut: "DAG",
        badge: "REASONING",
        action: () => {
          navigateTo("/tools/dag-visualizer");
        },
      },
      {
        id: "nav_voice_benchmarks",
        category: "Navigation",
        title: "16kHz Voice Pipeline & Sub-50ms Barge-In Benchmark",
        subtitle: "Empirical latency simulator and lockless ring buffer tests",
        shortcut: "VOX",
        badge: "BENCHMARK",
        action: () => {
          navigateTo("/benchmarks/voice-latency");
        },
      },
      {
        id: "nav_hardware",
        category: "Navigation",
        title: "Hardware Compatibility & Local Inference Sizing",
        subtitle: "Token generation throughput and VRAM requirements calculator",
        shortcut: "HW",
        badge: "HARDWARE",
        action: () => {
          navigateTo("/hardware");
        },
      },
      {
        id: "nav_vault_calculator",
        category: "Navigation",
        title: "Sovereign Vault Storage & Encryption Estimator",
        subtitle: "Local SQLite footprint and vector index RAM calculator",
        shortcut: "VLT",
        badge: "STORAGE",
        action: () => {
          navigateTo("/tools/vault-calculator");
        },
      },
      {
        id: "nav_docs",
        category: "Navigation",
        title: "Developer Documentation & Technical Specs",
        subtitle: "Host supervisor, Quarantine Sanctum & memory schema",
        shortcut: "DOCS",
        badge: "SPECS",
        action: () => {
          navigateTo("/docs");
        },
      },
      {
        id: "presentation_deck",
        category: "Navigation",
        title: "Launch 16:9 Interactive Presentation Deck",
        subtitle: "Open full-screen boardroom slides with live 3D models",
        shortcut: "P",
        badge: "16:9 SLIDES",
        action: () => {
          window.location.href = "/presentation.html";
        },
      },
      {
        id: "nav_hero",
        category: "Navigation",
        title: "Section 01 · 3D Cognitive Orb",
        subtitle: "Hero centerpiece & 16kHz speech perception simulator",
        action: () => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setIsOpen(false);
        },
      },
      {
        id: "nav_intelligence",
        category: "Navigation",
        title: "Section 02 · Intelligence in Motion",
        subtitle: "Understand → Plan → Execute → Verify 4-phase sequence",
        action: () => scrollToSection("intelligence-in-motion"),
      },
      {
        id: "nav_gyro",
        category: "Navigation",
        title: "Section 03 · Control Plane Gyroscope",
        subtitle: "5 Concentric Policy Rings & interactive 3D topology",
        action: () => scrollToSection("control-plane-preview"),
      },
      {
        id: "nav_arch",
        category: "Navigation",
        title: "Section 04 · Architecture Visualization",
        subtitle: "4 Execution Rooms, 4 Memory Drawers & 5 Policy Guards",
        action: () => scrollToSection("architecture-visualization"),
      },
      {
        id: "nav_autonomy",
        category: "Navigation",
        title: "Section 05 · Autonomy & User Control",
        subtitle: "Four autonomy tiers (T0 Advisory to T3 Delegated)",
        action: () => scrollToSection("autonomy-control"),
      },
      {
        id: "nav_waitlist",
        category: "Navigation",
        title: "Section 06 · Early Access Invitation",
        subtitle: "Join the local-first private personal AI program",
        action: () => scrollToSection("early-access"),
      },
      {
        id: "memory_info",
        category: "Telemetry",
        title: "Inspect Sovereign Memory Allocation",
        subtitle: "4 Drawers: Scratchpad, Episodic, Semantic, Archival S3",
        badge: "AES-256-GCM",
        action: () => scrollToSection("architecture-visualization"),
      },
    ],
    [mode, toggleMode, scrollToSection, navigateTo]
  );

  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands;
    const q = search.toLowerCase();
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [commands, search]);

  // Handle arrow keys
  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
    }
  };

  return (
    <>
      {/* Global Floating Trigger Pill in Navbar */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Command Palette (Ctrl+K or Cmd+K)"
        className="hidden md:flex items-center gap-2 rounded-full border border-el-border-strong bg-el-bg-raised/70 px-3 py-1 font-mono text-[11px] text-el-fg-muted shadow-xs backdrop-blur-xs hover:border-el-accent hover:text-el-fg transition-all cursor-pointer group"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-el-accent animate-pulse" />
        <span className="group-hover:text-el-accent transition-colors">AI HUD</span>
        <kbd className="rounded-xs border border-el-border bg-el-bg px-1.5 py-0.2 text-[9px] text-el-fg-faint">
          ⌘K
        </kbd>
      </button>

      {/* Modal Dialog Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="AI Command Center"
            className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-6"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#000205]/80 backdrop-blur-md"
            />

            {/* Command Palette Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="relative w-full max-w-xl overflow-hidden rounded-md border border-el-border-strong bg-el-bg-raised shadow-2xl z-10"
            >
              {/* Top Search Input */}
              <div className="flex items-center border-b border-el-border px-4 py-3 bg-el-bg">
                <span className="font-mono text-el-accent text-sm mr-2.5">❯</span>
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyNavigation}
                  placeholder="Type a command or jump to section..."
                  className="w-full bg-transparent font-mono text-base sm:text-el-sm text-el-fg placeholder:text-el-fg-faint focus:outline-none"
                />
                <kbd className="hidden sm:inline rounded-xs border border-el-border bg-el-bg-raised px-1.5 py-0.5 font-mono text-[9.5px] text-el-fg-faint">
                  ESC
                </kbd>
              </div>

              {/* Command List */}
              <div className="max-h-[min(360px,50dvh)] overflow-y-auto overscroll-contain p-2 font-mono">
                {filteredCommands.length === 0 ? (
                  <div className="py-8 text-center text-el-xs text-el-fg-faint">
                    No matching AI commands or sections found.
                  </div>
                ) : (
                  filteredCommands.map((cmd, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={cmd.id}
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center justify-between rounded-sm px-3 py-2.5 cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-el-accent/15 border border-el-accent/40 text-el-fg"
                            : "hover:bg-el-bg text-el-fg-muted"
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[12px] font-medium ${
                                isSelected ? "text-el-accent" : "text-el-fg"
                              }`}
                            >
                              {cmd.title}
                            </span>
                            {cmd.badge && (
                              <span className="rounded-xs bg-el-bg px-1.5 py-0.2 text-[8.5px] text-el-fg-faint border border-el-border">
                                {cmd.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-el-fg-faint">
                            {cmd.subtitle}
                          </span>
                        </div>

                        {cmd.shortcut && (
                          <kbd className="rounded-xs border border-el-border bg-el-bg px-1.5 py-0.5 text-[9px] text-el-fg-faint font-semibold">
                            {cmd.shortcut}
                          </kbd>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Helper */}
              <div className="flex items-center justify-between border-t border-el-border/60 bg-el-bg px-4 py-2 text-[10px] text-el-fg-faint font-mono">
                <div className="flex items-center gap-3">
                  <span>↑↓ Navigate</span>
                  <span>↵ Select</span>
                  <span>ESC Close</span>
                </div>
                <span className="text-el-accent font-semibold">
                  ELEVEN v3.1 CONTROL PLANE
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
