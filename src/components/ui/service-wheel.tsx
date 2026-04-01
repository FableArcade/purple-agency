"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Brain,
  Paintbrush,
  Target,
  Mail,
  Code,
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
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
  }, []);

  // Auto-rotation
  useEffect(() => {
    if (!autoRotate) return;
    const timer = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.3) % 360);
    }, 50);
    return () => clearInterval(timer);
  }, [autoRotate]);

  // Click anywhere outside a node to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".sw-node-btn") && !target.closest(".sw-dropdown")) {
        setActiveId(null);
        setAutoRotate(true);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

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
    const radius = isMobile ? 95 : 260;
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
      className="sw-container"
    >
      <GlassButtonFilter />

      {/* Orbit ring */}
      <svg className="sw-orbit-ring" viewBox="-320 -320 640 640">
        <circle cx={0} cy={0} r={isMobile ? 95 : 260} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={1} strokeDasharray="4 8" />
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
              transform: `translate(${pos.x}px, ${pos.y}px)`,
              zIndex: isActive ? 200 : pos.zIndex,
              opacity: isActive ? 1 : pos.opacity,
            }}
          >
            <LiquidGlassNode
              isActive={isActive}
              className={`sw-node-btn rounded-full ${isMobile ? "w-[42px] h-[42px]" : "w-[88px] h-[88px]"}`}
              onClick={(e) => {
                e.stopPropagation();
                handleNodeClick(service.id, i);
              }}
            >
              <Icon size={isMobile ? 14 : (isActive ? 30 : 26)} strokeWidth={1.5} className="text-white" />
            </LiquidGlassNode>

            {/* Label */}
            <div
              className="sw-node-label"
              style={{ position: "absolute", top: isMobile ? "48px" : "96px", left: "50%", transform: "translateX(-50%)", fontSize: isMobile ? "0.45rem" : undefined }}
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
                    {sub.label}
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
