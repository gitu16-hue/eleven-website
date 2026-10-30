"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

/**
 * Authoritative ELEVEN v3 Holographic Visualizer (Ported from F:\eleven-v3\src\eleven\ui\orb.js)
 * - Living cellular membrane GLSL shader with 3D simplex noise & Fresnel iridescent rim
 * - Inner geodesic nerve lattice wireframe
 * - 9 dynamic light filaments with travelling light pulses
 * - Volumetric 3D spherical outer GPU cloud + inner 3D vortex
 * - 4 segmented 3D gyroscopic gimbal rings
 * - Phase 4D.3 Orbiting 3D Governed Worker Satellites with Evidence Adjudication Halos
 * - UnrealBloomPass HDR post-processing with ACESFilmicToneMapping
 */

export type OrbRuntimeState =
  | "IDLE"
  | "LISTENING"
  | "THINKING"
  | "SPEAKING"
  | "EXECUTING"
  | "VERIFYING"
  | "AUTHORITY_REQUIRED";

export interface WorkerSatelliteSpec {
  stepId: string;
  toolName: string;
  lifecycleState: "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED";
  evidenceStatus: "PENDING" | "ACCEPTED" | "UNRESOLVED" | "REJECTED";
}

interface StateConfig {
  pri: number;
  sec: number;
  amp: number;
  freq: number;
  speed: number;
  scale: number;
  basePulse: number;
  bloom: number;
  badgeText: string;
  hex: string;
}

export const ORB_STATE_CONFIGS: Record<OrbRuntimeState, StateConfig> = {
  IDLE: {
    pri: 0x00d8ff,
    sec: 0x003377,
    amp: 0.09,
    freq: 1.75,
    speed: 0.35,
    scale: 1.0,
    basePulse: 0.0,
    bloom: 0.52,
    badgeText: "IDLE // READY",
    hex: "#00D8FF",
  },
  LISTENING: {
    pri: 0x00ffcc,
    sec: 0x0066aa,
    amp: 0.18,
    freq: 2.3,
    speed: 0.75,
    scale: 0.93,
    basePulse: -0.12,
    bloom: 0.66,
    badgeText: "LISTENING // 16kHz VAD",
    hex: "#00FFCC",
  },
  THINKING: {
    pri: 0xa855f7,
    sec: 0x0088cc,
    amp: 0.24,
    freq: 2.9,
    speed: 1.15,
    scale: 0.97,
    basePulse: -0.06,
    bloom: 0.65,
    badgeText: "THINKING // J.A.R.V.I.S. S2",
    hex: "#A855F7",
  },
  SPEAKING: {
    pri: 0xff9900,
    sec: 0x993300,
    amp: 0.26,
    freq: 2.2,
    speed: 0.85,
    scale: 1.06,
    basePulse: 0.05,
    bloom: 0.72,
    badgeText: "SPEAKING // F.R.I.D.A.Y. S1",
    hex: "#FF9900",
  },
  EXECUTING: {
    pri: 0x10b981,
    sec: 0x005577,
    amp: 0.16,
    freq: 2.4,
    speed: 0.95,
    scale: 1.03,
    basePulse: 0.02,
    bloom: 0.6,
    badgeText: "EXECUTING // SANDBOX DAG",
    hex: "#10B981",
  },
  VERIFYING: {
    pri: 0xd8f0ff,
    sec: 0x0284c7,
    amp: 0.05,
    freq: 3.4,
    speed: 0.5,
    scale: 0.95,
    basePulse: -0.08,
    bloom: 0.62,
    badgeText: "VERIFYING // SWARM GATE",
    hex: "#D8F0FF",
  },
  AUTHORITY_REQUIRED: {
    pri: 0xff3333,
    sec: 0x882200,
    amp: 0.04,
    freq: 1.4,
    speed: 0.12,
    scale: 0.86,
    basePulse: -0.16,
    bloom: 0.74,
    badgeText: "DEC-008 APPROVAL REQUIRED",
    hex: "#FF3333",
  },
};

const SATELLITE_COLORS: Record<WorkerSatelliteSpec["lifecycleState"], number> = {
  QUEUED: 0x64748b,
  RUNNING: 0x10b981,
  COMPLETED: 0x00d8ff,
  FAILED: 0xef4444,
};

const EVIDENCE_COLORS: Record<WorkerSatelliteSpec["evidenceStatus"], number> = {
  PENDING: 0x94a3b8,
  ACCEPTED: 0x10b981,
  UNRESOLVED: 0xf59e0b,
  REJECTED: 0xef4444,
};

// GLSL 3D Simplex Noise from authoritative orb.js
const SNOISE = `
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

const CORE_VERTEX = `
  uniform float uTime;
  uniform float uNoiseAmp;
  uniform float uNoiseFreq;
  uniform float uBreath;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vCenter;

  ${SNOISE}
  void main() {
    vNormal = normal;
    vCenter = (modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    float n1 = snoise(normal * uNoiseFreq + uTime * 0.95);
    float n2 = snoise(normal * (uNoiseFreq * 1.8) - uTime * 1.35) * 0.45;
    float disp = (n1 + n2) * uNoiseAmp * 0.06 + uBreath * 0.02;
    vec3 newPos = position + normal * disp;
    vPosition = (modelViewMatrix * vec4(newPos, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

const CORE_FRAGMENT = `
  uniform vec3 uColorPrimary;
  uniform vec3 uColorSecondary;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vCenter;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(-vPosition);
    float fres = pow(1.0 - abs(dot(N, V)), 3.2);
    float film = fres * 1.3 + uTime * 0.03;
    vec3 shift = 0.5 + 0.5 * cos(6.28318 * (film + vec3(0.00, 0.12, 0.28)));
    vec3 rim = mix(uColorPrimary, uColorPrimary * 0.3 + shift * 0.7, 0.4) * fres * 1.2;
    vec3 dd = normalize(vPosition);
    float bb = length(vCenter - dd * dot(vCenter, dd));
    float nuc = exp(-bb * bb * 16.0) * 0.30 + exp(-bb * bb * 2.6) * 0.07;
    vec3 nucCol = mix(uColorPrimary, vec3(1.0), 0.35) * nuc;
    gl_FragColor = vec4(rim + nucCol + uColorSecondary * 0.02, clamp(fres * 0.7 + nuc * 1.2 + 0.015, 0.0, 0.85));
  }
`;

const FIL_VERT = `
  attribute float aU;
  uniform float uTime, uPhase, uAmp, uK1, uK2, uRad;
  varying float vU;
  void main() {
    float u = aU * 6.28318530718;
    vec3 p = vec3(cos(u), sin(u), 0.0) * uRad;
    p.xy *= 1.0 + 0.045 * sin(u * uK2 - uTime * 0.45 + uPhase);
    p.z  += sin(u * uK1 + uTime * 0.55 + uPhase) * (0.05 + uAmp * 0.45) * uRad;
    vU = aU;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FIL_FRAG = `
  uniform vec3 uColor;
  uniform float uTime, uPhase, uSpeed;
  varying float vU;
  void main() {
    float head = fract(vU - uTime * uSpeed * 0.10 - uPhase);
    float pulse = pow(1.0 - head, 6.0);
    float a = 0.16 + 0.84 * pulse;
    gl_FragColor = vec4(uColor * (0.55 + 1.6 * pulse), a);
  }
`;

function checkWebGL(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

export function ElevenHolographicOrb3D({
  state,
  bargeInSignal = 0,
  satellites = [],
}: {
  state: OrbRuntimeState;
  bargeInSignal?: number;
  satellites?: WorkerSatelliteSpec[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglOk] = useState(() => checkWebGL());
  const [loaded, setLoaded] = useState(() => !checkWebGL());

  const stateRef = useRef<OrbRuntimeState>(state);
  const waveTriggerRef = useRef<number>(0);
  const bargeTriggerRef = useRef<number>(0);
  const satellitesRef = useRef<WorkerSatelliteSpec[]>(satellites);

  useEffect(() => {
    if (stateRef.current !== state) {
      stateRef.current = state;
      waveTriggerRef.current += 1;
    }
  }, [state]);

  useEffect(() => {
    if (bargeInSignal > 0) {
      bargeTriggerRef.current = bargeInSignal;
    }
  }, [bargeInSignal]);

  useEffect(() => {
    satellitesRef.current = satellites;
  }, [satellites]);

  useEffect(() => {
    if (!webglOk) return;

    const container = containerRef.current;
    if (!container) return;

    const isMobile =
      window.innerWidth < 768 ||
      /iPhone|iPad|Android/i.test(navigator.userAgent);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let disposed = false;
    let animId: number | null = null;
    const disposables: { dispose: () => void }[] = [];

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000205, 0.042);

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(0, 0.28, 7.9);

    // Disable renderer antialiasing when EffectComposer post-processing is active (premium-3d-website best practice)
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance",
      alpha: true,
    });
    renderer.setSize(width, height);
    // Mobile DPR clamped to 1 per 3d-web-experience skill
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.88;

    const canvas = renderer.domElement;
    canvas.setAttribute("role", "img");
    canvas.setAttribute(
      "aria-label",
      `ELEVEN v3 Authoritative Holographic Visualizer - State: ${stateRef.current}`
    );
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.touchAction = "pan-y";
    container.appendChild(canvas);

    // OrbitControls with enableZoom=false so scroll events are NEVER captured!
    const controls = new OrbitControls(camera, canvas);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.035;
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 0.42;

    if (isMobile) {
      // On mobile devices, disable touch rotation so single-finger swipe scrolls the webpage naturally
      controls.enableRotate = false;
    }

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.56,
      0.34,
      0.38
    );
    composer.addPass(bloomPass);

    // 1. Living Cellular Core + Geodesic Wireframe
    const initCfg = ORB_STATE_CONFIGS[stateRef.current];
    const uniforms = {
      uTime: { value: 0 },
      uNoiseAmp: { value: initCfg.amp },
      uNoiseFreq: { value: initCfg.freq },
      uBreath: { value: 0.0 },
      uColorPrimary: { value: new THREE.Color(initCfg.pri) },
      uColorSecondary: { value: new THREE.Color(initCfg.sec) },
    };

    const coreGeo = new THREE.IcosahedronGeometry(1.2, isMobile ? 20 : 34);
    const coreMat = new THREE.ShaderMaterial({
      vertexShader: CORE_VERTEX,
      fragmentShader: CORE_FRAGMENT,
      uniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const plasmaCore = new THREE.Mesh(coreGeo, coreMat);
    scene.add(plasmaCore);
    disposables.push(coreGeo, coreMat);

    const wireGeo = new THREE.IcosahedronGeometry(1.24, 4);
    const wireMat = new THREE.MeshBasicMaterial({
      color: initCfg.pri,
      wireframe: true,
      transparent: true,
      opacity: 0.04,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const wireShell = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireShell);
    disposables.push(wireGeo, wireMat);

    // 2. 9 Dynamic Light Filaments
    const filAmp = { value: 0.05 };
    const filaments = new THREE.Group();
    scene.add(filaments);
    const FIL_N = 9;
    const FIL_SEG = isMobile ? 240 : 420;
    const filDefs: {
      line: THREE.Line;
      sx: number;
      sy: number;
      sz: number;
    }[] = [];

    for (let f = 0; f < FIL_N; f++) {
      const aU = new Float32Array(FIL_SEG + 1);
      for (let i = 0; i <= FIL_SEG; i++) aU[i] = i / FIL_SEG;
      const g = new THREE.BufferGeometry();
      g.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array((FIL_SEG + 1) * 3), 3)
      );
      g.setAttribute("aU", new THREE.BufferAttribute(aU, 1));
      const m = new THREE.ShaderMaterial({
        vertexShader: FIL_VERT,
        fragmentShader: FIL_FRAG,
        uniforms: {
          uTime: uniforms.uTime,
          uColor: uniforms.uColorPrimary,
          uAmp: filAmp,
          uPhase: { value: f * 0.97 },
          uSpeed: { value: 0.7 + (f % 4) * 0.22 },
          uK1: { value: 2 + (f % 2) },
          uK2: { value: 2 + (f % 3) },
          uRad: { value: 0.7 + (f / (FIL_N - 1)) * 0.58 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const line = new THREE.Line(g, m);
      line.frustumCulled = false;
      line.rotation.set(f * 0.7, f * 1.1, f * 0.4);
      filaments.add(line);
      disposables.push(g, m);
      filDefs.push({
        line,
        sx: (f % 2 ? 1 : -1) * (0.05 + 0.02 * f),
        sy: (f % 3 ? 1 : -1) * (0.04 + 0.015 * f),
        sz: 0.02 + 0.01 * (f % 4),
      });
    }

    // 3. Outer Volumetric 3D GPU Particle Cloud
    const outerCount = isMobile ? 14000 : 40000;
    const pGeo = new THREE.BufferGeometry();
    const pBase = new Float32Array(outerCount * 3);
    const pRand = new Float32Array(outerCount * 4);

    for (let i = 0; i < outerCount; i++) {
      const r = 1.25 + Math.pow(Math.random(), 1.55) * 1.52;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pBase[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pBase[i * 3 + 1] = r * Math.cos(phi);
      pBase[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      pRand[i * 4] = Math.random();
      pRand[i * 4 + 1] = Math.random();
      pRand[i * 4 + 2] = Math.random();
      pRand[i * 4 + 3] = Math.random();
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pBase, 3));
    pGeo.setAttribute("aRand", new THREE.BufferAttribute(pRand, 4));

    const pU = {
      uTime: uniforms.uTime,
      uColor: uniforms.uColorPrimary,
      uColorSec: uniforms.uColorSecondary,
      uBass: { value: 0 },
      uMid: { value: 0 },
      uHigh: { value: 0 },
      uPulse: { value: 0 },
      uWave: { value: -10 },
      uWaveAmp: { value: 0 },
      uScale: { value: 1 },
      uPx: { value: (dpr * height) / 900 },
    };

    const pMat = new THREE.ShaderMaterial({
      uniforms: pU,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: `
        uniform float uTime, uBass, uMid, uHigh, uPulse, uWave, uWaveAmp, uScale, uPx;
        attribute vec4 aRand;
        varying float vAlpha;
        varying float vGlow;
        varying float vDepthCue;
        ${SNOISE}
        void main() {
          vec3 p = position;
          float r = length(p);
          float angY = uTime * 0.14 * (1.65 / (0.45 + r * 0.42));
          float cy = cos(angY), sy = sin(angY);
          p.xz = mat2(cy, -sy, sy, cy) * p.xz;

          float tiltAng = (aRand.x - 0.5) * 0.35 * sin(uTime * 0.25 + r);
          float ct = cos(tiltAng), st = sin(tiltAng);
          p.yz = mat2(ct, -st, st, ct) * p.yz;

          vec3 q = p * 0.55 + vec3(uTime * 0.08, -uTime * 0.06, uTime * 0.05);
          vec3 drift = vec3(snoise(q), snoise(q + 17.3), snoise(q + 41.7));
          float scatterFreedom = smoothstep(1.20, 2.65, r);
          p += drift * (0.045 + 0.11 * scatterFreedom + uMid * 0.06);

          float radialNorm = clamp((r - 1.25) / 1.52, 0.0, 1.0);
          float delayedPulse = uPulse * (1.05 - radialNorm * 0.22)
                             + sin(uTime * 5.2 - r * 2.1) * (uBass * 0.12 + uMid * 0.14);
          float voiceBand = mix(uBass, mix(uMid, uHigh, radialNorm), radialNorm);
          float radialScale = 1.0 + delayedPulse + voiceBand * (0.12 + 0.14 * aRand.w);
          p *= radialScale;

          float rr = length(p);
          float w = exp(-pow((rr - uWave) * 2.1, 2.0));
          p += normalize(p) * w * uWaveAmp * 0.38;
          p *= uScale;

          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;

          float camDepth = clamp((-mv.z - 5.6) / 5.2, 0.0, 1.0);
          vDepthCue = 1.0 - camDepth;

          float tw = 0.65 + 0.35 * sin(uTime * (0.9 + aRand.w * 1.7) + aRand.x * 40.0);
          float radialFade = clamp(1.25 - radialNorm * 0.48, 0.45, 1.0);
          float zOcclusion = mix(0.38, 1.18, vDepthCue);
          float lift = w * uWaveAmp * 0.85 + 0.22 + clamp(abs(uPulse) * 1.1 + voiceBand * 0.6, 0.0, 0.75);

          vAlpha = tw * radialFade * zOcclusion * (0.58 + aRand.y * 0.42) + lift * 0.65;
          vGlow = lift;

          float perspSize = (0.85 + aRand.z * 1.35 + vDepthCue * 0.85 + lift * 1.65);
          gl_PointSize = perspSize * uPx * (9.2 / -mv.z);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uColorSec;
        varying float vAlpha;
        varying float vGlow;
        varying float vDepthCue;
        void main() {
          vec2 d = gl_PointCoord - 0.5;
          float dist = length(d);
          if (dist > 0.5) discard;
          float m = smoothstep(0.5, 0.0, dist);
          float core = smoothstep(0.20, 0.0, dist);
          vec3 depthTint = mix(mix(uColor, uColorSec, 0.45), uColor, vDepthCue);
          vec3 col = depthTint * (0.45 + core * 0.55) + vec3(vGlow) * 0.32;
          gl_FragColor = vec4(col, m * m * vAlpha * 0.78);
        }
      `,
    });
    const particleCloud = new THREE.Points(pGeo, pMat);
    particleCloud.frustumCulled = false;
    scene.add(particleCloud);
    disposables.push(pGeo, pMat);

    // 4. Inner 3D Particle Vortex
    const innerCount = isMobile ? 5000 : 14000;
    const iGeo = new THREE.BufferGeometry();
    const iBase = new Float32Array(innerCount * 3);
    const iRand = new Float32Array(innerCount * 4);
    for (let i = 0; i < innerCount; i++) {
      const r = 0.16 + Math.pow(Math.random(), 0.78) * 0.98;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      iBase[i * 3] = r * Math.sin(ph) * Math.cos(th);
      iBase[i * 3 + 1] = r * Math.cos(ph);
      iBase[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
      for (let k = 0; k < 4; k++) iRand[i * 4 + k] = Math.random();
    }
    iGeo.setAttribute("position", new THREE.BufferAttribute(iBase, 3));
    iGeo.setAttribute("aRand", new THREE.BufferAttribute(iRand, 4));

    const iMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: uniforms.uTime,
        uColor: uniforms.uColorPrimary,
        uBass: pU.uBass,
        uMid: pU.uMid,
        uPulse: pU.uPulse,
        uScale: pU.uScale,
        uPx: pU.uPx,
        uWave: pU.uWave,
        uWaveAmp: pU.uWaveAmp,
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: `
        uniform float uTime, uBass, uMid, uPulse, uScale, uPx, uWave, uWaveAmp;
        attribute vec4 aRand;
        varying float vAlpha;
        ${SNOISE}
        void main() {
          vec3 p = position;
          float r = length(p);
          float ang = uTime * (0.22 + (1.0 - r) * 0.55);
          float c = cos(ang), s = sin(ang);
          p.xz = mat2(c, -s, s, c) * p.xz;
          vec3 q = p * 1.15 + vec3(uTime * 0.12, 0.0, -uTime * 0.09);
          p += vec3(snoise(q), snoise(q + 11.1), snoise(q + 23.7)) * (0.055 + uMid * 0.10);

          p *= 1.0 + uPulse * 0.78 + uBass * 0.20 * (1.0 - r * 0.4);
          float rr = length(p);
          float maxR = 1.10 * (1.0 + max(0.0, uPulse * 0.8));
          if (rr > maxR) p *= maxR / rr;

          float w = exp(-pow((length(p) - (uWave - 1.0) * 0.35) * 5.0, 2.0)) * uWaveAmp * step(uWave, 4.0);
          p *= uScale;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          float tw = 0.6 + 0.4 * sin(uTime * (1.0 + aRand.w * 2.0) + aRand.x * 30.0);
          vAlpha = tw * (0.45 + 0.55 * (1.0 - r * 0.55)) + w;
          gl_PointSize = (1.1 + aRand.z * 1.7 + w * 2.0) * uPx * (9.0 / -mv.z);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          vec2 d = gl_PointCoord - 0.5;
          float m = smoothstep(0.5, 0.0, length(d));
          float core = smoothstep(0.2, 0.0, length(d));
          gl_FragColor = vec4(uColor * (0.7 + core * 0.9), m * m * vAlpha * 0.9);
        }
      `,
    });
    const innerCloud = new THREE.Points(iGeo, iMat);
    innerCloud.frustumCulled = false;
    scene.add(innerCloud);
    disposables.push(iGeo, iMat);

    // 5. 4 Segmented 3D Gyroscopic Gimbal Rings
    const gimbalGroup = new THREE.Group();
    scene.add(gimbalGroup);
    const gyroMats: THREE.MeshBasicMaterial[] = [];

    const createGyroRing = (
      radius: number,
      tube: number,
      segments: number,
      arcFraction: number,
      tiltX: number,
      tiltY: number,
      opacity: number
    ) => {
      const ringContainer = new THREE.Group();
      for (let i = 0; i < segments; i++) {
        const arcLen = ((Math.PI * 2) / segments) * arcFraction;
        const geo = new THREE.TorusGeometry(radius, tube, 8, 64, arcLen);
        const mat = new THREE.MeshBasicMaterial({
          color: 0x00f0ff,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.z = i * ((Math.PI * 2) / segments);
        ringContainer.add(mesh);
        gyroMats.push(mat);
        disposables.push(geo, mat);
      }
      ringContainer.rotation.x = tiltX;
      ringContainer.rotation.y = tiltY;
      gimbalGroup.add(ringContainer);
      return ringContainer;
    };

    const ring1 = createGyroRing(1.72, 0.0045, 3, 0.55, 0.42, 0.22, 0.18);
    const ring2 = createGyroRing(2.08, 0.004, 4, 0.45, -0.68, 0.48, 0.14);
    const ring3 = createGyroRing(2.42, 0.0045, 2, 0.6, 1.08, -0.28, 0.15);
    const ring4 = createGyroRing(2.76, 0.003, 6, 0.3, -0.18, 0.88, 0.1);

    // 6. Phase 4D.3 Orbiting Worker Satellites Group
    const satelliteGroup = new THREE.Group();
    scene.add(satelliteGroup);

    interface SatMeshEntry {
      mesh: THREE.Mesh;
      coreMat: THREE.MeshBasicMaterial;
      haloMesh: THREE.Mesh;
      haloMat: THREE.MeshBasicMaterial;
      orbitRadius: number;
      orbitAngle: number;
      inclination: number;
    }

    const satMap = new Map<string, SatMeshEntry>();

    const syncSatellites = (specs: WorkerSatelliteSpec[], dt: number) => {
      const activeIds = new Set(specs.map((s) => s.stepId));
      // Prune removed satellites
      satMap.forEach((entry, key) => {
        if (!activeIds.has(key)) {
          satelliteGroup.remove(entry.mesh);
          entry.mesh.geometry.dispose();
          entry.coreMat.dispose();
          entry.haloMesh.geometry.dispose();
          entry.haloMat.dispose();
          satMap.delete(key);
        }
      });

      specs.forEach((spec, idx) => {
        let entry = satMap.get(spec.stepId);
        if (!entry) {
          const sGeo = new THREE.SphereGeometry(0.068, 14, 14);
          const coreMat = new THREE.MeshBasicMaterial({
            color: SATELLITE_COLORS[spec.lifecycleState],
          });
          const mesh = new THREE.Mesh(sGeo, coreMat);

          const hGeo = new THREE.RingGeometry(0.09, 0.125, 20);
          const haloMat = new THREE.MeshBasicMaterial({
            color: EVIDENCE_COLORS[spec.evidenceStatus],
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.82,
          });
          const haloMesh = new THREE.Mesh(hGeo, haloMat);
          mesh.add(haloMesh);
          satelliteGroup.add(mesh);

          entry = {
            mesh,
            coreMat,
            haloMesh,
            haloMat,
            orbitRadius: 2.38 + idx * 0.24,
            orbitAngle: idx * 1.9,
            inclination: (idx - 1.5) * 0.32,
          };
          satMap.set(spec.stepId, entry);
        }

        entry.coreMat.color.setHex(SATELLITE_COLORS[spec.lifecycleState]);
        entry.haloMat.color.setHex(EVIDENCE_COLORS[spec.evidenceStatus]);

        const speed =
          spec.lifecycleState === "RUNNING"
            ? 1.15
            : spec.lifecycleState === "COMPLETED"
            ? 0.38
            : 0.2;
        entry.orbitAngle += dt * speed;
        const x = Math.cos(entry.orbitAngle) * entry.orbitRadius;
        const z = Math.sin(entry.orbitAngle) * entry.orbitRadius;
        const y =
          Math.sin(entry.orbitAngle + entry.inclination) *
          (entry.orbitRadius * 0.38);
        entry.mesh.position.set(x, y, z);
        entry.haloMesh.rotation.z += dt * 1.6;
        entry.haloMesh.lookAt(camera.position);

        if (spec.lifecycleState === "RUNNING") {
          const pulse = 1.0 + Math.sin(performance.now() * 0.008) * 0.24;
          entry.mesh.scale.setScalar(pulse);
        } else {
          entry.mesh.scale.setScalar(1.0);
        }
      });
    };

    let lastTime = performance.now();
    let elapsed = 0;
    let curScale = 1.0;
    let curPulse = 0.0;
    let smoothBass = 0;
    let smoothMid = 0;
    let smoothHigh = 0;
    let lastWaveTrigger = waveTriggerRef.current;
    let lastBargeTrigger = bargeTriggerRef.current;

    const targetPri = new THREE.Color(initCfg.pri);
    const targetSec = new THREE.Color(initCfg.sec);

    const onResize = () => {
      if (disposed || !container) return;
      const w = container.clientWidth || 340;
      const h = container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      pU.uPx.value = (dpr * h) / 900;
    };
    window.addEventListener("resize", onResize);

    const onVisibility = () => {
      if (!document.hidden) lastTime = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);

    let isVisible = true;
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

    const animate = () => {
      if (disposed) return;
      animId = requestAnimationFrame(animate);

      if (!isVisible || document.hidden) return;

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      elapsed += dt;
      const activeKey = stateRef.current;
      const cfg = ORB_STATE_CONFIGS[activeKey];

      // State transition shockwave
      if (waveTriggerRef.current !== lastWaveTrigger) {
        lastWaveTrigger = waveTriggerRef.current;
        curPulse -= 0.1;
        pU.uWave.value = 1.25;
        pU.uWaveAmp.value = 0.95;
        canvas.setAttribute(
          "aria-label",
          `ELEVEN v3 Authoritative Holographic Visualizer - State: ${cfg.badgeText}`
        );
      }

      // Barge-In waveOutReset <50ms contraction shock
      if (bargeTriggerRef.current !== lastBargeTrigger) {
        lastBargeTrigger = bargeTriggerRef.current;
        curScale = 0.62;
        curPulse = -0.28;
        uniforms.uNoiseAmp.value = 0.52;
        pU.uWave.value = 1.1;
        pU.uWaveAmp.value = 1.25;
      }

      targetPri.setHex(cfg.pri);
      targetSec.setHex(cfg.sec);

      // Living Cardiac / Respiration Rhythm (Systole + Diastole)
      const cycle = (elapsed * 0.85) % 1.0;
      const systole = Math.exp(-Math.pow((cycle - 0.14) / 0.055, 2.0));
      const diastole = 0.55 * Math.exp(-Math.pow((cycle - 0.31) / 0.07, 2.0));
      const heartbeatWave =
        (systole + diastole - 0.22) * 0.22 + Math.sin(elapsed * 1.4) * 0.05;
      uniforms.uBreath.value = heartbeatWave;

      let rawBass = 0;
      let rawMid = 0;
      let rawHigh = 0;
      let targetPulse = cfg.basePulse + heartbeatWave * 0.22;

      if (activeKey === "SPEAKING") {
        // Simulated natural multi-syllable speech cadence
        const syl1 = Math.max(0, Math.sin(elapsed * 7.4));
        const syl2 = Math.max(0, Math.sin(elapsed * 11.8 + 1.1));
        const env = 0.45 + 0.55 * Math.sin(elapsed * 1.9);
        const energy = (syl1 * 0.6 + syl2 * 0.4) * Math.max(0.2, env);
        rawBass = energy * 0.52;
        rawMid = energy * 0.68;
        rawHigh = energy * 0.44;
        targetPulse = -0.08 + energy * 0.34;
      } else if (activeKey === "LISTENING") {
        const listenWave = Math.sin(elapsed * 3.2) * 0.5 + 0.5;
        rawBass = listenWave * 0.16;
        rawMid = listenWave * 0.22;
        rawHigh = listenWave * 0.16;
        targetPulse = -0.13 + listenWave * 0.17;
      } else if (activeKey === "THINKING" || activeKey === "EXECUTING") {
        const thinkWave = Math.sin(elapsed * 6.2);
        rawMid = 0.18 + 0.1 * thinkWave;
        targetPulse = -0.06 + thinkWave * 0.09;
      }

      smoothBass += (rawBass - smoothBass) * 0.15;
      smoothMid += (rawMid - smoothMid) * 0.15;
      smoothHigh += (rawHigh - smoothHigh) * 0.16;
      curPulse += (targetPulse - curPulse) * 0.14;
      const audioTotal =
        smoothBass * 0.45 + smoothMid * 0.4 + smoothHigh * 0.15;

      uniforms.uTime.value += dt * (cfg.speed + audioTotal * 0.85);
      uniforms.uNoiseAmp.value +=
        (cfg.amp + smoothMid * 0.42 - uniforms.uNoiseAmp.value) * 0.08;
      uniforms.uNoiseFreq.value +=
        (cfg.freq + smoothHigh * 0.8 - uniforms.uNoiseFreq.value) * 0.06;
      uniforms.uColorPrimary.value.lerp(targetPri, 0.06);
      uniforms.uColorSecondary.value.lerp(targetSec, 0.06);

      wireMat.color.copy(uniforms.uColorPrimary.value);
      bloomPass.strength +=
        (cfg.bloom + audioTotal * 0.22 - bloomPass.strength) * 0.06;

      const targetCoreScale =
        cfg.scale * (1.0 + curPulse * 0.55 + smoothBass * 0.16);
      curScale += (targetCoreScale - curScale) * 0.11;
      plasmaCore.scale.setScalar(curScale);
      wireShell.scale.setScalar(curScale * 1.035);
      filaments.scale.setScalar(curScale);

      filAmp.value +=
        (cfg.amp * 0.5 + smoothMid * 0.35 - filAmp.value) * 0.06;
      for (const d of filDefs) {
        const k = dt * (0.4 + cfg.speed);
        d.line.rotation.x += d.sx * k;
        d.line.rotation.y += d.sy * k;
        d.line.rotation.z += d.sz * k;
      }
      wireShell.rotation.y += dt * 0.18 * cfg.speed;
      wireShell.rotation.x -= dt * 0.11 * cfg.speed;

      pU.uBass.value = smoothBass;
      pU.uMid.value = smoothMid;
      pU.uHigh.value = smoothHigh;
      pU.uPulse.value = curPulse;
      pU.uScale.value = 0.94 + curScale * 0.06;
      if (pU.uWaveAmp.value > 0.001) {
        pU.uWave.value += dt * 3.8;
        pU.uWaveAmp.value *= Math.pow(0.18, dt);
      }

      particleCloud.rotation.z = Math.sin(elapsed * 0.25) * 0.05;
      particleCloud.rotation.x = Math.cos(elapsed * 0.18) * 0.04;
      innerCloud.rotation.y += dt * 0.05;

      const rSpeed = dt * cfg.speed * 0.55;
      ring1.rotation.z += rSpeed * 0.42;
      ring1.rotation.x += rSpeed * 0.12;
      ring2.rotation.z -= rSpeed * 0.28;
      ring2.rotation.y += rSpeed * 0.18;
      ring3.rotation.z += rSpeed * 0.22;
      ring4.rotation.z -= rSpeed * 0.14;

      const gimbalPulse = 1.0 + curPulse * 0.35 + smoothMid * 0.06;
      gimbalGroup.scale.setScalar(gimbalPulse);
      gyroMats.forEach((m) => m.color.copy(uniforms.uColorPrimary.value));

      syncSatellites(satellitesRef.current, dt);

      controls.update();
      composer.render();
    };

    setLoaded(true);
    animId = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      if (io) io.disconnect();
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);

      satMap.forEach((entry) => {
        entry.mesh.geometry.dispose();
        entry.coreMat.dispose();
        entry.haloMesh.geometry.dispose();
        entry.haloMat.dispose();
      });
      satMap.clear();

      disposables.forEach((d) => d.dispose());
      controls.dispose();
      composer.dispose();
      renderer.dispose();
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, [webglOk]);

  const cfg = ORB_STATE_CONFIGS[state];

  return (
    <div className="relative flex h-[430px] w-full flex-col items-center justify-center sm:h-[520px]">
      {/* Loading indicator per 3d-web-experience HIGH validation check */}
      {!loaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded border border-el-border bg-el-bg/85 backdrop-blur-md">
          <span className="h-6 w-6 rounded-full border-2 border-el-border-strong border-t-el-accent animate-spin" />
          <span className="font-mono text-xs tracking-[0.14em] text-el-accent">
            COMPILING GLSL SIMPLEX &amp; VOLUMETRIC SHADERS...
          </span>
        </div>
      )}

      {/* WebGL Fallback per 3d-web-experience MEDIUM validation check */}
      {!webglOk ? (
        <div className="flex h-full w-full flex-col items-center justify-center rounded border border-el-border bg-el-bg-raised p-8 text-center">
          <div
            className="h-36 w-36 rounded-full border-2 animate-pulse"
            style={{
              borderColor: cfg.hex,
              boxShadow: `0 0 40px ${cfg.hex}33`,
            }}
          />
          <p className="mt-6 font-mono text-xs tracking-[0.14em] text-el-fg">
            {cfg.badgeText}
          </p>
          <p className="mt-1 font-mono text-[11px] text-el-fg-muted">
            WebGL hardware acceleration unavailable — static telemetry active
          </p>
        </div>
      ) : (
        <div
          ref={containerRef}
          onClick={() => {
            waveTriggerRef.current += 1;
          }}
          title="Drag to orbit 360° · Click to send a harmonic pulse"
          className="h-full w-full cursor-grab active:cursor-grabbing"
        />
      )}

      {/* Top-Right Authoritative State Pill */}
      <div
        className="pointer-events-none absolute top-3 right-3 flex items-center gap-2 rounded border bg-[#080a0f]/85 px-3 py-1.5 font-mono text-[10.5px] tracking-[0.12em] backdrop-blur-md transition-colors duration-300"
        style={{
          color: cfg.hex,
          borderColor: `${cfg.hex}66`,
          boxShadow: `0 0 16px ${cfg.hex}24`,
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: cfg.hex }}
        />
        <span>{cfg.badgeText}</span>
      </div>

      {/* Bottom Telemetry Caption */}
      <div className="pointer-events-none absolute bottom-2 left-3 right-3 flex items-center justify-between font-mono text-[9.5px] tracking-[0.1em] text-el-fg-faint">
        <span>GLSL SIMPLEX · 54K VOLUMETRIC GPU PARTICLES · 4 GYROS</span>
        <span className="hidden sm:inline">DRAG TO ORBIT 360°</span>
      </div>
    </div>
  );
}
