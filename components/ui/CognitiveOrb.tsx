"use client";

import { useEffect, useRef, useState } from "react";

export function CognitiveOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [interactiveState, setInteractiveState] = useState({
    activity: "COGNITIVE SYNCHRONIZATION",
    frequency: "84.2 GHz",
    status: "RESONATING",
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Mouse interaction tracking
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;
    let isHovering = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
      isHovering = true;
    };

    const handleMouseLeave = () => {
      targetMouseX = width / 2;
      targetMouseY = height / 2;
      isHovering = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Particle Sphere generation
    const PARTICLE_COUNT = 1400;
    const particles: {
      phi: number;
      theta: number;
      radius: number;
      baseRadius: number;
      size: number;
      speed: number;
      colorGroup: number; // 0 = cyan, 1 = electric blue, 2 = violet
    }[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Golden Spiral distribution on sphere
      const phi = Math.acos(1 - (2 * (i + 0.5)) / PARTICLE_COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const baseRadius = 140;

      particles.push({
        phi,
        theta,
        radius: baseRadius,
        baseRadius,
        size: Math.random() * 1.6 + 0.8,
        speed: (Math.random() - 0.5) * 0.006,
        colorGroup: i % 3,
      });
    }

    // Horizon Wave Floor generation (for bottom grid reflection)
    const WAVE_POINTS_X = 35;
    const WAVE_POINTS_Y = 18;

    let time = 0;

    const render = () => {
      time += 0.016;

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const normMouseX = (mouseX - width / 2) / (width / 2);
      const normMouseY = (mouseY - height / 2) / (height / 2);

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2 - 20;

      // ── 1. AMBIENT GLOW BACKDROP ──
      const bgGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        30,
        centerX,
        centerY,
        220
      );
      bgGlow.addColorStop(0, "rgba(95, 208, 207, 0.12)"); // Cyan core
      bgGlow.addColorStop(0.5, "rgba(139, 127, 214, 0.08)"); // Violet mid
      bgGlow.addColorStop(1, "rgba(10, 13, 18, 0)");
      ctx.fillStyle = bgGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 220, 0, Math.PI * 2);
      ctx.fill();

      // ── 2. PARTICULATE REFLECTION FLOOR ──
      const floorY = centerY + 180;
      ctx.fillStyle = "rgba(95, 208, 207, 0.3)";
      for (let y = 0; y < WAVE_POINTS_Y; y++) {
        for (let x = 0; x < WAVE_POINTS_X; x++) {
          const fx = centerX + (x - WAVE_POINTS_X / 2) * 16;
          const fy =
            floorY +
            y * 6 +
            Math.sin(time * 2 + x * 0.3 + y * 0.5) * (3 + y * 0.4);
          const fAlpha = (1 - y / WAVE_POINTS_Y) * (0.35 - Math.abs(x - WAVE_POINTS_X / 2) / (WAVE_POINTS_X * 1.5));

          if (fAlpha > 0) {
            ctx.fillStyle =
              x % 2 === 0
                ? `rgba(95, 208, 207, ${Math.max(0, fAlpha * 0.8)})`
                : `rgba(139, 127, 214, ${Math.max(0, fAlpha * 0.6)})`;
            ctx.fillRect(fx, fy, 1.2, 1.2);
          }
        }
      }

      // ── 3. SPHERICAL POINT CLOUD WITH S-CURVE SINGULARITY ──
      const rotY = time * 0.4 + normMouseX * 0.8;
      const rotX = Math.sin(time * 0.2) * 0.15 + normMouseY * 0.4;

      // Project and sort particles by depth for true 3D
      const projected = particles.map((p) => {
        // Dynamic pulse wave through sphere
        const pulse = Math.sin(time * 2.5 + p.phi * 3) * 6;
        // React to mouse proximity
        const mouseReactive = isHovering ? Math.sin(p.theta * 4 + time * 3) * 8 : 0;
        const currentRadius = p.baseRadius + pulse + mouseReactive;

        // 3D coordinates on sphere
        const x3d = currentRadius * Math.sin(p.phi) * Math.cos(p.theta + p.speed * time * 50);
        const y3d = currentRadius * Math.sin(p.phi) * Math.sin(p.theta + p.speed * time * 50);
        const z3d = currentRadius * Math.cos(p.phi);

        // Rotation Matrix Y
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const xRotY = x3d * cosY - z3d * sinY;
        const zRotY = x3d * sinY + z3d * cosY;

        // Rotation Matrix X
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const yRotX = y3d * cosX - zRotY * sinX;
        const zRotX = y3d * sinX + zRotY * cosX;

        // Perspective projection
        const focalLength = 420;
        const scale = focalLength / (focalLength + zRotX);
        const projX = centerX + xRotY * scale;
        const projY = centerY + yRotX * scale;

        return {
          x: projX,
          y: projY,
          z: zRotX,
          scale,
          size: p.size * scale,
          colorGroup: p.colorGroup,
        };
      });

      // Sort back-to-front
      projected.sort((a, b) => b.z - a.z);

      // Render sphere particles
      for (let i = 0; i < projected.length; i++) {
        const pt = projected[i];
        const depthAlpha = Math.max(0.12, (pt.z + 180) / 360);

        if (pt.colorGroup === 0) {
          ctx.fillStyle = `rgba(95, 208, 207, ${depthAlpha * 0.9})`; // Cyan
        } else if (pt.colorGroup === 1) {
          ctx.fillStyle = `rgba(66, 153, 225, ${depthAlpha * 0.85})`; // Electric Blue
        } else {
          ctx.fillStyle = `rgba(167, 139, 250, ${depthAlpha * 0.75})`; // Neon Violet
        }

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── 4. THE SIGNATURE LUMINESCENT "S" SINGULARITY ──
      // Dynamic mathematical harmonic curve carving through the center
      ctx.save();
      ctx.shadowBlur = 18;
      ctx.shadowColor = "rgba(95, 208, 207, 0.9)";

      ctx.beginPath();
      const sPoints = 60;
      const sRadius = 115;

      for (let i = 0; i <= sPoints; i++) {
        const t = (i / sPoints) * Math.PI * 2;
        // Parametric double-harmonic S-swirl equation
        const sx3 = Math.sin(t) * sRadius * 0.75;
        const sy3 = Math.cos(t) * (sRadius * 1.05) + Math.sin(t * 2 + time * 1.5) * 12;
        const sz3 = Math.sin(t * 2 + time) * 35;

        // Apply same rotation matrix to S-singularity
        const cosY = Math.cos(rotY * 1.1);
        const sinY = Math.sin(rotY * 1.1);
        const xR = sx3 * cosY - sz3 * sinY;
        const zR = sx3 * sinY + sz3 * cosY;

        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const yR = sy3 * cosX - zR * sinX;
        const zFinal = sy3 * sinX + zR * cosX;

        const scale = 420 / (420 + zFinal);
        const px = centerX + xR * scale;
        const py = centerY + yR * scale;

        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }

      // Outer Glow Line
      ctx.strokeStyle = "rgba(95, 208, 207, 0.4)";
      ctx.lineWidth = 5;
      ctx.stroke();

      // Inner Sharp Electric Core
      ctx.strokeStyle = "rgba(237, 238, 233, 0.95)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // ── 5. EQUATORIAL ENERGY RING ──
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(
        centerX,
        centerY,
        148 + Math.sin(time * 3) * 2,
        42 + Math.cos(time * 2) * 2,
        rotX * 0.5,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = "rgba(95, 208, 207, 0.25)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 12]);
      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative flex h-[520px] w-full items-center justify-center overflow-hidden lg:h-[620px]">
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-crosshair"
      />
      {/* Floating System Status Pill Overlay */}
      <div className="pointer-events-none absolute bottom-4 left-6 flex items-center gap-3 rounded-full border border-el-border/70 bg-el-bg-raised/80 px-4 py-1.5 font-mono text-[11px] text-el-fg-muted backdrop-blur-md shadow-el-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-el-accent opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-el-accent" />
        </span>
        <span className="text-el-fg font-medium tracking-wider">COGNITIVE SINGULARITY // ACTIVE</span>
        <span className="text-el-fg-faint">|</span>
        <span className="text-el-fg-faint">INTERACTIVE REACTION FIELD</span>
      </div>
    </div>
  );
}
