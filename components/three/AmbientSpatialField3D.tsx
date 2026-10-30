"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Minimalist Premium 3D Spatial Background Field (3d-web-experience + premium-3d-website)
 * - Sparse 3D quantum lattice nodes with GLSL depth-of-field bokeh, 3D cursor magnetic parting,
 *   and passive click shockwave ripple (`<= 0.30` alpha)
 * - Custom GLSL traveling photon-arc orbital horizon rings in 3D perspective
 * - Ultra-minimal GLSL topological wave horizon (`<= 0.052` alpha) responding to scroll progression
 * - Multi-act scroll-driven 3D camera choreography, WebGL context-loss recovery,
 *   mobile DPR=1 clamp, automatic tab-visibility pause, and zero heap allocations per frame.
 */
export function AmbientSpatialField3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
        depth: false,
        stencil: false,
      });
    } catch {
      return;
    }

    const isMobile =
      window.innerWidth < 768 ||
      /iPhone|iPad|Android/i.test(navigator.userAgent);
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const canvas = renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / Math.max(window.innerHeight, 1),
      0.1,
      55
    );
    camera.position.set(0, 0, 8.5);

    const disposables: { dispose: () => void }[] = [];
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Shared GPU uniforms across shaders (zero JS vertex updates per frame)
    const sharedUniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uShockwave: { value: 0 },
    };

    // Deterministic PRNG so spatial composition is balanced & repeatable
    let seed = 11031;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    // -------------------------------------------------------------------------
    // 1. Sparse 3D Quantum Nodes with Cursor Magnetic Field & Bokeh Depth Shader
    // -------------------------------------------------------------------------
    const NODE_COUNT = isMobile ? 58 : 112;
    const positions = new Float32Array(NODE_COUNT * 3);
    const colors = new Float32Array(NODE_COUNT * 3);
    const phases = new Float32Array(NODE_COUNT);
    const sizes = new Float32Array(NODE_COUNT);

    const palette = [
      new THREE.Color(0x00f0ff), // Hologram Cyan
      new THREE.Color(0x94a3b8), // Titanium Starlight
      new THREE.Color(0x8b5cf6), // Singularity Violet
      new THREE.Color(0x00ff9d), // Signal Mint
    ];

    const rawPts: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const x = (rand() - 0.5) * 22;
      const y = (rand() - 0.5) * 16;
      const z = (rand() - 0.5) * 11 - 2.5;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      rawPts.push(new THREE.Vector3(x, y, z));

      const rPick = rand();
      const c =
        palette[rPick < 0.44 ? 1 : rPick < 0.68 ? 0 : rPick < 0.86 ? 2 : 3];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      phases[i] = rand() * Math.PI * 2;
      sizes[i] = (1.5 + rand() * 2.2) * dpr;
    }

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    pointsGeo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    pointsGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    disposables.push(pointsGeo);

    const pointsMat = new THREE.ShaderMaterial({
      uniforms: sharedUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute float aPhase;
        attribute float aSize;
        attribute vec3 color;
        uniform float uTime;
        uniform float uScroll;
        uniform vec2 uPointer;
        uniform float uShockwave;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec3 pos = position;
          pos.y += sin(uTime * 0.32 + aPhase) * 0.20;
          pos.x += cos(uTime * 0.24 + aPhase * 1.3) * 0.15;

          // Subtle 3D cursor magnetic parting + click gravity ripple
          vec2 ptrWorld = vec2(uPointer.x * 7.5, -uPointer.y * 5.2 - uScroll * 2.1);
          vec2 delta = pos.xy - ptrWorld;
          float d = length(delta) + 0.001;
          float influence = smoothstep(3.8, 0.0, d);
          pos.xy += (delta / d) * influence * (0.38 + uShockwave * 0.85);
          pos.z += influence * (0.28 + uShockwave * 0.55);

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          float dist = max(-mvPosition.z, 1.5);
          gl_PointSize = clamp(aSize * (8.8 / dist) * (1.0 + influence * 0.35), 1.5, 10.0);

          float pulse = 0.62 + 0.38 * sin(uTime * 0.88 + aPhase);
          float depthFade = smoothstep(16.5, 3.2, dist);
          vColor = mix(color, vec3(0.0, 0.94, 1.0), influence * 0.45);
          vAlpha = (0.28 + influence * 0.16) * pulse * depthFade;

          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float r2 = dot(uv, uv);
          if (r2 > 0.25) discard;
          float core = exp(-r2 * 22.0);
          float halo = exp(-r2 * 8.5) * 0.45;
          gl_FragColor = vec4(vColor, vAlpha * (core + halo));
        }
      `,
    });
    disposables.push(pointsMat);

    const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
    rootGroup.add(pointsMesh);

    // -------------------------------------------------------------------------
    // 2. Sparse Architectural Constellation Filaments
    // -------------------------------------------------------------------------
    const lineVerts: number[] = [];
    const maxDistSq = isMobile ? 9.5 : 11.5;
    let edgeCount = 0;
    const maxEdges = isMobile ? 34 : 76;

    for (let i = 0; i < NODE_COUNT && edgeCount < maxEdges; i++) {
      let connectionsForNode = 0;
      for (let j = i + 1; j < NODE_COUNT && connectionsForNode < 2; j++) {
        const dSq = rawPts[i].distanceToSquared(rawPts[j]);
        if (dSq < maxDistSq) {
          lineVerts.push(
            rawPts[i].x,
            rawPts[i].y,
            rawPts[i].z,
            rawPts[j].x,
            rawPts[j].y,
            rawPts[j].z
          );
          connectionsForNode++;
          edgeCount++;
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(lineVerts, 3)
    );
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.042,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(lineGeo, lineMat);
    const constellationLines = new THREE.LineSegments(lineGeo, lineMat);
    rootGroup.add(constellationLines);

    // -------------------------------------------------------------------------
    // 3. Custom GLSL Traveling Photon-Arc Orbital Horizon Rings
    // -------------------------------------------------------------------------
    const createPhotonOrbit = (
      radius: number,
      segments: number,
      hex: number,
      baseAlpha: number,
      speedDir: number
    ) => {
      const pts = new Float32Array((segments + 1) * 3);
      const arcs = new Float32Array(segments + 1);
      for (let i = 0; i <= segments; i++) {
        const frac = i / segments;
        const theta = frac * Math.PI * 2;
        pts[i * 3] = Math.cos(theta) * radius;
        pts[i * 3 + 1] = Math.sin(theta) * radius;
        pts[i * 3 + 2] = 0;
        arcs[i] = frac;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
      geo.setAttribute("aArc", new THREE.BufferAttribute(arcs, 1));

      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: sharedUniforms.uTime,
          uColor: { value: new THREE.Color(hex) },
          uBaseAlpha: { value: baseAlpha },
          uSpeed: { value: speedDir },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          attribute float aArc;
          varying float vArc;
          void main() {
            vArc = aArc;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uBaseAlpha;
          uniform float uSpeed;
          varying float vArc;
          void main() {
            float head = fract(uTime * uSpeed);
            float dist = abs(vArc - head);
            dist = min(dist, 1.0 - dist);
            float packet = exp(-dist * 26.0) * 0.14;
            gl_FragColor = vec4(uColor, uBaseAlpha + packet);
          }
        `,
      });
      disposables.push(geo, mat);
      return new THREE.Line(geo, mat);
    };

    const outerOrbit = createPhotonOrbit(7.4, 112, 0x00f0ff, 0.036, 0.085);
    outerOrbit.rotation.set(1.12, 0.24, 0.15);
    outerOrbit.position.set(0, -0.4, -3.5);
    scene.add(outerOrbit);

    const innerOrbit = createPhotonOrbit(5.1, 96, 0x8b5cf6, 0.032, -0.11);
    innerOrbit.rotation.set(-0.95, -0.32, 0.4);
    innerOrbit.position.set(0, 0.3, -4.2);
    scene.add(innerOrbit);

    // Distant Geodesic Polyhedron
    const icoGeo = new THREE.IcosahedronGeometry(3.35, 1);
    const icoEdges = new THREE.EdgesGeometry(icoGeo);
    const icoMat = new THREE.LineBasicMaterial({
      color: 0x00ff9d,
      transparent: true,
      opacity: 0.026,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(icoGeo, icoEdges, icoMat);
    const geodesicCore = new THREE.LineSegments(icoEdges, icoMat);
    geodesicCore.position.set(0, 0, -5.5);
    scene.add(geodesicCore);

    // -------------------------------------------------------------------------
    // 4. Minimalist GLSL Topological Horizon Wave Plane (Lower Depth Floor)
    // -------------------------------------------------------------------------
    const waveSegX = isMobile ? 28 : 48;
    const waveSegY = isMobile ? 12 : 18;
    const waveGeo = new THREE.PlaneGeometry(26, 11, waveSegX, waveSegY);
    const waveMat = new THREE.ShaderMaterial({
      uniforms: sharedUniforms,
      wireframe: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uScroll;
        varying vec2 vUv;
        varying float vElev;

        void main() {
          vUv = uv;
          vec3 pos = position;
          float waveA = sin(pos.x * 0.42 + uTime * 0.48 + uScroll * 3.14) * 0.34;
          float waveB = cos(pos.y * 0.65 - uTime * 0.36) * 0.22;
          pos.z += waveA + waveB;
          vElev = (waveA + waveB + 0.56) / 1.12;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uScroll;
        varying vec2 vUv;
        varying float vElev;

        void main() {
          // Soft radial horizon mask so edges dissolve invisibly
          vec2 centered = (vUv - vec2(0.5)) * vec2(2.0, 2.0);
          float vignette = 1.0 - smoothstep(0.25, 0.98, length(centered));

          vec3 cyan = vec3(0.0, 0.94, 1.0);
          vec3 violet = vec3(0.545, 0.36, 0.965);
          vec3 mint = vec3(0.0, 1.0, 0.616);

          vec3 scrollTint = mix(cyan, violet, smoothstep(0.15, 0.65, uScroll));
          scrollTint = mix(scrollTint, mint, smoothstep(0.65, 1.0, uScroll) * 0.65);
          vec3 col = mix(scrollTint, vec3(1.0), vElev * 0.22);

          gl_FragColor = vec4(col, vignette * (0.022 + vElev * 0.028));
        }
      `,
    });
    disposables.push(waveGeo, waveMat);

    const horizonWave = new THREE.Mesh(waveGeo, waveMat);
    horizonWave.rotation.x = -1.24;
    horizonWave.position.set(0, -4.4, -5.8);
    scene.add(horizonWave);

    // -------------------------------------------------------------------------
    // 5. Passive Scroll, Pointer & Click Shockwave Listeners (Zero Layout Reads)
    // -------------------------------------------------------------------------
    let maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
    let targetScroll = window.scrollY / maxScroll;
    let smoothScroll = targetScroll;

    let targetPtrX = 0;
    let targetPtrY = 0;
    let smoothPtrX = 0;
    let smoothPtrY = 0;
    let shockwave = 0;

    const onScroll = () => {
      targetScroll = Math.min(
        1,
        Math.max(0, window.scrollY / Math.max(maxScroll, 1))
      );
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isMobile) return;
      targetPtrX = (e.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      targetPtrY = (e.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
    };

    const onPointerDown = () => {
      shockwave = 1.0;
    };

    const onResize = () => {
      const w = window.innerWidth;
      const h = Math.max(window.innerHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      maxScroll = Math.max(document.documentElement.scrollHeight - h, 1);
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    if (!isMobile) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    // -------------------------------------------------------------------------
    // 6. Low-Overhead Render Loop + Visibility & WebGL Context-Loss Recovery
    // -------------------------------------------------------------------------
    let animId = 0;
    let disposed = false;
    let contextLost = false;
    let lastTime = performance.now();

    const renderFrame = (now: number) => {
      if (disposed || contextLost) return;
      const dt = Math.min((now - lastTime) * 0.001, 0.05);
      lastTime = now;

      sharedUniforms.uTime.value += dt;

      smoothScroll += (targetScroll - smoothScroll) * 0.045;
      smoothPtrX += (targetPtrX - smoothPtrX) * 0.04;
      smoothPtrY += (targetPtrY - smoothPtrY) * 0.04;
      shockwave *= 0.93;

      sharedUniforms.uScroll.value = smoothScroll;
      sharedUniforms.uPointer.value.set(smoothPtrX, smoothPtrY);
      sharedUniforms.uShockwave.value = shockwave;

      // Multi-act scroll-driven 3D camera choreography
      camera.position.y = -smoothScroll * 2.15 - smoothPtrY * 0.28;
      camera.position.x =
        smoothPtrX * 0.36 + Math.sin(smoothScroll * Math.PI) * 0.28;
      camera.position.z = 8.5 - smoothScroll * 1.45;
      camera.rotation.z = smoothPtrX * -0.012;

      rootGroup.rotation.y =
        sharedUniforms.uTime.value * 0.018 +
        smoothScroll * 0.42 +
        smoothPtrX * 0.08;
      rootGroup.rotation.x = smoothScroll * 0.22 - smoothPtrY * 0.06;

      outerOrbit.rotation.z += dt * 0.032;
      outerOrbit.rotation.x = 1.12 + smoothScroll * 0.3;

      innerOrbit.rotation.z -= dt * 0.026;
      innerOrbit.rotation.y = -0.32 + smoothScroll * 0.36;

      geodesicCore.rotation.y += dt * 0.032;
      geodesicCore.rotation.x =
        smoothScroll * 0.68 + sharedUniforms.uTime.value * 0.014;

      horizonWave.position.y = -4.4 - smoothScroll * 1.45;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(renderFrame);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = 0;
        }
      } else if (!animId && !disposed && !contextLost) {
        lastTime = performance.now();
        animId = requestAnimationFrame(renderFrame);
      }
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      if (animId) {
        cancelAnimationFrame(animId);
        animId = 0;
      }
    };

    const onContextRestored = () => {
      contextLost = false;
      if (!document.hidden && !disposed) {
        lastTime = performance.now();
        animId = requestAnimationFrame(renderFrame);
      }
    };

    canvas.addEventListener("webglcontextlost", onContextLost, false);
    canvas.addEventListener("webglcontextrestored", onContextRestored, false);
    document.addEventListener("visibilitychange", onVisibilityChange);
    animId = requestAnimationFrame(renderFrame);

    return () => {
      disposed = true;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);

      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden [mask-image:radial-gradient(ellipse_90%_85%_at_50%_45%,#000_30%,transparent_100%)]"
    />
  );
}
