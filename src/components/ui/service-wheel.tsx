"use client";

import React, { useState } from "react";
import {
  Brain,
  Paintbrush,
  Target,
  Mail,
  Code,
  TrendingUp,
  Search,
  MapPin,
  Megaphone,
  Palette,
  Video,
  FileText,
  BarChart3,
  Globe,
  Smartphone,
  PenTool,
  LineChart,
  Layers,
} from "lucide-react";

interface SubService {
  icon: React.ReactNode;
  label: string;
  href?: string;
}

interface Pillar {
  id: string;
  label: string;
  subServices: SubService[];
}

const PILLARS: Pillar[] = [
  {
    id: "strategy",
    label: "Strategy & Intel",
    subServices: [
      { icon: <TrendingUp size={20} />, label: "Brand Positioning" },
      { icon: <Search size={20} />, label: "Competitive Intel" },
      { icon: <MapPin size={20} />, label: "GEO Audit" },
      { icon: <BarChart3 size={20} />, label: "Market Analysis" },
    ],
  },
  {
    id: "creative",
    label: "Content & Creative",
    subServices: [
      { icon: <Paintbrush size={20} />, label: "Ad Creative" },
      { icon: <Video size={20} />, label: "Video & Motion" },
      { icon: <FileText size={20} />, label: "Social Content" },
      { icon: <PenTool size={20} />, label: "Copywriting" },
    ],
  },
  {
    id: "paid",
    label: "Paid Media",
    subServices: [
      { icon: <Target size={20} />, label: "Google Ads" },
      { icon: <Megaphone size={20} />, label: "Meta Ads" },
      { icon: <Globe size={20} />, label: "LinkedIn Ads" },
      { icon: <LineChart size={20} />, label: "Performance" },
    ],
  },
  {
    id: "email",
    label: "Email & Lifecycle",
    subServices: [
      { icon: <Mail size={20} />, label: "Email Sequences" },
      { icon: <Smartphone size={20} />, label: "SMS Marketing" },
      { icon: <Layers size={20} />, label: "Lifecycle Flows" },
    ],
  },
  {
    id: "web",
    label: "Web & Dev",
    subServices: [
      { icon: <Code size={20} />, label: "Landing Pages" },
      { icon: <Palette size={20} />, label: "CRO & Testing" },
      { icon: <Brain size={20} />, label: "Custom Builds" },
    ],
  },
];

// Position satellites around the circle (top, then clockwise)
const POSITIONS = [
  { angle: -90, x: 0, y: -1 },     // top
  { angle: -18, x: 0.95, y: -0.31 }, // top-right
  { angle: 54, x: 0.59, y: 0.81 },   // bottom-right
  { angle: 126, x: -0.59, y: 0.81 }, // bottom-left
  { angle: 198, x: -0.95, y: -0.31 },// top-left
];

export default function ServiceWheel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const centerRadius = 160;
  const orbitRadius = 220;
  const satelliteRadius = 56;

  return (
    <div className="wheel-container">
      {/* Orbital rings */}
      <svg
        className="wheel-orbits"
        viewBox="-350 -350 700 700"
        fill="none"
      >
        {/* Outer dotted ring */}
        <circle
          cx={0}
          cy={0}
          r={orbitRadius + satelliteRadius + 30}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
          strokeDasharray="4 6"
        />
        {/* Inner dotted ring */}
        <circle
          cx={0}
          cy={0}
          r={orbitRadius - 20}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={1}
          strokeDasharray="3 8"
        />
        {/* Connecting lines from satellites to center */}
        {PILLARS.map((_, i) => {
          const pos = POSITIONS[i];
          return (
            <line
              key={i}
              x1={0}
              y1={0}
              x2={pos.x * orbitRadius}
              y2={pos.y * orbitRadius}
              stroke={
                i === activeIndex
                  ? "rgba(168,85,247,0.3)"
                  : "rgba(255,255,255,0.06)"
              }
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          );
        })}
      </svg>

      {/* Center circle — shows active pillar's sub-services */}
      <div className="wheel-center">
        <div className="wheel-center-inner">
          {PILLARS[activeIndex].subServices.map((sub, i) => (
            <button
              key={i}
              className="wheel-sub-service"
              onClick={() => {
                if (sub.href) window.location.href = sub.href;
              }}
            >
              <span className="wheel-sub-icon">{sub.icon}</span>
              <span className="wheel-sub-label">{sub.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Satellite circles */}
      {PILLARS.map((pillar, i) => {
        const pos = POSITIONS[i];
        const isActive = i === activeIndex;
        const x = pos.x * orbitRadius;
        const y = pos.y * orbitRadius;

        return (
          <button
            key={pillar.id}
            className={`wheel-satellite ${isActive ? "active" : ""}`}
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
            onClick={() => setActiveIndex(i)}
          >
            <span className="wheel-satellite-label">{pillar.label}</span>
            <span className="wheel-satellite-toggle">
              {isActive ? "−" : "+"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
