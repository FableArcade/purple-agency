"use client";

import React, { useRef, useId, useEffect } from "react";
import { animate, useMotionValue } from "framer-motion";

function mapRange(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number): number {
  if (fromLow === fromHigh) return toLow;
  return toLow + ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow);
}

interface EtheralShadowProps {
  color?: string;
  scale?: number;
  speed?: number;
  opacity?: number;
  className?: string;
}

export function EtheralShadow({
  color = "rgba(128, 128, 128, 1)",
  scale = 100,
  speed = 90,
  opacity = 0.15,
  className = "",
}: EtheralShadowProps) {
  const rawId = useId();
  const id = `etheral-${rawId.replace(/:/g, "")}`;
  const feRef = useRef<SVGFEColorMatrixElement>(null);
  const hue = useMotionValue(0);

  const displacementScale = mapRange(scale, 1, 100, 20, 100);
  const duration = mapRange(speed, 1, 100, 1000, 50) / 25;

  useEffect(() => {
    const ctrl = animate(hue, 360, {
      duration,
      repeat: Infinity,
      repeatType: "loop",
      ease: "linear",
      onUpdate: (v: number) => {
        feRef.current?.setAttribute("values", String(v));
      },
    });
    return () => ctrl.stop();
  }, [duration, hue]);

  return (
    <div
      className={`fixed inset-0 w-screen h-screen pointer-events-none ${className}`}
      style={{ zIndex: 1, opacity }}
    >
      <div style={{ position: "absolute", inset: -displacementScale, filter: `url(#${id}) blur(4px)` }}>
        <svg style={{ position: "absolute" }}>
          <defs>
            <filter id={id}>
              <feTurbulence result="undulation" numOctaves={2} baseFrequency={`${mapRange(scale, 0, 100, 0.001, 0.0005)},${mapRange(scale, 0, 100, 0.004, 0.002)}`} seed={0} type="turbulence" />
              <feColorMatrix ref={feRef} in="undulation" type="hueRotate" values="180" />
              <feColorMatrix in="dist" result="circulation" type="matrix" values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0" />
              <feDisplacementMap in="SourceGraphic" in2="circulation" scale={displacementScale} result="dist" />
              <feDisplacementMap in="dist" in2="undulation" scale={displacementScale} result="output" />
            </filter>
          </defs>
        </svg>
        <div
          style={{
            backgroundColor: color,
            maskImage: "url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')",
            WebkitMaskImage: "url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')",
            maskSize: "cover",
            WebkitMaskSize: "cover",
            maskRepeat: "no-repeat",
            maskPosition: "center",
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}
