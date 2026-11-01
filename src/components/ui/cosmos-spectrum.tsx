"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

interface CosmicSpectrumProps {
  color?:
    | "original"
    | "blue-pink"
    | "blue-orange"
    | "sunset"
    | "purple"
    | "monochrome"
    | "pink-purple"
    | "blue-black"
    | "beige-black";
  blur?: boolean;
}

export function CosmicSpectrum({
  color = "purple",
  blur = true,
}: CosmicSpectrumProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const colorThemes: Record<string, string[]> = {
    original: ["#340B05", "#0358F7", "#5092C7", "#E1ECFE", "#FFD400", "#FA3D1D", "#FD02F5", "#FFC0FD"],
    "blue-pink": ["#1E3A8A", "#3B82F6", "#A855F7", "#EC4899", "#F472B6", "#F9A8D4", "#FBCFE8", "#FDF2F8"],
    "blue-orange": ["#1E40AF", "#3B82F6", "#60A5FA", "#FFFFFF", "#FED7AA", "#FB923C", "#EA580C", "#9A3412"],
    sunset: ["#FEF3C7", "#FCD34D", "#F59E0B", "#D97706", "#B45309", "#92400E", "#78350F", "#451A03"],
    purple: ["#F3E8FF", "#E9D5FF", "#D8B4FE", "#C084FC", "#A855F7", "#9333EA", "#7C3AED", "#6B21B6"],
    monochrome: ["#1A1A1A", "#404040", "#666666", "#999999", "#CCCCCC", "#E5E5E5", "#F5F5F5", "#FFFFFF"],
    "pink-purple": ["#FDF2F8", "#FCE7F3", "#F9A8D4", "#F472B6", "#EC4899", "#BE185D", "#831843", "#500724"],
    "blue-black": ["#000000", "#0F172A", "#1E293B", "#334155", "#475569", "#64748B", "#94A3B8", "#CBD5E1"],
    "beige-black": ["#FEF3C7", "#F59E0B", "#D97706", "#92400E", "#451A03", "#1C1917", "#0C0A09", "#000000"],
  };

  useEffect(() => {
    const loadScript = (src: string) =>
      new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve(true);
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

    const init = async () => {
      try {
        await Promise.all([
          loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"),
          loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"),
        ]);

        setTimeout(() => {
          if (window.gsap && window.ScrollTrigger) {
            window.gsap.registerPlugin(window.ScrollTrigger);
            setupAnimations();
          }
        }, 200);
      } catch (e) {
        console.error("Failed to load GSAP:", e);
      }
    };

    const setupAnimations = () => {
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      if (!gsap || !ScrollTrigger) return;

      // Hero title chars
      const titleChars = document.querySelectorAll(".cs-hero-title .char");
      if (titleChars.length > 0) {
        gsap.set(titleChars, { opacity: 0, filter: "blur(8px)", x: -20 });
        gsap.to(titleChars, {
          opacity: 1,
          filter: "blur(0px)",
          x: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: "power2.out",
          delay: 0.5,
        });
      }

      // Subtitle
      const subtitle = document.querySelector(".cs-subtitle");
      if (subtitle) {
        gsap.set(subtitle, { opacity: 0, y: 30 });
        gsap.to(subtitle, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 1.2,
        });
      }

      // Scroll hint
      const scrollChars = document.querySelectorAll(".cs-scroll-hint .char");
      if (scrollChars.length > 0) {
        gsap.set(scrollChars, { opacity: 0, filter: "blur(3px)" });
        gsap.to(scrollChars, {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.6,
          stagger: { each: 0.08, repeat: -1, yoyo: true },
          ease: "sine.inOut",
          delay: 1.5,
        });
      }

      // Scroll-triggered spectrum
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".cs-animation-section",
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      const mainTitle = document.querySelector(".cs-main-title");
      if (mainTitle) gsap.set(mainTitle, { opacity: 0, y: 30, filter: "blur(8px)" });

      tl.to(".cs-svg-container", { opacity: 1, duration: 0.01 }, 0)
        .to(".cs-svg-container", {
          transform: "scaleY(0.05) translateY(-30px)",
          duration: 0.3,
          ease: "power2.out",
        }, 0)
        .to(".cs-svg-container", {
          transform: "scaleY(1) translateY(0px)",
          duration: 1.2,
          ease: "power2.out",
        }, 0.3)
        .to(mainTitle, {
          duration: 0.8,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          ease: "power2.out",
        }, 0.9);

      window.addEventListener("resize", () => ScrollTrigger.refresh());
    };

    init();
  }, []);

  const splitText = (text: string) =>
    text.split("").map((char, i) => (
      <span key={i} className="char" style={{ display: "inline-block" }}>
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  const currentColors = colorThemes[color];

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section className="h-screen w-full flex flex-col items-center justify-center relative">
        <h1
          className="cs-hero-title text-center text-6xl md:text-8xl font-light tracking-tight text-white"
          style={{
            fontFamily: "var(--font-heading), 'Cormorant Garamond', Georgia, serif",
            textShadow: "0 2px 20px rgba(0,0,0,0.4)",
          }}
        >
          {splitText("Marketing That Moves")}
        </h1>
        <p
          className="cs-subtitle mt-6 text-white/40 text-sm md:text-base font-light tracking-wide text-center"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          Full-service marketing, powered by AI.
        </p>
      </section>

      {/* Scroll hint */}
      <div
        className="cs-scroll-hint fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] text-xs uppercase tracking-widest text-white/30"
        style={{ fontFamily: "var(--font-mono), monospace" }}
      >
        {splitText("Scroll to explore")}
      </div>

      <div className="h-[50vh]" />

      {/* Animation section */}
      <div className="cs-animation-section h-screen relative">
        <div className="fixed bottom-0 left-0 right-0 h-screen pointer-events-none z-10">
          {/* Spectrum SVG */}
          <div
            className="cs-svg-container absolute bottom-0 left-0 right-0 h-screen opacity-0 z-[15]"
            style={{
              transformOrigin: "bottom",
              transform: "scaleY(0.05) translateY(100vh)",
              willChange: "transform, opacity",
            }}
          >
            <svg className="w-full h-full" viewBox="0 0 1567 584" preserveAspectRatio="none" fill="none">
              <g clipPath="url(#cs-clip)" filter={blur ? "url(#cs-blur)" : undefined}>
                <path d="M1219 584H1393V184H1219V584Z" fill="url(#cs-g0)" />
                <path d="M1045 584H1219V104H1045V584Z" fill="url(#cs-g1)" />
                <path d="M348 584H174L174 184H348L348 584Z" fill="url(#cs-g2)" />
                <path d="M522 584H348L348 104H522L522 584Z" fill="url(#cs-g3)" />
                <path d="M697 584H522L522 54H697L697 584Z" fill="url(#cs-g4)" />
                <path d="M870 584H1045V54H870V584Z" fill="url(#cs-g5)" />
                <path d="M870 584H697L697 0H870L870 584Z" fill="url(#cs-g6)" />
                <path d="M174 585H0L0 295H174L174 585Z" fill="url(#cs-g7)" />
                <path d="M1393 584H1567V294H1393V584Z" fill="url(#cs-g8)" />
              </g>
              <defs>
                <filter id="cs-blur" x="-30" y="-30" width="1627" height="644" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feGaussianBlur stdDeviation="15" result="effect1" />
                </filter>
                {Array.from({ length: 9 }, (_, i) => (
                  <linearGradient key={i} id={`cs-g${i}`} x1="50%" y1="100%" x2="50%" y2="0%" gradientUnits="userSpaceOnUse">
                    <stop stopColor={currentColors[0]} />
                    <stop offset="0.18" stopColor={currentColors[1]} />
                    <stop offset="0.28" stopColor={currentColors[2]} />
                    <stop offset="0.41" stopColor={currentColors[3]} />
                    <stop offset="0.59" stopColor={currentColors[4]} />
                    <stop offset="0.68" stopColor={currentColors[5]} />
                    <stop offset="0.80" stopColor={currentColors[6]} />
                    <stop offset="1" stopColor={currentColors[7]} stopOpacity="0" />
                  </linearGradient>
                ))}
                <clipPath id="cs-clip">
                  <rect width="1567" height="584" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>

          {/* Reveal text */}
          <div
            className="cs-main-title absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 text-center z-20 opacity-0"
            style={{
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              color: "#fff",
              fontSize: "clamp(0.75rem, 1.2vw, 1rem)",
              lineHeight: 1.8,
              letterSpacing: "0.03em",
              fontWeight: 300,
              textShadow: "0 1px 8px rgba(0,0,0,0.4)",
            }}
          >
            AI engine. Human direction.
            <br />
            Campaigns live in days.
          </div>
        </div>
      </div>
    </div>
  );
}
