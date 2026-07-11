"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;

    if (!video || !section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleResumeClick = () => {
    scrollToSection("projects");
  };

  const handleMyWorkClick = () => {
    scrollToSection("video-editing");
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center justify-start pl-10 sm:pl-16 lg:pl-24 xl:pl-32 pr-4 sm:pr-6 lg:pr-8 overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover [transform:translateZ(0)]"
        >
          <source src="/Untitled design.mp4" type="video/mp4" />
        </video>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950 pointer-events-none z-10" />
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        <div className="flex flex-col items-start space-y-6">
          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl xl:text-[7rem] font-bold uppercase tracking-[0.18em] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.45)]">
            AYAN
          </h1>

          <ul
            className="text-slate-300 text-sm sm:text-base max-w-md font-light leading-relaxed space-y-2 list-disc list-inside"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            <li>Web Development & Digital Solutions</li>
            <li>Photography & Videography</li>
            <li>Social Media, Branding & Creative Strategy</li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
            <button
              onClick={handleResumeClick}
              className="px-6 py-3 sm:px-8 sm:py-4 border-2 border-white/80 text-white rounded-xl font-semibold hover:bg-white/10 hover:border-white transition-all duration-200 backdrop-blur-sm shadow-md"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Resume
            </button>
            <button
              onClick={handleMyWorkClick}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-slate-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-200"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              My Work
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
