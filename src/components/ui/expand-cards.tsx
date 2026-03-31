"use client";

import { useState } from "react";
import { GlassEffect, GlassFilter } from "@/components/ui/liquid-glass";

const campaigns = [
  {
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80",
    brand: "Nike",
    type: "Brand Commercial",
  },
  {
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    brand: "Nike",
    type: "Product Launch",
  },
  {
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    brand: "DW",
    type: "Lifestyle Campaign",
  },
  {
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    brand: "Sony",
    type: "Product Film",
  },
  {
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
    brand: "Ray-Ban",
    type: "Brand Identity",
  },
  {
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80",
    brand: "Polaroid",
    type: "Social Campaign",
  },
  {
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
    brand: "Nike",
    type: "Digital Experience",
  },
  {
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80",
    brand: "Glossier",
    type: "Brand Commercial",
  },
  {
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80",
    brand: "Beats",
    type: "Product Launch",
  },
];

const ExpandOnHover = () => {
  const [expandedImage, setExpandedImage] = useState(4);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="w-full flex items-center justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ touchAction: "pan-x" }}
    >
      <GlassFilter />
      <GlassEffect
        className="rounded-3xl p-3 transition-opacity duration-700"
        style={{
          opacity: hovered ? 1 : 0.5,
        }}
      >
        <div
          className="relative w-[85vw] md:w-full md:max-w-6xl overflow-x-scroll scrollbar-hide rounded-2xl"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex items-center gap-1 w-max md:w-full md:justify-center">
            {campaigns.map((item, idx) => {
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
                  onTouchStart={() => setExpandedImage(idx + 1)}
                >
                  <img
                    className="w-full h-full object-cover"
                    src={item.image}
                    alt={`${item.brand} ${item.type}`}
                  />
                  {isExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                      <p
                        className="text-white text-2xl md:text-3xl tracking-tight"
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontWeight: 700,
                        }}
                      >
                        {item.brand}
                      </p>
                      <p
                        className="text-white/50 text-xs md:text-sm tracking-widest uppercase mt-1"
                        style={{
                          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                          fontWeight: 300,
                        }}
                      >
                        {item.type}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </GlassEffect>
    </div>
  );
};

export default ExpandOnHover;
