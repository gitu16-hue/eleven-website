"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { AnimatePresence, motion } from "framer-motion";
import { useClarityMode } from "@/components/motion/PremiumMotion";

export type TopologyFocus = "UNIFIED" | "FRIDAY_S1" | "JARVIS_S2" | "CONTROL_PLANE";

const FOCUS_META: Record<
  TopologyFocus,
  {
    tabPlain: string;
    tabTech: string;
    codePlain: string;
    codeTech: string;
    titlePlain: string;
    titleTech: string;
    metricPlain: string;
    metricTech: string;
    captionPlain: string;
    captionTech: string;
  }
> = {
  UNIFIED: {
    tabPlain: "Overview",
    tabTech: "Unified",
    codePlain: "LIVE 3D MODEL · ALL SYSTEMS",
    codeTech: "TOPOLOGY // 00",
    titlePlain: "Two Brains Inside Five Safety Rings",
    titleTech: "Dual-Mind + 5-Stage Control Plane",
    metricPlain: "PRIVATE · RUNS ON YOUR PC",
    metricTech: "LOCAL-FIRST · DETERMINISTIC",
    captionPlain:
      "Every AI suggestion passes through five safety rings (outer circles) before it can touch your files or apps.",
    captionTech:
      "Untrusted model proposals are contained inside five concentric policy rings before reaching host OS execution.",
  },
  FRIDAY_S1: {
    tabPlain: "Quick Voice",
    tabTech: "F.R.I.D.A.Y. (S1)",
    codePlain: "INNER CORE · VOICE PARTNER",
    codeTech: "SYSTEM 1 // F.R.I.D.A.Y.",
    titlePlain: "Instant Natural Voice",
    titleTech: "Conscious Voice Interface",
    metricPlain: "REPLIES IN <0.5s · INTERRUPT ANYTIME",
    metricTech: "<500ms TURN GOAL · <50ms BARGE-IN",
    captionPlain:
      "Listens and talks naturally like a real conversation—if you speak up mid-sentence, it stops talking right away.",
    captionTech:
      "16kHz PCM ring buffer, Silero Adaptive VAD, non-blocking candidate ASR, and Speculative Audio Bridge.",
  },
  JARVIS_S2: {
    tabPlain: "Deep Mind",
    tabTech: "J.A.R.V.I.S. (S2)",
    codePlain: "MIDDLE WEB · BACKGROUND WORKER",
    codeTech: "SYSTEM 2 // J.A.R.V.I.S.",
    titlePlain: "Background Deep Thinking",
    titleTech: "Subconscious Analytical Engine",
    metricPlain: "WORKS QUIETLY · DOUBLE-CHECKS FACTS",
    metricTech: "DAG ENGINE · SWARM ADJUDICATED",
    captionPlain:
      "Handles complex coding, research, and multi-step jobs in the background without freezing your conversation.",
    captionTech:
      "Asynchronous multi-step mission planning, Ed25519 signed EvidencePackets, and zero-majority-vote synthesis.",
  },
  CONTROL_PLANE: {
    tabPlain: "5 Safety Rings",
    tabTech: "5-Stage Gate",
    codePlain: "OUTER RINGS · SAFETY GUARD",
    codeTech: "GOVERNANCE // DEC-008",
    titlePlain: "Five Automatic Checkpoints",
    titleTech: "5-Stage Containment Boundary",
    metricPlain: "HIDES SECRETS · ASKS BEFORE ACTING",
    metricTech: "TIER 0–3 · SHA-256 NONCE BOUND",
    captionPlain:
      "Automatically hides your passwords, checks folder rules, and asks your permission before doing anything risky.",
    captionTech:
      "TaskCompiler → DataMinimizer → ModelRouter → PolicyGate → Cold-Room ExecutionController.",
  },
};

function detectWebGLSupport(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

export function ControlPlaneGyro3D({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { mode: clarityMode } = useClarityMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<TopologyFocus>("UNIFIED");
  const focusRef = useRef<TopologyFocus>("UNIFIED");
  const clickImpulseRef = useRef<number>(0);
  const [ready, setReady] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    focusRef.current = focus;
  }, [focus]);

  useEffect(() => {
    if (!detectWebGLSupport()) {
      setWebglSupported(false);
      setReady(true);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const isMobile =
      window.innerWidth < 768 ||
      /iPhone|iPad|Android/i.test(navigator.userAgent);
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let disposed = false;
    let animId: number | null = null;

    const width = container.clientWidth || 460;
    const height = container.clientHeight || 460;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 8.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    // Strict mobile DPR clamp per 3d-web-experience guidelines
    renderer.setPixelRatio(
      isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2)
    );
    renderer.setClearColor(0x000000, 0);

    const canvas = renderer.domElement;
    canvas.setAttribute("role", "img");
    canvas.setAttribute(
      "aria-label",
      "ELEVEN v3 3D Architectural Control Plane Spatial Instrument"
    );
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. System 1 Core (F.R.I.D.A.Y. — Fast Inner Geodesic Polyhedron)
    const s1Group = new THREE.Group();
    rootGroup.add(s1Group);

    const s1Geo = new THREE.IcosahedronGeometry(0.78, 2);
    const s1WireMat = new THREE.MeshBasicMaterial({
      color: 0x2b4d47,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const s1Mesh = new THREE.Mesh(s1Geo, s1WireMat);
    s1Group.add(s1Mesh);

    const s1InnerGeo = new THREE.SphereGeometry(0.32, 24, 24);
    const s1InnerMat = new THREE.MeshBasicMaterial({
      color: 0x2b4d47,
      transparent: true,
      opacity: 0.14,
    });
    const s1Inner = new THREE.Mesh(s1InnerGeo, s1InnerMat);
    s1Group.add(s1Inner);

    // 2. System 2 Frame (J.A.R.V.I.S. — Subconscious Analytical Lattice)
    const s2Group = new THREE.Group();
    rootGroup.add(s2Group);

    const s2Geo = new THREE.IcosahedronGeometry(1.38, 1);
    const s2Edges = new THREE.EdgesGeometry(s2Geo);
    const s2Mat = new THREE.LineBasicMaterial({
      color: 0x11110e,
      transparent: true,
      opacity: 0.34,
    });
    const s2Wire = new THREE.LineSegments(s2Edges, s2Mat);
    s2Group.add(s2Wire);

    // Vertex nodes on System 2 DAG lattice
    const s2PosAttr = s2Geo.getAttribute("position");
    const s2PointsMat = new THREE.PointsMaterial({
      color: 0x2b4d47,
      size: isMobile ? 0.055 : 0.048,
      transparent: true,
      opacity: 0.75,
    });
    const s2Nodes = new THREE.Points(
      new THREE.BufferGeometry().setAttribute("position", s2PosAttr),
      s2PointsMat
    );
    s2Group.add(s2Nodes);

    // 3. 5-Stage AI Control Plane Containment Gimbal Rings
    const ringsGroup = new THREE.Group();
    rootGroup.add(ringsGroup);

    const ringSpecs = [
      { r: 1.78, segs: 3, frac: 0.74, tx: 0.48, ty: 0.22, color: 0x2b4d47, op: 0.55 },
      { r: 2.04, segs: 4, frac: 0.68, tx: -0.62, ty: 0.45, color: 0x5c5b54, op: 0.42 },
      { r: 2.30, segs: 2, frac: 0.80, tx: 0.95, ty: -0.34, color: 0x2b4d47, op: 0.48 },
      { r: 2.56, segs: 6, frac: 0.55, tx: -0.28, ty: 0.86, color: 0x5c5b54, op: 0.36 },
      { r: 2.84, segs: 4, frac: 0.72, tx: 1.24, ty: 0.16, color: 0x11110e, op: 0.45 },
    ];

    const ringContainers: {
      group: THREE.Group;
      mats: THREE.MeshBasicMaterial[];
      baseOp: number;
    }[] = [];

    const disposables: { dispose: () => void }[] = [
      s1Geo,
      s1WireMat,
      s1InnerGeo,
      s1InnerMat,
      s2Geo,
      s2Edges,
      s2Mat,
      s2PointsMat,
      s2Nodes.geometry,
    ];

    ringSpecs.forEach((spec) => {
      const grp = new THREE.Group();
      const mats: THREE.MeshBasicMaterial[] = [];
      for (let i = 0; i < spec.segs; i++) {
        const arc = ((Math.PI * 2) / spec.segs) * spec.frac;
        const tGeo = new THREE.TorusGeometry(spec.r, 0.0085, 8, 64, arc);
        const tMat = new THREE.MeshBasicMaterial({
          color: spec.color,
          transparent: true,
          opacity: spec.op,
        });
        const mesh = new THREE.Mesh(tGeo, tMat);
        mesh.rotation.z = i * ((Math.PI * 2) / spec.segs);
        grp.add(mesh);
        mats.push(tMat);
        disposables.push(tGeo, tMat);
      }
      grp.rotation.x = spec.tx;
      grp.rotation.y = spec.ty;
      ringsGroup.add(grp);
      ringContainers.push({ group: grp, mats, baseOp: spec.op });
    });

    // 4. Precision Sovereign Memory Datum Cloud
    const pointCount = isMobile ? 750 : 1850;
    const pPositions = new Float32Array(pointCount * 3);
    for (let i = 0; i < pointCount; i++) {
      const radius = 1.55 + Math.pow(Math.random(), 1.4) * 1.55;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pPositions[i * 3 + 1] = radius * Math.cos(phi);
      pPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    const cloudGeo = new THREE.BufferGeometry();
    cloudGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    const cloudMat = new THREE.PointsMaterial({
      color: 0x2b4d47,
      size: isMobile ? 0.024 : 0.02,
      transparent: true,
      opacity: 0.36,
    });
    const datumCloud = new THREE.Points(cloudGeo, cloudMat);
    rootGroup.add(datumCloud);
    disposables.push(cloudGeo, cloudMat);

    // Non-blocking pointer & scroll reactivity
    let targetPtrX = 0;
    let targetPtrY = 0;
    let smoothPtrX = 0;
    let smoothPtrY = 0;
    let scrollProgress = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
      const ny = ((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
      targetPtrX = Math.max(-1, Math.min(1, nx));
      targetPtrY = Math.max(-1, Math.min(1, ny));
    };

    const onPointerLeave = () => {
      targetPtrX = 0;
      targetPtrY = 0;
    };

    const onScroll = () => {
      const maxScroll = Math.max(window.innerHeight * 1.2, 600);
      scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };

    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // InstancedMesh orbiting signal packets (premium-3d-website instancing best practice)
    const packetCount = isMobile ? 8 : 16;
    const packetGeo = new THREE.SphereGeometry(0.036, 10, 10);
    const packetMat = new THREE.MeshBasicMaterial({
      color: 0x2b4d47,
      transparent: true,
      opacity: 0.78,
    });
    disposables.push(packetGeo, packetMat);
    const packetInstanced = new THREE.InstancedMesh(
      packetGeo,
      packetMat,
      packetCount
    );
    const dummyObj = new THREE.Object3D();
    rootGroup.add(packetInstanced);

    const onPointerDown = () => {
      clickImpulseRef.current = 1.0;
    };
    container.addEventListener("pointerdown", onPointerDown, { passive: true });

    const onResize = () => {
      if (disposed || !container) return;
      const w = container.clientWidth || 360;
      const h = container.clientHeight || 360;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let s1TargetScale = 1;
    let s2TargetScale = 1;
    let ringTargetScale = 1;

    const animate = () => {
      if (disposed) return;
      animId = requestAnimationFrame(animate);

      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();
      const mode = focusRef.current;

      // Focus-dependent architectural emphasis
      if (mode === "FRIDAY_S1") {
        s1TargetScale = 1.32;
        s2TargetScale = 0.88;
        ringTargetScale = 0.95;
      } else if (mode === "JARVIS_S2") {
        s1TargetScale = 0.82;
        s2TargetScale = 1.24;
        ringTargetScale = 0.96;
      } else if (mode === "CONTROL_PLANE") {
        s1TargetScale = 0.88;
        s2TargetScale = 0.92;
        ringTargetScale = 1.09;
      } else {
        s1TargetScale = 1.0;
        s2TargetScale = 1.0;
        ringTargetScale = 1.0;
      }

      s1Group.scale.lerp(
        new THREE.Vector3(s1TargetScale, s1TargetScale, s1TargetScale),
        0.07
      );
      s2Group.scale.lerp(
        new THREE.Vector3(s2TargetScale, s2TargetScale, s2TargetScale),
        0.07
      );
      ringsGroup.scale.lerp(
        new THREE.Vector3(ringTargetScale, ringTargetScale, ringTargetScale),
        0.07
      );

      // Opacity emphasis per focus
      s1WireMat.opacity +=
        ((mode === "FRIDAY_S1" ? 0.88 : mode === "UNIFIED" ? 0.56 : 0.22) -
          s1WireMat.opacity) *
        0.08;
      s2Mat.opacity +=
        ((mode === "JARVIS_S2" ? 0.78 : mode === "UNIFIED" ? 0.36 : 0.16) -
          s2Mat.opacity) *
        0.08;

      ringContainers.forEach((rc, idx) => {
        const targetOp =
          mode === "CONTROL_PLANE"
            ? Math.min(0.9, rc.baseOp * 1.65)
            : mode === "UNIFIED"
            ? rc.baseOp
            : rc.baseOp * 0.45;
        rc.mats.forEach((m) => {
          m.opacity += (targetOp - m.opacity) * 0.08;
        });

        if (!prefersReduced) {
          const dir = idx % 2 === 0 ? 1 : -1;
          const speed =
            (mode === "CONTROL_PLANE" ? 0.36 : 0.2) * (1 - idx * 0.08);
          rc.group.rotation.z += dt * speed * dir;
          rc.group.rotation.x += dt * 0.05 * dir;
        }
      });

      // Decay interactive click shockwave impulse smoothly
      clickImpulseRef.current *= 0.92;
      const impulse = clickImpulseRef.current;

      if (!prefersReduced) {
        const breath = 1 + Math.sin(elapsed * 1.6) * 0.035 + impulse * 0.14;
        s1Inner.scale.setScalar(breath);

        s1Mesh.rotation.y += dt * ((mode === "FRIDAY_S1" ? 0.65 : 0.32) + impulse * 1.4);
        s1Mesh.rotation.x += dt * 0.18;

        s2Group.rotation.y -= dt * ((mode === "JARVIS_S2" ? 0.38 : 0.16) + impulse * 0.8);
        s2Group.rotation.z += dt * 0.09;

        datumCloud.rotation.y += dt * 0.06;

        // Update instanced signal packets flowing through the 5 safety rings
        for (let i = 0; i < packetCount; i++) {
          const phase = (elapsed * 0.28 + i / packetCount) % 1;
          const radius = 2.48 - phase * 1.65;
          const angle = elapsed * (0.7 + (i % 3) * 0.22) + i * 1.15;
          const tilt = Math.sin(angle * 0.8 + i) * 0.42;
          dummyObj.position.set(
            Math.cos(angle) * radius,
            tilt,
            Math.sin(angle) * radius
          );
          const pScale = Math.sin(phase * Math.PI) * (1 + impulse * 0.5);
          dummyObj.scale.setScalar(Math.max(0.25, pScale));
          dummyObj.updateMatrix();
          packetInstanced.setMatrixAt(i, dummyObj.matrix);
        }
        packetInstanced.instanceMatrix.needsUpdate = true;
      }

      // Smooth pointer + scroll-driven 3D camera choreography
      smoothPtrX += (targetPtrX - smoothPtrX) * 0.06;
      smoothPtrY += (targetPtrY - smoothPtrY) * 0.06;

      rootGroup.rotation.y = smoothPtrX * 0.38 + scrollProgress * 0.65;
      rootGroup.rotation.x = -smoothPtrY * 0.28 + scrollProgress * 0.32;

      renderer.render(scene, camera);
    };

    const onVisibility = () => {
      if (document.hidden) {
        clock.stop();
      } else {
        clock.start();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    setReady(true);
    animId = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      if (animId) cancelAnimationFrame(animId);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);

      packetInstanced.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  const meta = FOCUS_META[focus];
  const isPlain = clarityMode === "plain";

  return (
    <div className="relative flex flex-col border border-el-border bg-el-bg-raised shadow-el-md transition-shadow duration-300 hover:shadow-el-lg">
      {/* Top Instrument Header */}
      <div className="flex items-center justify-between border-b border-el-border px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-el-accent animate-pulse" />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-el-fg-muted">
            {isPlain ? meta.codePlain : meta.codeTech}
          </span>
        </div>
        <span className="font-mono text-[10px] tracking-[0.08em] text-el-accent">
          {isPlain ? meta.metricPlain : meta.metricTech}
        </span>
      </div>

      {/* 3D Viewport Area */}
      <div
        className={`relative w-full overflow-hidden ${
          compact ? "h-[320px] sm:h-[360px]" : "h-[360px] sm:h-[430px]"
        }`}
      >
        {/* Subtle institutional grid lines behind transparent WebGL */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--el-fg) 1px, transparent 1px), linear-gradient(to bottom, var(--el-fg) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* Loading indicator */}
        {!ready && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-el-bg-raised/90">
            <span className="h-5 w-5 rounded-full border border-el-border-strong border-t-el-accent animate-spin" />
            <span className="font-mono text-[11px] tracking-[0.12em] text-el-fg-faint">
              LOADING INTERACTIVE 3D MODEL...
            </span>
          </div>
        )}

        {/* Static architectural vector fallback if WebGL is disabled */}
        {!webglSupported ? (
          <div className="flex h-full w-full items-center justify-center p-8">
            <svg
              viewBox="0 0 240 240"
              className="h-56 w-56 text-el-accent"
              aria-label="ELEVEN Control Plane Topology Schematic"
            >
              <circle
                cx="120"
                cy="120"
                r="102"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.22"
                strokeDasharray="6 4"
              />
              <circle
                cx="120"
                cy="120"
                r="82"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.35"
              />
              <circle
                cx="120"
                cy="120"
                r="58"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.5"
              />
              <polygon
                points="120,76 158,98 158,142 120,164 82,142 82,98"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <circle cx="120" cy="120" r="14" fill="currentColor" fillOpacity="0.2" />
            </svg>
          </div>
        ) : (
          <div
            ref={containerRef}
            title="Move mouse to tilt · Click to send a safety pulse"
            className="h-full w-full cursor-pointer"
          />
        )}

        {/* Corner Coordinate Hairlines */}
        <div className="pointer-events-none absolute bottom-3 left-4 font-mono text-[9.5px] tracking-[0.1em] text-el-fg-faint">
          {isPlain ? "100% PRIVATE ON YOUR DEVICE" : "127.0.0.1 // LOOPBACK ISOLATED"}
        </div>
        <div className="pointer-events-none absolute bottom-3 right-4 font-mono text-[9.5px] tracking-[0.1em] text-el-fg-faint">
          MOVE OR CLICK TO INTERACT
        </div>
      </div>

      {/* Interactive Subsystem Focus Switcher with Sliding Spring Pill */}
      <div className="border-t border-el-border bg-el-bg p-3.5 sm:p-4">
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {(["UNIFIED", "FRIDAY_S1", "JARVIS_S2", "CONTROL_PLANE"] as const).map(
            (tabId) => {
              const activeTab = focus === tabId;
              const tabMeta = FOCUS_META[tabId];
              return (
                <button
                  key={tabId}
                  type="button"
                  onClick={() => {
                    setFocus(tabId);
                    clickImpulseRef.current = 0.75;
                  }}
                  className={`relative cursor-pointer overflow-hidden rounded-sm border px-2.5 py-2 font-mono text-[10.5px] tracking-[0.03em] transition-colors duration-200 ${
                    activeTab
                      ? "border-el-fg text-el-bg font-medium"
                      : "border-el-border bg-el-bg-raised text-el-fg-muted hover:border-el-border-strong hover:text-el-fg"
                  }`}
                >
                  {activeTab && (
                    <motion.span
                      layoutId={compact ? "gyroTabCompact" : "gyroTabHero"}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="absolute inset-0 bg-el-fg"
                    />
                  )}
                  <span className="relative z-10">
                    {isPlain ? tabMeta.tabPlain : tabMeta.tabTech}
                  </span>
                </button>
              );
            }
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${focus}-${clarityMode}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="mt-3 flex flex-col gap-1 border-t border-el-border/70 pt-2.5 sm:flex-row sm:items-baseline sm:justify-between"
          >
            <p className="text-el-xs font-medium text-el-fg">
              {isPlain ? meta.titlePlain : meta.titleTech}
            </p>
            <p className="max-w-[48ch] text-[12px] leading-relaxed text-el-fg-muted">
              {isPlain ? meta.captionPlain : meta.captionTech}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
