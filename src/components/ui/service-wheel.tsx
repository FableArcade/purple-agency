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
  const [time, setTime] = useState(0);
  const animRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Organic floating animation
  useEffect(() => {
    const animate = () => {
      setTime((t) => t + 0.004);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Close on background click
  const handleBgClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      setActiveId(null);
    }
  };

  const getNodePosition = (index: number, total: number) => {
    if (activeId) {
      const activeIndex = SERVICES.findIndex((s) => s.id === activeId);
      if (index === activeIndex) {
        // Active node goes to center
        return { x: 0, y: 0, scale: 1.3 };
      }
      // Others spread out in a wider arc below
      const otherIndices = Array.from({ length: total }, (_, i) => i).filter(
        (i) => i !== activeIndex
      );
      const pos = otherIndices.indexOf(index);
      const spread = 280;
      const startX = -((otherIndices.length - 1) * spread) / 2;
      return {
        x: startX + pos * spread,
        y: 220,
        scale: 0.7,
      };
    }

    // Organic floating positions
    const baseAngle = (index / total) * Math.PI * 2 - Math.PI / 2;
    const radius = 180;
    // Each node has slightly different drift speed/phase
    const drift = Math.sin(time * (1 + index * 0.3) + index * 1.5) * 12;
    const driftY = Math.cos(time * (0.8 + index * 0.2) + index * 2) * 10;

    return {
      x: Math.cos(baseAngle) * (radius + drift),
      y: Math.sin(baseAngle) * (radius + driftY),
      scale: 1,
    };
  };

  return (
    <div
      ref={containerRef}
      className="sw-container"
      onClick={handleBgClick}
    >
      {/* Center glow */}
      {!activeId && (
        <div className="sw-center-glow" />
      )}

      {/* Orbital ring */}
      {!activeId && (
        <svg className="sw-orbit-ring" viewBox="-250 -250 500 500">
          <circle
            cx={0}
            cy={0}
            r={180}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
            strokeDasharray="6 10"
          />
        </svg>
      )}

      {/* Nodes */}
      {SERVICES.map((service, i) => {
        const pos = getNodePosition(i, SERVICES.length);
        const isActive = activeId === service.id;
        const Icon = service.icon;

        return (
          <div
            key={service.id}
            className={`sw-node ${isActive ? "active" : ""} ${activeId && !isActive ? "inactive" : ""}`}
            style={{
              transform: `translate(${pos.x}px, ${pos.y}px) scale(${pos.scale})`,
              zIndex: isActive ? 20 : 5,
            }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveId(isActive ? null : service.id);
            }}
          >
            {/* Glass circle */}
            <div className="sw-node-circle">
              <Icon size={isActive ? 22 : 18} strokeWidth={1.5} />
            </div>
            <span className="sw-node-label">{service.label}</span>

            {/* Glass dropdown */}
            {isActive && (
              <div className="sw-dropdown">
                {service.subServices.map((sub, j) => (
                  <button
                    key={j}
                    className="sw-dropdown-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Navigate to service page when wired up
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
