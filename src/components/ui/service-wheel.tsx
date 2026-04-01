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
  const [isMobile, setIsMobile] = useState(false);
  const autoRotateRef = useRef(true);
  const rotationRef = useRef(0);
  const nodeRefsArr = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
  }, []);

  // Desktop: React state rotation (works with existing transitions)
  // Mobile: rAF direct DOM updates (smooth, no re-renders)
  useEffect(() => {
    if (isMobile) {
      // Mobile: direct DOM manipulation
      let raf: number;
      let lastTime = performance.now();
      const tick = (now: number) => {
        if (autoRotateRef.current) {
          const delta = now - lastTime;
          rotationRef.current = (rotationRef.current + delta * 0.012) % 360;
          updateMobilePositions();
        }
        lastTime = now;
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    } else {
      // Desktop: React state
      if (!autoRotateRef.current) return;
      const timer = setInterval(() => {
        setRotationAngle((prev) => (prev + 0.3) % 360);
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isMobile, activeId]);

  const updateMobilePositions = () => {
    const radius = 95;
    SERVICES.forEach((_, i) => {
      const el = nodeRefsArr.current[i];
      if (!el) return;
      const angle = ((i / SERVICES.length) * 360 + rotationRef.current) % 360;
      const radian = (angle * Math.PI) / 180;
      const x = radius * Math.cos(radian);
      const y = radius * Math.sin(radian);
      const opacity = 0.5 + 0.5 * ((1 + Math.sin(radian)) / 2);
      el.style.transform = `translate(${x}px, ${y}px)`;
      el.style.opacity = String(opacity);
      el.style.zIndex = String(Math.round(100 + 50 * Math.cos(radian)));
    });
  };

  // Click anywhere outside a node to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".sw-node-btn") && !target.closest(".sw-dropdown")) {
        setActiveId(null);
        autoRotateRef.current = true;
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleNodeClick = (id: string, index: number) => {
    if (activeId === id) {
      setActiveId(null);
      autoRotateRef.current = true;
    } else {
      setActiveId(id);
      autoRotateRef.current = false;
      const targetAngle = (index / SERVICES.length) * 360;
      if (isMobile) {
        rotationRef.current = 270 - targetAngle;
        updateMobilePositions();
      } else {
        setRotationAngle(270 - targetAngle);
      }
    }
  };

  // Desktop position calculator
  const getNodePosition = (index: number) => {
    const total = SERVICES.length;
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 260;
    const radian = (angle * Math.PI) / 180;
    return {
      x: radius * Math.cos(radian),
      y: radius * Math.sin(radian),
      zIndex: Math.round(100 + 50 * Math.cos(radian)),
      opacity: 0.5 + 0.5 * ((1 + Math.sin(radian)) / 2),
    };
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
        const isActive = activeId === service.id;
        const Icon = service.icon;
        const pos = !isMobile ? getNodePosition(i) : null;

        return (
          <div
            key={service.id}
            ref={(el) => { nodeRefsArr.current[i] = el; }}
            className={isMobile ? "absolute" : "absolute transition-all duration-700"}
            style={isMobile ? {
              willChange: "transform",
              zIndex: isActive ? 200 : undefined,
              opacity: isActive ? 1 : undefined,
              transition: "transform 0.5s ease",
            } : {
              transform: `translate(${pos!.x}px, ${pos!.y}px) scale(${isActive ? 1.15 : 1})`,
              zIndex: isActive ? 200 : pos!.zIndex,
              opacity: isActive ? 1 : pos!.opacity,
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
