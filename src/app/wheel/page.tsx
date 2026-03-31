"use client";

import {
  Brain,
  Paintbrush,
  Target,
  Mail,
  Code,
} from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { GlassFilter } from "@/components/ui/liquid-glass";

const serviceData = [
  {
    id: 1,
    title: "Strategy & Intel",
    date: "Phase 1",
    content:
      "Brand positioning, competitive intelligence, GEO audit, and market analysis. We map your landscape before a single asset is made.",
    category: "Strategy",
    icon: Brain,
    relatedIds: [2, 5],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Content & Creative",
    date: "Phase 2",
    content:
      "Ad creative, video & motion, social content, and copywriting. AI generates variants at scale — humans curate the best.",
    category: "Creative",
    icon: Paintbrush,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Paid Media",
    date: "Phase 2",
    content:
      "Google Ads, Meta Ads, LinkedIn Ads, and performance optimization. Campaigns live in days, not weeks.",
    category: "Acquisition",
    icon: Target,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 75,
  },
  {
    id: 4,
    title: "Email & Lifecycle",
    date: "Phase 2",
    content:
      "Email sequences, SMS marketing, and lifecycle flows. Retention powered by AI, directed by humans.",
    category: "Retention",
    icon: Mail,
    relatedIds: [3, 5],
    status: "in-progress" as const,
    energy: 60,
  },
  {
    id: 5,
    title: "Web & Dev",
    date: "Phase 3",
    content:
      "Landing pages, CRO & A/B testing, and custom web/app builds. Every touchpoint optimized for conversion.",
    category: "Development",
    icon: Code,
    relatedIds: [1, 4],
    status: "pending" as const,
    energy: 45,
  },
];

export default function WheelPage() {
  return (
    <div
      className="min-h-screen bg-black relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 50% 50%, rgba(88, 28, 135, 0.15) 0%, rgba(0,0,0,1) 70%)`,
      }}
    >
      <GlassFilter />

      {/* Header text */}
      <div className="absolute top-0 left-0 w-full z-20 pt-20 text-center pointer-events-none">
        <p className="text-xs uppercase tracking-[0.3em] text-purple-400/60 mb-4">
          The Purple Engine
        </p>
        <h2
          className="text-4xl md:text-5xl font-light text-white mb-4"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
          }}
        >
          Every Channel Works Together
        </h2>
        <p className="text-white/40 max-w-lg mx-auto text-sm leading-relaxed px-4">
          Click any node to explore our services. Each one connects to the
          others — because your marketing should too.
        </p>
      </div>

      {/* Orbital timeline */}
      <RadialOrbitalTimeline timelineData={serviceData} />
    </div>
  );
}
