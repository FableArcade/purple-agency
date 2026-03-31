"use client";

import React from "react";

interface GlassEffectProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const GlassEffect: React.FC<GlassEffectProps> = ({
  children,
  className = "",
  style = {},
}) => {
  return (
    <div
      className={`relative flex overflow-hidden text-white cursor-pointer ${className}`}
      style={{
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "1.5rem",
        ...style,
      }}
    >
      {/* Blur layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backdropFilter: "blur(16px) saturate(1.2)",
          WebkitBackdropFilter: "blur(16px) saturate(1.2)",
          borderRadius: "inherit",
        }}
      />
      {/* Gradient sheen — simulates light hitting glass */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.06) 100%)",
          borderRadius: "inherit",
        }}
      />
      {/* Inner highlight edge */}
      <div
        className="absolute inset-0 z-20"
        style={{
          boxShadow:
            "inset 0 1px 0 0 rgba(255,255,255,0.2), inset 0 -1px 0 0 rgba(255,255,255,0.05)",
          borderRadius: "inherit",
        }}
      />
      {/* Content */}
      <div className="relative z-30">{children}</div>
    </div>
  );
};

export const GlassFilter: React.FC = () => null;
