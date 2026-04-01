"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Brain,
  Paintbrush,
  Target,
  Mail,
  Code,
  ChevronRight,
} from "lucide-react";
import { LiquidGlassNode, GlassButtonFilter } from "@/components/ui/liquid-glass-button";

interface SubService {
  label: string;
  href?: string;
}

interface ServiceNode {
  id: string;
  label: string;
  icon: React.ElementType;
  subServices: SubService[];
}

const SERVICES: ServiceNode[] = [
  {
    id: "strategy",
    label: "Strategy & Intel",
    icon: Brain,
    subServices: [
      { label: "Brand Positioning" },
      { label: "Competitive Intel" },
      { label: "GEO Audit" },
      { label: "Market Analysis" },
    ],
  },
  {
    id: "creative",
    label: "Content & Creative",
    icon: Paintbrush,
    subServices: [
      { label: "Ad Creative" },
      { label: "Video & Motion" },
      { label: "Social Content" },
      { label: "Copywriting" },
    ],
  },
  {
    id: "paid",
    label: "Paid Media",
    icon: Target,
    subServices: [
      { label: "Google Ads" },
      { label: "Meta Ads" },
      { label: "LinkedIn Ads" },
      { label: "Performance" },
    ],
  },
  {
    id: "email",
    label: "Email & Lifecycle",
    icon: Mail,
    subServices: [
      { label: "Email Sequences" },
      { label: "SMS Marketing" },
      { label: "Lifecycle Flows" },
    ],
  },
  {
    id: "web",
    label: "Web & Dev",
    icon: Code,
    subServices: [
      { label: "Landing Pages" },
      { label: "CRO & Testing" },
      { label: "Custom Builds" },
    ],
  },
];

export default function ServiceWheel() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-rotation
  useEffect(() => {
    if (!autoRotate) return;
    const timer = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.3) % 360);
    }, 50);
    return () => clearInterval(timer);
  }, [autoRotate]);

  // Background click to deselect
  const handleBgClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).classList.contains("sw-bg")) {
      setActiveId(null);
      setAutoRotate(true);
    }
  };

  const handleNodeClick = (id: string, index: number) => {
    if (activeId === id) {
      setActiveId(null);
      setAutoRotate(true);
    } else {
      setActiveId(id);
      setAutoRotate(false);
      // Snap selected node to top (270°)
      const targetAngle = (index / SERVICES.length) * 360;
      setRotationAngle(270 - targetAngle);
    }
  };

  const getNodePosition = (index: number) => {
    const total = SERVICES.length;
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 180;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = 0.5 + 0.5 * ((1 + Math.sin(radian)) / 2);
    return { x, y, zIndex, opacity };
  };

  return (
    <div
      ref={containerRef}
      className="sw-container sw-bg"
      onClick={handleBgClick}
    >
      <GlassButtonFilter />

      {/* Center core */}
      <div className="absolute w-14 h-14 rounded-full flex items-center justify-center z-10 pointer-events-none">
        <div className="w-14 h-14 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-white/15 backdrop-blur-sm" />
        </div>
        <div className="absolute w-18 h-18 rounded-full border border-white/8 animate-ping opacity-40" />
      </div>

      {/* Orbit ring */}
      <svg className="sw-orbit-ring" viewBox="-250 -250 500 500">
        <circle cx={0} cy={0} r={180} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="4 8" />
      </svg>

      {/* Nodes */}
      {SERVICES.map((service, i) => {
        const pos = getNodePosition(i);
        const isActive = activeId === service.id;
        const Icon = service.icon;

        return (
          <div
            key={service.id}
            className="absolute transition-all duration-700"
            style={{
              transform: `translate(${pos.x}px, ${pos.y}px) scale(${isActive ? 1.25 : 1})`,
              zIndex: isActive ? 200 : pos.zIndex,
              opacity: isActive ? 1 : pos.opacity,
            }}
          >
            <LiquidGlassNode
              isActive={isActive}
              className="w-[72px] h-[72px] rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleNodeClick(service.id, i);
              }}
            >
              <Icon size={isActive ? 22 : 18} strokeWidth={1.5} className="text-white/80" />
            </LiquidGlassNode>

            {/* Label */}
            <div
              className={`absolute top-[80px] left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium tracking-wider uppercase transition-all duration-300 ${
                isActive ? "text-white" : "text-white/50"
              }`}
            >
              {service.label}
            </div>

            {/* Glass dropdown */}
            {isActive && (
              <div className="sw-dropdown">
                {service.subServices.map((sub, j) => (
                  <button
                    key={j}
                    className="sw-dropdown-item"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <span>{sub.label}</span>
                    <ChevronRight size={14} className="sw-dropdown-arrow" />
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
