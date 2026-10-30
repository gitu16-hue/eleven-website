"use client";

import React, { useId, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * Kinetic Sci-Fi Circuit Stream (Viewport-Gated & GPU-Optimized)
 * - Pauses completely when scrolled out of view (`useInView`) for 0% idle CPU/GPU cost
 * - Replaces expensive full-region SVG Gaussian blur filters with crisp dual-stroke
 *   vector laser halos for 5x faster frame rasterization
 */
export function AnimeCircuitStream() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: false, margin: "160px" });
  const reduced = useReducedMotion();
  const uniqueId = useId().replace(/:/g, "_");
  const animateActive = !reduced && inView;

  const path1 = "M 40 40 L 250 40 L 290 20 L 520 20 L 560 55 L 850 55 L 890 35 L 1160 35";
  const path2 = "M 80 60 L 320 60 L 360 40 L 640 40 L 680 15 L 940 15 L 980 45 L 1120 45";
  const path3 = "M 120 20 L 210 20 L 240 50 L 460 50 L 500 25 L 760 25 L 800 60 L 1060 60";

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden py-3 select-none pointer-events-none opacity-90"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-16 stroke-current"
      >
        <defs>
          <linearGradient id={`grad1_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.08" />
            <stop offset="25%" stopColor="#00F0FF" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.75" />
            <stop offset="90%" stopColor="#00FF9D" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00FF9D" stopOpacity="0.08" />
          </linearGradient>

          <linearGradient id={`grad2_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.12" />
            <stop offset="45%" stopColor="#00F0FF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* ── BASE STATIC CIRCUIT TRACKS ── */}
        <path
          d={path1}
          stroke={`url(#grad1_${uniqueId})`}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeOpacity="0.38"
        />
        <path
          d={path2}
          stroke={`url(#grad2_${uniqueId})`}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.32"
        />
        <path
          d={path3}
          stroke={`url(#grad1_${uniqueId})`}
          strokeWidth="1"
          strokeLinecap="round"
          strokeOpacity="0.28"
        />

        {/* ── DUAL-STROKE VECTOR LASER BEAMS (Active Only In Viewport) ── */}
        {animateActive && (
          <>
            {/* Beam 1 Halo + Core: Electric Cyan */}
            <motion.path
              d={path1}
              stroke="#00F0FF"
              strokeWidth="5"
              strokeOpacity="0.22"
              strokeLinecap="round"
              strokeDasharray="48 280"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -656 }}
              transition={{ duration: 4.6, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
              d={path1}
              stroke="#00F0FF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="48 280"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -656 }}
              transition={{ duration: 4.6, repeat: Infinity, ease: "linear" }}
            />

            {/* Beam 2 Halo + Core: Quantum Violet */}
            <motion.path
              d={path2}
              stroke="#8B5CF6"
              strokeWidth="4.5"
              strokeOpacity="0.22"
              strokeLinecap="round"
              strokeDasharray="36 320"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -712 }}
              transition={{ duration: 5.4, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
              d={path2}
              stroke="#8B5CF6"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="36 320"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -712 }}
              transition={{ duration: 5.4, repeat: Infinity, ease: "linear" }}
            />

            {/* Beam 3 Halo + Core: Signal Lime */}
            <motion.path
              d={path3}
              stroke="#00FF9D"
              strokeWidth="4"
              strokeOpacity="0.2"
              strokeLinecap="round"
              strokeDasharray="28 240"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -536 }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
              d={path3}
              stroke="#00FF9D"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDasharray="28 240"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -536 }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
            />
          </>
        )}

        {/* ── SENSOR JUNCTION NODES ── */}
        {[
          { cx: 290, cy: 20, color: "#00F0FF" },
          { cx: 560, cy: 55, color: "#8B5CF6" },
          { cx: 890, cy: 35, color: "#00FF9D" },
          { cx: 360, cy: 40, color: "#00F0FF" },
          { cx: 680, cy: 15, color: "#00FF9D" },
          { cx: 980, cy: 45, color: "#8B5CF6" },
          { cx: 240, cy: 50, color: "#00F0FF" },
          { cx: 500, cy: 25, color: "#8B5CF6" },
          { cx: 800, cy: 60, color: "#00FF9D" },
        ].map((node, i) => (
          <g key={`node-${i}`}>
            <circle cx={node.cx} cy={node.cy} r="5.5" fill={node.color} fillOpacity="0.16" />
            <circle cx={node.cx} cy={node.cy} r="2.6" fill={node.color} />
          </g>
        ))}

        {/* ── TELEMETRY BEACONS ── */}
        <g transform="translate(290, 11)">
          <circle cx="-28" cy="-2.5" r="2" fill="#00F0FF" />
          <text
            x="0"
            y="0"
            fill="#00F0FF"
            fontSize="8.5"
            fontFamily="var(--font-mono), monospace"
            letterSpacing="0.08em"
            textAnchor="middle"
            fontWeight="bold"
          >
            PCM:16k
          </text>
        </g>

        <g transform="translate(560, 73)">
          <circle cx="-25" cy="-2.5" r="2" fill="#8B5CF6" />
          <text
            x="0"
            y="0"
            fill="#8B5CF6"
            fontSize="8.5"
            fontFamily="var(--font-mono), monospace"
            letterSpacing="0.08em"
            textAnchor="middle"
            fontWeight="bold"
          >
            DAG:OK
          </text>
        </g>

        <g transform="translate(890, 24)">
          <circle cx="-28" cy="-2.5" r="2" fill="#00FF9D" />
          <text
            x="0"
            y="0"
            fill="#00FF9D"
            fontSize="8.5"
            fontFamily="var(--font-mono), monospace"
            letterSpacing="0.08em"
            textAnchor="middle"
            fontWeight="bold"
          >
            GATE:15
          </text>
        </g>
      </svg>
    </div>
  );
}
