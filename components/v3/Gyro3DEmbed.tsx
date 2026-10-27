"use client";

import React from "react";
import dynamic from "next/dynamic";

const ControlPlaneGyro3D = dynamic(
  () =>
    import("@/components/three/ControlPlaneGyro3D").then(
      (mod) => mod.ControlPlaneGyro3D
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[420px] w-full flex-col items-center justify-center rounded-sm border border-el-border bg-el-bg-raised p-8">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-el-border-strong border-t-el-accent" />
        <span className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-el-fg-faint">
          CALIBRATING 3D TOPOLOGY…
        </span>
      </div>
    ),
  }
);

export function Gyro3DEmbed({ compact = false }: { compact?: boolean }) {
  return <ControlPlaneGyro3D compact={compact} />;
}
