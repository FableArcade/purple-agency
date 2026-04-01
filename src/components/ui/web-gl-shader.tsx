"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function WebGLShaderBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer | null;
    uniforms: any;
    animationId: number | null;
  }>({
    renderer: null,
    uniforms: null,
    animationId: null,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const refs = sceneRef.current;

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

        float d = length(p) * distortion;

        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
        float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
        float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);

        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `;

    const scene = new THREE.Scene();
    refs.renderer = new THREE.WebGLRenderer({ canvas });
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    refs.renderer.setClearColor(new THREE.Color(0x000000));

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

    refs.uniforms = {
      resolution: { value: [canvas.offsetWidth, canvas.offsetHeight] },
      time: { value: 0.0 },
      xScale: { value: 1.0 },
      yScale: { value: 0.5 },
      distortion: { value: 0.05 },
    };

    const positions = new THREE.BufferAttribute(
      new Float32Array([
        -1, -1, 0, 1, -1, 0, -1, 1, 0,
        1, -1, 0, -1, 1, 0, 1, 1, 0,
      ]),
      3
    );
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", positions);

    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: refs.uniforms,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      refs.renderer.setSize(w, h, false);
      refs.uniforms.resolution.value = [w, h];
    };

    handleResize();

    const animate = () => {
      if (refs.uniforms) refs.uniforms.time.value += 0.01;
      if (refs.renderer) refs.renderer.render(scene, camera);
      refs.animationId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("resize", handleResize);

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      refs.renderer?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
