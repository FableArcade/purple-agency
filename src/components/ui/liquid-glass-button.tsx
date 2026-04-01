"use client";

import React from "react";

export function GlassButtonFilter() {
  return (
    <svg className="hidden">
      <defs>
        <filter
          id="container-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves={1}
            seed={1}
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation={2} result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale={70}
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation={4} result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

interface LiquidGlassNodeProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  isActive?: boolean;
}

export function LiquidGlassNode({
  children,
  className = "",
  onClick,
  isActive,
}: LiquidGlassNodeProps) {
  return (
    <button
      className={`relative inline-flex items-center justify-center cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div
        className={`absolute top-0 left-0 z-0 h-full w-full rounded-full transition-all duration-500
          ${
            isActive
              ? "shadow-[0_0_8px_rgba(255,255,255,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.15),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.9),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.7),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.7),inset_0_0_6px_6px_rgba(255,255,255,0.15),inset_0_0_2px_2px_rgba(255,255,255,0.08),0_0_20px_rgba(255,255,255,0.1)]"
              : "shadow-[0_0_6px_rgba(0,0,0,0.03),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.06),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.6),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.4),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.4),inset_0_0_6px_6px_rgba(255,255,255,0.08),inset_0_0_2px_2px_rgba(255,255,255,0.04),0_0_12px_rgba(255,255,255,0.06)]"
          }`}
      />
      <div
        className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-full"
        style={{ backdropFilter: 'url("#container-glass")' }}
      />
      <div className="relative z-10">{children}</div>
    </button>
  );
}
