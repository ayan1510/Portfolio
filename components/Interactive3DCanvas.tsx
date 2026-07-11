"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  speed: number;
}

export default function Interactive3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef({ y: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    const particleCount = 120;
    const maxDepth = 1000;
    const fov = 350;

    const colors = [
      "rgba(56, 189, 248, ",  // Sky Blue
      "rgba(147, 51, 234, ",  // Purple
      "rgba(236, 72, 153, ",  // Pink
      "rgba(99, 102, 241, ",  // Indigo
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initParticles = () => {
      particles = [];
      const width = window.innerWidth;
      const height = window.innerHeight;
      const spread = Math.max(width, height) * 1.2;

      for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * spread;
        const y = (Math.random() - 0.5) * spread;
        const z = Math.random() * maxDepth;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 1.5 + 0.8;
        const speed = Math.random() * 0.2 + 0.05;

        particles.push({
          x,
          y,
          z,
          color,
          size,
          baseX: x,
          baseY: y,
          baseZ: z,
          speed,
        });
      }
    };

    resizeCanvas();
    initParticles();

    window.addEventListener("resize", () => {
      resizeCanvas();
      initParticles();
    });

    // Mouse movement listener
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to [-0.5, 0.5]
      mouseRef.current.targetX = (e.clientX / window.innerWidth) - 0.5;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) - 0.5;
    };

    // Scroll listener
    const handleScroll = () => {
      scrollRef.current.targetY = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Slow rotation over time
    let time = 0;

    const animate = () => {
      time += 0.0015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // Smooth mouse coordinates
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Smooth scroll value
      const scroll = scrollRef.current;
      scroll.y += (scroll.targetY - scroll.y) * 0.08;

      // Calculate camera rotation angles based on mouse
      // Yaw (around Y axis) and Pitch (around X axis)
      const angleY = mouse.x * 0.15 + Math.sin(time * 0.2) * 0.02;
      const angleX = mouse.y * 0.15 + Math.cos(time * 0.1) * 0.01;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // Scroll speed modifier (how much scrolling moves particles in Z space)
      const scrollZOffset = scroll.y * 0.8;

      // Array to keep projected 2D coordinates for rendering lines
      const projected: { x: number; y: number; z: number; size: number; opacity: number; color: string }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Constant drift forward & scroll response
        // Scroll pushes particles closer (decreasing z makes them appear closer)
        let z = p.baseZ - (time * 200 * p.speed + scrollZOffset) % maxDepth;
        if (z < 0) z += maxDepth;

        let x = p.baseX;
        let y = p.baseY;

        // 2. 3D Rotations
        // Rotate around Y axis (Yaw)
        let x1 = x * cosY - z * sinY;
        let z1 = x * sinY + z * cosY;

        // Rotate around X axis (Pitch)
        let y2 = y * cosX - z1 * sinX;
        let z2 = y * sinX + z1 * cosX;

        // 3. Perspective Projection
        const scale = fov / (fov + z2);
        const screenX = centerX + x1 * scale;
        const screenY = centerY + y2 * scale;

        // Depth fading calculations
        let opacity = 1;
        if (z2 < 100) {
          // Fade out as it gets extremely close to camera
          opacity = z2 / 100;
        } else if (z2 > maxDepth - 200) {
          // Fade out in the distance
          opacity = (maxDepth - z2) / 200;
        }
        opacity = Math.max(0, Math.min(1, opacity)) * 0.45; // Max opacity 0.45

        if (screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height) {
          projected.push({
            x: screenX,
            y: screenY,
            z: z2,
            size: p.size * scale * 1.2,
            opacity,
            color: p.color,
          });

          // Draw the particle
          ctx.beginPath();
          ctx.arc(screenX, screenY, p.size * scale * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${opacity})`;
          ctx.fill();

          // Subtly draw particle glow
          if (p.size > 1.8 && opacity > 0.2) {
            ctx.beginPath();
            ctx.arc(screenX, screenY, p.size * scale * 3, 0, Math.PI * 2);
            ctx.fillStyle = `${p.color}${opacity * 0.25})`;
            ctx.fill();
          }
        }
      }

      // Draw connection lines between nearby particles
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];

          // Calculate 3D distance
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Only connect particles that are close on screen AND have similar depths
          if (dist < 100 && Math.abs(p1.z - p2.z) < 150) {
            const lineOpacity = (1 - dist / 100) * Math.min(p1.opacity, p2.opacity) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Create a gradient line between the two particle colors
            const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            grad.addColorStop(0, `${p1.color}${lineOpacity})`);
            grad.addColorStop(1, `${p2.color}${lineOpacity})`);
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.6 * (fov / (fov + p1.z));
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-transparent"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
