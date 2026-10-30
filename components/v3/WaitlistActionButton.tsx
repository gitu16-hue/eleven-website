"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { WaitlistModal } from "@/components/v3/WaitlistModal";

export function WaitlistActionButton({
  variant = "primary",
  arrow = false,
  className = "",
  tier = "general",
  children,
}: {
  variant?: "primary" | "secondary" | "ghost";
  arrow?: boolean;
  className?: string;
  tier?: "general" | "technical";
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant={variant}
        arrow={arrow}
        className={`cursor-pointer ${className}`}
        onClick={() => setIsOpen(true)}
      >
        {children}
      </Button>

      <WaitlistModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialTier={tier}
      />
    </>
  );
}
