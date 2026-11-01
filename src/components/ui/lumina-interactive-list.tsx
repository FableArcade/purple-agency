"use client";

import React, { useEffect, useRef, useState } from "react";
import ExpandOnHover from "@/components/ui/expand-cards";
import { GlassEffect, GlassFilter } from "@/components/ui/liquid-glass";

declare const gsap: any;

const NEWS_ARTICLES = [
  {
    headline: "Waititi Inks First-Look Deal With 20th\u00A0TV, FX\u00A0Prods. & Hulu",
    source: "Deadline",
    date: "November 2025",
    summary:
      "Taika Waititi has signed a first-look deal with 20th Television, FX Productions, and Hulu to develop new original projects. Under the pact, Waititi will develop and direct series with priority given to Disney Entertainment Television platforms.",
    url: "https://deadline.com/2025/11/taika-waititi-deal-20th-tv-fx-hulu-last-look-jason-kim-1236621919/",
  },
  {
    headline: "'Last Look' Fashion Comedy in Development at Hulu",
    source: "Deadline",
    date: "November 2025",
    summary:
      "A half-hour comedy co-created with Barry writer-producer Jason Kim. A modern upstairs/downstairs story set in a luxury fashion house — following the underdogs who make the fashions and the fabulous monsters who design them.",
    url: "https://deadline.com/2025/11/taika-waititi-deal-20th-tv-fx-hulu-last-look-jason-kim-1236621919/",
  },
  {
    headline: "'Very Young Frankenstein' Pilot at FX",
    source: "Deadline",
    date: "November 2025",
    summary:
      "Waititi directed and executive produced the FX pilot inspired by Mel Brooks' 1974 film, currently in contention for a series pickup at 20th Television.",
    url: "https://deadline.com/2025/11/taika-waititi-deal-20th-tv-fx-hulu-last-look-jason-kim-1236621919/",
  },
];

function NewsSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="w-full flex flex-col items-center gap-4 md:gap-6 px-4 md:px-10">
      <GlassFilter />
      <h2
        className="scroll-section-heading"
        style={{ maxWidth: "none", marginBottom: "0", fontSize: "clamp(1.8rem, 5vw, 6rem)" }}
      >
        In the Press
      </h2>
      <div className="flex flex-col gap-2 md:gap-4 w-full max-w-3xl">
        {NEWS_ARTICLES.map((article, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i}>
              {/* Mobile: collapsed accordion */}
              <div className="md:hidden">
                <GlassEffect className="rounded-xl">
                  <button
                    className="relative z-30 w-full text-left p-4 flex items-center justify-between gap-3"
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[9px] tracking-[0.3em] uppercase"
                          style={{
                            fontFamily: "var(--font-geist-sans)",
                            fontWeight: 500,
                            color: "rgba(245, 240, 232, 0.5)",
                          }}
                        >
                          {article.source}
                        </span>
                        <span
                          className="text-[9px]"
                          style={{
                            fontFamily: "var(--font-geist-sans)",
                            fontWeight: 400,
                            color: "rgba(245, 240, 232, 0.35)",
                          }}
                        >
                          {article.date}
                        </span>
                      </div>
                      <h3
                        className="text-sm text-white leading-snug"
                        style={{
                          fontFamily: "var(--font-display), Georgia, serif",
                          fontStyle: "italic",
                          fontWeight: 500,
                        }}
                      >
                        {article.headline}
                      </h3>
                    </div>
                    <span
                      className="text-white/40 text-lg flex-shrink-0 transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
                    >
                      ▾
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: isOpen ? "12rem" : "0" }}
                  >
                    <div className="relative z-30 px-4 pb-4 flex flex-col gap-2">
                      <p
                        className="text-xs leading-relaxed"
                        style={{
                          fontFamily: "var(--font-geist-sans)",
                          fontWeight: 400,
                          color: "rgba(245, 240, 232, 0.7)",
                        }}
                      >
                        {article.summary}
                      </p>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] tracking-[0.25em] uppercase self-start"
                        style={{
                          fontFamily: "var(--font-geist-sans)",
                          fontWeight: 600,
                          color: "rgba(245, 240, 232, 0.85)",
                          borderBottom: "1px solid rgba(245, 240, 232, 0.3)",
                          paddingBottom: "2px",
                        }}
                      >
                        Read on {article.source} →
                      </a>
                    </div>
                  </div>
                </GlassEffect>
              </div>

              {/* Desktop: full cards */}
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:block transition-transform hover:scale-[1.015]"
              >
                <GlassEffect className="rounded-2xl p-8">
                  <div className="relative z-30 flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className="text-[11px] tracking-[0.3em] uppercase"
                        style={{
                          fontFamily: "var(--font-geist-sans)",
                          fontWeight: 500,
                          color: "rgba(245, 240, 232, 0.5)",
                        }}
                      >
                        {article.source}
                      </span>
                      <span
                        className="text-[11px]"
                        style={{
                          fontFamily: "var(--font-geist-sans)",
                          fontWeight: 400,
                          color: "rgba(245, 240, 232, 0.35)",
                        }}
                      >
                        {article.date}
                      </span>
                    </div>
                    <h3
                      className="text-2xl text-white"
                      style={{
                        fontFamily: "var(--font-display), Georgia, serif",
                        fontStyle: "italic",
                        fontWeight: 500,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.15,
                      }}
                    >
                      {article.headline}
                    </h3>
                    <p
                      className="text-[0.95rem]"
                      style={{
                        fontFamily: "var(--font-geist-sans)",
                        fontWeight: 400,
                        lineHeight: 1.6,
                        color: "rgba(245, 240, 232, 0.7)",
                      }}
                    >
                      {article.summary}
                    </p>
                  </div>
                </GlassEffect>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
declare const THREE: any;

const SLIDES = [
  {
    nav: "Home",
    title: "Waititi Productions",
    description: "Bold, original film and television from voices Hollywood overlooks.",
    media: "/films/hero.webp",
    content: {
      heading: "Stories Told from the Edges",
      body: "Founded by Academy Award–winning filmmaker Taika\u00A0Waititi and led by Ishi\u00A0Metkar and Michelle\u00A0Chan, we build film and television that is sharp, irreverent, and unmistakably alive.",
    },
  },
  {
    nav: "About",
    title: "About",
    description: "Working-class, rural, indigenous, underrepresented — by design.",
    media: "/films/about.jpg",
    content: {
      heading: "Who We Are",
      body: "Waititi Productions is dedicated to producing bold, original film and television projects that spotlight voices and stories too often excluded from Hollywood — particularly those from working-class backgrounds and rural or underrepresented parts of the world.\n\nBy pairing sharp, irreverent storytelling with authentic cultural representation, we strive to create work that is both entertaining and deeply resonant — expanding access, building opportunity, and redefining whose stories get told on screen.",
    },
  },
  {
    nav: "Productions",
    title: "Productions",
    description: "Selected works — feature films and series.",
    media: "/films/productions.webp",
    content: {
      heading: "Selected Works",
      body: "",
    },
  },
  {
    nav: "News",
    title: "News",
    description: "What's in development, on set, and on screen.",
    media: "/films/news.webp",
    content: {
      heading: "In the Press",
      body: "",
    },
  },
];

export function Component() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const setActiveSlideRef = useRef(setActiveSlide);
  setActiveSlideRef.current = setActiveSlide;

  useEffect(() => {
    const loadScript = (src: string, globalName: string) =>
      new Promise<void>((res, rej) => {
        if ((window as any)[globalName]) { res(); return; }
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => setTimeout(() => res(), 100);
        s.onerror = () => rej(new Error(`Failed: ${src}`));
        document.head.appendChild(s);
      });

    const init = async () => {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js", "gsap");
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js", "THREE");

      let currentSlide = 0;
      let isAnimating = false;
      let shaderMat: any;
      let renderer: any;
      let scene: any;
      let camera: any;
      const textures: any[] = [];
      const mouse = { x: 0, y: 0, sx: 0, sy: 0 };

      // --- SHADERS ---
      const vertSrc = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
      const fragSrc = `
        uniform sampler2D uTex1, uTex2;
        uniform float uProgress, uDirection, uMobile;
        uniform vec2 uRes, uTex1Size, uTex2Size, uMouse;
        varying vec2 vUv;

        vec2 coverUV(vec2 uv, vec2 ts){
          vec2 s=uRes/ts; float sc=max(s.x,s.y);
          vec2 ss=ts*sc, off=(uRes-ss)*0.5;
          return (uv*uRes-off)/ss;
        }

        void main(){
          float p=uProgress;
          vec2 mOff=uMouse*0.03;

          vec2 uv1=coverUV(vUv,uTex1Size)+mOff;
          vec2 uv2=coverUV(vUv,uTex2Size)+mOff;

          if(uMobile>0.5){
            // Mobile: clean crossfade, no distortion, no offset
            float fade=smoothstep(0.0,1.0,p);
            vec2 muv1=coverUV(vUv,uTex1Size);
            vec2 muv2=coverUV(vUv,uTex2Size);
            gl_FragColor=mix(texture2D(uTex1,muv1),texture2D(uTex2,muv2),fade);
          } else {
            // Desktop: ripple + slide + chromatic aberration
            float d=uDirection;
            float p1=smoothstep(0.0,0.5,p);
            float p2=smoothstep(0.5,1.0,p);
            uv1+=vec2(0.0,p1*0.08*d);
            uv2-=vec2(0.0,(1.0-p2)*0.08*d);

            vec2 c=vec2(0.5);
            float dist=length(vUv-c);
            float wave=sin(dist*24.0-p*12.0)*0.05;
            float wf=p*1.4;
            wave*=exp(-pow(dist-wf,2.0)*8.0);
            wave*=smoothstep(0.0,0.15,p)*smoothstep(1.0,0.85,p);

            vec2 rd=(dist>0.0)?normalize(vUv-c):vec2(0.0);
            uv1+=rd*wave; uv2+=rd*wave*0.5;
            float ab=wave*0.3;

            vec4 col;
            if(p<0.5){
              col=vec4(texture2D(uTex1,uv1+rd*ab).r,texture2D(uTex1,uv1).g,texture2D(uTex1,uv1-rd*ab).b,1.0);
            } else {
              col=vec4(texture2D(uTex2,uv2+rd*ab*.3).r,texture2D(uTex2,uv2).g,texture2D(uTex2,uv2-rd*ab*.3).b,1.0);
            }
            gl_FragColor=col;
          }
        }
      `;

      // --- RENDERER ---
      const canvas = containerRef.current!.querySelector(".webgl-canvas") as HTMLCanvasElement;
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
      const isMobile = window.innerWidth < 768;
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));

      shaderMat = new THREE.ShaderMaterial({
        uniforms: {
          uTex1: { value: null }, uTex2: { value: null },
          uProgress: { value: 0 }, uDirection: { value: 1 },
          uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uTex1Size: { value: new THREE.Vector2(1, 1) },
          uTex2Size: { value: new THREE.Vector2(1, 1) },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uMobile: { value: 0.0 },
        },
        vertexShader: vertSrc, fragmentShader: fragSrc,
      });
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMat));

      // --- LOAD TEXTURES ---
      const loader = new THREE.TextureLoader();
      for (const sl of SLIDES) {
        try {
          const t: any = await new Promise((res, rej) => loader.load(sl.media, res, undefined, rej));
          t.minFilter = t.magFilter = THREE.LinearFilter;
          t.userData = { size: new THREE.Vector2(t.image.width, t.image.height) };
          textures.push(t);
        } catch { textures.push(null); }
      }

      if (textures[0]) {
        shaderMat.uniforms.uTex1.value = textures[0];
        shaderMat.uniforms.uTex1Size.value = textures[0].userData.size;
      }
      containerRef.current!.querySelector(".slider-wrapper")!.classList.add("loaded");

      const canvasEl = canvas;

      canvasEl.style.transform = "scale(1)";

      // --- RENDER ---
      let animating = false;

      const renderLoop = () => {
        if (!animating) return;
        requestAnimationFrame(renderLoop);
        if (!isMobile) {
          mouse.sx += (mouse.x - mouse.sx) * 0.05;
          mouse.sy += (mouse.y - mouse.sy) * 0.05;
          shaderMat.uniforms.uMouse.value.set(mouse.sx, mouse.sy);
        }
        renderer.render(scene, camera);
      };

      const startRenderLoop = () => {
        if (!animating) { animating = true; renderLoop(); }
      };
      const stopRenderLoop = () => { animating = false; };

      // Initial render
      renderer.render(scene, camera);
      if (!isMobile) {
        animating = true;
        renderLoop();
      }

      // --- NAVIGATE ---
      const goToSlide = (idx: number, duration = 0.9) => {
        if (isAnimating || idx === currentSlide) return;
        isAnimating = true;

        // Update nav
        document.querySelectorAll(".slide-nav-item").forEach((el, i) => {
          el.classList.toggle("active", i === idx);
          const fill = el.querySelector(".slide-progress-fill") as HTMLElement;
          if (fill) { fill.style.width = i === idx ? "100%" : "0%"; }
        });
        const numEl = document.getElementById("slideNumber");
        if (numEl) numEl.textContent = String(idx + 1).padStart(2, "0");

        // Switch text content at midpoint
        setTimeout(() => {
          setActiveSlideRef.current(idx);
        }, duration * 400);

        if (isMobile) {
          if (!textures[idx]) { isAnimating = false; return; }

          shaderMat.uniforms.uDirection.value = idx > currentSlide ? 1 : -1;
          shaderMat.uniforms.uTex1.value = textures[currentSlide];
          shaderMat.uniforms.uTex1Size.value = textures[currentSlide].userData.size;
          shaderMat.uniforms.uTex2.value = textures[idx];
          shaderMat.uniforms.uTex2Size.value = textures[idx].userData.size;

          startRenderLoop();

          gsap.fromTo(shaderMat.uniforms.uProgress, { value: 0 }, {
            value: 1, duration, ease: "power2.inOut",
            onComplete: () => {
              shaderMat.uniforms.uProgress.value = 0;
              shaderMat.uniforms.uTex1.value = textures[idx];
              shaderMat.uniforms.uTex1Size.value = textures[idx].userData.size;
              // Render final frame and stop loop
              renderer.render(scene, camera);
              stopRenderLoop();
              currentSlide = idx;
              isAnimating = false;
            },
          });
        } else {
          // DESKTOP: WebGL ripple transition
          if (!textures[idx]) return;
          const dir = idx > currentSlide ? 1 : -1;
          shaderMat.uniforms.uDirection.value = dir;
          shaderMat.uniforms.uTex1.value = textures[currentSlide];
          shaderMat.uniforms.uTex1Size.value = textures[currentSlide].userData.size;
          shaderMat.uniforms.uTex2.value = textures[idx];
          shaderMat.uniforms.uTex2Size.value = textures[idx].userData.size;

          gsap.fromTo(shaderMat.uniforms.uProgress, { value: 0 }, {
            value: 1, duration, ease: "power2.inOut",
            onComplete: () => {
              shaderMat.uniforms.uProgress.value = 0;
              shaderMat.uniforms.uTex1.value = textures[idx];
              shaderMat.uniforms.uTex1Size.value = textures[idx].userData.size;
              currentSlide = idx;
              isAnimating = false;
            },
          });
        }

        // Scroll to matching section
        lockScroll();
        setTimeout(() => unlockScroll(idx), 600);
      };

      // --- NAV ---
      const nav = document.getElementById("slidesNav")!;
      SLIDES.forEach((sl, i) => {
        const item = document.createElement("div");
        item.className = `slide-nav-item${i === 0 ? " active" : ""}`;
        item.innerHTML = `<div class="slide-progress-line"><div class="slide-progress-fill" style="width:${i===0?"100%":"0%"}"></div></div><div class="slide-nav-title">${sl.nav}</div>`;
        item.addEventListener("click", () => goToSlide(i, 0.7));
        nav.appendChild(item);
      });

      // Init text
      document.getElementById("mainTitle")!.textContent = SLIDES[0].title;
      document.getElementById("mainDesc")!.textContent = SLIDES[0].description;

      // --- SCROLL DRIVEN ---
      const SECTION_H = () => window.innerHeight * 3;

      let locked = false;

      const lockScroll = () => {
        locked = true;
      };

      const unlockScroll = (slideIdx: number) => {
        const sH = SECTION_H();
        window.scrollTo({ top: slideIdx * sH + sH * 0.5, behavior: "auto" });
        setTimeout(() => { locked = false; }, 100);
      };

      const onScroll = () => {
        if (isAnimating || locked) return;
        const scrollY = window.scrollY;
        const sH = SECTION_H();
        const centerOfSection = currentSlide * sH + sH * 0.5;
        const distFromCenter = scrollY - centerOfSection;

        if (Math.abs(distFromCenter) > sH * 0.3) {
          const nextSlide = distFromCenter > 0
            ? Math.min(currentSlide + 1, SLIDES.length - 1)
            : Math.max(currentSlide - 1, 0);

          if (nextSlide !== currentSlide) {
            lockScroll();
            goToSlide(nextSlide, 0.9);
            setTimeout(() => unlockScroll(nextSlide), 1000);
          }
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      // Start at center of first section
      window.scrollTo({ top: SECTION_H() * 0.5, behavior: "auto" });

      // --- MOUSE (desktop) ---
      window.addEventListener("mousemove", (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
      });

      // Gyro is handled by React click handler (requestGyro) for iOS permission

      // --- RESIZE ---
      window.addEventListener("resize", () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        shaderMat.uniforms.uRes.value.set(window.innerWidth, window.innerHeight);
      });
    };

    init().catch(console.error);
  }, []);

  return (
    <div ref={containerRef} className="lumina-slider-root">
      <a href="#" className="studio-wordmark">
        <span className="dot" />
        Waititi Productions
        <span className="mark-sub">Est. MMXXIV</span>
      </a>
      <span className="studio-location">Los Angeles, California</span>
      {/* Fixed background: canvas + WebGL */}
      <div className="slider-fixed-layer">
        <main className="slider-wrapper">
          <div className="mobile-bg" />
          <div className="mobile-bg-next" />
          <canvas className="webgl-canvas" />
          <div className="slide-content">
            <h1 className="slide-title" id="mainTitle"></h1>
            <p className="slide-description" id="mainDesc"></p>
          </div>
        </main>
      </div>

      {/* Fixed center content — always visible, switches with active slide */}
      <div className="fixed-slide-content">
        {SLIDES.map((sl, i) => (
          <div
            key={i}
            className={`fixed-slide-panel ${activeSlide === i ? "active" : ""}`}
          >
            {i === 2 ? (
              <ExpandOnHover />
            ) : i === 3 ? (
              <NewsSection />
            ) : (
              <div className="fixed-slide-text">
                <h2 className="scroll-section-heading">{sl.content.heading}</h2>
                <p className="scroll-section-text">
                  {sl.content.body.split("\n").map((line, j, arr) => (
                    <React.Fragment key={j}>
                      {line}
                      {j < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Nav */}
      <nav className="slides-navigation" id="slidesNav"></nav>

      {/* Scroll spacer — just creates scroll height, no visible content */}
      <div className="slider-scroll-spacer">
        {SLIDES.map((_, i) => (
          <div key={i} className="slider-scroll-section" />
        ))}
      </div>
    </div>
  );
}
