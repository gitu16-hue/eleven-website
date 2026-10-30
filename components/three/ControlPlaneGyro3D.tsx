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
  theme = "dark",
}: {
  compact?: boolean;
  theme?: "dark" | "light";
}) {
  const { mode: clarityMode } = useClarityMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<TopologyFocus>("UNIFIED");
  const focusRef = useRef<TopologyFocus>("UNIFIED");
  const clickImpulseRef = useRef<number>(0);
  const [webglSupported] = useState(() => detectWebGLSupport());
  const [ready, setReady] = useState(() => !detectWebGLSupport());

  useEffect(() => {
    focusRef.current = focus;
  }, [focus]);

  useEffect(() => {
    if (!webglSupported) return;

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

    const dprVal = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dprVal);
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
    canvas.style.touchAction = "pan-y";
    container.appendChild(canvas);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const isDark = theme === "dark";

    // 1. System 1 Core (F.R.I.D.A.Y. — Geodesic Shell + Custom GLSL Fresnel Plasma Core)
    const s1Group = new THREE.Group();
    rootGroup.add(s1Group);

    const s1Geo = new THREE.IcosahedronGeometry(0.78, 2);
    const s1WireMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x00f0ff : 0x2b4d47,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.65 : 0.55,
      depthWrite: false,
    });
    const s1Mesh = new THREE.Mesh(s1Geo, s1WireMat);
    s1Group.add(s1Mesh);

    const s1InnerGeo = new THREE.SphereGeometry(0.36, 32, 32);
    const coreUniforms = {
      uTime: { value: 0 },
      uImpulse: { value: 0 },
      uPrimary: {
        value: new THREE.Color(isDark ? 0x00f0ff : 0x2b4d47),
      },
      uSecondary: {
        value: new THREE.Color(isDark ? 0x8b5cf6 : 0x11110e),
      },
    };
    const s1InnerMat = new THREE.ShaderMaterial({
      uniforms: coreUniforms,
      transparent: true,
      depthWrite: false,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uImpulse;
        varying vec3 vNormalW;
        varying vec3 vViewDir;

        void main() {
          vec3 pos = position;
          float wave = sin(pos.x * 7.0 + uTime * 2.4) * cos(pos.y * 7.0 - uTime * 1.9) * 0.024;
          pos += normal * (wave + uImpulse * 0.06);
          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          vNormalW = normalize(normalMatrix * normal);
          vViewDir = normalize(-mvPos.xyz);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform float uImpulse;
        uniform vec3 uPrimary;
        uniform vec3 uSecondary;
        varying vec3 vNormalW;
        varying vec3 vViewDir;

        void main() {
          float fresnel = pow(1.0 - max(dot(vNormalW, vViewDir), 0.0), 2.2);
          float pulse = 0.68 + 0.32 * sin(uTime * 2.6);
          vec3 col = mix(uSecondary, uPrimary, fresnel * 0.85 + 0.25);
          float alpha = (0.18 + fresnel * 0.58 + uImpulse * 0.32) * pulse;
          gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.92));
        }
      `,
    });
    const s1Inner = new THREE.Mesh(s1InnerGeo, s1InnerMat);
    s1Group.add(s1Inner);

    // 2. System 2 Frame (J.A.R.V.I.S. — Subconscious Analytical Lattice)
    const s2Group = new THREE.Group();
    rootGroup.add(s2Group);

    const s2Geo = new THREE.IcosahedronGeometry(1.38, 1);
    const s2Edges = new THREE.EdgesGeometry(s2Geo);
    const s2Mat = new THREE.LineBasicMaterial({
      color: isDark ? 0x8b5cf6 : 0x11110e,
      transparent: true,
      opacity: isDark ? 0.5 : 0.34,
      depthWrite: false,
    });
    const s2Wire = new THREE.LineSegments(s2Edges, s2Mat);
    s2Group.add(s2Wire);

    const s2PosAttr = s2Geo.getAttribute("position");
    const s2PointsMat = new THREE.PointsMaterial({
      color: isDark ? 0x00ff9d : 0x2b4d47,
      size: isMobile ? 0.052 : 0.045,
      transparent: true,
      opacity: isDark ? 0.85 : 0.75,
      depthWrite: false,
    });
    const s2Nodes = new THREE.Points(
      new THREE.BufferGeometry().setAttribute("position", s2PosAttr),
      s2PointsMat
    );
    s2Group.add(s2Nodes);

    // 3. 5-Stage AI Control Plane Containment Gimbal Rings
    const ringsGroup = new THREE.Group();
    rootGroup.add(ringsGroup);

    const ringSpecs = isDark
      ? [
          { r: 1.78, segs: 3, frac: 0.74, tx: 0.48, ty: 0.22, color: 0x00f0ff, op: 0.78 },
          { r: 2.04, segs: 4, frac: 0.68, tx: -0.62, ty: 0.45, color: 0x8b5cf6, op: 0.7 },
          { r: 2.3, segs: 2, frac: 0.8, tx: 0.95, ty: -0.34, color: 0x00ff9d, op: 0.66 },
          { r: 2.56, segs: 6, frac: 0.55, tx: -0.28, ty: 0.86, color: 0x38bdf8, op: 0.58 },
          { r: 2.84, segs: 4, frac: 0.72, tx: 1.24, ty: 0.16, color: 0x6366f1, op: 0.55 },
        ]
      : [
          { r: 1.78, segs: 3, frac: 0.74, tx: 0.48, ty: 0.22, color: 0x2b4d47, op: 0.55 },
          { r: 2.04, segs: 4, frac: 0.68, tx: -0.62, ty: 0.45, color: 0x5c5b54, op: 0.42 },
          { r: 2.3, segs: 2, frac: 0.8, tx: 0.95, ty: -0.34, color: 0x2b4d47, op: 0.48 },
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
          blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
          depthWrite: false,
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

    // 4. Precision Sovereign Memory Datum Cloud (Deterministic PRNG + GLSL Bokeh)
    let seed = 42019;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const pointCount = isMobile ? 750 : 1850;
    const pPositions = new Float32Array(pointCount * 3);
    const pPhases = new Float32Array(pointCount);
    for (let i = 0; i < pointCount; i++) {
      const radius = 1.55 + Math.pow(rand(), 1.4) * 1.55;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      pPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pPositions[i * 3 + 1] = radius * Math.cos(phi);
      pPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      pPhases[i] = rand() * Math.PI * 2;
    }
    const cloudGeo = new THREE.BufferGeometry();
    cloudGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    cloudGeo.setAttribute("aPhase", new THREE.BufferAttribute(pPhases, 1));
    const cloudMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: coreUniforms.uTime,
        uImpulse: coreUniforms.uImpulse,
        uDpr: { value: dprVal },
        uColor: { value: new THREE.Color(isDark ? 0x00f0ff : 0x2b4d47) },
        uBaseAlpha: { value: isDark ? 0.34 : 0.38 },
      },
      transparent: true,
      depthWrite: false,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      vertexShader: /* glsl */ `
        attribute float aPhase;
        uniform float uTime;
        uniform float uImpulse;
        uniform float uDpr;
        varying float vAlpha;

        void main() {
          vec3 pos = position * (1.0 + uImpulse * 0.08);
          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          float dist = max(-mvPos.z, 2.0);
          gl_PointSize = clamp((13.0 * uDpr) / dist, 1.2, 5.5);
          float twinkle = 0.55 + 0.45 * sin(uTime * 1.6 + aPhase);
          vAlpha = twinkle;
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform float uBaseAlpha;
        varying float vAlpha;

        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float r2 = dot(uv, uv);
          if (r2 > 0.25) discard;
          float soft = exp(-r2 * 14.0);
          gl_FragColor = vec4(uColor, uBaseAlpha * vAlpha * soft);
        }
      `,
    });
    const datumCloud = new THREE.Points(cloudGeo, cloudMat);
    rootGroup.add(datumCloud);
    disposables.push(cloudGeo, cloudMat);

    // Expanding 3D Shockwave Pulse Ring on Click / Focus Switch
    const pulseRingGeo = new THREE.RingGeometry(0.85, 0.91, 64);
    const pulseRingMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x00ff9d : 0x2b4d47,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });
    const pulseRingMesh = new THREE.Mesh(pulseRingGeo, pulseRingMat);
    pulseRingMesh.rotation.x = Math.PI * 0.36;
    rootGroup.add(pulseRingMesh);
    disposables.push(pulseRingGeo, pulseRingMat);

    // Non-blocking pointer tilt + Drag-to-Rotate 3D Inertia + Scroll Reactivity
    let targetPtrX = 0;
    let targetPtrY = 0;
    let smoothPtrX = 0;
    let smoothPtrY = 0;
    let isDragging = false;
    let lastDragX = 0;
    let lastDragY = 0;
    let dragAngleY = 0;
    let dragAngleX = 0;
    let dragVelY = 0;
    let dragVelX = 0;
    let scrollProgress = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
      const ny = ((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
      targetPtrX = Math.max(-1, Math.min(1, nx));
      targetPtrY = Math.max(-1, Math.min(1, ny));

      if (isDragging) {
        const dx = e.clientX - lastDragX;
        const dy = e.clientY - lastDragY;
        lastDragX = e.clientX;
        lastDragY = e.clientY;
        dragVelY = dx * 0.0085;
        dragVelX = dy * 0.0065;
        dragAngleY += dragVelY;
        dragAngleX = Math.max(-0.85, Math.min(0.85, dragAngleX + dragVelX));
      }
    };

    const onPointerLeave = () => {
      isDragging = false;
      targetPtrX = 0;
      targetPtrY = 0;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onScroll = () => {
      const maxScroll = Math.max(window.innerHeight * 1.2, 600);
      scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };

    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // InstancedMesh orbiting signal packets (premium-3d-website instancing best practice)
    const packetCount = isMobile ? 8 : 16;
    const packetGeo = new THREE.SphereGeometry(0.036, 10, 10);
    const packetMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x00f0ff : 0x2b4d47,
      transparent: true,
      opacity: isDark ? 0.85 : 0.78,
      depthWrite: false,
    });
    disposables.push(packetGeo, packetMat);
    const packetInstanced = new THREE.InstancedMesh(
      packetGeo,
      packetMat,
      packetCount
    );
    const dummyObj = new THREE.Object3D();
    rootGroup.add(packetInstanced);

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastDragX = e.clientX;
      lastDragY = e.clientY;
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
    window.addEventListener("resize", onResize, { passive: true });

    let lastTime = performance.now();
    let elapsed = 0;
    const tempScaleVec = new THREE.Vector3();
    let s1TargetScale = 1;
    let s2TargetScale = 1;
    let ringTargetScale = 1;

    let isVisible = true;
    let contextLost = false;
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isVisible = entry ? entry.isIntersecting : true;
          if (isVisible && !document.hidden) {
            lastTime = performance.now();
          }
        },
        { threshold: 0.05 }
      );
      io.observe(container);
    }

    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
    };
    const onContextRestored = () => {
      contextLost = false;
    };
    canvas.addEventListener("webglcontextlost", onContextLost, false);
    canvas.addEventListener("webglcontextrestored", onContextRestored, false);

    const animate = () => {
      if (disposed) return;
      animId = requestAnimationFrame(animate);

      if (!isVisible || document.hidden || contextLost) return;

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      elapsed += dt;
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
        tempScaleVec.set(s1TargetScale, s1TargetScale, s1TargetScale),
        0.07
      );
      s2Group.scale.lerp(
        tempScaleVec.set(s2TargetScale, s2TargetScale, s2TargetScale),
        0.07
      );
      ringsGroup.scale.lerp(
        tempScaleVec.set(ringTargetScale, ringTargetScale, ringTargetScale),
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
            (mode === "CONTROL_PLANE" ? 0.42 : 0.24) * (1 - idx * 0.07);
          rc.group.rotation.z += dt * speed * dir;

          const nutationX =
            Math.sin(elapsed * 0.7 + idx * 1.1) *
            0.08 *
            (1 + (mode === "CONTROL_PLANE" ? 0.4 : 0));
          const nutationY =
            Math.cos(elapsed * 0.55 + idx * 0.85) *
            0.09 *
            (1 + (mode === "CONTROL_PLANE" ? 0.4 : 0));
          rc.group.rotation.x = ringSpecs[idx].tx + nutationX;
          rc.group.rotation.y = ringSpecs[idx].ty + nutationY;
        }
      });

      // Decay interactive click shockwave impulse & update GLSL uniforms
      clickImpulseRef.current *= 0.92;
      const impulse = clickImpulseRef.current;
      coreUniforms.uTime.value = elapsed;
      coreUniforms.uImpulse.value = impulse;

      if (impulse > 0.01) {
        const ringExpand = 1 + (1 - impulse) * 2.35;
        pulseRingMesh.scale.setScalar(ringExpand);
        pulseRingMat.opacity = impulse * 0.55;
        pulseRingMesh.rotation.z = elapsed * 0.9;
      } else {
        pulseRingMat.opacity = 0;
      }

      if (!prefersReduced) {
        const breath1 = Math.sin(elapsed * 1.8) * 0.04;
        const breath2 = Math.sin(elapsed * 3.6 + 0.8) * 0.02;
        const breath = 1 + breath1 + breath2 + impulse * 0.22;
        s1Inner.scale.setScalar(breath);
        s1Mesh.scale.setScalar(1 + breath1 * 0.7 + impulse * 0.16);

        s1Mesh.rotation.y +=
          dt * ((mode === "FRIDAY_S1" ? 0.75 : 0.38) + impulse * 1.6);
        s1Mesh.rotation.x += dt * (0.22 + Math.sin(elapsed * 0.5) * 0.05);

        s2Group.rotation.y -=
          dt * ((mode === "JARVIS_S2" ? 0.45 : 0.2) + impulse * 1.0);
        s2Group.rotation.z += dt * 0.12;
        s2Group.rotation.x = Math.sin(elapsed * 0.4) * 0.06;

        datumCloud.rotation.y += dt * 0.08;
        datumCloud.rotation.x = Math.sin(elapsed * 0.3) * 0.04;

        for (let i = 0; i < packetCount; i++) {
          const phase = (elapsed * 0.32 + i / packetCount) % 1;
          const radius = 2.52 - phase * 1.7;
          const angle = elapsed * (0.8 + (i % 3) * 0.25) + i * 1.25;
          const tilt = Math.sin(angle * 1.2 + i * 0.7) * 0.45;
          dummyObj.position.set(
            Math.cos(angle) * radius,
            tilt,
            Math.sin(angle) * radius
          );
          const pScale =
            (0.35 + Math.sin(phase * Math.PI) * 0.85) * (1 + impulse * 0.7);
          dummyObj.scale.setScalar(Math.max(0.2, pScale));
          dummyObj.updateMatrix();
          packetInstanced.setMatrixAt(i, dummyObj.matrix);
        }
        packetInstanced.instanceMatrix.needsUpdate = true;
      }

      // Smooth pointer + drag inertia + scroll-driven 3D camera choreography
      smoothPtrX += (targetPtrX - smoothPtrX) * 0.07;
      smoothPtrY += (targetPtrY - smoothPtrY) * 0.07;

      if (!isDragging) {
        dragAngleY += dragVelY;
        dragAngleX = Math.max(-0.85, Math.min(0.85, dragAngleX + dragVelX));
        dragVelY *= 0.94;
        dragVelX *= 0.92;
        dragAngleX *= 0.992;
      }

      const ambientDriftY = Math.sin(elapsed * 0.35) * 0.06;
      const ambientDriftX = Math.cos(elapsed * 0.28) * 0.04;

      rootGroup.rotation.y =
        dragAngleY + smoothPtrX * 0.38 + ambientDriftY + scrollProgress * 0.65;
      rootGroup.rotation.x =
        dragAngleX - smoothPtrY * 0.28 + ambientDriftX + scrollProgress * 0.32;

      renderer.render(scene, camera);
    };

    const onVisibility = () => {
      if (!document.hidden) {
        lastTime = performance.now();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    setReady(true);
    animId = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      if (io) io.disconnect();
      if (animId) cancelAnimationFrame(animId);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);

      packetInstanced.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, [theme, webglSupported]);

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
            title="Drag to rotate 3D topology · Click to emit a safety shockwave"
            className="h-full w-full cursor-grab active:cursor-grabbing select-none"
          />
        )}

        {/* Corner Coordinate Hairlines */}
        <div className="pointer-events-none absolute bottom-3 left-4 font-mono text-[9.5px] tracking-[0.1em] text-el-fg-faint">
          {isPlain ? "100% PRIVATE ON YOUR DEVICE" : "127.0.0.1 // LOOPBACK ISOLATED"}
        </div>
        <div className="pointer-events-none absolute bottom-3 right-4 font-mono text-[9.5px] tracking-[0.1em] text-el-fg-faint">
          DRAG TO ORBIT · CLICK TO PULSE
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
                    clickImpulseRef.current = 0.85;
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
