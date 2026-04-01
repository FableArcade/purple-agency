"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export interface ParticleTextEffectProps {
  text?: string;
  colors?: string[];
  className?: string;
  animationForce?: number;
  particleDensity?: number;
  width?: number;
  height?: number;
}

const ParticleTextEffect: React.FC<ParticleTextEffectProps> = ({
  text = "HOVER",
  colors = ["ffffff", "dddddd", "bbbbbb", "999999"],
  className = "",
  animationForce = 80,
  particleDensity = 3,
  width = 400,
  height = 120,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const particlesRef = useRef<any[]>([]);
  const pointerRef = useRef<{ x?: number; y?: number }>({});
  const hasPointerRef = useRef(false);
  const interactionRadiusRef = useRef(100);
  const textBoxRef = useRef<{ str: string; x: number; y: number; w: number; h: number }>({
    str: text,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });

  const rand = (max = 1, min = 0) => min + Math.random() * (max - min);

  const createParticle = useCallback(
    (x: number, y: number, rgb: number[]) => {
      const or = rand(2.2, 0.8);
      const f = rand(animationForce + 15, animationForce - 15);
      const particle = {
        ox: x,
        oy: y,
        cx: x,
        cy: y,
        or,
        cr: or,
        f,
        rgb: rgb.map((c) => Math.max(0, Math.min(255, c + rand(5, -5)))),
      };
      return particle;
    },
    [animationForce]
  );

  const drawParticle = useCallback((p: any) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.fillStyle = `rgb(${p.rgb.join(",")})`;
    ctx.beginPath();
    ctx.arc(p.cx, p.cy, p.cr, 0, 2 * Math.PI);
    ctx.fill();
  }, []);

  const moveParticle = useCallback(
    (p: any) => {
      if (hasPointerRef.current && pointerRef.current.x !== undefined && pointerRef.current.y !== undefined) {
        const dx = p.cx - pointerRef.current.x;
        const dy = p.cy - pointerRef.current.y;
        const dist = Math.hypot(dx, dy);
        if (dist < interactionRadiusRef.current && dist > 0) {
          const force = Math.min(p.f, ((interactionRadiusRef.current - dist) / dist) * 2);
          p.cx += (dx / dist) * force;
          p.cy += (dy / dist) * force;
        }
      }

      const odx = p.ox - p.cx;
      const ody = p.oy - p.cy;
      const od = Math.hypot(odx, ody);
      if (od > 1) {
        const restore = Math.min(od * 0.1, 3);
        p.cx += (odx / od) * restore;
        p.cy += (ody / od) * restore;
      }

      drawParticle(p);
    },
    [drawParticle]
  );

  const initialize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const tb = textBoxRef.current;
    tb.str = text;
    tb.h = Math.min(Math.floor(height * 0.85), 100);

    const isTouchDevice = "ontouchstart" in window;
    interactionRadiusRef.current = Math.max(isTouchDevice ? 80 : 40, tb.h * (isTouchDevice ? 2 : 1.2));

    ctx.font = `800 ${tb.h}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    tb.w = Math.round(ctx.measureText(tb.str).width);
    tb.x = 0.5 * (width - tb.w);
    tb.y = 0.5 * (height - tb.h);

    const gradient = ctx.createLinearGradient(tb.x, tb.y, tb.x + tb.w, tb.y + tb.h);
    const N = colors.length - 1;
    colors.forEach((c, i) => gradient.addColorStop(i / N, `#${c}`));
    ctx.fillStyle = gradient;
    ctx.fillText(tb.str, 0.5 * width, 0.5 * height);

    // Dottify
    const data = ctx.getImageData(tb.x * dpr, tb.y * dpr, tb.w * dpr, tb.h * dpr).data;
    const imgW = tb.w * dpr;
    const step = particleDensity * dpr;
    const particles: any[] = [];

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) continue; // skip transparent/anti-aliased edges
      const px = (i / 4) % imgW;
      const py = Math.floor(i / 4 / imgW);
      if (px % step !== 0 || py % step !== 0) continue;
      // Skip near-white pixels (anti-alias artifacts)
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (brightness > 220) continue;
      particles.push(
        createParticle(tb.x + px / dpr, tb.y + py / dpr, [data[i], data[i + 1], data[i + 2]])
      );
    }

    ctx.clearRect(0, 0, width, height);
    particlesRef.current = particles;
    particles.forEach(drawParticle);
  }, [text, colors, width, height, particleDensity, createParticle, drawParticle]);

  const animate = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    particlesRef.current.forEach(moveParticle);
    animationIdRef.current = requestAnimationFrame(animate);
  }, [width, height, moveParticle]);

  useEffect(() => {
    initialize();
    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [initialize]);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    pointerRef.current.x = (e.clientX - rect.left) * scaleX;
    pointerRef.current.y = (e.clientY - rect.top) * scaleY;
    hasPointerRef.current = true;
    if (!animationIdRef.current) animate();
  };

  const handlePointerLeave = () => {
    hasPointerRef.current = false;
    pointerRef.current.x = undefined;
    pointerRef.current.y = undefined;
    if (!animationIdRef.current) animate();
  };

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width, height, touchAction: "none" }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerEnter={() => { hasPointerRef.current = true; }}
      onTouchMove={(e) => {
        const touch = e.touches[0];
        const canvas = canvasRef.current;
        if (!canvas || !touch) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = width / rect.width;
        const scaleY = height / rect.height;
        pointerRef.current.x = (touch.clientX - rect.left) * scaleX;
        pointerRef.current.y = (touch.clientY - rect.top) * scaleY;
        hasPointerRef.current = true;
        if (!animationIdRef.current) animate();
      }}
      onTouchEnd={() => {
        hasPointerRef.current = false;
        pointerRef.current.x = undefined;
        pointerRef.current.y = undefined;
        if (!animationIdRef.current) animate();
      }}
    />
  );
};

export { ParticleTextEffect };
