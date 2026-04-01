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
  const [, forceRender] = useState(0);
  const rotationRef = useRef(0);
  const autoRotateRef = useRef(true);
  const isMobileRef = useRef(false);
  const nodeRefsArr = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isMobileRef.current = window.innerWidth < 640;
  }, []);

  // Auto-rotation via rAF — directly updates DOM, no React re-renders
  useEffect(() => {
    let raf: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      if (autoRotateRef.current) {
        const delta = now - lastTime;
        const speed = isMobileRef.current ? 0.012 : 0.018;
        rotationRef.current = (rotationRef.current + delta * speed) % 360;
        updateNodePositions();
      }
      lastTime = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const updateNodePositions = () => {
    const radius = isMobileRef.current ? 95 : 260;
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
      rotationRef.current = 270 - targetAngle;
      updateNodePositions();
    }
  };

  return (
    <div
      ref={containerRef}
      className="sw-container"
    >
      <GlassButtonFilter />

      {/* Orbit ring */}
      <svg className="sw-orbit-ring" viewBox="-320 -320 640 640">
        <circle cx={0} cy={0} r={isMobileRef.current ? 95 : 260} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={1} strokeDasharray="4 8" />
      </svg>

      {/* Nodes */}
      {SERVICES.map((service, i) => {
        const isActive = activeId === service.id;
        const Icon = service.icon;

        return (
          <div
            key={service.id}
            ref={(el) => { nodeRefsArr.current[i] = el; }}
            className="absolute"
            style={{
              willChange: "transform",
              zIndex: isActive ? 200 : undefined,
              opacity: isActive ? 1 : undefined,
            }}
          >
            <LiquidGlassNode
              isActive={isActive}
              className={`sw-node-btn rounded-full ${isMobileRef.current ? "w-[42px] h-[42px]" : "w-[88px] h-[88px]"}`}
              onClick={(e) => {
                e.stopPropagation();
                handleNodeClick(service.id, i);
              }}
            >
              <Icon size={isMobileRef.current ? 14 : (isActive ? 30 : 26)} strokeWidth={1.5} className="text-white" />
            </LiquidGlassNode>

            {/* Label */}
            <div
              className="sw-node-label"
              style={{ position: "absolute", top: isMobileRef.current ? "48px" : "96px", left: "50%", transform: "translateX(-50%)", fontSize: isMobileRef.current ? "0.45rem" : undefined }}
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
