"use client";

import { useState } from "react";
import { GlassEffect, GlassFilter } from "@/components/ui/liquid-glass";

const campaigns = [
  {
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80",
    label: "Nike — Phantom",
  },
  {
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    label: "Nike — Air Max",
  },
  {
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    label: "Minimal — Watch",
  },
  {
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    label: "Sony — Headphones",
  },
  {
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
    label: "Ray-Ban — Aviator",
  },
  {
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80",
    label: "Polaroid — Snap",
  },
  {
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
    label: "Nike — React",
  },
  {
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80",
    label: "Skincare — Glow",
  },
  {
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80",
    label: "Beats — Studio",
  },
];

const ExpandOnHover = () => {
  const [expandedImage, setExpandedImage] = useState(4);
  const [hovered, setHovered] = useState(false);

  const getImageWidth = (index: number) =>
    index === expandedImage ? "24rem" : "5rem";

  return (
    <div
      className="w-full flex items-center justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <GlassFilter />
      <GlassEffect
        className="rounded-3xl p-3 transition-all duration-700"
        style={{
          opacity: hovered ? 1 : 0.4,
          background: hovered ? "rgba(255,255,255,0.08)" : "transparent",
        }}
      >
        <div className="relative w-full max-w-6xl overflow-x-auto">
          <div className="flex w-full items-center justify-center gap-1 md:flex-nowrap">
            {campaigns.map((item, idx) => (
              <div
                key={idx}
                className="relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-500 ease-in-out"
                style={{
                  width: getImageWidth(idx + 1),
                  height: "24rem",
                }}
                onMouseEnter={() => setExpandedImage(idx + 1)}
              >
                <img
                  className="w-full h-full object-cover"
                  src={item.image}
                  alt={item.label}
                />
                {idx + 1 === expandedImage && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-white text-sm font-light tracking-wider">
                      {item.label}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </GlassEffect>
    </div>
  );
};

export default ExpandOnHover;
