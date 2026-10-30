"use client";

import React, { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";

const emptySubscribe = () => () => {};

function Gyro3DPreloader({ compact }: { compact?: boolean }) {
  return (
    <div
      className={`relative flex w-full flex-col justify-between overflow-hidden rounded-sm border border-el-border bg-el-bg-raised ${
        compact ? "min-h-[430px]" : "min-h-[510px]"
      }`}
    >
      <div className="flex items-center justify-between border-b border-el-border px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-el-accent animate-pulse" />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-el-fg-muted">
            INITIALIZING WEBGL TOPOLOGY
          </span>
        </div>
        <span className="font-mono text-[10px] tracking-[0.08em] text-el-accent">
          GLSL SHADERS · 60FPS
        </span>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center p-8">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-dashed border-el-accent/35 animate-spin [animation-duration:8s]" />
          <span className="absolute inset-3 rounded-full border border-el-violet/45 animate-spin [animation-direction:reverse] [animation-duration:5s]" />
          <span className="absolute inset-7 rounded-full border border-el-signal-lime/50 animate-pulse" />
          <span className="h-3 w-3 rounded-full bg-el-accent shadow-[0_0_14px_rgba(0,240,255,0.8)]" />
        </div>
        <span className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-el-fg-faint">
          CALIBRATING 5-RING CONTROL PLANE…
        </span>
      </div>

      <div className="border-t border-el-border bg-el-bg p-3.5 sm:p-4">
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {["Overview", "Quick Voice", "Deep Mind", "5 Safety Rings"].map(
            (label) => (
              <div
                key={label}
                className="rounded-sm border border-el-border bg-el-bg-raised/60 px-2.5 py-2 text-center font-mono text-[10.5px] text-el-fg-faint"
              >
                {label}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

const ControlPlaneGyro3D = dynamic(
  () =>
    import("@/components/three/ControlPlaneGyro3D").then(
      (mod) => mod.ControlPlaneGyro3D
    ),
  {
    ssr: false,
    loading: () => <Gyro3DPreloader />,
  }
);

export function Gyro3DEmbed({
  compact = false,
  theme = "dark",
}: {
  compact?: boolean;
  theme?: "dark" | "light";
}) {
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!hydrated) {
    return <Gyro3DPreloader compact={compact} />;
  }

  return <ControlPlaneGyro3D compact={compact} theme={theme} />;
}
