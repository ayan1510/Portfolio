"use client";

import React, { useState, useRef, MouseEvent } from "react";

interface Card3DTiltProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum rotation in degrees (default: 12)
  scale?: number;   // Scale on hover (default: 1.03)
}

export default function Card3DTilt({
  children,
  className = "",
  maxTilt = 12,
  scale = 1.03,
}: Card3DTiltProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [shineStyle, setShineStyle] = useState<React.CSSProperties>({
    opacity: 0,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card bounds
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize coordinates to range [-0.5, 0.5]
    const normalizedX = (mouseX / width) - 0.5;
    const normalizedY = (mouseY / height) - 0.5;

    // Calculate rotation angles
    // Moving mouse to the right (positive normalizedX) rotates around Y axis positively
    const rotateY = normalizedX * maxTilt * 2; // scale it slightly for better feel
    // Moving mouse down (positive normalizedY) rotates around X axis negatively
    const rotateX = -normalizedY * maxTilt * 2;

    // Update tilt transform (GPU accelerated)
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: "transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)",
    });

    // Update reflection glare position
    setShineStyle({
      opacity: 1,
      background: `radial-gradient(circle 250px at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.08), transparent 80%)`,
    });
  };

  const handleMouseLeave = () => {
    // Reset to flat/base state with smooth easing transition
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
    });
    setShineStyle({
      opacity: 0,
      transition: "opacity 0.6s ease",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden transition-all duration-300 ${className}`}
      style={{
        ...tiltStyle,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Inner wrapper to support child 3D layers using translateZ */}
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="h-full w-full">
        {children}
      </div>

      {/* Glossy reflective shine overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-30 mix-blend-overlay"
        style={shineStyle}
      />
    </div>
  );
}
