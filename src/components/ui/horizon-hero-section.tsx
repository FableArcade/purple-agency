"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

gsap.registerPlugin(ScrollTrigger);

export const Component = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const totalSections = 3;

  const scrollTarget = useRef(0);
  const scrollCurrent = useRef(0);

  const threeRefs = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    composer: EffectComposer | null;
    animationId: number | null;
    cameraPath: THREE.CatmullRomCurve3 | null;
    cameraLookPath: THREE.CatmullRomCurve3 | null;
    nebulaParticles: THREE.Points[];
    starFields: THREE.Points[];
  }>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    animationId: null,
    cameraPath: null,
    cameraLookPath: null,
    nebulaParticles: [],
    starFields: [],
  });

  useEffect(() => {
    const refs = threeRefs.current;

    // Scene
    refs.scene = new THREE.Scene();

    // Camera
    refs.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    );

    // Renderer
    refs.renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current!,
      antialias: true,
      alpha: false,
    });
    refs.renderer.setSize(window.innerWidth, window.innerHeight);
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
    refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    refs.renderer.toneMappingExposure = 0.8;

    // Post-processing
    refs.composer = new EffectComposer(refs.renderer);
    refs.composer.addPass(new RenderPass(refs.scene, refs.camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.0,
      0.4,
      0.75
    );
    refs.composer.addPass(bloom);

    // === SKYBOX: photo-textured sphere ===
    const textureLoader = new THREE.TextureLoader();
    const skyTexture = textureLoader.load("/cosmos-bg.jpg");
    skyTexture.colorSpace = THREE.SRGBColorSpace;
    const skyGeo = new THREE.SphereGeometry(2000, 64, 64);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTexture,
      side: THREE.BackSide,
      fog: false,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    refs.scene.add(sky);

    // === STAR FIELD: distributed along the flight path ===
    const createStars = (
      count: number,
      spread: number,
      zMin: number,
      zMax: number,
      sizeRange: [number, number]
    ) => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.6;
        pos[i * 3 + 2] = zMin + Math.random() * (zMax - zMin);

        const c = new THREE.Color();
        const r = Math.random();
        if (r < 0.6) c.setHSL(0, 0, 0.85 + Math.random() * 0.15);
        else if (r < 0.8) c.setHSL(0.6, 0.4, 0.85);
        else if (r < 0.9) c.setHSL(0.08, 0.6, 0.9);
        else c.setHSL(0.85, 0.4, 0.85);

        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
        sizes[i] = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
      }

      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      const mat = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          varying float vDist;
          uniform float time;
          void main() {
            vColor = color;
            vec3 p = position;
            p.x += sin(time * 0.2 + position.z * 0.01) * 0.5;
            p.y += cos(time * 0.15 + position.x * 0.01) * 0.3;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            vDist = -mv.z;
            gl_PointSize = size * (250.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vDist;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float glow = exp(-d * 6.0);
            float core = smoothstep(0.15, 0.0, d);
            float alpha = glow * 0.6 + core * 0.8;
            vec3 col = vColor + core * 0.3;
            gl_FragColor = vec4(col, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const points = new THREE.Points(geo, mat);
      refs.scene!.add(points);
      refs.starFields.push(points);
      return points;
    };

    // Stars distributed along the entire camera path
    createStars(15000, 600, 200, -2500, [1.5, 4]);
    createStars(8000, 1200, 200, -2500, [0.5, 1.5]);
    createStars(3000, 300, -200, -1800, [3, 6]);

    // === NEBULA CLOUDS: 3D billboard sprites ===
    const createNebulaCloud = (
      x: number,
      y: number,
      z: number,
      size: number,
      color: THREE.Color,
      opacity: number
    ) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d")!;
      const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      gradient.addColorStop(0, `rgba(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)}, ${opacity})`);
      gradient.addColorStop(0.4, `rgba(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)}, ${opacity * 0.4})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);

      const texture = new THREE.CanvasTexture(canvas);
      const mat = new THREE.SpriteMaterial({
        map: texture,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(x, y, z);
      sprite.scale.set(size, size, 1);
      refs.scene!.add(sprite);
      return sprite;
    };

    // Scatter nebula clouds along the path
    const nebulaColors = [
      new THREE.Color(0x1a44ff),
      new THREE.Color(0xff2277),
      new THREE.Color(0x6622cc),
      new THREE.Color(0x0088ff),
      new THREE.Color(0xff4488),
      new THREE.Color(0x2244aa),
    ];

    for (let i = 0; i < 60; i++) {
      const z = -100 + Math.random() * -2000;
      const x = (Math.random() - 0.5) * 800;
      const y = (Math.random() - 0.5) * 400;
      const size = 150 + Math.random() * 400;
      const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
      createNebulaCloud(x, y, z, size, color, 0.08 + Math.random() * 0.12);
    }

    // === TERRAIN: 3D mountain geometry along the path ===
    const createTerrain = (zPos: number, color: number, heightScale: number) => {
      const geo = new THREE.PlaneGeometry(1200, 400, 128, 64);
      const positions = geo.attributes.position;

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        // Generate mountain-like terrain
        const height =
          Math.sin(x * 0.008) * heightScale * 0.6 +
          Math.sin(x * 0.02 + 1.5) * heightScale * 0.3 +
          Math.cos(x * 0.005 + y * 0.01) * heightScale * 0.4 +
          Math.sin(x * 0.05) * heightScale * 0.1;
        // Fade out at edges
        const edgeFade = 1 - Math.pow(Math.abs(y) / 200, 2);
        positions.setZ(i, Math.max(0, height * Math.max(0, edgeFade)));
      }

      geo.computeVertexNormals();

      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.9,
        metalness: 0.1,
        flatShading: true,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI * 0.5;
      mesh.position.set(0, -80, zPos);
      refs.scene!.add(mesh);
    };

    createTerrain(0, 0x0a0a1a, 80);
    createTerrain(-500, 0x0d1025, 100);
    createTerrain(-1000, 0x101530, 120);
    createTerrain(-1600, 0x0a1228, 90);

    // === LIGHTING ===
    const ambient = new THREE.AmbientLight(0x222244, 0.5);
    refs.scene.add(ambient);

    const blueLight = new THREE.PointLight(0x4488ff, 3, 800);
    blueLight.position.set(100, 50, -400);
    refs.scene.add(blueLight);

    const pinkLight = new THREE.PointLight(0xff2266, 2, 600);
    pinkLight.position.set(-150, 80, -900);
    refs.scene.add(pinkLight);

    const whiteLight = new THREE.PointLight(0xffffff, 1.5, 500);
    whiteLight.position.set(0, 100, -1500);
    refs.scene.add(whiteLight);

    // === CAMERA PATH: smooth spline through the scene ===
    refs.cameraPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 30, 150),
      new THREE.Vector3(10, 40, -100),
      new THREE.Vector3(-20, 50, -400),
      new THREE.Vector3(30, 35, -700),
      new THREE.Vector3(-10, 60, -1100),
      new THREE.Vector3(0, 45, -1500),
      new THREE.Vector3(15, 55, -1900),
    ]);

    refs.cameraLookPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 20, -100),
      new THREE.Vector3(0, 25, -400),
      new THREE.Vector3(0, 30, -700),
      new THREE.Vector3(0, 25, -1000),
      new THREE.Vector3(0, 35, -1400),
      new THREE.Vector3(0, 30, -1800),
      new THREE.Vector3(0, 40, -2200),
    ]);

    // === ANIMATION LOOP ===
    const animate = () => {
      refs.animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      // Smooth scroll interpolation
      scrollCurrent.current += (scrollTarget.current - scrollCurrent.current) * 0.04;
      const t = Math.max(0, Math.min(1, scrollCurrent.current));

      // Move camera along path
      if (refs.cameraPath && refs.cameraLookPath && refs.camera) {
        const pos = refs.cameraPath.getPointAt(t);
        const look = refs.cameraLookPath.getPointAt(t);

        // Add gentle floating motion
        pos.x += Math.sin(time * 0.15) * 2;
        pos.y += Math.cos(time * 0.12) * 1.5;

        refs.camera.position.copy(pos);
        refs.camera.lookAt(look);
      }

      // Animate star twinkle
      refs.starFields.forEach((sf) => {
        const mat = sf.material as THREE.ShaderMaterial;
        if (mat.uniforms) mat.uniforms.time.value = time;
      });

      // Rotate skybox slowly
      sky.rotation.y = time * 0.01;
      sky.rotation.x = Math.sin(time * 0.005) * 0.05;

      if (refs.composer) refs.composer.render();
    };

    animate();
    setIsReady(true);

    // Resize
    const handleResize = () => {
      if (refs.camera && refs.renderer && refs.composer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.composer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      window.removeEventListener("resize", handleResize);
      refs.renderer?.dispose();
    };
  }, []);

  // GSAP entrance animations
  useEffect(() => {
    if (!isReady) return;

    gsap.set(
      [menuRef.current, titleRef.current, subtitleRef.current, scrollProgressRef.current],
      { visibility: "visible" }
    );

    const tl = gsap.timeline();

    if (menuRef.current) {
      tl.from(menuRef.current, { x: -100, opacity: 0, duration: 1, ease: "power3.out" });
    }
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll(".title-char");
      tl.from(chars, { y: 200, opacity: 0, duration: 1.5, stagger: 0.05, ease: "power4.out" }, "-=0.5");
    }
    if (subtitleRef.current) {
      const lines = subtitleRef.current.querySelectorAll(".subtitle-line");
      tl.from(lines, { y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out" }, "-=0.8");
    }
    if (scrollProgressRef.current) {
      tl.from(scrollProgressRef.current, { opacity: 0, y: 50, duration: 1, ease: "power2.out" }, "-=0.5");
    }

    return () => { tl.kill(); };
  }, [isReady]);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / maxScroll, 1);

      scrollTarget.current = progress;
      setScrollProgress(progress);
      setCurrentSection(Math.min(Math.floor(progress * totalSections), totalSections - 1));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalSections]);

  return (
    <div ref={containerRef} className="hero-container cosmos-style">
      <canvas ref={canvasRef} className="hero-canvas" />

      <div ref={menuRef} className="side-menu" style={{ visibility: "hidden" }}>
        <div className="menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="vertical-text">PURPLE</div>
      </div>

      <div className="hero-content cosmos-content">
        <h1 ref={titleRef} className="hero-title">
          {"PURPLE".split("").map((char, i) => (
            <span key={i} className="title-char">{char}</span>
          ))}
        </h1>
        <div ref={subtitleRef} className="hero-subtitle cosmos-subtitle">
          <p className="subtitle-line">AI-powered advertising that transcends,</p>
          <p className="subtitle-line">the boundaries of what&apos;s possible</p>
        </div>
      </div>

      <div ref={scrollProgressRef} className="scroll-progress" style={{ visibility: "hidden" }}>
        <div className="scroll-text">SCROLL</div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${scrollProgress * 100}%` }} />
        </div>
        <div className="section-counter">
          {String(currentSection + 1).padStart(2, "0")} / {String(totalSections).padStart(2, "0")}
        </div>
      </div>

      <div className="scroll-sections">
        {[
          { title: "CREATE", line1: "From concept to campaign in seconds,", line2: "your brand story told by intelligence" },
          { title: "AMPLIFY", line1: "Scale your creative vision infinitely,", line2: "with AI that understands your audience" },
        ].map((section, i) => (
          <section key={i} className="content-section">
            <h1 className="hero-title">{section.title}</h1>
            <div className="hero-subtitle cosmos-subtitle">
              <p className="subtitle-line">{section.line1}</p>
              <p className="subtitle-line">{section.line2}</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
