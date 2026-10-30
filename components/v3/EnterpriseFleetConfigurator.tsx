"use client";

import React, { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";

type IndustryPreset = "defense" | "fintech" | "healthcare" | "tech";
type OsMix = "mac" | "windows" | "hybrid";
type IsolationTier = "full_scif" | "hybrid_gateway" | "egress_scrubbed";
type Tab = "telemetry" | "manifest" | "controls";

export function EnterpriseFleetConfigurator() {
  const [seats, setSeats] = useState<number>(250);
  const [preset, setPreset] = useState<IndustryPreset>("fintech");
  const [osMix, setOsMix] = useState<OsMix>("hybrid");
  const [isolation, setIsolation] = useState<IsolationTier>("full_scif");
  const [activeTab, setActiveTab] = useState<Tab>("telemetry");
  const [copied, setCopied] = useState<boolean>(false);
  const sliderId = useId();

  // Industry Preset metadata
  const presetConfig = {
    defense: {
      label: "Defense & SCIF",
      badge: "FEDRAMP HIGH // ITAR",
      color: "text-el-amber",
      borderColor: "border-el-amber/40",
      complianceStandards: ["FedRAMP High", "NIST SP 800-171", "ITAR Category XI", "DoD IL6"],
      enforcementLevel: "Hard Air-Gap (Zero Network)",
      authType: "CAC / PIV / YubiKey FIDO2 Pin-Bound",
      maxAutonomyTier: "T1 (Supervised Human Approval Required for All Mutations)",
    },
    fintech: {
      label: "Banking & Financial Services",
      badge: "SEC 17A-4 // SOC 2 TYPE II",
      color: "text-el-cyan",
      borderColor: "border-el-cyan/40",
      complianceStandards: ["SEC Rule 17a-4", "SOC 2 Type II (All 5 Trust)", "PCI-DSS v4.0", "FINRA 4511"],
      enforcementLevel: "Cryptographic Merkle WORM Ledger",
      authType: "Okta / Microsoft Entra SAML 2.0 + WebAuthn FIDO2",
      maxAutonomyTier: "T2 (Pre-Approved Quarantined AST Worktrees)",
    },
    healthcare: {
      label: "Healthcare & Life Sciences",
      badge: "HIPAA HITECH // 21 CFR 11",
      color: "text-el-mint",
      borderColor: "border-el-mint/40",
      complianceStandards: ["HIPAA Security & Privacy Rules", "HITECH Act", "21 CFR Part 11", "HITRUST CSF"],
      enforcementLevel: "Local ePHI Encryption Sanctum",
      authType: "Enterprise SSO + Biometric Touch ID / Windows Hello",
      maxAutonomyTier: "T2 (Deterministic Policy Gate Validation)",
    },
    tech: {
      label: "Enterprise Software & AI Labs",
      badge: "ZERO IP EXFILTRATION",
      color: "text-purple-400",
      borderColor: "border-purple-400/40",
      complianceStandards: ["SOC 2 Type II", "ISO/IEC 27001:2022", "GDPR Art. 25 & 28", "EU AI Act High-Risk"],
      enforcementLevel: "Quarantined Git Worktree & AST Gates",
      authType: "Corporate IdP + Ed25519 Developer Keys in Secure Enclave",
      maxAutonomyTier: "T3 (Autonomous Read/Plan, Gated Mutation Execution)",
    },
  }[preset];

  // Dynamic calculations
  // Average developer/knowledge worker generates ~35 MB of code, prompts, logs, and docs daily
  const dailyDataGB = (seats * 35) / 1024;
  const monthlyDataTB = (dailyDataGB * 22) / 1024; // 22 work days
  const formattedMonthlyData = monthlyDataTB >= 1 ? `${monthlyDataTB.toFixed(1)} TB` : `${Math.round(dailyDataGB * 22)} GB`;

  // Cloud assistant license cost avoidance (~$35/seat/month + $15 compliance audit surcharge = $50/seat/mo)
  const annualCloudCostSavings = seats * 50 * 12;
  const formattedSavings = `$${annualCloudCostSavings.toLocaleString()}`;

  // Daily verified Merkle cryptographic audit proofs (~320 actions/prompts per seat per day)
  const dailyMerkleProofs = seats * 320;
  const formattedMerkleProofs = dailyMerkleProofs >= 1000000 
    ? `${(dailyMerkleProofs / 1000000).toFixed(2)}M`
    : `${(dailyMerkleProofs / 1000).toFixed(1)}k`;

  // Generated YAML Manifest
  const yamlManifest = `# ==============================================================================
# ELEVEN ENTERPRISE FLEET POLICY MANIFEST (v3.1)
# Organization Policy Profile: ${preset.toUpperCase()} (${presetConfig.label})
# Target Fleet Size: ${seats} Managed Workstations
# OS Target Architecture: ${osMix.toUpperCase()}
# Isolation Mode: ${isolation.toUpperCase()}
# Generated via ELEVEN Zero-Trust Policy Engine
# ==============================================================================

version: "3.1"
fleet_profile:
  tier: "enterprise_sovereign"
  enforcement_profile: "${preset}"
  authorized_seats: ${seats}
  watchdog_mode: "ring_0_ebpf_strict"
  hardware_killswitch_latency_max_ms: 50

identity_and_authentication:
  idp_provider: "${preset === 'defense' ? 'piv_cac_saml' : 'microsoft_entra_saml2'}"
  mfa_requirement: "fido2_webauthn_hardware_token_required"
  pin_bound_enforcement: ${preset === "defense" ? "true" : "false"}
  session_timeout_seconds: 28800 # 8 hours
  max_autonomy_level: "${presetConfig.maxAutonomyTier.slice(0, 2)}"

network_isolation_rules:
  default_policy: "DENY_ALL"
  allow_local_loopback_ipc: true
  allowed_inbound_ports: [] # Strictly zero inbound listening sockets
  allowed_outbound_endpoints:
    ${isolation === "full_scif" ? "# 100% AIR-GAPPED: Zero outbound connections permitted" : ""}${isolation === "hybrid_gateway" ? "- host: internal-gpu-inference.corp.local\n      port: 8443\n      protocol: mTLS_Ed25519" : ""}${isolation === "egress_scrubbed" ? "- host: siem-merkle-sink.corp.internal\n      port: 443\n      payload: 'SHA256_HASHES_ONLY_ZERO_PROMPTS'" : ""}
  blocked_domains_regex:
    - "^.*\\.openai\\.com$"
    - "^.*\\.anthropic\\.com$"
    - "^.*\\.googleapis\\.com$"
    - "^.*\\.cohere\\.ai$"
    - "^.*\\.mistral\\.ai$"

storage_and_encryption:
  vault_driver: "sqlite_aes_256_gcm"
  hardware_key_provider: "${osMix === 'mac' ? 'apple_secure_enclave' : osMix === 'windows' ? 'tpm_2_0_vbs' : 'hardware_tpm_or_nitrokey'}"
  key_rotation_interval_days: 30
  local_retention_days: 90
  zero_knowledge_scrubbing_on_session_end: true

continuous_audit_and_merkle_chain:
  merkle_hash_algorithm: "SHA-256"
  signature_scheme: "Ed25519"
  batch_checkpoint_frequency_seconds: 60
  siem_export_format: "RFC-5424_MERKLE_RECEIPT_V3"
  siem_destination: "syslog-tls://siem-collector.corp.internal:6514"
  compliance_tags:
${presetConfig.complianceStandards.map(s => `    - "${s}"`).join("\n")}
`;

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(yamlManifest);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full overflow-hidden rounded-sm border border-el-border bg-[#04060A] shadow-el-lg">
      {/* Console Top Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-el-border/80 bg-el-bg-raised/80 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-el-mint shadow-[0_0_8px_#00FF9D]" />
            <span className="h-2.5 w-2.5 rounded-full bg-el-cyan/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-el-border" />
          </div>
          <span className="font-mono text-xs font-semibold tracking-wider text-el-fg">
            FLEET_GOVERNANCE_CONFIGURATOR // ZERO-TRUST AIR-GAP
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-el-cyan">
            {presetConfig.badge}
          </span>
          <span className="rounded-xs border border-el-border bg-el-bg px-2 py-0.5 font-mono text-[10px] text-el-fg-faint">
            REV 3.1.8
          </span>
        </div>
      </div>

      {/* Main Grid: Controls on Left, Dynamic Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Interactive Parameter Console (5 Cols) */}
        <div className="space-y-6 border-b border-el-border p-5 lg:col-span-5 lg:border-b-0 lg:border-r lg:p-6">
          {/* 1. Fleet Seats Slider */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor={sliderId} className="font-mono font-medium text-el-fg">
                1. FLEET SIZE (MANAGED WORKSTATIONS)
              </label>
              <span className="rounded-xs border border-el-cyan/30 bg-el-cyan/10 px-2 py-0.5 font-mono text-xs font-semibold text-el-cyan">
                {seats.toLocaleString()} SEATS
              </span>
            </div>
            <input
              id={sliderId}
              type="range"
              min={25}
              max={2500}
              step={25}
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-el-border-strong accent-el-cyan"
            />
            <div className="flex justify-between font-mono text-[10px] text-el-fg-faint">
              <span>25 seats (Pilot)</span>
              <span>500 seats (Mid-Enterprise)</span>
              <span>2,500 seats (Global)</span>
            </div>
          </div>

          {/* 2. Industry Governance Profile */}
          <div className="space-y-2">
            <span className="font-mono text-xs font-medium text-el-fg">
              2. REGULATORY & COMPLIANCE PROFILE
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: "fintech", label: "Fintech & Banking", sub: "SEC 17a-4 / SOC2" },
                { id: "defense", label: "Defense & SCIF", sub: "FedRAMP / ITAR" },
                { id: "healthcare", label: "Healthcare", sub: "HIPAA / ePHI" },
                { id: "tech", label: "Software / AI", sub: "Zero-IP Egress" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPreset(p.id as IndustryPreset)}
                  className={`rounded-xs border p-2 text-left transition-all ${
                    preset === p.id
                      ? "border-el-cyan bg-el-cyan/10 text-el-cyan shadow-sm"
                      : "border-el-border bg-el-bg-raised/40 text-el-fg-muted hover:border-el-border-strong hover:text-el-fg"
                  }`}
                >
                  <p className="font-medium">{p.label}</p>
                  <p className="font-mono text-[10px] opacity-70">{p.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Hardware / OS Deployment Mix */}
          <div className="space-y-2">
            <span className="font-mono text-xs font-medium text-el-fg">
              3. ENDPOINT OS & HARDWARE KEYSTORE
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: "mac", label: "macOS M-Series", sub: "Secure Enclave" },
                { id: "windows", label: "Windows 11", sub: "TPM 2.0 / VBS" },
                { id: "hybrid", label: "Hybrid Fleet", sub: "Cross-Platform" },
              ].map((os) => (
                <button
                  key={os.id}
                  type="button"
                  onClick={() => setOsMix(os.id as OsMix)}
                  className={`rounded-xs border p-2 text-left transition-all ${
                    osMix === os.id
                      ? "border-el-cyan bg-el-cyan/10 text-el-cyan"
                      : "border-el-border bg-el-bg-raised/40 text-el-fg-muted hover:border-el-border-strong hover:text-el-fg"
                  }`}
                >
                  <p className="font-medium">{os.label}</p>
                  <p className="font-mono text-[9px] opacity-70">{os.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Air-Gap Isolation Level */}
          <div className="space-y-2">
            <span className="font-mono text-xs font-medium text-el-fg">
              4. NETWORK ISOLATION TOPOLOGY
            </span>
            <div className="space-y-1.5 text-xs">
              {[
                {
                  id: "full_scif",
                  label: "100% Air-Gapped (Zero Network)",
                  sub: "No outbound connections whatsoever. Local model weights loaded via verified MDM bundles.",
                },
                {
                  id: "hybrid_gateway",
                  label: "Private On-Premises GPU Cluster",
                  sub: "Workstations run local System 1 voice; deep System 2 delegates to internal private VPC over mTLS.",
                },
                {
                  id: "egress_scrubbed",
                  label: "Hash-Only SIEM Telemetry Sync",
                  sub: "Only cryptographic Merkle root hashes exported to Splunk/Datadog; zero raw code or prompt leakage.",
                },
              ].map((iso) => (
                <button
                  key={iso.id}
                  type="button"
                  onClick={() => setIsolation(iso.id as IsolationTier)}
                  className={`w-full rounded-xs border p-2 text-left transition-all ${
                    isolation === iso.id
                      ? "border-el-mint bg-el-mint/10 text-el-fg"
                      : "border-el-border bg-el-bg-raised/30 text-el-fg-muted hover:border-el-border-strong hover:text-el-fg"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className={`font-medium ${isolation === iso.id ? "text-el-mint" : "text-el-fg"}`}>
                      {iso.label}
                    </p>
                    {isolation === iso.id && (
                      <span className="font-mono text-[9px] text-el-mint">ACTIVE</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] leading-snug text-el-fg-muted">{iso.sub}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output & Telemetry View (7 Cols) */}
        <div className="flex flex-col justify-between p-5 lg:col-span-7 lg:p-6">
          {/* Top View Toggle Tabs */}
          <div>
            <div className="flex items-center justify-between border-b border-el-border pb-3">
              <div className="flex gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("telemetry")}
                  className={`rounded-xs px-3 py-1 font-medium transition-all ${
                    activeTab === "telemetry"
                      ? "bg-el-cyan/20 text-el-cyan border border-el-cyan/40"
                      : "text-el-fg-faint hover:text-el-fg hover:bg-el-bg-raised"
                  }`}
                >
                  [1] LIVE FLEET METRICS
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("manifest")}
                  className={`rounded-xs px-3 py-1 font-medium transition-all ${
                    activeTab === "manifest"
                      ? "bg-el-cyan/20 text-el-cyan border border-el-cyan/40"
                      : "text-el-fg-faint hover:text-el-fg hover:bg-el-bg-raised"
                  }`}
                >
                  [2] MDM POLICY MANIFEST (YAML)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("controls")}
                  className={`rounded-xs px-3 py-1 font-medium transition-all ${
                    activeTab === "controls"
                      ? "bg-el-cyan/20 text-el-cyan border border-el-cyan/40"
                      : "text-el-fg-faint hover:text-el-fg hover:bg-el-bg-raised"
                  }`}
                >
                  [3] COMPLIANCE CONTROLS
                </button>
              </div>

              {activeTab === "manifest" && (
                <button
                  type="button"
                  onClick={handleCopyManifest}
                  className="flex items-center gap-1.5 rounded-xs border border-el-cyan/40 bg-el-cyan/10 px-2.5 py-1 font-mono text-[11px] text-el-cyan hover:bg-el-cyan/20"
                >
                  {copied ? (
                    <>
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      COPIED
                    </>
                  ) : (
                    <>
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      COPY YAML
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Tab 1: Live Fleet Metrics */}
            {activeTab === "telemetry" && (
              <div className="mt-5 space-y-4">
                {/* 4 Quick Stat Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative overflow-hidden rounded-xs border border-el-border bg-el-bg-raised/40 p-3.5">
                    <span className="font-mono text-[10px] uppercase text-el-fg-faint">
                      PREVENTED CLOUD EXFILTRATION
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-mono text-2xl font-bold tracking-tight text-el-mint">
                        {formattedMonthlyData}
                      </span>
                      <span className="text-[11px] text-el-fg-faint">/ month</span>
                    </div>
                    <p className="mt-1 text-[11px] text-el-fg-muted">
                      Source code, diffs, proprietary prompts retained 100% on endpoints.
                    </p>
                    <div className="pointer-events-none absolute top-1 right-1 font-mono text-[10px] text-el-mint/40">
                      ⌜ ⌟
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xs border border-el-border bg-el-bg-raised/40 p-3.5">
                    <span className="font-mono text-[10px] uppercase text-el-fg-faint">
                      ANNUAL SAAS COST AVOIDANCE
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-mono text-2xl font-bold tracking-tight text-el-cyan">
                        {formattedSavings}
                      </span>
                      <span className="text-[11px] text-el-fg-faint">/ year</span>
                    </div>
                    <p className="mt-1 text-[11px] text-el-fg-muted">
                      Eliminates recurring per-seat cloud assistant & compliance surcharges.
                    </p>
                    <div className="pointer-events-none absolute top-1 right-1 font-mono text-[10px] text-el-cyan/40">
                      ⌜ ⌟
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xs border border-el-border bg-el-bg-raised/40 p-3.5">
                    <span className="font-mono text-[10px] uppercase text-el-fg-faint">
                      MERKLE PROOFS GENERATED
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-mono text-2xl font-bold tracking-tight text-el-fg">
                        {formattedMerkleProofs}
                      </span>
                      <span className="text-[11px] text-el-fg-faint">/ day</span>
                    </div>
                    <p className="mt-1 text-[11px] text-el-fg-muted">
                      Cryptographically signed Ed25519 action verification tokens.
                    </p>
                    <div className="pointer-events-none absolute top-1 right-1 font-mono text-[10px] text-el-border">
                      ⌜ ⌟
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xs border border-el-border bg-el-bg-raised/40 p-3.5">
                    <span className="font-mono text-[10px] uppercase text-el-fg-faint">
                      RING-0 HARDWARE KILLSWITCH
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-mono text-2xl font-bold tracking-tight text-el-mint">
                        &lt; 50 ms
                      </span>
                      <span className="text-[11px] text-el-fg-faint">deterministic</span>
                    </div>
                    <p className="mt-1 text-[11px] text-el-fg-muted">
                      Hard process termination on policy violation or socket escape.
                    </p>
                    <div className="pointer-events-none absolute top-1 right-1 font-mono text-[10px] text-el-mint/40">
                      ⌜ ⌟
                    </div>
                  </div>
                </div>

                {/* Fleet Deployment Security Pipeline Architecture Box */}
                <div className="rounded-xs border border-el-border bg-[#020408] p-3.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between border-b border-el-border/60 pb-2 text-[10px] text-el-fg-faint">
                    <span>SECURITY PIPELINE STATUS</span>
                    <span className="text-el-mint">100% INVARIANT PASS</span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-el-fg-muted">Centralized MDM Policy Sync:</span>
                      <span className="text-el-cyan">Automated via Jamf / Intune (.pkg/.msi)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-el-fg-muted">Hardware Keystore:</span>
                      <span className="text-el-fg">
                        {osMix === "mac" ? "Apple Secure Enclave (T2/M-Series)" : osMix === "windows" ? "TPM 2.0 / VBS Isolation" : "Hardware Enclave & Nitrokey"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-el-fg-muted">Authentication Bridge:</span>
                      <span className="text-el-fg">{presetConfig.authType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-el-fg-muted">Outbound Network Sockets:</span>
                      <span className={isolation === "full_scif" ? "text-el-mint font-semibold" : "text-el-cyan"}>
                        {isolation === "full_scif" ? "0 BYTES (SCIF AIR-GAP ENFORCED)" : "STRICT MTLS ZERO-KNOWLEDGE"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: MDM Policy Manifest (YAML) */}
            {activeTab === "manifest" && (
              <div className="mt-4">
                <div className="relative max-h-[380px] overflow-y-auto rounded-xs border border-el-border bg-[#020306] p-4 font-mono text-[11px] leading-relaxed text-el-fg-muted">
                  <pre className="whitespace-pre">{yamlManifest}</pre>
                </div>
              </div>
            )}

            {/* Tab 3: Compliance Controls */}
            {activeTab === "controls" && (
              <div className="mt-4 space-y-2.5">
                <p className="font-mono text-xs text-el-fg-muted">
                  The {presetConfig.label} profile maps to the following non-negotiable enterprise controls:
                </p>
                <div className="space-y-2">
                  {presetConfig.complianceStandards.map((std, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xs border border-el-border bg-el-bg-raised/40 p-3">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-el-mint/10 text-el-mint">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="text-xs">
                        <p className="font-mono font-medium text-el-fg">{std}</p>
                        <p className="text-[11px] text-el-fg-muted">
                          Enforced via local-first execution sanctum, zero cloud telemetry, and signed Merkle receipts.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Note & Quick Consultation Banner */}
          <div className="mt-5 border-t border-el-border/80 pt-3 text-[11px]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-el-fg-faint">
                READY FOR PILOT DEPLOYMENT (25-100 SEATS)
              </span>
              <span className="font-mono text-el-cyan">
                DETERMINISTIC · AUDITABLE · AIR-GAPPED
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}