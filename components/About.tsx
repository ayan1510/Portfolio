"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Card3DTilt from "@/components/Card3DTilt";
import SectionVideoBackground from "@/components/SectionVideoBackground";

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
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100,
      }}
      className="h-full"
    >
      <Card3DTilt
        maxTilt={10}
        scale={1.04}
        className="group h-full relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-800/40 p-6 text-center backdrop-blur-sm hover:border-sky-500/50 transition-all duration-500"
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
      </Card3DTilt>
    </motion.div>
  );
}

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <SectionVideoBackground src="/videowork/IMG_4711.MP4" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
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
                I&apos;m a Web Developer and Creative Strategist passionate about building digital experiences that help brands grow and connect with their audience. As the Founder of Drizzle, I work at the intersection of technology, creativity, and storytelling—creating modern websites, engaging visual content, and impactful brand experiences.
              </motion.p>
              <motion.p
                custom={1}
                variants={textVariants}
                className="font-normal"
              >
                My work goes beyond development. I enjoy photography, videography, video editing, social media management, and creating content that captures attention and drives engagement. From product shoots and short-form videos to social media campaigns and brand storytelling, I focus on creating content that feels authentic and memorable.
              </motion.p>
              <motion.p
                custom={2}
                variants={textVariants}
                className="font-normal"
              >
                I have a strong interest in branding, customer experience, and creative marketing ideas. Whether it&apos;s designing a website, planning content for Instagram, or developing strategies to improve online presence, I enjoy turning ideas into experiences that leave a lasting impression.
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

          <motion.div
            className="relative mx-auto w-full max-w-sm lg:max-w-md lg:mx-0 lg:ml-auto"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="relative aspect-3/4 w-full overflow-hidden">
              <Image
                src="/about/IMG_4690.JPG%20(1).jpeg"
                alt="Ayan Mondal"
                fill
                sizes="(min-width: 1024px) 40vw, 80vw"
                className="object-cover object-center [mask-image:linear-gradient(to_right,transparent,black_20%,black_90%,transparent)]"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/60 to-slate-950/20" />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/90 via-transparent to-slate-950/30" />
              <div
                className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-40"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 50%, rgb(56 189 248 / 0.15), transparent 70%)",
                }}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 30%, rgb(2 6 23 / 0.7) 100%)",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
      {/* Top and bottom subtle fades */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
    </section>
  );
}



