"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * EnterAmbientBackdrop — Full-viewport GenesisFX ambient WebGL depth horizon +
 * 4 vertical frosted columns (.hero-bar) for /enter, matching `/` stage atmosphere
 * without competing visually with the interactive center 3D Holographic Orb.
 */
export function EnterAmbientBackdrop({
  accentHex = "#10BC83",
  energy = 0.35,
}: {
  accentHex?: string;
  energy?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetColorRef = useRef<THREE.Color>(new THREE.Color(accentHex));
  const energyRef = useRef<number>(energy);

  useEffect(() => {
    targetColorRef.current.set(accentHex);
  }, [accentHex]);

  useEffect(() => {
    energyRef.current = energy;
  }, [energy]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let renderer: THREE.WebGLRenderer | null = null;
    let animId: number | null = null;
    let disposed = false;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        powerPreference: "high-performance",
        antialias: false,
        alpha: true,
      });
      const isMobile = (window.innerWidth || 1280) < 768;
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;

      const width = window.innerWidth || 1280;
      const height = window.innerHeight || 800;
      renderer.setSize(width, height, false);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(0, 0.3, 6.4);

      if (!prefersReduced) {
        canvas.classList.add("is-entering");
        const removeEntering = () => canvas.classList.remove("is-entering");
        canvas.addEventListener("animationend", removeEntering, { once: true });
      }

      // 1. Wide-field drifting volumetric dust / star horizon
      const starCount = isMobile ? 750 : 1800;
      const starGeo = new THREE.BufferGeometry();
      const starPos = new Float32Array(starCount * 3);
      const starRand = new Float32Array(starCount * 3);

      for (let i = 0; i < starCount; i++) {
        starPos[i * 3] = (Math.random() - 0.5) * 16;
        starPos[i * 3 + 1] = (Math.random() - 0.5) * 9.5;
        starPos[i * 3 + 2] = -0.8 - Math.random() * 6.5;

        starRand[i * 3] = Math.random();
        starRand[i * 3 + 1] = Math.random();
        starRand[i * 3 + 2] = Math.random();
      }

      starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
      starGeo.setAttribute("aRand", new THREE.BufferAttribute(starRand, 3));

      const uniforms = {
        uTime: { value: 0 },
        uColor: { value: targetColorRef.current.clone() },
        uEnergy: { value: energyRef.current },
        uPx: { value: dpr * (height / 900) },
      };

      const starMat = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexShader: `
          attribute vec3 aRand;
          uniform float uTime;
          uniform float uEnergy;
          uniform float uPx;
          varying float vAlpha;
          varying float vMix;
          void main() {
            vec3 p = position;
            p.y += sin(uTime * (0.25 + aRand.x * 0.35) + aRand.y * 12.0) * 0.18;
            p.x += cos(uTime * (0.18 + aRand.z * 0.25) + aRand.x * 9.0) * 0.16;

            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;

            float depth = clamp((-mv.z - 1.5) / 7.5, 0.0, 1.0);
            float tw = 0.5 + 0.5 * sin(uTime * (0.9 + aRand.y * 1.8) + aRand.z * 24.0);
            vAlpha = (1.0 - depth * 0.55) * tw * (0.24 + uEnergy * 0.22);
            vMix = aRand.x;
            gl_PointSize = (1.1 + aRand.z * 1.8) * uPx * (6.0 / max(1.2, -mv.z));
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          varying float vAlpha;
          varying float vMix;
          void main() {
            vec2 d = gl_PointCoord - 0.5;
            float dist = length(d);
            if (dist > 0.5) discard;
            float m = smoothstep(0.5, 0.0, dist);
            vec3 c = mix(vec3(0.06, 0.45, 0.34), uColor, 0.45 + 0.55 * vMix);
            gl_FragColor = vec4(c, m * m * vAlpha);
          }
        `,
      });

      const stars = new THREE.Points(starGeo, starMat);
      scene.add(stars);

      // 2. GenesisFX Undulating Water Caustic Horizon Plane
      const waterGeo = new THREE.PlaneGeometry(20, 12, 64, 64);
      const waterMat = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexShader: `
          uniform float uTime;
          uniform float uEnergy;
          varying vec2 vUv;
          varying float vWave;
          void main() {
            vUv = uv;
            vec3 p = position;
            float amp = 0.045 + uEnergy * 0.035;
            float w1 = sin(p.x * 2.2 + uTime * 1.1) * cos(p.y * 2.4 - uTime * 0.85) * amp;
            float w2 = sin(p.x * 4.5 - uTime * 1.6) * (amp * 0.42);
            p.z += w1 + w2;
            vWave = w1 + w2;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uEnergy;
          varying vec2 vUv;
          varying float vWave;
          void main() {
            vec2 c = vUv - vec2(0.5, 0.54);
            float dist = length(c * vec2(0.85, 1.5));
            float radial = smoothstep(0.52, 0.0, dist);
            float caustic = 0.5 + 0.5 * sin(dist * 46.0 - vWave * 32.0);
            vec3 waterCol = mix(vec3(0.015, 0.14, 0.10), uColor, caustic * 0.72);
            float alpha = radial * radial * (0.09 + 0.14 * caustic + uEnergy * 0.05);
            gl_FragColor = vec4(waterCol, alpha);
          }
        `,
      });

      const waterMesh = new THREE.Mesh(waterGeo, waterMat);
      waterMesh.rotation.x = -Math.PI / 2;
      waterMesh.position.set(0, -1.78, -0.8);
      scene.add(waterMesh);

      let targetX = 0;
      let targetY = 0;
      const onPointerMove = (e: PointerEvent) => {
        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;
        targetX = ((e.clientX / w) * 2 - 1) * 0.28;
        targetY = (-(e.clientY / h) * 2 + 1) * 0.16;
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });

      const onResize = () => {
        if (disposed || !renderer) return;
        const w = window.innerWidth || 1280;
        const h = window.innerHeight || 800;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        uniforms.uPx.value = dpr * (h / 900);
      };
      window.addEventListener("resize", onResize);

      let lastT = performance.now();
      const tick = () => {
        if (disposed || !renderer) return;
        animId = requestAnimationFrame(tick);
        if (document.hidden) return;

        const now = performance.now();
        const dt = Math.min((now - lastT) / 1000, 0.05);
        lastT = now;

        if (!prefersReduced) {
          uniforms.uTime.value += dt;
        }
        uniforms.uColor.value.lerp(targetColorRef.current, 0.05);
        uniforms.uEnergy.value += (energyRef.current - uniforms.uEnergy.value) * 0.06;

        stars.position.x += (targetX - stars.position.x) * 0.05;
        stars.position.y += (targetY - stars.position.y) * 0.05;

        renderer.render(scene, camera);
      };
      animId = requestAnimationFrame(tick);

      return () => {
        disposed = true;
        if (animId) cancelAnimationFrame(animId);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("resize", onResize);
        starGeo.dispose();
        starMat.dispose();
        waterGeo.dispose();
        waterMat.dispose();
        renderer?.dispose();
      };
    } catch {
      return undefined;
    }
  }, []);

  return (
    <div className="globe-stage enter-ambient-stage" aria-hidden="true">
      <canvas ref={canvasRef} id="globe-canvas" />
      <span className="hero-bar hero-bar--outer" />
      <span className="hero-bar hero-bar--inner" />
      <span className="hero-bar hero-bar--inner" />
      <span className="hero-bar hero-bar--outer" />
    </div>
  );
}
