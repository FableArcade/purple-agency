"use client";

import {
  Mail,
  Target,
  Megaphone,
  BarChart3,
  FileText,
  Globe,
  Zap,
  TrendingUp,
  Layers,
  Brain,
  Paintbrush,
  Code,
  Search,
  Video,
} from "lucide-react";

const orbitIcons = [
  { Icon: Target, label: "Google" },
  { Icon: Megaphone, label: "Meta" },
  { Icon: Globe, label: "LinkedIn" },
  { Icon: Mail, label: "Email" },
  { Icon: FileText, label: "Content" },
  { Icon: BarChart3, label: "Analytics" },
  { Icon: Brain, label: "AI" },
  { Icon: Paintbrush, label: "Creative" },
  { Icon: Code, label: "Web" },
  { Icon: Search, label: "SEO" },
  { Icon: Video, label: "Video" },
  { Icon: TrendingUp, label: "Growth" },
];

export default function ContactSection() {
  const orbitCount = 3;
  const iconsPerOrbit = Math.ceil(orbitIcons.length / orbitCount);

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-center justify-between px-4 md:px-10">
      {/* Left side */}
      <div className="w-full md:w-1/2 z-10 text-center md:text-left">
        <p
          className="text-xs uppercase tracking-[0.2em] text-white/30 mb-4"
          style={{ fontFamily: "var(--font-mono), monospace" }}
        >
          Let&apos;s Build
        </p>
        <h2
          className="text-4xl sm:text-6xl md:text-8xl font-bold text-white mb-6"
          style={{ letterSpacing: "-0.02em" }}
        >
          Let&apos;s Chat
        </h2>
        <p className="text-white/70 mb-8 max-w-md mx-auto md:mx-0 text-sm sm:text-base leading-relaxed font-light">
          90 days. Strategy, content, and competitive intelligence — powered by
          an engine that gets smarter every cycle. Your startup deserves
          marketing that moves as fast as you do.
        </p>
        <div className="flex flex-col sm:flex-row items-center md:items-start gap-4">
          <a
            href="mailto:hello@movesstudio.ai"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white text-sm font-medium hover:bg-white/15 transition-all duration-300"
          >
            <Mail size={16} />
            hello@movesstudio.ai
          </a>
          <a
            href="mailto:hello@movesstudio.ai"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white/50 text-sm font-light hover:text-white/80 hover:border-white/20 transition-all duration-300"
          >
            Book a call
          </a>
        </div>
      </div>

      {/* Right side — orbit */}
      <div className="hidden md:flex relative w-1/2 h-[32rem] items-center justify-start overflow-visible">
        <div className="relative w-[44rem] h-[44rem] translate-x-[25%] flex items-center justify-center">
          {/* Center */}
          <div className="w-16 h-16 rounded-full bg-white/[0.04] backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <Zap className="w-7 h-7 text-white/60" />
          </div>

          {/* Orbits */}
          {[...Array(orbitCount)].map((_, orbitIdx) => {
            const size = `${10 + 7 * (orbitIdx + 1)}rem`;
            const angleStep = (2 * Math.PI) / iconsPerOrbit;
            const direction = orbitIdx % 2 === 0 ? "normal" : "reverse";

            return (
              <div
                key={orbitIdx}
                className="absolute rounded-full border border-dashed border-white/[0.06]"
                style={{
                  width: size,
                  height: size,
                  animation: `contact-spin ${20 + orbitIdx * 8}s linear infinite ${direction}`,
                }}
              >
                {orbitIcons
                  .slice(
                    orbitIdx * iconsPerOrbit,
                    orbitIdx * iconsPerOrbit + iconsPerOrbit
                  )
                  .map((cfg, iconIdx) => {
                    const angle = iconIdx * angleStep;
                    const x = 50 + 50 * Math.cos(angle);
                    const y = 50 + 50 * Math.sin(angle);

                    return (
                      <div
                        key={iconIdx}
                        className="absolute bg-white/[0.04] backdrop-blur-sm rounded-full p-2 border border-white/[0.08]"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: "translate(-50%, -50%)",
                          animation: `contact-counter-spin ${20 + orbitIdx * 8}s linear infinite ${direction === "normal" ? "reverse" : "normal"}`,
                        }}
                      >
                        <cfg.Icon className="w-5 h-5 text-white/40" />
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes contact-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes contact-counter-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
