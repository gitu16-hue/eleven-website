"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTier?: "general" | "technical";
}

function WaitlistForm({
  initialTier,
  onClose,
}: {
  initialTier: "general" | "technical";
  onClose: () => void;
}) {
  const [tier, setTier] = useState<"general" | "technical">(initialTier);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [intendedUse, setIntendedUse] = useState("");
  const [consent, setConsent] = useState(false);
  const [hpCompany, setHpCompany] = useState(""); // Honeypot field

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [persistedResult, setPersistedResult] = useState<{
    tier: "general" | "technical";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }

    if (!consent) {
      setErrorMessage("You must accept the communication consent to proceed.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          intendedUse,
          tier,
          consent,
          hp_company: hpCompany,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(
          data.error || "Unable to complete registration. Please try again."
        );
      } else {
        // Guaranteed actual database persistence
        setPersistedResult({
          tier: data.tier,
          message: data.message,
        });
      }
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 12 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto overscroll-contain rounded-sm border border-el-border-strong bg-el-bg-raised p-5 sm:p-8 shadow-el-lg"
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-el-border pb-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-el-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-el-accent animate-pulse" />
            ACCESS GATE · ELEVEN v3.1
          </div>
          <h2
            id="waitlist-title"
            className="mt-1.5 text-el-xl font-medium tracking-[-0.02em] text-el-fg"
          >
            {tier === "technical"
              ? "Request Technical Access"
              : "Join Early Access"}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="cursor-pointer rounded-sm border border-el-border p-1.5 text-el-fg-faint transition-colors hover:border-el-border-strong hover:text-el-fg"
        >
          ✕
        </button>
      </div>

      {/* Mode Selector Tabs */}
      <div className="mt-5 grid grid-cols-2 gap-2 rounded-sm border border-el-border bg-el-bg p-1 font-mono text-el-xs">
        <button
          type="button"
          onClick={() => {
            setTier("general");
            setErrorMessage(null);
          }}
          className={`cursor-pointer rounded-xs py-1.5 text-center transition-colors ${
            tier === "general"
              ? "bg-el-bg-raised font-semibold text-el-fg shadow-el-sm"
              : "text-el-fg-muted hover:text-el-fg"
          }`}
        >
          General Early Access
        </button>
        <button
          type="button"
          onClick={() => {
            setTier("technical");
            setErrorMessage(null);
          }}
          className={`cursor-pointer rounded-xs py-1.5 text-center transition-colors ${
            tier === "technical"
              ? "bg-el-bg-raised font-semibold text-el-fg shadow-el-sm"
              : "text-el-fg-muted hover:text-el-fg"
          }`}
        >
          Technical Access (Devs)
        </button>
      </div>

      {/* Success State — Rendered ONLY when actually persisted in DB */}
      {persistedResult ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-sm border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-300">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] font-semibold">
              ✓ REGISTRATION CONFIRMED & PERSISTED
            </p>
            <p className="mt-2 text-el-xs leading-[1.6]">
              {persistedResult.message}
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full cursor-pointer rounded-sm border border-el-border-strong bg-el-bg-raised py-2.5 font-mono text-el-xs uppercase tracking-[0.06em] text-el-fg transition-colors hover:bg-el-bg"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        /* Form State */
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Honeypot field (hidden from human users, catches spam bots) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="hp_company">Company Website</label>
            <input
              type="text"
              id="hp_company"
              name="hp_company"
              tabIndex={-1}
              autoComplete="off"
              value={hpCompany}
              onChange={(e) => setHpCompany(e.target.value)}
            />
          </div>

          {/* Email (Required) */}
          <div>
            <label
              htmlFor="waitlist-email"
              className="block font-mono text-[11px] uppercase tracking-[0.06em] text-el-fg-muted"
            >
              Email Address <span className="text-el-accent">*</span>
            </label>
            <input
              id="waitlist-email"
              type="email"
              required
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-sm border border-el-border bg-el-bg px-3.5 py-2 text-base sm:text-el-sm text-el-fg placeholder-el-fg-faint transition-colors focus:border-el-accent focus:outline-none"
            />
          </div>

          {/* Name (Optional) */}
          <div>
            <label
              htmlFor="waitlist-name"
              className="block font-mono text-[11px] uppercase tracking-[0.06em] text-el-fg-muted"
            >
              Full Name <span className="text-el-fg-faint">(Optional)</span>
            </label>
            <input
              id="waitlist-name"
              type="text"
              placeholder="Ada Lovelace"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-sm border border-el-border bg-el-bg px-3.5 py-2 text-base sm:text-el-sm text-el-fg placeholder-el-fg-faint transition-colors focus:border-el-accent focus:outline-none"
            />
          </div>

          {/* Intended Use (Optional) */}
          <div>
            <label
              htmlFor="waitlist-use"
              className="block font-mono text-[11px] uppercase tracking-[0.06em] text-el-fg-muted"
            >
              {tier === "technical"
                ? "Primary Architecture / System Integration"
                : "Primary Use Case"}{" "}
              <span className="text-el-fg-faint">(Optional)</span>
            </label>
            <input
              id="waitlist-use"
              type="text"
              placeholder={
                tier === "technical"
                  ? "e.g. Local DAG agents, TaskCompiler SDK, policy gating"
                  : "e.g. Autonomous desktop research, local sovereign memory"
              }
              value={intendedUse}
              onChange={(e) => setIntendedUse(e.target.value)}
              className="mt-1.5 w-full rounded-sm border border-el-border bg-el-bg px-3.5 py-2 text-base sm:text-el-sm text-el-fg placeholder-el-fg-faint transition-colors focus:border-el-accent focus:outline-none"
            />
          </div>

          {/* Consent & Privacy Notice */}
          <div className="flex items-start gap-2.5 pt-1">
            <input
              id="waitlist-consent"
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded-xs border-el-border bg-el-bg text-el-accent accent-el-accent focus:ring-0"
            />
            <label
              htmlFor="waitlist-consent"
              className="text-el-xs leading-[1.5] text-el-fg-muted"
            >
              I consent to receive release notifications from GISHH Labs.
              Personal information is never shared, rented, or sold.
            </label>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="rounded-sm border border-rose-500/40 bg-rose-500/10 p-3 font-mono text-[11px] leading-[1.6] text-rose-300">
              <span className="font-semibold uppercase">System Notice:</span>{" "}
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-sm border border-el-border-strong bg-el-fg py-2.5 font-mono text-el-xs uppercase tracking-[0.08em] text-el-bg font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Validating…"
                : tier === "technical"
                ? "Submit Technical Request"
                : "Join Early Access"}
            </button>
          </div>

          <p className="text-center font-mono text-[10px] text-el-fg-faint">
            SOVEREIGN MEMORY · HUMAN CONTROL PLANE · GISHH LABS
          </p>
        </form>
      )}
    </motion.div>
  );
}

export function WaitlistModal({
  isOpen,
  onClose,
  initialTier = "general",
}: WaitlistModalProps) {
  // Handle ESC key to close modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="waitlist-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Form Content Component: freshly mounted with initial state */}
          <WaitlistForm
            key={initialTier}
            initialTier={initialTier}
            onClose={onClose}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
