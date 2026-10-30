"use client";

import React, { useState, useId } from "react";
import { motion } from "framer-motion";

type ContextDensity = "light" | "balanced" | "heavy";
type EmbeddingDim = 384 | 768 | 1536;

export function SovereignVaultCalculator() {
  const [turns, setTurns] = useState<number>(50000); // 50k default
  const [density, setDensity] = useState<ContextDensity>("balanced");
  const [dimension, setDimension] = useState<EmbeddingDim>(768);
  const turnsSliderId = useId();

  // Bytes per turn based on context density
  const bytesPerTurn = {
    light: 1200, // 1.2 KB (concise chat turns)
    balanced: 4800, // 4.8 KB (structured tasks, code snippets, notes)
    heavy: 18500, // 18.5 KB (rich monorepo logs, multi-file code diffs, PDFs)
  }[density];

  // Vector index storage overhead per turn
  // Float32 = 4 bytes per dim + 32 graph edges * 8 bytes = dim * 4 + 256 bytes + hierarchy overhead
  const vectorBytesPerTurn = dimension * 4 + 320;

  // SQLite B-tree & WAL journal overhead factor (~1.18x)
  const sqliteOverhead = 1.18;

  // Raw SQLite disk footprint in MB
  const rawSqliteBytes = turns * bytesPerTurn * sqliteOverhead;
  const rawSqliteMB = rawSqliteBytes / (1024 * 1024);

  // Vector Index RAM in MB
  const vectorIndexBytes = turns * vectorBytesPerTurn;
  const vectorIndexMB = vectorIndexBytes / (1024 * 1024);

  // Total Vault Footprint on SSD
  const totalDiskMB = rawSqliteMB + vectorIndexMB * 1.05; // vector graph persisted on disk
  const totalDiskFormatted =
    totalDiskMB >= 1024
      ? `${(totalDiskMB / 1024).toFixed(2)} GB`
      : `${Math.round(totalDiskMB)} MB`;

  const vectorRamFormatted =
    vectorIndexMB >= 1024
      ? `${(vectorIndexMB / 1024).toFixed(2)} GB`
      : `${Math.round(vectorIndexMB)} MB`;

  // Knowledge Graph estimated edges (avg ~4.2 entities/relations per turn)
  const estimatedEdges = Math.round(turns * 4.2);

  // Annual Cloud Vector DB / Managed DB cost avoided:
  // e.g. Pinecone Starter/Standard: $70/mo for 250k vectors + AWS RDS Postgres $60/mo
  const annualCloudCostSaved = Math.round(
    Math.max(360, (turns / 50000) * 480 + 360)
  );

  return (
    <div className="w-full overflow-hidden rounded-sm border border-el-border bg-[#05080E] font-mono shadow-el-lg">
      {/* Top Cyber Title Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-el-border/80 bg-el-bg-raised/80 px-4 py-3 text-[11px]">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-el-accent animate-pulse" />
          <span className="text-el-fg font-semibold tracking-wider">
            VAULT_CAPACITY_SIMULATOR // LOCAL_CRYPTFS
          </span>
          <span className="hidden rounded-xs border border-el-accent/30 bg-el-accent/10 px-1.5 py-0.2 text-[9.5px] text-el-accent sm:inline">
            100%_CONFINED_127.0.0.1
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10.5px] text-el-fg-faint">
          <span>CIPHER:</span>
          <span className="text-el-signal-lime font-semibold">AES-256-GCM (Argon2id)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-12 lg:p-8">
        {/* Left Inputs Column */}
        <div className="space-y-6 lg:col-span-6">
          {/* Slider: Conversation History Volume */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-el-xs">
              <label htmlFor={turnsSliderId} className="text-el-fg">Lifetime Conversational Turns:</label>
              <span className="font-semibold text-el-accent text-sm tabular-nums">
                {turns.toLocaleString()} turns
              </span>
            </div>
            <input
              id={turnsSliderId}
              type="range"
              min={1000}
              max={500000}
              step={5000}
              value={turns}
              onChange={(e) => setTurns(Number(e.target.value))}
              aria-label="Lifetime Conversational Turns"
              className="h-1.5 w-full cursor-pointer appearance-none rounded-sm bg-el-border accent-el-accent"
            />
            <div className="flex justify-between text-[10px] text-el-fg-faint">
              <span>1k (1 Month)</span>
              <span>50k (~3 Years)</span>
              <span>250k (~10 Years)</span>
              <span>500k (Master Vault)</span>
            </div>
          </div>

          {/* Context Density Selector */}
          <div className="space-y-2">
            <label className="text-el-xs text-el-fg">Conversation &amp; Task Density:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDensity("light")}
                className={`cursor-pointer rounded-xs border p-2.5 text-center text-[10.5px] transition-all ${
                  density === "light"
                    ? "border-el-accent bg-el-accent/10 text-el-accent font-semibold"
                    : "border-el-border bg-el-bg-raised/50 text-el-fg-muted hover:border-el-border-strong"
                }`}
              >
                <div className="font-semibold">Light Chat</div>
                <div className="text-[9.5px] opacity-75">~1.2 KB / turn</div>
              </button>
              <button
                type="button"
                onClick={() => setDensity("balanced")}
                className={`cursor-pointer rounded-xs border p-2.5 text-center text-[10.5px] transition-all ${
                  density === "balanced"
                    ? "border-el-accent bg-el-accent/10 text-el-accent font-semibold"
                    : "border-el-border bg-el-bg-raised/50 text-el-fg-muted hover:border-el-border-strong"
                }`}
              >
                <div className="font-semibold">Balanced Tasks</div>
                <div className="text-[9.5px] opacity-75">~4.8 KB / turn</div>
              </button>
              <button
                type="button"
                onClick={() => setDensity("heavy")}
                className={`cursor-pointer rounded-xs border p-2.5 text-center text-[10.5px] transition-all ${
                  density === "heavy"
                    ? "border-el-accent bg-el-accent/10 text-el-accent font-semibold"
                    : "border-el-border bg-el-bg-raised/50 text-el-fg-muted hover:border-el-border-strong"
                }`}
              >
                <div className="font-semibold">Monorepo / Code</div>
                <div className="text-[9.5px] opacity-75">~18.5 KB / turn</div>
              </button>
            </div>
          </div>

          {/* Embedding Dimension Selector */}
          <div className="space-y-2">
            <label className="text-el-xs text-el-fg">Vector Embedding Dimension (HNSW):</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDimension(384)}
                className={`cursor-pointer rounded-xs border p-2.5 text-center text-[10.5px] transition-all ${
                  dimension === 384
                    ? "border-el-signal-lime bg-el-signal-lime/10 text-el-signal-lime font-semibold"
                    : "border-el-border bg-el-bg-raised/50 text-el-fg-muted hover:border-el-border-strong"
                }`}
              >
                <div className="font-semibold">384-d MiniLM</div>
                <div className="text-[9.5px] opacity-75">Ultra-Fast / Low RAM</div>
              </button>
              <button
                type="button"
                onClick={() => setDimension(768)}
                className={`cursor-pointer rounded-xs border p-2.5 text-center text-[10.5px] transition-all ${
                  dimension === 768
                    ? "border-el-signal-lime bg-el-signal-lime/10 text-el-signal-lime font-semibold"
                    : "border-el-border bg-el-bg-raised/50 text-el-fg-muted hover:border-el-border-strong"
                }`}
              >
                <div className="font-semibold">768-d Nomic</div>
                <div className="text-[9.5px] opacity-75">Default v3.1 Spec</div>
              </button>
              <button
                type="button"
                onClick={() => setDimension(1536)}
                className={`cursor-pointer rounded-xs border p-2.5 text-center text-[10.5px] transition-all ${
                  dimension === 1536
                    ? "border-el-signal-lime bg-el-signal-lime/10 text-el-signal-lime font-semibold"
                    : "border-el-border bg-el-bg-raised/50 text-el-fg-muted hover:border-el-border-strong"
                }`}
              >
                <div className="font-semibold">1536-d Large</div>
                <div className="text-[9.5px] opacity-75">Deep Precision</div>
              </button>
            </div>
          </div>

          {/* Cryptographic Key Specs Note */}
          <div className="rounded-xs border border-el-border/60 bg-el-bg-raised/30 p-3 text-[10.5px] text-el-fg-faint leading-relaxed">
            <span className="text-el-fg font-medium">Cryptographic Security:</span> Memory drawers are encrypted at rest using AES-256-GCM. Decryption keys are derived from your device password via Argon2id (m=64MB, t=1, p=4) and stored exclusively in Apple Secure Enclave / Windows TPM 2.0.
          </div>
        </div>

        {/* Right Output Dashboard */}
        <div className="flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/60 p-6 lg:col-span-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-el-border pb-3">
              <span className="text-[11px] uppercase tracking-wider text-el-fg-faint">
                SOVEREIGN STORAGE BREAKDOWN
              </span>
              <span className="rounded-xs border border-el-accent/40 bg-el-accent/10 px-2 py-0.5 text-[10px] font-semibold text-el-accent">
                SSD COMPATIBLE
              </span>
            </div>

            {/* Total Storage Metric */}
            <div>
              <p className="text-[11px] text-el-fg-faint uppercase">Total Encrypted Vault Size</p>
              <motion.div
                key={totalDiskFormatted}
                initial={{ scale: 0.96, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-el-accent tabular-nums"
              >
                {totalDiskFormatted}
              </motion.div>
              <p className="mt-1 text-[11px] text-el-fg-muted">
                Fits easily on any standard laptop or workstation drive with zero cloud storage required.
              </p>
            </div>

            {/* 4 Memory Drawers Footprint Grid */}
            <div className="space-y-2.5 pt-2 text-[11px]">
              {/* Drawer 1 */}
              <div className="flex items-center justify-between rounded-xs border border-el-border/60 bg-el-bg/40 p-2.5">
                <div>
                  <span className="font-semibold text-el-fg">Drawer 1: Preferences &amp; Identities</span>
                  <div className="text-[10px] text-el-fg-faint">Structured SQLite (prefs.db)</div>
                </div>
                <span className="font-mono text-el-signal-lime font-semibold">&lt;4.2 MB</span>
              </div>

              {/* Drawer 2 */}
              <div className="flex items-center justify-between rounded-xs border border-el-border/60 bg-el-bg/40 p-2.5">
                <div>
                  <span className="font-semibold text-el-fg">Drawer 2: Ephemeral Scratchpad</span>
                  <div className="text-[10px] text-el-fg-faint">RAM MMAP (Auto-purged on exit)</div>
                </div>
                <span className="font-mono text-el-signal-lime font-semibold">&lt;16 MB RAM</span>
              </div>

              {/* Drawer 3 */}
              <div className="flex items-center justify-between rounded-xs border border-el-border/60 bg-el-bg/40 p-2.5">
                <div>
                  <span className="font-semibold text-el-fg">Drawer 3: Episodic Interactions</span>
                  <div className="text-[10px] text-el-fg-faint">Bi-temporal history (episodes.db)</div>
                </div>
                <span className="font-mono text-el-accent font-semibold">
                  {rawSqliteMB >= 1024
                    ? `${(rawSqliteMB / 1024).toFixed(2)} GB`
                    : `${Math.round(rawSqliteMB)} MB`}
                </span>
              </div>

              {/* Drawer 4 */}
              <div className="flex items-center justify-between rounded-xs border border-el-border/60 bg-el-bg/40 p-2.5">
                <div>
                  <span className="font-semibold text-el-fg">Drawer 4: Semantic Vector Index</span>
                  <div className="text-[10px] text-el-fg-faint">HNSW Graph ({estimatedEdges.toLocaleString()} edges)</div>
                </div>
                <span className="font-mono text-purple-400 font-semibold">
                  {vectorRamFormatted} RAM
                </span>
              </div>
            </div>

            {/* Cost Avoidance Card */}
            <div className="rounded-xs border border-el-signal-lime/30 bg-el-signal-lime/5 p-3.5 text-el-xs">
              <div className="flex items-center justify-between text-el-signal-lime font-semibold">
                <span>CLOUD VECTOR &amp; DB BILL SAVED:</span>
                <span className="tabular-nums font-mono text-sm">
                  ${annualCloudCostSaved.toLocaleString()} / yr
                </span>
              </div>
              <p className="mt-1 text-[10.5px] text-el-fg-muted leading-relaxed">
                Running your vector memory locally avoids monthly managed vector database subscriptions (e.g. Pinecone / Weaviate Cloud) and data transfer egress fees.
              </p>
            </div>
          </div>

          {/* Bottom Telemetry Strip */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-el-border/80 pt-4 text-[10.5px] text-el-fg-faint">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-el-signal-lime" />
              <span>ARGON2ID UNLOCK: ~180ms</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-el-accent" />
              <span>AES-NI SPEED: ~3.8 GB/s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
