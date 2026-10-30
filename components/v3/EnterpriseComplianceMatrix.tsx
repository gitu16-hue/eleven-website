"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type FrameworkFilter = "all" | "gdpr" | "hipaa" | "fedramp" | "soc2" | "sec";

interface ComplianceRow {
  id: string;
  framework: FrameworkFilter;
  frameworkName: string;
  controlId: string;
  domain: string;
  cloudRisk: string;
  sovereignMitigation: string;
  invariantRef: string;
  invariantHref: string;
  details: string;
}

const complianceData: ComplianceRow[] = [
  {
    id: "gdpr-residency",
    framework: "gdpr",
    frameworkName: "GDPR & EU AI Act",
    controlId: "Art. 25 & Art. 28",
    domain: "Data Residency & Sub-Processors",
    cloudRisk: "Prompts and codebase diffs traverse international boundaries to US-hosted model cloud clusters, creating Schrems II transfer liability and unvetted sub-processor risks.",
    sovereignMitigation: "Zero outbound network transit. All model weights, context windows, and code embeddings reside on the local physical NVMe drive within the user's jurisdiction.",
    invariantRef: "INV-01 (Zero Cloud Exfiltration)",
    invariantHref: "/security#rules",
    details: "ELEVEN binds loopback sockets to 127.0.0.1. eBPF socket monitoring drops any unexpected outbound SYN packets, mathematically eliminating cross-border data transfer exposure.",
  },
  {
    id: "hipaa-phi",
    framework: "hipaa",
    frameworkName: "HIPAA HITECH",
    controlId: "45 CFR § 164.312(a)(1)",
    domain: "Protected Health Information (ePHI)",
    cloudRisk: "Requires formal BAA agreements; cloud providers often reserve rights to retain de-identified transcripts, exposing healthcare entities to data breach and training leakage.",
    sovereignMitigation: "Operates in an air-gapped Quarantine Sanctum. Hardware AES-256-GCM encryption with local key management ensures ePHI is never accessible outside physical endpoints.",
    invariantRef: "INV-08 (Quarantined Execution Sanctum)",
    invariantHref: "/security#rules",
    details: "Patient diagnostics and clinical charts are processed exclusively in-memory through local Quantized GGUF/Safetensors weights. Memory pages are zeroized upon session termination.",
  },
  {
    id: "fedramp-airgap",
    framework: "fedramp",
    frameworkName: "FedRAMP High / ITAR",
    controlId: "AC-3 & SC-7",
    domain: "Boundary Protection & SCIF Isolation",
    cloudRisk: "Cloud assistants cannot operate without persistent WAN connectivity to proprietary cloud control planes, disqualifying them from subterranean SCIF and classified networks.",
    sovereignMitigation: "100% self-contained offline runtime. All dependencies, model weights, vector embeddings, and speech pipelines function with network interfaces physically disabled.",
    invariantRef: "INV-12 (Deterministic Fail-Closed Defaults)",
    invariantHref: "/security#rules",
    details: "Compliant with DoD IL6 and NIST SP 800-171 air-gap mandates. Fleet updates are cryptographically pre-signed and deployed via offline USB/PXE or secure MDM packages.",
  },
  {
    id: "soc2-audit",
    framework: "soc2",
    frameworkName: "SOC 2 Type II",
    controlId: "CC6.1 & CC6.6",
    domain: "Logical Access & Audit Non-Repudiation",
    cloudRisk: "Audit trails depend on opaque cloud provider API logs that can be truncated, retroactively altered, or lost during vendor cloud outages.",
    sovereignMitigation: "Tamper-evident Merkle tree audit log. Every single ActionProposal and approval generates an immutable Ed25519-signed receipt verifiable by external SIEMs.",
    invariantRef: "INV-04 (Cryptographic Audit Ledger)",
    invariantHref: "/security#rules",
    details: "Each workstation exports only SHA-256 Merkle root hashes to corporate Splunk or Datadog instances. Auditors verify complete operational integrity without viewing sensitive source code.",
  },
  {
    id: "sec-worm",
    framework: "sec",
    frameworkName: "SEC Rule 17a-4",
    controlId: "17 CFR § 240.17a-4(f)",
    domain: "WORM Storage & Records Retention",
    cloudRisk: "Ephemeral web chat interfaces allow employees to alter or delete conversational history, directly violating financial services communications preservation mandates.",
    sovereignMitigation: "Write-Once-Read-Many (WORM) SQLite ledger with hardware-bound signature chains. No human or AI agent can alter historic ActionProposals or approval records.",
    invariantRef: "INV-05 (Immutable State Transitions)",
    invariantHref: "/security#rules",
    details: "SQLite append-only WAL mode with cryptographic checksums per row ensures broker-dealers and hedge funds retain a verifiable, non-rewriteable archive of all model advisory events.",
  },
  {
    id: "ai-act-governance",
    framework: "gdpr",
    frameworkName: "EU AI Act High-Risk",
    controlId: "Art. 14 (Human Oversight)",
    domain: "Autonomous Execution Governance",
    cloudRisk: "Black-box cloud tool-use models execute external API calls directly, making real-time human intervention impossible once a generation token stream begins.",
    sovereignMitigation: "Strict Human-in-the-Loop policy gates. Autonomy Tier 2 and Tier 3 mandate explicit human signing of structured ActionProposals before any OS mutation occurs.",
    invariantRef: "INV-02 (Human Sovereign Veto)",
    invariantHref: "/security#rules",
    details: "The local control plane separates model reasoning from action dispatch. Even if an LLM is hijacked by an adversarial prompt injection, zero OS mutations occur without manual user sign-off.",
  },
];

export function EnterpriseComplianceMatrix() {
  const [selectedFilter, setSelectedFilter] = useState<FrameworkFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>("gdpr-residency");

  const filteredRows = complianceData.filter(
    (row) => selectedFilter === "all" || row.framework === selectedFilter
  );

  return (
    <div className="w-full space-y-6">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs uppercase text-el-fg-faint mr-2">
          FILTER REGULATION:
        </span>
        {[
          { id: "all", label: "ALL STANDARDS" },
          { id: "soc2", label: "SOC 2 TYPE II" },
          { id: "gdpr", label: "GDPR / EU AI ACT" },
          { id: "hipaa", label: "HIPAA HITECH" },
          { id: "fedramp", label: "FEDRAMP HIGH" },
          { id: "sec", label: "SEC 17A-4" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedFilter(tab.id as FrameworkFilter)}
            className={`rounded-xs px-3 py-1 font-mono text-xs transition-all ${
              selectedFilter === tab.id
                ? "border border-el-cyan/50 bg-el-cyan/15 text-el-cyan shadow-sm"
                : "border border-el-border bg-el-bg-raised/40 text-el-fg-muted hover:border-el-border-strong hover:text-el-fg"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Compliance Comparison Table */}
      <div className="overflow-hidden rounded-sm border border-el-border bg-[#04060A] shadow-el-md">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-el-border bg-el-bg-raised/60 text-el-fg-faint">
                <th className="py-3 px-4 uppercase tracking-wider">MANDATE & DOMAIN</th>
                <th className="py-3 px-4 uppercase tracking-wider text-el-amber">CLOUD SAAS ASSISTANT RISK</th>
                <th className="py-3 px-4 uppercase tracking-wider text-el-mint">ELEVEN SOVEREIGN MITIGATION</th>
                <th className="py-3 px-4 uppercase tracking-wider text-right">INVARIANT RULE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-el-border/60">
              {filteredRows.map((row) => {
                const isExpanded = expandedId === row.id;

                return (
                  <React.Fragment key={row.id}>
                    <tr
                      onClick={() => setExpandedId(isExpanded ? null : row.id)}
                      className={`cursor-pointer transition-colors ${
                        isExpanded ? "bg-el-cyan/5" : "hover:bg-el-bg-raised/30"
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-el-fg">{row.frameworkName}</span>
                          <span className="rounded-xs border border-el-border bg-el-bg px-1.5 py-0.2 font-mono text-[10px] text-el-fg-faint">
                            {row.controlId}
                          </span>
                        </div>
                        <p className="mt-1 font-sans text-xs text-el-fg-muted">{row.domain}</p>
                      </td>

                      <td className="py-4 px-4 font-sans text-xs text-red-200/90 leading-relaxed max-w-[280px]">
                        <div className="flex items-start gap-1.5">
                          <span className="text-red-400 shrink-0 font-mono">✕</span>
                          <span>{row.cloudRisk}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-sans text-xs text-el-mint/90 leading-relaxed max-w-[280px]">
                        <div className="flex items-start gap-1.5">
                          <span className="text-el-mint shrink-0 font-mono">✓</span>
                          <span>{row.sovereignMitigation}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <Link
                            href={row.invariantHref}
                            className="font-mono text-[11px] text-el-cyan hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {row.invariantRef}
                          </Link>
                          <span className="font-mono text-[10px] text-el-fg-faint">
                            {isExpanded ? "[- COLLAPSE]" : "[+ DETAILS]"}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Technical Verification Detail */}
                    {isExpanded && (
                      <tr className="bg-[#020306] border-b border-el-border/80">
                        <td colSpan={4} className="p-4 pl-8">
                          <div className="rounded-xs border border-el-cyan/30 bg-el-cyan/5 p-3.5 text-xs">
                            <div className="flex items-center gap-2 font-mono text-[11px] text-el-cyan">
                              <span className="h-1.5 w-1.5 rounded-full bg-el-cyan animate-pulse" />
                              <span>TECHNICAL ENFORCEMENT ARCHITECTURE // {row.controlId}</span>
                            </div>
                            <p className="mt-2 font-sans text-xs leading-relaxed text-el-fg-muted">
                              {row.details}
                            </p>
                            <div className="mt-3 flex items-center gap-4 font-mono text-[10px] text-el-fg-faint">
                              <span>VERIFICATION TEST: AUTOMATED INVARIANT SUITE</span>
                              <span>STATUS: ZERO-TOLERANCE FAIL-CLOSED</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}