"use client";

import { useEffect, useRef } from "react";

interface SectionVideoBackgroundProps {
  src: string;
}

export default function SectionVideoBackground({ src }: SectionVideoBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15, rootMargin: "80px 0px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-0">
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover [transform:translateZ(0)]"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-slate-950/50" />
      <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-slate-950/80 via-slate-950/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
    </div>
  );
}
