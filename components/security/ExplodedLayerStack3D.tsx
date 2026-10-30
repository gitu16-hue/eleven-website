"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Layers, RotateCcw, SlidersHorizontal, Shield, Cpu } from "lucide-react";
import { useClarityMode } from "@/components/motion/PremiumMotion";
import {
  usePrefersReducedMotion,
  useWebGLAvailable,
} from "@/components/security/useSecurityEnv";
import {
  SecurityTextReveal,
  SecurityNumberCounter,
} from "./SecurityMotionPrimitives";

export interface ArchitecturalLayerSpec {
  index: number;
  code: string;
  processDomain: string;
  plainTitle: string;
  techTitle: string;
  plainSummary: string;
  techSummary: string;
  boundaryContract: string;
  verificationNote: string;
  accentHex: string;
  geometryKind: "hud" | "acoustic" | "bus" | "gate" | "tournament" | "sandbox" | "vault";
}

export const ARCHITECTURAL_LAYERS: ArchitecturalLayerSpec[] = [
  {
    index: 0,
    code: "L07",
    processDomain: "eleven_hud",
    plainTitle: "Operator HUD & Honest Receipts",
    techTitle: "Operator Surface & Cold-Room HUD",
    plainSummary:
      "Displays live system state and plain-fact 30-second approval cards stripped of persuasive AI sales talk.",
    techSummary:
      "Renders visual telemetry and Protocol D DEC-008 receipt surfaces isolated from untrusted LLM prose.",
    boundaryContract: "Canonical Diff Only · Global Killswitch Shortcut",
    verificationNote: "UI pattern modeled in web showcase; native hotkey belongs to desktop OS spec",
    accentHex: "#F5F5F0",
    geometryKind: "hud",
  },
  {
    index: 1,
    code: "L06",
    processDomain: "eleven_voice",
    plainTitle: "Dedicated Listening & Voice Room",
    techTitle: "Duplex Acoustic & Speculative Voice",
    plainSummary:
      "Processes microphone input in its own isolated room so heavy background tasks never cause voice stutter.",
    techSummary:
      "16kHz PCM lockless ring buffer, acoustic echo cancellation, VAD barge-in, and bounded ASR worker.",
    boundaryContract: "Audio Fault Isolation · Non-Blocking Turn Interrupt",
    verificationNote: "Target desktop OS process specification (eleven_voice)",
    accentHex: "#B8F36B",
    geometryKind: "acoustic",
  },
  {
    index: 2,
    code: "L05",
    processDomain: "ipc_mind_bus",
    plainTitle: "Fast Bridge Between Both Brains",
    techTitle: "Dual-Mind Synchronization Bus",
    plainSummary:
      "Passes structured task handoffs between instant conversation and deep background work without mixing permissions.",
    techSummary:
      "Typed async IPC event stream with epoch turn tokens and correlation IDs preventing ambiguous confirmation.",
    boundaryContract: "Typed JSON-RPC · Disambiguated Task Correlation",
    verificationNote: "Target desktop OS inter-process bus specification",
    accentHex: "#647A6A",
    geometryKind: "bus",
  },
  {
    index: 3,
    code: "L04",
    processDomain: "eleven_supervisor / policy",
    plainTitle: "Five Un-Bypassable Safety Gates",
    techTitle: "5-Stage Deterministic Control Plane",
    plainSummary:
      "Redacts secrets, locks folder scopes, and inspects every AI action proposal before anything runs.",
    techSummary:
      "TaskCompiler → DataMinimizer → ModelRouter → PolicyGate → ExecutionController unidirectional pipeline.",
    boundaryContract: "Monotonic Tier Ceiling · 30s Single-Use DEC-008 Nonce",
    verificationNote: "Simulated interactively in browser; host kernel enforcement is desktop spec",
    accentHex: "#B8F36B",
    geometryKind: "gate",
  },
  {
    index: 4,
    code: "L03",
    processDomain: "eleven_deep / verifier",
    plainTitle: "Helper Proof & Fact Checker",
    techTitle: "SwarmTournament Evidence Gate",
    plainSummary:
      "Requires verifiable proof from helper agents and escalates conflicts instead of guessing by majority vote.",
    techSummary:
      "Validates worker digests and Ed25519 signatures (300s TTL); halts synthesis on contradictory evidence.",
    boundaryContract: "Zero Majority-Vote Averaging · Signed Worker Digests",
    verificationNote: "Target desktop multi-agent verification specification",
    accentHex: "#647A6A",
    geometryKind: "tournament",
  },
  {
    index: 5,
    code: "L02",
    processDomain: "eleven_deep / sandbox",
    plainTitle: "Sealed Project Sandbox",
    techTitle: "Sandboxed Worker Runtime",
    plainSummary:
      "Executes approved file and code tasks inside restricted project folders with internet blocked by default.",
    techSummary:
      "Canonical realpath root confinement, transient git worktrees, and default-deny outbound socket rules.",
    boundaryContract: "Canonical Root Jail · Default-Deny Outbound Network",
    verificationNote: "Target desktop worker runtime specification",
    accentHex: "#B8F36B",
    geometryKind: "sandbox",
  },
  {
    index: 6,
    code: "L01",
    processDomain: "127.0.0.1 loopback_vault",
    plainTitle: "Encrypted Local Memory Vault",
    techTitle: "Loopback Sovereign Memory Vault",
    plainSummary:
      "Stores your notes, history, and audit receipts privately on your own machine—never in a vendor cloud.",
    techSummary:
      "127.0.0.1 loopback-bound persistence with AES-256-GCM encryption and SHA-256 hash-chained audit records.",
    boundaryContract: "127.0.0.1 Loopback Bind · Hash-Chained Audit Ledger",
    verificationNote: "Target desktop storage spec; web waitlist uses hardened HTTPS API route",
    accentHex: "#F5F5F0",
    geometryKind: "vault",
  },
];

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Maps normalized scroll progress [0, 1] into:
 * 1) explodeFactor: separates (0 -> 1), holds open for inspection, then reconnects (1 -> 0.06)
 * 2) activeLayerIndex: sweeps deterministically from L07 (0) down to L01 (6)
 * 3) phaseLabel: human-readable state label
 */
function computeScrollChoreography(progress: number): {
  explodeFactor: number;
  activeLayerIndex: number;
  phaseLabel: string;
} {
  const p = Math.max(0, Math.min(1, progress));
  if (p < 0.2) {
    const explode = smoothstep(0.02, 0.2, p);
    return {
      explodeFactor: explode,
      activeLayerIndex: 0,
      phaseLabel: explode < 0.25 ? "UNIFIED STACK" : "SEPARATING FAULT DOMAINS",
    };
  }
  if (p <= 0.8) {
    const sweep = (p - 0.2) / 0.6;
    const idx = Math.min(
      ARCHITECTURAL_LAYERS.length - 1,
      Math.floor(sweep * ARCHITECTURAL_LAYERS.length)
    );
    return {
      explodeFactor: 1,
      activeLayerIndex: idx,
      phaseLabel: `INSPECTING ${ARCHITECTURAL_LAYERS[idx].code}`,
    };
  }
  const reconnect = 1 - smoothstep(0.8, 0.97, p) * 0.94;
  return {
    explodeFactor: reconnect,
    activeLayerIndex: 3, // PolicyGate core lock
    phaseLabel: reconnect < 0.2 ? "RECONNECTED · FAIL-CLOSED SEAL" : "RECONNECTING STACK",
  };
}

function StaticExplodedDiagramSVG({
  activeIndex,
  onSelectLayer,
  reasonLabel,
}: {
  activeIndex: number;
  onSelectLayer: (idx: number) => void;
  reasonLabel: string;
}) {
  return (
    <div
      className="flex h-full flex-col justify-between rounded-sm border border-el-sec-sage/40 bg-el-sec-graphite-deep p-4 sm:p-6"
      data-fallback-diagram="static-svg"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-el-sec-sage/30 pb-3">
        <span className="font-mono text-[11px] font-semibold text-el-sec-lime">
          {reasonLabel}
        </span>
        <span className="font-mono text-[10.5px] text-el-sec-sage-light">
          Click any plate to inspect boundary
        </span>
      </div>

      <svg
        viewBox="0 0 520 470"
        role="img"
        aria-labelledby="static-exploded-title static-exploded-desc"
        className="mx-auto my-3 w-full max-w-[480px] h-auto select-none"
      >
        <title id="static-exploded-title">
          ELEVEN 7-Layer Exploded Security Architecture Diagram
        </title>
        <desc id="static-exploded-desc">
          Static isometric diagram showing layers L07 Operator HUD down to L01 Loopback Memory Vault connected by vertical verification conduits.
        </desc>

        {/* Vertical Verification Spine Conduits */}
        <line
          x1="150"
          y1="58"
          x2="150"
          y2="412"
          stroke="#647A6A"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.55"
        />
        <line
          x1="260"
          y1="42"
          x2="260"
          y2="428"
          stroke="#B8F36B"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          opacity="0.7"
        />
        <line
          x1="370"
          y1="58"
          x2="370"
          y2="412"
          stroke="#647A6A"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.55"
        />

        {ARCHITECTURAL_LAYERS.map((layer, idx) => {
          const cy = 54 + idx * 58;
          const isSelected = idx === activeIndex;
          const shiftX = isSelected ? 12 : 0;
          const fillTop = isSelected ? "#242C27" : "#171A18";
          const strokeColor = isSelected ? "#B8F36B" : "#647A6A";
          const strokeW = isSelected ? 2 : 1.15;

          return (
            <g
              key={layer.code}
              transform={`translate(${shiftX}, 0)`}
              onClick={() => onSelectLayer(idx)}
              className="cursor-pointer"
            >
              {/* Isometric Diamond Plate */}
              <polygon
                points={`260,${cy - 24} 405,${cy} 260,${cy + 24} 115,${cy}`}
                fill={fillTop}
                stroke={strokeColor}
                strokeWidth={strokeW}
              />
              {/* Plate Thickness Front-Left & Front-Right */}
              <polygon
                points={`115,${cy} 260,${cy + 24} 260,${cy + 32} 115,${cy + 8}`}
                fill="#111412"
                stroke={strokeColor}
                strokeWidth="0.9"
              />
              <polygon
                points={`405,${cy} 260,${cy + 24} 260,${cy + 32} 405,${cy + 8}`}
                fill="#1B201D"
                stroke={strokeColor}
                strokeWidth="0.9"
              />

              {/* Center Core Node */}
              <circle
                cx="260"
                cy={cy}
                r={isSelected ? 5.5 : 3.5}
                fill={isSelected ? "#B8F36B" : "#F5F5F0"}
              />

              {/* Layer Code Pill on Left */}
              <rect
                x="18"
                y={cy - 11}
                width="76"
                height="22"
                rx="3"
                fill={isSelected ? "#B8F36B" : "#1F2421"}
                stroke={strokeColor}
                strokeWidth="1"
              />
              <text
                x="56"
                y={cy + 4}
                textAnchor="middle"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="700"
                fill={isSelected ? "#171A18" : "#F5F5F0"}
              >
                {layer.code}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-el-sec-sage/30 pt-3 font-mono text-[10.5px] text-el-sec-sage-light">
        <span>Active Plate: {ARCHITECTURAL_LAYERS[activeIndex].code}</span>
        <span>0 Continuous Idle Frames</span>
      </div>
    </div>
  );
}

export function ExplodedLayerStack3D() {
  const { mode } = useClarityMode();
  const isPlain = mode === "plain";
  const reducedMotion = usePrefersReducedMotion();
  const webglAvailable = useWebGLAvailable();

  const sectionTrackRef = useRef<HTMLDivElement | null>(null);
  const canvasHostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activeLayerIdx, setActiveLayerIdx] = useState<number>(3);
  const [explodePct, setExplodePct] = useState<number>(85);
  const [phaseLabel, setPhaseLabel] = useState<string>("INSPECTING L04");
  const [manualLock, setManualLock] = useState<boolean>(false);
  const [webglInitFailed, setWebglInitFailed] = useState<boolean>(false);

  // Mutable animation target/current refs for demand-driven Three.js scheduler
  const renderControlRef = useRef<{
    targetExplode: number;
    currentExplode: number;
    targetActive: number;
    currentActive: number;
    targetYaw: number;
    currentYaw: number;
    schedule: () => void;
  }>({
    targetExplode: 0.85,
    currentExplode: 0.85,
    targetActive: 3,
    currentActive: 3,
    targetYaw: 0.68,
    currentYaw: 0.68,
    schedule: () => {},
  });

  const useStaticDiagram = reducedMotion || !webglAvailable || webglInitFailed;

  // Scroll-scrubbed deterministic listener (disabled in reduced motion or manual lock)
  useEffect(() => {
    if (reducedMotion || manualLock) return;

    const handleScroll = () => {
      const track = sectionTrackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;
      const stickyScrollable = rect.height - viewportH;

      let rawProgress: number;
      if (stickyScrollable > viewportH * 0.35) {
        // Desktop sticky scroll track mode
        rawProgress = -rect.top / stickyScrollable;
      } else {
        // Narrow viewport natural scroll mode: scrub as canvas traverses viewport
        const entryY = viewportH * 0.82;
        const exitY = -Math.max(240, rect.height * 0.38);
        rawProgress = (entryY - rect.top) / Math.max(1, entryY - exitY);
      }

      const clamped = Math.max(0, Math.min(1, rawProgress));

      const { explodeFactor, activeLayerIndex, phaseLabel: nextLabel } =
        computeScrollChoreography(clamped);

      const ctrl = renderControlRef.current;
      ctrl.targetExplode = explodeFactor;
      ctrl.targetActive = activeLayerIndex;
      ctrl.targetYaw = 0.54 + clamped * 0.44;
      ctrl.schedule();

      const roundedPct = Math.round(explodeFactor * 100);
      setExplodePct((prev) => (prev === roundedPct ? prev : roundedPct));
      setActiveLayerIdx((prev) =>
        prev === activeLayerIndex ? prev : activeLayerIndex
      );
      setPhaseLabel((prev) => (prev === nextLabel ? prev : nextLabel));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [reducedMotion, manualLock]);

  // On-demand Three.js Exploded Architectural Stack
  useEffect(() => {
    if (useStaticDiagram) return;
    const canvas = canvasRef.current;
    const host = canvasHostRef.current;
    if (!canvas || !host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      queueMicrotask(() => setWebglInitFailed(true));
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.set(0, 1.35, 11.4);
    camera.lookAt(0, 0, 0);

    // Subtle precision architectural lighting
    const ambientLight = new THREE.AmbientLight(0xf5f5f0, 0.72);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xf5f5f0, 1.15);
    keyLight.position.set(5, 9, 7);
    scene.add(keyLight);

    const limeRimLight = new THREE.DirectionalLight(0xb8f36b, 0.65);
    limeRimLight.position.set(-6, 3, -4);
    scene.add(limeRimLight);

    const stackRoot = new THREE.Group();
    stackRoot.rotation.x = 0.34;
    scene.add(stackRoot);

    const disposables: Array<{ dispose: () => void }> = [];

    const colorSage = new THREE.Color("#647A6A");
    const colorLime = new THREE.Color("#B8F36B");
    const colorPorcelain = new THREE.Color("#F5F5F0");
    const colorGraphite = new THREE.Color("#1A1F1C");
    const colorGraphiteActive = new THREE.Color("#252E29");

    interface LayerMeshEntry {
      group: THREE.Group;
      slabMat: THREE.MeshStandardMaterial;
      edgeMat: THREE.LineBasicMaterial;
      detailMat: THREE.LineBasicMaterial;
    }

    const layerEntries: LayerMeshEntry[] = [];
    const slabGeo = new THREE.BoxGeometry(3.7, 0.15, 2.45);
    const slabEdges = new THREE.EdgesGeometry(slabGeo);
    disposables.push(slabGeo, slabEdges);

    ARCHITECTURAL_LAYERS.forEach((spec) => {
      const group = new THREE.Group();

      const slabMat = new THREE.MeshStandardMaterial({
        color: colorGraphite.clone(),
        roughness: 0.42,
        metalness: 0.28,
        transparent: true,
        opacity: 0.95,
      });
      disposables.push(slabMat);

      const slabMesh = new THREE.Mesh(slabGeo, slabMat);
      group.add(slabMesh);

      const edgeMat = new THREE.LineBasicMaterial({
        color: colorSage.clone(),
        transparent: true,
        opacity: 0.75,
      });
      disposables.push(edgeMat);

      const edgeLines = new THREE.LineSegments(slabEdges, edgeMat);
      group.add(edgeLines);

      const detailMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(spec.accentHex),
        transparent: true,
        opacity: 0.65,
      });
      disposables.push(detailMat);

      // Distinct architectural circuit/core motif per layer
      if (spec.geometryKind === "gate") {
        // L04 PolicyGate: 5 concentric octagon rings
        for (let r = 0.28; r <= 0.92; r += 0.21) {
          const ringGeo = new THREE.RingGeometry(r - 0.02, r, 8);
          ringGeo.rotateX(-Math.PI / 2);
          const ringEdges = new THREE.EdgesGeometry(ringGeo);
          disposables.push(ringGeo, ringEdges);
          const ringLine = new THREE.LineSegments(ringEdges, detailMat);
          ringLine.position.y = 0.085;
          group.add(ringLine);
        }
      } else if (spec.geometryKind === "vault") {
        // L01 Loopback Vault: 4 encrypted drawer cells
        const cellGeo = new THREE.BoxGeometry(1.45, 0.04, 0.85);
        const cellEdges = new THREE.EdgesGeometry(cellGeo);
        disposables.push(cellGeo, cellEdges);
        const offsets: Array<[number, number]> = [
          [-0.82, -0.5],
          [0.82, -0.5],
          [-0.82, 0.5],
          [0.82, 0.5],
        ];
        offsets.forEach(([ox, oz]) => {
          const cell = new THREE.LineSegments(cellEdges, detailMat);
          cell.position.set(ox, 0.095, oz);
          group.add(cell);
        });
      } else if (spec.geometryKind === "acoustic") {
        // L06 Voice: duplex waveform bars
        for (let b = -5; b <= 5; b++) {
          const barLen = 0.35 + (1 - Math.abs(b) / 6) * 0.95;
          const barGeo = new THREE.BoxGeometry(0.11, 0.035, barLen);
          const barEdges = new THREE.EdgesGeometry(barGeo);
          disposables.push(barGeo, barEdges);
          const bar = new THREE.LineSegments(barEdges, detailMat);
          bar.position.set(b * 0.26, 0.095, 0);
          group.add(bar);
        }
      } else {
        // Precision inner bus frame + center node
        const innerGeo = new THREE.BoxGeometry(2.85, 0.03, 1.65);
        const innerEdges = new THREE.EdgesGeometry(innerGeo);
        const coreGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 16);
        const coreEdges = new THREE.EdgesGeometry(coreGeo);
        disposables.push(innerGeo, innerEdges, coreGeo, coreEdges);

        const innerFrame = new THREE.LineSegments(innerEdges, detailMat);
        innerFrame.position.y = 0.09;
        group.add(innerFrame);

        const coreNode = new THREE.LineSegments(coreEdges, detailMat);
        coreNode.position.y = 0.1;
        group.add(coreNode);
      }

      stackRoot.add(group);
      layerEntries.push({ group, slabMat, edgeMat, detailMat });
    });

    // Vertical verification spine & 4 corner conduits connecting L07 <-> L01
    const conduitPositions = new Float32Array(5 * 2 * 3);
    const conduitGeo = new THREE.BufferGeometry();
    conduitGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(conduitPositions, 3)
    );
    const conduitMat = new THREE.LineBasicMaterial({
      color: colorLime.clone(),
      transparent: true,
      opacity: 0.45,
    });
    disposables.push(conduitGeo, conduitMat);
    const conduitLines = new THREE.LineSegments(conduitGeo, conduitMat);
    stackRoot.add(conduitLines);

    const conduitAnchors: Array<[number, number]> = [
      [0, 0],
      [-1.72, -1.1],
      [1.72, -1.1],
      [-1.72, 1.1],
      [1.72, 1.1],
    ];

    const updateSize = () => {
      const width = Math.max(260, host.clientWidth);
      const height = Math.max(320, host.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // Slightly zoom out on narrow viewports so slabs never clip horizontally
      camera.position.z = width < 460 ? 13.4 : 11.4;
      camera.updateProjectionMatrix();
    };

    updateSize();

    let rafId: number | null = null;
    let renderCount = 0;
    let lastTimeMs: number | null = null;

    const applySceneState = (nowMs: number) => {
      const dtSec =
        lastTimeMs === null
          ? 1 / 60
          : Math.min(0.5, Math.max(1 / 240, (nowMs - lastTimeMs) / 1000));
      lastTimeMs = nowMs;

      const alpha = 1 - Math.exp(-16 * dtSec);
      const alphaActive = 1 - Math.exp(-18 * dtSec);

      const ctrl = renderControlRef.current;
      ctrl.currentExplode += (ctrl.targetExplode - ctrl.currentExplode) * alpha;
      ctrl.currentActive +=
        (ctrl.targetActive - ctrl.currentActive) * alphaActive;
      ctrl.currentYaw += (ctrl.targetYaw - ctrl.currentYaw) * alpha;

      const settled =
        Math.abs(ctrl.targetExplode - ctrl.currentExplode) < 0.0012 &&
        Math.abs(ctrl.targetActive - ctrl.currentActive) < 0.004 &&
        Math.abs(ctrl.targetYaw - ctrl.currentYaw) < 0.0012;

      if (settled) {
        ctrl.currentExplode = ctrl.targetExplode;
        ctrl.currentActive = ctrl.targetActive;
        ctrl.currentYaw = ctrl.targetYaw;
      }

      const spacing = 0.2 + ctrl.currentExplode * 0.56;
      stackRoot.rotation.y = ctrl.currentYaw;

      layerEntries.forEach((entry, idx) => {
        // idx 0 is L07 (top), idx 6 is L01 (bottom)
        const centeredIdx = 3 - idx;
        const y = centeredIdx * spacing;

        const distFromActive = Math.abs(idx - ctrl.currentActive);
        const focusWeight = Math.max(0, 1 - distFromActive * 0.85);

        entry.group.position.y = y;
        entry.group.position.x = focusWeight * 0.26 * ctrl.currentExplode;
        entry.group.position.z = focusWeight * 0.18 * ctrl.currentExplode;

        entry.slabMat.color
          .copy(colorGraphite)
          .lerp(colorGraphiteActive, focusWeight);
        entry.edgeMat.color
          .copy(colorSage)
          .lerp(idx === 0 || idx === 6 ? colorPorcelain : colorLime, focusWeight);
        entry.edgeMat.opacity = 0.42 + focusWeight * 0.58;
        entry.detailMat.opacity = 0.28 + focusWeight * 0.72;
      });

      // Update vertical conduit endpoints from top slab (idx 0) to bottom slab (idx 6)
      const topY = 3 * spacing;
      const botY = -3 * spacing;
      const posAttr = conduitGeo.getAttribute("position") as THREE.BufferAttribute;
      conduitAnchors.forEach(([ax, az], cIdx) => {
        const base = cIdx * 6;
        conduitPositions[base] = ax;
        conduitPositions[base + 1] = topY;
        conduitPositions[base + 2] = az;
        conduitPositions[base + 3] = ax;
        conduitPositions[base + 4] = botY;
        conduitPositions[base + 5] = az;
      });
      posAttr.needsUpdate = true;
      conduitMat.opacity = 0.08 + ctrl.currentExplode * 0.42;

      renderer.render(scene, camera);
      renderCount += 1;
      canvas.dataset.renderFrames = String(renderCount);

      if (!settled) {
        canvas.dataset.renderState = "interpolating";
        rafId = window.requestAnimationFrame(applySceneState);
      } else {
        canvas.dataset.renderState = "idle";
        rafId = null;
        lastTimeMs = null;
      }
    };

    const scheduleFrame = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(applySceneState);
      }
    };

    const ctrlInstance = renderControlRef.current;
    ctrlInstance.schedule = scheduleFrame;
    scheduleFrame();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
      scheduleFrame();
    });
    resizeObserver.observe(host);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      ctrlInstance.schedule = () => {};
      resizeObserver.disconnect();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, [useStaticDiagram]);

  const handleSelectLayerManual = useCallback((idx: number) => {
    setManualLock(true);
    setActiveLayerIdx(idx);
    setExplodePct(100);
    setPhaseLabel(`LOCKED · ${ARCHITECTURAL_LAYERS[idx].code}`);
    const ctrl = renderControlRef.current;
    ctrl.targetExplode = 1;
    ctrl.targetActive = idx;
    ctrl.targetYaw = 0.72 + idx * 0.04;
    ctrl.schedule();
  }, []);

  const handleManualScrub = useCallback((nextPct: number) => {
    setManualLock(true);
    setExplodePct(nextPct);
    const factor = nextPct / 100;
    setPhaseLabel(
      nextPct < 15
        ? "MANUAL · UNIFIED MONOLITH"
        : nextPct > 85
        ? "MANUAL · FULL EXPLODED STACK"
        : `MANUAL · ${nextPct}% SEPARATION`
    );
    const ctrl = renderControlRef.current;
    ctrl.targetExplode = factor;
    ctrl.targetYaw = 0.56 + factor * 0.36;
    ctrl.schedule();
  }, []);

  const handleResumeScrollSync = useCallback(() => {
    setManualLock(false);
  }, []);

  const activeSpec = ARCHITECTURAL_LAYERS[activeLayerIdx] ?? ARCHITECTURAL_LAYERS[3];

  return (
    <div
      ref={sectionTrackRef}
      className={
        reducedMotion
          ? "relative"
          : "relative lg:min-h-[215vh]"
      }
      data-component="exploded-layer-stack-3d"
    >
      <div
        className={
          reducedMotion
            ? "relative"
            : "relative lg:sticky lg:top-20 lg:py-2"
        }
      >
        <div className="overflow-hidden rounded-sm border border-el-sec-sage/45 bg-el-sec-graphite text-el-sec-porcelain shadow-el-lg">
          {/* Top Control & Telemetry Strip */}
          <div className="flex flex-col gap-3 border-b border-el-sec-sage/35 bg-el-sec-graphite-deep px-4 py-3.5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-xs border border-el-sec-lime/50 bg-el-sec-lime/12 px-2.5 py-1 font-mono text-[11px] font-semibold text-el-sec-lime">
                <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                {phaseLabel}
              </span>
              <span className="font-mono text-[11px] text-el-sec-sage-light">
                {useStaticDiagram
                  ? "Static accessible diagram mode"
                  : "Scroll-scrubbed on-demand WebGL · Separates & reconnects with scroll"}
              </span>
            </div>

            {/* Interactive Separation Slider + Scroll Sync Reset with Dynamic Numbers */}
            <div className="flex flex-wrap items-center gap-3">
              <label
                htmlFor="layer-explosion-range"
                className="inline-flex items-center gap-2 font-mono text-[11px] text-el-sec-sage-light"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-el-sec-lime" aria-hidden="true" />
                <span>
                  Separation: <SecurityNumberCounter value={explodePct} suffix="%" className="font-bold text-el-sec-lime" />
                </span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="layer-explosion-range"
                  type="range"
                  min={0}
                  max={100}
                  value={explodePct}
                  onChange={(e) => handleManualScrub(Number(e.target.value))}
                  aria-label="Architectural layer separation percentage"
                  className="h-1.5 w-28 cursor-pointer accent-[#B8F36B]"
                />
              </div>
              {manualLock && !reducedMotion && (
                <button
                  type="button"
                  onClick={handleResumeScrollSync}
                  className="inline-flex items-center gap-1 rounded-xs border border-el-sec-lime/50 bg-el-sec-graphite-raised px-2.5 py-1 font-mono text-[10.5px] text-el-sec-lime transition-colors hover:bg-el-sec-lime hover:text-el-sec-graphite"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  Sync Scroll
                </button>
              )}
            </div>
          </div>

          {/* Main 2-Column Stage: Left 3D / Static Canvas + Right Layer Selector & Active Spec */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left 7 Cols: 3D Viewport or Static Exploded SVG Fallback */}
            <div className="relative border-b border-el-sec-sage/30 p-4 sm:p-6 lg:col-span-7 lg:border-r lg:border-b-0">
              {useStaticDiagram ? (
                <StaticExplodedDiagramSVG
                  activeIndex={activeLayerIdx}
                  onSelectLayer={handleSelectLayerManual}
                  reasonLabel={
                    reducedMotion
                      ? "REDUCED MOTION · STATIC EXPLODED STACK"
                      : "WEBGL FALLBACK · VECTOR EXPLODED STACK"
                  }
                />
              ) : (
                <div
                  ref={canvasHostRef}
                  className="relative h-[300px] w-full overflow-hidden rounded-sm border border-el-sec-sage/35 bg-[radial-gradient(circle_at_50%_42%,rgba(100,122,106,0.22),rgba(17,20,18,0.96)_72%)] sm:h-[360px] lg:h-[390px]"
                  style={{ touchAction: "pan-y" }}
                >
                  <canvas
                    ref={canvasRef}
                    aria-label="Scroll-scrubbed 3D exploded diagram of ELEVEN's 7 architectural layers"
                    role="img"
                    className="block h-full w-full"
                    style={{ touchAction: "pan-y" }}
                  />

                  {/* Subtle Non-Obstructive Corner Readouts with Dynamic Number Counters */}
                  <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-2 rounded-xs border border-el-sec-sage/40 bg-el-sec-graphite/90 px-2.5 py-1 font-mono text-[10px] text-el-sec-porcelain">
                    <span className="h-1.5 w-1.5 rounded-full bg-el-sec-lime" />
                    <span>{activeSpec.code} · {activeSpec.processDomain}</span>
                    <span className="border-l border-el-sec-sage/40 pl-2 text-el-sec-lime font-bold">
                      Layer 0{7 - activeLayerIdx}/07
                    </span>
                  </div>

                  <div className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-2 rounded-xs border border-el-sec-sage/35 bg-el-sec-graphite/90 px-2.5 py-1 font-mono text-[10px] text-el-sec-sage-light">
                    <span>On-Demand Render · 0 Idle FPS</span>
                    <span className="border-l border-el-sec-sage/35 pl-2 text-el-sec-porcelain font-bold">
                      Δ: ±<SecurityNumberCounter value={Number((0.2 + (explodePct / 100) * 0.56).toFixed(2))} suffix="m" decimals={2} />
                    </span>
                  </div>
                </div>
              )}

              {/* Active Layer Warm Porcelain Inspection Card */}
              <div className="mt-4 rounded-sm border border-el-sec-sage/45 bg-el-sec-porcelain p-4 text-el-sec-graphite sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-el-sec-graphite/15 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-xs bg-el-sec-graphite px-2 py-0.5 font-mono text-xs font-bold text-el-sec-lime">
                      {activeSpec.code}
                    </span>
                    <SecurityTextReveal
                      key={activeSpec.code + "-title"}
                      text={isPlain ? activeSpec.plainTitle : activeSpec.techTitle}
                      as="h3"
                      className="text-sm font-semibold tracking-tight text-el-sec-graphite sm:text-base"
                    />
                  </div>
                  <code className="font-mono text-[11px] font-medium text-el-sec-graphite/75">
                    {activeSpec.processDomain}
                  </code>
                </div>

                <SecurityTextReveal
                  key={activeSpec.code + (isPlain ? "-psummary" : "-tsummary")}
                  text={isPlain ? activeSpec.plainSummary : activeSpec.techSummary}
                  as="p"
                  className="mt-2.5 text-xs leading-relaxed text-el-sec-graphite/85 sm:text-sm"
                />

                <div className="mt-3 flex flex-col justify-between gap-1.5 border-t border-el-sec-graphite/15 pt-2.5 font-mono text-[10.5px] sm:flex-row sm:items-center">
                  <span className="font-semibold text-el-sec-graphite">
                    Boundary: {activeSpec.boundaryContract}
                  </span>
                  <span className="text-el-sec-graphite/70">
                    {activeSpec.verificationNote}
                  </span>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Accessible 7-Layer Stack Rail */}
            <div className="flex flex-col justify-between p-4 sm:p-6 lg:col-span-5">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-el-sec-sage-light">
                    7-Layer Architecture Stack (Top → Vault)
                  </span>
                  <Cpu className="h-4 w-4 text-el-sec-lime" aria-hidden="true" />
                </div>

                <div
                  role="listbox"
                  aria-label="ELEVEN 7 architectural layers"
                  className="space-y-2"
                >
                  {ARCHITECTURAL_LAYERS.map((layer, idx) => {
                    const isSelected = idx === activeLayerIdx;
                    return (
                      <button
                        key={layer.code}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelectLayerManual(idx)}
                        className={`w-full rounded-xs border p-3 text-left transition-colors ${
                          isSelected
                            ? "border-el-sec-lime bg-el-sec-graphite-raised text-el-sec-porcelain"
                            : "border-el-sec-sage/30 bg-el-sec-graphite-deep/75 text-el-sec-porcelain/80 hover:border-el-sec-sage/70 hover:text-el-sec-porcelain"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`rounded-xs px-1.5 py-0.5 font-mono text-[10.5px] font-bold ${
                                isSelected
                                  ? "bg-el-sec-lime text-el-sec-graphite"
                                  : "bg-el-sec-graphite text-el-sec-sage-light"
                              }`}
                            >
                              {layer.code}
                            </span>
                            <span className="text-xs font-semibold sm:text-[13px]">
                              {isPlain ? layer.plainTitle : layer.techTitle}
                            </span>
                          </div>
                          <code className="hidden font-mono text-[10px] text-el-sec-sage-light sm:inline">
                            {layer.processDomain}
                          </code>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Web vs Desktop OS Verification Scope Card */}
              <div className="mt-4 rounded-xs border border-el-sec-sage/35 bg-el-sec-graphite-deep p-3.5 font-mono text-[10.5px] leading-relaxed text-el-sec-sage-light">
                <div className="flex items-center gap-1.5 font-semibold text-el-sec-porcelain">
                  <Shield className="h-3.5 w-3.5 text-el-sec-lime" aria-hidden="true" />
                  <span>Architecture Verification Scope</span>
                </div>
                <p className="mt-1">
                  Layers L01–L07 illustrate ELEVEN’s documented desktop OS specification. In this web repository, HTTP CSP/HSTS headers and /api/waitlist rate-limiting &amp; sanitization are verified directly in source.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
