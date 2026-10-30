"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DiffTab = "diff" | "invariants" | "receipt";

export function DeveloperDiffReviewConsole() {
  const [activeTab, setActiveTab] = useState<DiffTab>("diff");
  const [signed, setSigned] = useState(false);
  const [signing, setSigning] = useState(false);

  const handleApprove = () => {
    setSigning(true);
    setTimeout(() => {
      setSigning(false);
      setSigned(true);
      setActiveTab("receipt");
    }, 600);
  };

  const handleReset = () => {
    setSigned(false);
    setActiveTab("diff");
  };

  return (
    <div className="w-full overflow-hidden rounded-sm border border-el-border bg-[#04060A] font-mono shadow-el-lg">
      {/* Top Cyber Terminal Title Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-el-border/80 bg-el-bg-raised/80 px-4 py-3 text-[11px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="text-el-border-strong">|</span>
          <span className="text-el-fg font-semibold tracking-wider">
            QUARANTINE_SANCTUM // ACTION_PROPOSAL #0492
          </span>
          <span className="hidden rounded-xs border border-el-accent/40 bg-el-accent/10 px-1.5 py-0.2 text-[9.5px] text-el-accent sm:inline">
            GIT_WORKTREE_ISOLATED
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("diff")}
            className={`cursor-pointer rounded-xs px-2.5 py-1 text-[10.5px] transition-all ${
              activeTab === "diff"
                ? "bg-el-accent text-[#04060A] font-semibold"
                : "text-el-fg-faint hover:text-el-fg"
            }`}
          >
            Diff (Unified)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("invariants")}
            className={`cursor-pointer rounded-xs px-2.5 py-1 text-[10.5px] transition-all ${
              activeTab === "invariants"
                ? "bg-el-accent text-[#04060A] font-semibold"
                : "text-el-fg-faint hover:text-el-fg"
            }`}
          >
            Policy Audit (5/5)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("receipt")}
            className={`cursor-pointer rounded-xs px-2.5 py-1 text-[10.5px] transition-all ${
              activeTab === "receipt"
                ? "bg-el-accent text-[#04060A] font-semibold"
                : "text-el-fg-faint hover:text-el-fg"
            }`}
          >
            Ed25519 Receipt
          </button>
        </div>
      </div>

      {/* Pane Content */}
      <div className="p-4 sm:p-5 text-el-xs leading-relaxed">
        <AnimatePresence mode="wait">
          {activeTab === "diff" && (
            <motion.div
              key="diff"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="space-y-1 overflow-x-auto text-[11.5px]"
            >
              <p className="text-el-fg-faint select-none">
                commit: 8f2c019 (staged in memory: /tmp/eleven_quarantine/tree_89)
              </p>
              <p className="text-el-fg-faint select-none">
                author: eleven_deep &lt;agent@local.quarantine&gt;
              </p>
              <p className="text-el-accent font-semibold pt-2 select-none">
                --- a/src/auth/token_verifier.ts
              </p>
              <p className="text-el-accent font-semibold select-none">
                +++ b/src/auth/token_verifier.ts
              </p>
              <p className="text-el-border-strong select-none pt-1">
                @@ -42,7 +42,9 @@ export async function verifyClientToken(raw: string)
              </p>
              <p className="text-[#94A3B8] pl-2">
                &nbsp;&nbsp;const decoded = await jwt.decode(raw);
              </p>
              <p className="bg-red-500/10 text-red-400 pl-2">
                - const secret = process.env.PUBLIC_FALLBACK_SECRET;
              </p>
              <p className="bg-green-500/10 text-el-signal-lime pl-2">
                + const secret = await HostSupervisor.fetchHardwareKey();
              </p>
              <p className="bg-green-500/10 text-el-signal-lime pl-2">
                + if (!secret) throw new SecurityBoundaryError(&quot;Hardware key missing&quot;);
              </p>
              <p className="text-[#94A3B8] pl-2">
                &nbsp;&nbsp;return jwt.verify(raw, secret, &#123; algorithms: [&quot;EdDSA&quot;] &#125;);
              </p>
            </motion.div>
          )}

          {activeTab === "invariants" && (
            <motion.div
              key="invariants"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between border-b border-el-border pb-2 text-[10.5px]">
                <span className="text-el-fg-faint uppercase">INVARIANT CHECK</span>
                <span className="text-el-signal-lime font-semibold">ALL GATES PASSED (5/5)</span>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-start gap-2 text-el-fg">
                  <span className="text-el-signal-lime">✓</span>
                  <div>
                    <span className="text-el-accent">GATE 1 · PATH_CONFINEMENT:</span> Diff is confined to /src/auth. No traversal to ~/.ssh, ~/.env, or /etc.
                  </div>
                </div>
                <div className="flex items-start gap-2 text-el-fg">
                  <span className="text-el-signal-lime">✓</span>
                  <div>
                    <span className="text-el-accent">GATE 2 · STATIC_AST_AUDIT:</span> Code passes ESLint security rules with zero unsafe eval or dynamic child_process.
                  </div>
                </div>
                <div className="flex items-start gap-2 text-el-fg">
                  <span className="text-el-signal-lime">✓</span>
                  <div>
                    <span className="text-el-accent">GATE 3 · SANDBOX_UNIT_TESTS:</span> Quarantined test runner executed 38 unit tests (38 passed, 0 regressions).
                  </div>
                </div>
                <div className="flex items-start gap-2 text-el-fg">
                  <span className="text-el-signal-lime">✓</span>
                  <div>
                    <span className="text-el-accent">GATE 4 · EGRESS_FIREWALL:</span> Zero outbound network calls initiated during compilation.
                  </div>
                </div>
                <div className="flex items-start gap-2 text-el-fg">
                  <span className="text-el-signal-lime">✓</span>
                  <div>
                    <span className="text-el-accent">GATE 5 · ESCALATION_REQUIRED:</span> Classified as Tier 2 ActionProposal: requires operator Ed25519 signature.
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "receipt" && (
            <motion.div
              key="receipt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="space-y-2 text-[11px]"
            >
              <div className="flex items-center justify-between border-b border-el-border pb-2 text-[10.5px]">
                <span className="text-el-fg-faint uppercase">CRYPTOGRAPHIC RECEIPT</span>
                <span className={signed ? "text-el-signal-lime font-semibold" : "text-yellow-400 font-semibold"}>
                  {signed ? "SIGNATURE VERIFIED (ED25519)" : "AWAITING HUMAN APPROVAL"}
                </span>
              </div>
              <p className="text-el-fg-muted">
                Receipt Nonce: <span className="text-el-fg">DEC-008-8f2c019-9481</span>
              </p>
              <p className="text-el-fg-muted">
                Action Hash (SHA-256): <span className="text-el-accent break-all">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
              </p>
              <p className="text-el-fg-muted">
                One-Time Authorization Window: <span className="text-el-fg">30.00 seconds</span>
              </p>
              {signed ? (
                <div className="mt-3 rounded-xs border border-el-signal-lime/40 bg-el-signal-lime/10 p-3 text-el-signal-lime">
                  ✓ Signed by Operator Key [ed25519:f892a01]. ActionProposal applied to host git branch. Quarantined worktree purged.
                </div>
              ) : (
                <div className="mt-3 text-el-fg-faint">
                  Click &ldquo;Sign &amp; Apply to Host Git&rdquo; below to simulate operator verification.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Command Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-el-border/80 bg-el-bg-raised/90 px-4 py-3 text-el-xs">
        <div className="flex items-center gap-2 text-el-fg-faint text-[10.5px]">
          <span className="h-1.5 w-1.5 rounded-full bg-el-signal-lime" />
          <span>STATUS: CONFINED IN QUARANTINE</span>
        </div>

        <div className="flex items-center gap-2">
          {signed ? (
            <button
              type="button"
              onClick={handleReset}
              className="cursor-pointer rounded-xs border border-el-border px-3 py-1.5 font-mono text-[11px] text-el-fg-muted hover:text-el-fg transition-colors"
            >
              Reset Simulation
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApprove}
              disabled={signing}
              className="cursor-pointer rounded-xs bg-el-accent px-4 py-1.5 font-mono text-[11px] font-semibold text-[#04060A] shadow-xs hover:bg-el-signal-lime transition-all active:scale-95 disabled:opacity-50"
            >
              {signing ? "Signing Nonce…" : "Sign & Apply to Host Git →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
