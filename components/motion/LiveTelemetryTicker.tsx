"use client";

import React, { useEffect, useState } from "react";

/**
 * Editorial status strip under the nav.
 * Deliberately shows only true information: product stage, published design
 * targets, and the visitor's local time. It does not claim a live runtime.
 */
export function LiveTelemetryTicker() {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const update = () => {
      if (document.visibilityState !== "hidden") {
        setTimeStr(fmt.format(new Date()));
      }
    };
    update();
    const interval = setInterval(update, 1000);
    const onVisibility = () => {
      if (document.visibilityState === "visible") update();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="relative z-30 border-b border-el-border/60 bg-el-bg/70 px-4 py-2 backdrop-blur-md select-none sm:px-6 lg:px-10"
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between font-mono text-[10.5px] text-el-fg-faint">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-el-accent opacity-60 el-breathe" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-el-accent" />
            </span>
            <span className="uppercase tracking-[0.16em] text-el-fg-muted">
              Early access preview
            </span>
          </span>

          <span className="hidden text-el-border-strong sm:inline">/</span>
          <span className="hidden uppercase tracking-[0.12em] sm:inline">
            Local-first · Human-approved actions
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden uppercase tracking-[0.12em] lg:inline">
            Design targets: voice &lt;0.5s · stop &lt;50ms
          </span>
          <span className="hidden text-el-border-strong lg:inline">/</span>
          <span className="tabular-nums tracking-[0.08em] text-el-fg-muted">
            {timeStr || "--:--:--"}
          </span>
        </div>
      </div>
    </div>
  );
}
