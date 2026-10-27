"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { usePortalTransition } from "@/components/ui/PortalTransition";

export function PortalActionButton({
  variant = "primary",
  arrow = false,
  className = "",
  children,
}: {
  variant?: "primary" | "secondary" | "ghost";
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const { enterComputationalMode } = usePortalTransition();

  return (
    <Button
      type="button"
      variant={variant}
      arrow={arrow}
      className={`cursor-pointer ${className}`}
      onClick={enterComputationalMode}
    >
      {children}
    </Button>
  );
}
