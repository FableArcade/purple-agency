"use client";

import React, { useEffect, useRef, useState } from "react";
import ExpandOnHover from "@/components/ui/expand-cards";
import ServiceWheel from "@/components/ui/service-wheel";
import { WebGLShaderBg } from "@/components/ui/web-gl-shader";
import HowItWorks from "@/components/ui/how-it-works";
import ContactSection from "@/components/ui/contact-section";
import { ParticleTextEffect } from "@/components/ui/interactive-text-particle";

declare const gsap: any;
declare const THREE: any;

const SLIDES = [
  {
    nav: "Home",
    title: "Purple",
    description: "AI Marketing Engine",
    media: "https://assets.codepen.io/7558/orange-portrait-001.jpg",
    content: {
      heading: "Marketing That Moves",
      body: "Strategy, content, creative, and campaigns\n— live in days, not weeks.\n\n80%+ produced by AI. 100% directed by humans.\nBuilt for startups. Priced on outcomes.",
    },
  },
  {
    nav: "Work",
    title: "Work",
    description: "Campaigns at AI speed.",
    media: "https://assets.codepen.io/7558/orange-portrait-002.jpg",
    content: {
      heading: "Built Fast. Built Right.",
      body: "15 ad variants. 5 email sequences.\n3 landing pages. Full social calendar.\n\n48 hours. Every cycle smarter than the last.",
    },
  },
  {
    nav: "Services",
    title: "Services",
    description: "Every channel, connected.",
    media: "https://assets.codepen.io/7558/orange-portrait-003.jpg",
    content: {
      heading: "",
      body: "",
    },
  },
  {
    nav: "How It Works",
    title: "How It Works",
    description: "Brief in. Campaign out.",
    media: "https://assets.codepen.io/7558/orange-portrait-004.jpg",
    content: {
      heading: "5 Days. Start to Live.",
      body: "Day 1 — Brief and positioning locked.\nDay 2–3 — Engine produces creative, emails, pages, social.\nDay 4 — Creative director curates. Channels configured.\nDay 5 — Live across Google, Meta, LinkedIn, email.\n\nEvery output grounded in your brand.\nNot generic AI slop.",
    },
  },
  {
    nav: "Contact",
    title: "Contact",
    description: "Let's build.",
    media: "https://assets.codepen.io/7558/orange-portrait-005.jpg",
    content: {
      heading: "Start Your Growth Sprint",
      body: "90 days. Strategy, content, and competitive intelligence\n— powered by an engine that gets smarter every cycle.\n\nYour startup deserves marketing\nthat moves as fast as you do.\n\nhello@purplepix.ai",
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
          vec2 mOff=uMouse*0.015;

          vec2 uv1=coverUV(vUv,uTex1Size)+mOff;
          vec2 uv2=coverUV(vUv,uTex2Size)+mOff;

          if(uMobile>0.5){
            // Mobile: clean crossfade, no distortion, no offset
            float fade=smoothstep(0.0,1.0,p);
            vec2 muv1=coverUV(vUv,uTex1Size);
            vec2 muv2=coverUV(vUv,uTex2Size);
            gl_FragColor=mix(texture2D(uTex1,muv1),texture2D(uTex2,muv2),fade);
          } else {
            // Desktop: ripple + chromatic aberration (no slide)
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

      // Scroll-driven zoom via CSS transform on canvas
      let zoomScale = 1;
      let zoomLastY = window.scrollY;

      const onZoomScroll = () => {
        if (isAnimating || locked) return;
        const delta = window.scrollY - zoomLastY;
        zoomLastY = window.scrollY;
        if (Math.abs(delta) > 2) {
          zoomScale = Math.min(1.03, zoomScale + Math.abs(delta) * 0.0003);
        }
      };
      window.addEventListener("scroll", onZoomScroll, { passive: true });

      // Only run zoom on mobile
      if (isMobile) {
        let lastAppliedZoom = 1;
        const zoomTick = () => {
          requestAnimationFrame(zoomTick);
          zoomScale += (1.0 - zoomScale) * 0.06;
          if (zoomScale < 1.001) zoomScale = 1;
          // Only update DOM when value actually changes
          if (!isAnimating && zoomScale !== lastAppliedZoom) {
            canvasEl.style.transform = `scale(${zoomScale})`;
            lastAppliedZoom = zoomScale;
          }
        };
        zoomTick();
      }

      // --- RENDER ---
      let animating = false;

      let mouseFrozen = false;

      const renderLoop = () => {
        if (!animating) return;
        requestAnimationFrame(renderLoop);
        if (!isMobile && !mouseFrozen) {
          const dx = mouse.x - mouse.sx;
          const dy = mouse.y - mouse.sy;
          // Deadzone — ignore tiny movements
          if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
            mouse.sx += dx * 0.03;
            mouse.sy += dy * 0.03;
          }
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
        document.getElementById("slideNumber")!.textContent = String(idx + 1).padStart(2, "0");

        // If going TO services (idx 2), show it immediately so beams cover the bg
        // If leaving services, hide current panel so ripple is visible
        if (idx === 2) {
          setActiveSlideRef.current(idx);
        } else {
          setActiveSlideRef.current(-1);
          setTimeout(() => {
            setActiveSlideRef.current(idx);
          }, duration * 900);
        }

        if (isMobile) {
          if (!textures[idx]) { isAnimating = false; return; }

          shaderMat.uniforms.uDirection.value = idx > currentSlide ? 1 : -1;
          shaderMat.uniforms.uTex1.value = textures[currentSlide];
          shaderMat.uniforms.uTex1Size.value = textures[currentSlide].userData.size;
          shaderMat.uniforms.uTex2.value = textures[idx];
          shaderMat.uniforms.uTex2Size.value = textures[idx].userData.size;

          zoomScale = 1;
          canvasEl.style.transform = "scale(1)";
          startRenderLoop();

          gsap.fromTo(shaderMat.uniforms.uProgress, { value: 0 }, {
            value: 1, duration, ease: "power2.inOut",
            onComplete: () => {
              shaderMat.uniforms.uProgress.value = 0;
              shaderMat.uniforms.uTex1.value = textures[idx];
              shaderMat.uniforms.uTex1Size.value = textures[idx].userData.size;
              mouse.sx = mouse.x; mouse.sy = mouse.y;
              shaderMat.uniforms.uMouse.value.set(mouse.sx, mouse.sy);
              renderer.render(scene, camera);
              stopRenderLoop();
              currentSlide = idx;
              isAnimating = false;
              zoomLastY = window.scrollY;
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
              mouse.sx = mouse.x; mouse.sy = mouse.y;
              shaderMat.uniforms.uMouse.value.set(mouse.sx, mouse.sy);
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
      document.getElementById("slideNumber")!.textContent = "01";
      document.getElementById("slideTotal")!.textContent = String(SLIDES.length).padStart(2, "0");

      // --- SCROLL DRIVEN ---
      const isMobileDevice = window.innerWidth < 768;
      const SECTION_H = () => window.innerHeight * (isMobileDevice ? 2 : 3);

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
      {/* Fixed background: canvas + WebGL */}
      <div className="slider-fixed-layer">
        <main className="slider-wrapper">
          <div className="mobile-bg" />
          <div className="mobile-bg-next" />
          <canvas className="webgl-canvas" />
          <span className="slide-number" id="slideNumber">01</span>
          <span className="slide-total" id="slideTotal">05</span>
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
            {i === 0 ? (
              <div className="fixed-slide-text">
                {/* Desktop: one line, Mobile: two lines */}
                <div className="hidden sm:block text-center mb-2">
                  <h1
                    className="text-6xl md:text-8xl font-bold flex items-center justify-center"
                    style={{ letterSpacing: "-0.02em", lineHeight: 1.2, paddingBottom: "0.15em" }}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                      Marketing That&nbsp;
                    </span>
                    <ParticleTextEffect
                      text="Moves"
                      colors={["ff6bd6", "c084fc", "60a5fa", "34d399", "fbbf24", "fb7185"]}
                      width={420}
                      height={180}
                      particleDensity={2}
                      animationForce={55}
                      className="inline-block cursor-pointer translate-y-1 -ml-12"
                    />
                  </h1>
                </div>
                <div className="sm:hidden text-center mb-2">
                  <h1
                    className="text-4xl font-bold"
                    style={{ letterSpacing: "-0.02em", lineHeight: 0.9 }}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                      Marketing That
                    </span>
                  </h1>
                  <div className="flex justify-center" style={{ marginTop: "0.2em" }}>
                    <ParticleTextEffect
                      text="Moves"
                      colors={["ff6bd6", "c084fc", "60a5fa", "34d399", "fbbf24", "fb7185"]}
                      width={200}
                      height={70}
                      particleDensity={3}
                      animationForce={55}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                <p className="text-base sm:text-lg md:text-xl text-white/70 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto text-center mt-0">
                  AI engine. Human direction. Campaigns live in days.
                </p>
              </div>
            ) : i === 1 ? (
              <ExpandOnHover />
            ) : i === 2 ? (
              <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: "100vh" }}>
                <WebGLShaderBg />
                <div className="relative z-10">
                  <ServiceWheel />
                </div>
              </div>
            ) : i === 3 ? (
              <HowItWorks />
            ) : i === 4 ? (
              <ContactSection />
            ) : (
              <div className="fixed-slide-text">
                <h2 className="scroll-section-heading">{sl.content.heading}</h2>
                <p
                  className="scroll-section-text"
                  dangerouslySetInnerHTML={{
                    __html: sl.content.body.replace(/\n/g, "<br />"),
                  }}
                />
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
