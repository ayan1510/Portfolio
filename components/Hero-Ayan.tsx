"use client";

import { useEffect, useState, useRef } from "react";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY >= 0) {
        setMounted(true);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    
    if (!video || !section) return;

    // Use Intersection Observer to detect when Hero section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Section is in view - play video
            video.play().catch((error) => {
              // Handle autoplay restrictions
              console.log("Video autoplay prevented:", error);
            });
          } else {
            // Section is out of view - pause video
            video.pause();
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of section is visible
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleResumeClick = () => {
    // You can add resume download logic here
    // For now, it will scroll to projects section
    scrollToSection("projects");
  };

  const handleMyWorkClick = () => {
    scrollToSection("projects");
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center justify-start px-4 sm:px-6 lg:px-8"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          playsInline
          muted={false}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/Untitled design.mp4" type="video/mp4" />
        </video>
        {/* Bottom gradient blend to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950 pointer-events-none z-10" />
      </div>

      {/* Content Overlay - Left Middle */}
      <div
        className={`relative z-10 max-w-6xl w-full section-reveal ${
          mounted ? "section-reveal-visible" : "section-reveal-hidden"
        }`}
      >
        <div className="flex flex-col items-start space-y-6 px-4 sm:px-8 lg:px-12">
          {/* Name */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
            AYAN
          </h1>

          {/* Title */}
          <p className="text-lg sm:text-xl lg:text-2xl text-white font-normal" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
            Frontend Developer
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={handleResumeClick}
              className="px-6 py-3 sm:px-8 sm:py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Resume
            </button>
            <button
              onClick={handleMyWorkClick}
              className="px-6 py-3 sm:px-8 sm:py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              My Work
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
