"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const emptySubscribe = () => () => {};

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
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative z-10 w-full max-w-lg max-h-[90dvh] overflow-y-auto overscroll-contain rounded-md border border-white/10 bg-el-sec-graphite p-6 sm:p-8 text-el-sec-porcelain shadow-lg"
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-el-sec-lime">
            <span className="h-1.5 w-1.5 rounded-full bg-el-sec-lime motion-safe:animate-pulse motion-reduce:animate-none" />
            Access Gate · ELEVEN v3.1
          </div>
          <h2
            id="waitlist-title"
            className="mt-1.5 text-xl font-medium tracking-tight text-el-sec-porcelain"
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
          className="cursor-pointer rounded-xs border border-white/10 p-1.5 text-neutral-400 transition-colors hover:border-white/20 hover:text-el-sec-porcelain focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime active:scale-[0.96]"
        >
          ✕
        </button>
      </div>

      {/* Mode Selector Tabs */}
      <div className="mt-5 grid grid-cols-2 gap-1.5 rounded-sm border border-white/10 bg-el-sec-graphite-deep p-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => {
            setTier("general");
            setErrorMessage(null);
          }}
          className={`cursor-pointer rounded-xs py-1.5 text-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime active:scale-[0.98] ${
            tier === "general"
              ? "bg-el-sec-graphite-raised text-el-sec-porcelain shadow-sm"
              : "text-neutral-400 hover:text-el-sec-porcelain"
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
          className={`cursor-pointer rounded-xs py-1.5 text-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime active:scale-[0.98] ${
            tier === "technical"
              ? "bg-el-sec-graphite-raised text-el-sec-porcelain shadow-sm"
              : "text-neutral-400 hover:text-el-sec-porcelain"
          }`}
        >
          Technical Access (Devs)
        </button>
      </div>

      {/* Success State */}
      {persistedResult ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-sm border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-300">
            <p className="text-xs font-semibold">
              ✓ Registration confirmed & persisted
            </p>
            <p className="mt-2 text-xs leading-relaxed text-emerald-200/90">
              {persistedResult.message}
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full cursor-pointer rounded-sm border border-white/10 bg-el-sec-graphite-raised py-2.5 text-xs font-medium text-el-sec-porcelain transition-colors hover:bg-el-sec-graphite focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime"
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
              className="block text-xs font-medium text-neutral-300"
            >
              Email Address <span className="text-el-sec-lime">*</span>
            </label>
            <input
              id="waitlist-email"
              type="email"
              required
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-sm border border-white/10 bg-el-sec-graphite-deep px-3.5 py-2 text-sm text-el-sec-porcelain placeholder-neutral-500 transition-colors focus:border-el-sec-lime focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime"
            />
          </div>

          {/* Name (Optional) */}
          <div>
            <label
              htmlFor="waitlist-name"
              className="block text-xs font-medium text-neutral-300"
            >
              Full Name <span className="text-neutral-500">(Optional)</span>
            </label>
            <input
              id="waitlist-name"
              type="text"
              placeholder="Ada Lovelace"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-sm border border-white/10 bg-el-sec-graphite-deep px-3.5 py-2 text-sm text-el-sec-porcelain placeholder-neutral-500 transition-colors focus:border-el-sec-lime focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime"
            />
          </div>

          {/* Intended Use (Optional) */}
          <div>
            <label
              htmlFor="waitlist-use"
              className="block text-xs font-medium text-neutral-300"
            >
              {tier === "technical"
                ? "Primary Architecture / System Integration"
                : "Primary Use Case"}{" "}
              <span className="text-neutral-500">(Optional)</span>
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
              className="mt-1.5 w-full rounded-sm border border-white/10 bg-el-sec-graphite-deep px-3.5 py-2 text-sm text-el-sec-porcelain placeholder-neutral-500 transition-colors focus:border-el-sec-lime focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime"
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
              className="mt-0.5 h-4 w-4 rounded-xs border-white/20 bg-el-sec-graphite-deep text-el-sec-lime accent-el-sec-lime focus:ring-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime"
            />
            <label
              htmlFor="waitlist-consent"
              className="text-xs leading-relaxed text-neutral-400"
            >
              I consent to receive release notifications from GISHH Labs.
              Personal information is never shared, rented, or sold.
            </label>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="rounded-sm border border-rose-500/40 bg-rose-500/10 p-3 text-xs leading-relaxed text-rose-300">
              <span className="font-semibold">Notice:</span>{" "}
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-sm bg-el-sec-lime py-2.5 text-xs font-semibold text-el-sec-graphite transition-opacity hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime"
            >
              {loading
                ? "Validating…"
                : tier === "technical"
                ? "Submit Technical Request"
                : "Join Early Access"}
            </button>
          </div>

          <p className="text-center text-[11px] text-neutral-500 font-sans">
            Sovereign memory and human control plane. GISHH Labs.
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
  // SSR hydration safety guard using idiomatic React external store subscription
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const triggerRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus preservation and body scroll lock
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";

      // Focus first focusable input or button
      const timer = setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
          'button:not([disabled]), input:not([disabled]):not([type="hidden"]), [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }, 50);

      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  // Ensure body scroll lock cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Keyboard accessibility: ESC to close, Tab trapping
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null);

        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="waitlist-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto"
        >
          {/* Form Content Component: freshly mounted with initial state */}
          <WaitlistForm
            key={initialTier}
            initialTier={initialTier}
            onClose={onClose}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
