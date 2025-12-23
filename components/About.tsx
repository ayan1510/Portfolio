"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

interface StatCardProps {
  value: string;
  label: string;
  delay: number;
  color: "sky" | "purple" | "pink";
}

function StatCard({ value, label, delay, color }: StatCardProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const colorClasses = {
    sky: "text-sky-300",
    purple: "text-purple-300",
    pink: "text-pink-300",
  };

  useEffect(() => {
    if (!isInView) return;

    const numericValue = parseInt(value.replace(/\D/g, ""));
    const suffix = value.replace(/\d/g, "");
    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      className="group relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-800/40 p-6 text-center backdrop-blur-sm transition-all duration-500 hover:border-sky-500/50 hover:shadow-[0_20px_60px_rgba(56,189,248,0.3)]"
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{ scale: 1.05, y: -8 }}
    >
      <div className="relative z-10">
        <motion.div
          className={`text-4xl font-bold mb-2 ${colorClasses[color]}`}
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{
            delay: delay + 0.3,
            type: "spring",
            stiffness: 200,
          }}
        >
          {count}
          {value.replace(/\d/g, "")}
        </motion.div>
        <div className="text-slate-300 font-medium">{label}</div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-sky-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500" />
    </motion.div>
  );
}

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: i * 0.03,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
  };

  const title = "About Me";
  const titleArray = title.split("");

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current
        .play()
        .catch(() => {
          /* autoplay may fail; user can click video or unmute */
        });
    }
  }, []);

  // Unmute when About section is in view, mute when scrolled away
  useEffect(() => {
    const section = containerRef.current;
    const video = videoRef.current;

    if (!section || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Section is in view - unmute video
            video.muted = false;
          } else {
            // Section is out of view - mute video
            video.muted = true;
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

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative">
            {/* Animated Title */}
            <div className="mb-12 text-left">
          <motion.h2
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-slate-50"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            style={{ perspective: 1000, fontFamily: 'var(--font-inter), sans-serif' }}
          >
            <span className="inline-block">
              {titleArray.map((letter, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  custom={i}
                  variants={letterVariants}
                  whileHover={{
                    scale: 1.2,
                    y: -10,
                    color: "#60a5fa",
                    transition: { duration: 0.2 },
                  }}
                  style={{ display: "inline-block" }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </span>
          </motion.h2>
          <motion.div
            className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
            </div>

            <div className="max-w-3xl">
              {/* Content */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="space-y-8"
              >
            {/* Introduction Text */}
            <div className="space-y-6 text-lg text-slate-300 leading-relaxed" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
              <motion.p
                custom={0}
                variants={textVariants}
                className="text-xl text-slate-200 font-medium"
              >
                I'm <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400">Ayan Mondal</span>, a passionate <span className="font-semibold text-purple-400">Frontend Developer</span> from{" "}
                <span className="font-semibold text-sky-400">Kolkata</span>, dedicated to crafting beautiful, responsive, and high-performance web experiences using modern technologies like React, Next.js, and TypeScript.
              </motion.p>
              <motion.p
                custom={1}
                variants={textVariants}
                className="font-normal"
              >
                I recently completed a <span className="font-semibold text-purple-400">3-month internship</span> as a Frontend Developer at{" "}
                <motion.span
                  className="font-semibold text-sky-400 inline-block"
                  whileHover={{ scale: 1.1, x: 5 }}
                >
                  easy1pay.in
                </motion.span>
                , where I gained hands-on experience building interactive UI components, implementing responsive designs, and collaborating with cross-functional teams to deliver seamless user experiences. This experience helped me refine my skills in component architecture, state management, and performance optimization.
              </motion.p>
              <motion.p
                custom={2}
                variants={textVariants}
                className="font-normal"
              >
                I'm passionate about creating intuitive interfaces that not only look great but also provide exceptional user experiences. Whether it's building dynamic dashboards, crafting smooth animations, or ensuring pixel-perfect responsiveness across devices, I approach every project with attention to detail and a commitment to writing clean, maintainable code.
              </motion.p>
            </div>

            {/* Stats Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <StatCard value="20+" label="Projects Completed" delay={0.5} color="purple" />
              <StatCard value="10+" label="Happy Clients" delay={0.6} color="pink" />
            </motion.div>

            {/* Skills Tags */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB"].map(
                (skill, i) => (
                  <motion.span
                    key={skill}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-700/50 text-slate-300 text-sm font-medium backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.9 + i * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{
                      scale: 1.1,
                      borderColor: "#60a5fa",
                      color: "#60a5fa",
                      boxShadow: "0 0 20px rgba(96, 165, 250, 0.3)",
                    }}
                  >
                    {skill}
                  </motion.span>
                )
              )}
            </motion.div>
              </motion.div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border-0 bg-slate-900/70 shadow-[0_20px_80px_rgba(15,23,42,0.8)] backdrop-blur-sm">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src="/2b76c1cb7846ae47a877c0c81360dc06_720w.mp4"
              autoPlay
              loop
              playsInline
              muted
            />
            {/* Top edge blend - only hide the edge */}
            <div 
              className="pointer-events-none absolute top-0 left-0 right-0 h-40" 
              style={{
                background: 'linear-gradient(to bottom, rgb(2 6 23), rgb(2 6 23 / 0.9), rgb(2 6 23 / 0.6), rgb(2 6 23 / 0.3), transparent)'
              }}
            />
            {/* Bottom edge blend - only hide the edge */}
            <div 
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-40" 
              style={{
                background: 'linear-gradient(to top, rgb(2 6 23), rgb(2 6 23 / 0.9), rgb(2 6 23 / 0.6), rgb(2 6 23 / 0.3), transparent)'
              }}
            />
            {/* Left edge blend - only hide the edge */}
            <div 
              className="pointer-events-none absolute top-0 bottom-0 left-0 w-40" 
              style={{
                background: 'linear-gradient(to right, rgb(2 6 23), rgb(2 6 23 / 0.9), rgb(2 6 23 / 0.6), rgb(2 6 23 / 0.3), transparent)'
              }}
            />
            {/* Right edge blend - only hide the edge */}
            <div 
              className="pointer-events-none absolute top-0 bottom-0 right-0 w-40" 
              style={{
                background: 'linear-gradient(to left, rgb(2 6 23), rgb(2 6 23 / 0.9), rgb(2 6 23 / 0.6), rgb(2 6 23 / 0.3), transparent)'
              }}
            />
            {/* Corner blend overlays for seamless edge transition */}
            <div 
              className="pointer-events-none absolute top-0 left-0 w-48 h-48" 
              style={{
                background: 'radial-gradient(circle at top left, rgb(2 6 23), rgb(2 6 23 / 0.9), rgb(2 6 23 / 0.6), rgb(2 6 23 / 0.3), transparent)'
              }}
            />
            <div 
              className="pointer-events-none absolute top-0 right-0 w-48 h-48" 
              style={{
                background: 'radial-gradient(circle at top right, rgb(2 6 23), rgb(2 6 23 / 0.9), rgb(2 6 23 / 0.6), rgb(2 6 23 / 0.3), transparent)'
              }}
            />
            <div 
              className="pointer-events-none absolute bottom-0 left-0 w-48 h-48" 
              style={{
                background: 'radial-gradient(circle at bottom left, rgb(2 6 23), rgb(2 6 23 / 0.9), rgb(2 6 23 / 0.6), rgb(2 6 23 / 0.3), transparent)'
              }}
            />
            <div 
              className="pointer-events-none absolute bottom-0 right-0 w-48 h-48" 
              style={{
                background: 'radial-gradient(circle at bottom right, rgb(2 6 23), rgb(2 6 23 / 0.9), rgb(2 6 23 / 0.6), rgb(2 6 23 / 0.3), transparent)'
              }}
            />
          </div>
        </div>
      </div>
      {/* Top and bottom subtle fades */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
    </section>
  );
}



