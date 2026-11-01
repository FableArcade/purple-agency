"use client";

import { useState, useEffect, useRef } from "react";
import { GlassEffect, GlassFilter } from "@/components/ui/liquid-glass";

type Film = {
  image: string;
  brand: string;
  type: string;
  trailer?: string;
};

const FILMS: Film[] = [
  { image: "/films/jojo.jpg", brand: "Jojo Rabbit", type: "2019", trailer: "tL4McUzXfFI" },
  { image: "/films/ragnarok.jpg", brand: "Thor: Ragnarok", type: "2017", trailer: "ue80QwXMRHg" },
  { image: "/films/lovethunder.jpeg", brand: "Thor: Love and Thunder", type: "2022", trailer: "tgB1wUcmbbw" },
  { image: "/films/wilderpeople.png", brand: "Hunt for the Wilderpeople", type: "2016", trailer: "n8Xvsjy57X0" },
  { image: "/films/nextgoal.png", brand: "Next Goal Wins", type: "2023", trailer: "pRH5u5lpArQ" },
  { image: "/films/shadows.jpg", brand: "What We Do in the Shadows", type: "2014", trailer: "IAZEWtyhpes" },
  { image: "/films/boy.jpg", brand: "Boy", type: "2010", trailer: "oP05fUP9xAo" },
  { image: "/films/eagle.jpg", brand: "Eagle vs Shark", type: "2007", trailer: "NW2bqu7URfM" },
];

const TV: Film[] = [
  { image: "/films/resdogs.jpg", brand: "Reservation Dogs", type: "FX · 2021–2023", trailer: "YWYVTyhFAOU" },
  { image: "/films/ofmd.jpg", brand: "Our Flag Means Death", type: "HBO Max · 2022–2023", trailer: "prQDst-tAJ8" },
];

function CarouselRow({
  items,
  onTrailer,
}: {
  items: Film[];
  onTrailer: (id: string, title: string) => void;
}) {
  const [expandedImage, setExpandedImage] = useState(1);
  const lastTapRef = useRef<{ idx: number; time: number }>({ idx: -1, time: 0 });

  const handleClick = (idx: number) => {
    const isExpanded = idx + 1 === expandedImage;
    if (!isExpanded) {
      setExpandedImage(idx + 1);
    }
  };

  const handleTouch = (idx: number) => {
    const now = Date.now();
    const last = lastTapRef.current;
    if (last.idx === idx && now - last.time < 400) {
      return;
    }
    lastTapRef.current = { idx, time: now };
    setExpandedImage(idx + 1);
  };

  return (
    <div
      className="relative w-[85vw] md:w-full md:max-w-6xl overflow-x-scroll scrollbar-hide rounded-2xl"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <div className="flex items-center gap-1 w-max md:w-full md:justify-center">
        {items.map((item, idx) => {
          const isExpanded = idx + 1 === expandedImage;
          return (
            <div
              key={idx}
              className="relative cursor-pointer overflow-hidden rounded-[1.2rem] transition-all duration-500 ease-in-out flex-shrink-0"
              style={{
                width: isExpanded ? "min(24rem, 65vw)" : "3.5rem",
                height: "min(22rem, 55vh)",
              }}
              onMouseEnter={() => setExpandedImage(idx + 1)}
              onTouchStart={() => handleTouch(idx)}
              onClick={() => handleClick(idx)}
            >
              <img
                className="w-full h-full object-cover"
                src={item.image}
                alt={`${item.brand} ${item.type}`}
              />
              {isExpanded && (
                <>
                  {item.trailer && (
                    <button
                      className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all hover:bg-white/30 hover:scale-110 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTrailer(item.trailer!, item.brand);
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <p
                      className="text-white text-2xl md:text-4xl"
                      style={{
                        fontFamily: "var(--font-display), Georgia, serif",
                        fontStyle: "italic",
                        fontWeight: 500,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.0,
                      }}
                    >
                      {item.brand}
                    </p>
                    <p
                      className="text-white/55 text-[10px] md:text-[11px] mt-2"
                      style={{
                        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                        fontWeight: 500,
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.type}
                    </p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ExpandOnHover = () => {
  const [tab, setTab] = useState<"film" | "tv">("film");
  const [hovered, setHovered] = useState(false);
  const [trailer, setTrailer] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTrailer(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openTrailer = (id: string, title: string) => setTrailer({ id, title });

  return (
    <div
      className="w-full flex flex-col items-center justify-center gap-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <GlassFilter />

      {/* Film / Television toggle */}
      <div
        className="flex gap-1 rounded-full p-1"
        style={{
          background: "rgba(255, 255, 255, 0.06)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {(["film", "tv"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="relative px-6 py-2 rounded-full transition-all duration-300"
            style={{
              fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
              fontSize: "11px",
              fontWeight: tab === t ? 600 : 400,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: tab === t ? "#fff" : "rgba(245, 240, 232, 0.45)",
              background: tab === t ? "rgba(255, 255, 255, 0.12)" : "transparent",
            }}
          >
            {t === "film" ? "Film" : "Television"}
          </button>
        ))}
      </div>

      <GlassEffect
        className="rounded-3xl p-3 transition-opacity duration-700"
        style={{
          opacity: hovered ? 1 : 0.5,
        }}
      >
        {tab === "film" ? (
          <CarouselRow items={FILMS} onTrailer={openTrailer} />
        ) : (
          <CarouselRow items={TV} onTrailer={openTrailer} />
        )}
      </GlassEffect>

      {trailer && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 md:p-10"
          onClick={() => setTrailer(null)}
          style={{ animation: "fadeIn 0.25s ease" }}
        >
          <div
            className="relative w-full max-w-6xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setTrailer(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm tracking-[0.3em] uppercase transition"
              style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif", fontWeight: 500 }}
            >
              Close ✕
            </button>
            <iframe
              className="w-full h-full rounded-xl shadow-2xl"
              src={`https://www.youtube-nocookie.com/embed/${trailer.id}?autoplay=1&rel=0&modestbranding=1`}
              title={`${trailer.title} — Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <p
              className="absolute -bottom-10 left-0 text-white/70 text-sm"
              style={{ fontFamily: "var(--font-display), Georgia, serif", fontStyle: "italic" }}
            >
              {trailer.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandOnHover;
