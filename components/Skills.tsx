"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

interface Skill {
  name: string;
  level: number;
  icon?: string;
  description?: string;
}

interface SkillCategory {
  title: string;
  icon: string;
  color: string;
  skills: Skill[];
}

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useMotionValue(0);
  const spring = useSpring(count, { damping: 15, stiffness: 50 });
  const display = useSpring(rounded, { damping: 15, stiffness: 50 });

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      rounded.set(Math.round(latest));
    });
    count.set(value);
    return unsubscribe;
  }, [value, count, spring, rounded]);

  return <motion.span>{display}</motion.span>;
}

function SkillBar({ skill, index, color }: { skill: Skill; index: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="group relative"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <motion.div
            className="text-2xl"
            animate={{ rotate: isHovered ? [0, -10, 10, -10, 0] : 0 }}
            transition={{ duration: 0.5 }}
          >
            {skill.icon || "⚡"}
          </motion.div>
          <div>
            <h4 className="text-slate-200 font-semibold text-base">{skill.name}</h4>
            {skill.description && (
              <motion.p
                className="text-slate-400 text-xs mt-0.5"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? "auto" : 0 }}
                transition={{ duration: 0.3 }}
              >
                {skill.description}
              </motion.p>
            )}
          </div>
        </div>
        <motion.span
          className="text-slate-300 font-bold text-sm tabular-nums"
          animate={{ scale: isHovered ? 1.2 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatedCounter value={skill.level} />%
        </motion.span>
      </div>
      <div className="relative w-full h-3 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm">
        <motion.div
          className={`h-full rounded-full ${color} relative overflow-hidden`}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{
            duration: 1.5,
            delay: index * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: isHovered ? ["-100%", "200%"] : "-100%",
            }}
            transition={{
              duration: 1.5,
              repeat: isHovered ? Infinity : 0,
              ease: "linear",
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const skillCategories: SkillCategory[] = [
    {
      title: "Frontend Frameworks",
      icon: "⚛️",
      color: "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500",
      skills: [
        {
          name: "React",
          level: 95,
          icon: "⚛️",
          description: "Component architecture, hooks, context API, performance optimization",
        },
        {
          name: "Next.js",
          level: 90,
          icon: "▲",
          description: "SSR, SSG, API routes, App Router, Image optimization",
        },
        {
          name: "TypeScript",
          level: 88,
          icon: "📘",
          description: "Type safety, interfaces, generics, advanced types",
        },
        {
          name: "Vue.js",
          level: 75,
          icon: "💚",
          description: "Composition API, Vuex, Vue Router",
        },
      ],
    },
    {
      title: "Styling & UI",
      icon: "🎨",
      color: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
      skills: [
        {
          name: "Tailwind CSS",
          level: 95,
          icon: "💨",
          description: "Utility-first, responsive design, custom configurations",
        },
        {
          name: "CSS3/SCSS",
          level: 90,
          icon: "🎨",
          description: "Flexbox, Grid, animations, custom properties",
        },
        {
          name: "Framer Motion",
          level: 85,
          icon: "✨",
          description: "Complex animations, gestures, layout animations",
        },
        {
          name: "Material-UI",
          level: 80,
          icon: "🧩",
          description: "Component library, theming, customization",
        },
        {
          name: "Shadcn/ui",
          level: 85,
          icon: "🔧",
          description: "Component composition, Radix UI primitives",
        },
      ],
    },
    {
      title: "State Management",
      icon: "🔄",
      color: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500",
      skills: [
        {
          name: "Redux Toolkit",
          level: 85,
          icon: "🔄",
          description: "Store management, RTK Query, middleware",
        },
        {
          name: "Zustand",
          level: 80,
          icon: "🐻",
          description: "Lightweight state management",
        },
        {
          name: "React Query",
          level: 88,
          icon: "🔄",
          description: "Server state, caching, mutations",
        },
        {
          name: "Context API",
          level: 90,
          icon: "📦",
          description: "React context, custom hooks",
        },
      ],
    },
    {
      title: "Build Tools & Bundlers",
      icon: "🛠️",
      color: "bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500",
      skills: [
        {
          name: "Vite",
          level: 90,
          icon: "⚡",
          description: "Fast build tool, HMR, plugin ecosystem",
        },
        {
          name: "Webpack",
          level: 75,
          icon: "📦",
          description: "Module bundling, code splitting, loaders",
        },
        {
          name: "Turborepo",
          level: 70,
          icon: "🚀",
          description: "Monorepo management, build caching",
        },
      ],
    },
    {
      title: "Testing & Quality",
      icon: "🧪",
      color: "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500",
      skills: [
        {
          name: "Jest",
          level: 85,
          icon: "🧪",
          description: "Unit testing, mocking, snapshots",
        },
        {
          name: "React Testing Library",
          level: 88,
          icon: "🔬",
          description: "Component testing, user-centric tests",
        },
        {
          name: "Cypress",
          level: 75,
          icon: "🌲",
          description: "E2E testing, component testing",
        },
        {
          name: "Playwright",
          level: 70,
          icon: "🎭",
          description: "Cross-browser testing, automation",
        },
      ],
    },
    {
      title: "Backend & APIs",
      icon: "🔌",
      color: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600",
      skills: [
        {
          name: "Node.js",
          level: 80,
          icon: "🟢",
          description: "Express, REST APIs, middleware",
        },
        {
          name: "GraphQL",
          level: 75,
          icon: "📊",
          description: "Apollo Client, queries, mutations",
        },
        {
          name: "REST APIs",
          level: 90,
          icon: "🌐",
          description: "API integration, error handling, authentication",
        },
        {
          name: "MongoDB",
          level: 75,
          icon: "🍃",
          description: "Database design, queries, aggregation",
        },
      ],
    },
    {
      title: "Tools & DevOps",
      icon: "⚙️",
      color: "bg-gradient-to-r from-slate-600 via-gray-600 to-zinc-600",
      skills: [
        {
          name: "Git & GitHub",
          level: 92,
          icon: "📚",
          description: "Version control, branching, PR workflows",
        },
        {
          name: "Docker",
          level: 70,
          icon: "🐳",
          description: "Containerization, Docker Compose",
        },
        {
          name: "CI/CD",
          level: 80,
          icon: "🔄",
          description: "GitHub Actions, Vercel, Netlify",
        },
        {
          name: "Figma",
          level: 85,
          icon: "🎨",
          description: "UI design, prototyping, design systems",
        },
      ],
    },
  ];

  return (
    <section
      id="skills"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Top gradient blend */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent z-0" />
      {/* Bottom gradient blend */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-slate-50"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Skills &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-purple-500">
              Technologies
            </span>
          </motion.h2>
          <motion.div
            className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.p
            className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            A comprehensive toolkit for building modern, scalable, and performant web applications
          </motion.p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              className="group relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-800/50 p-6 lg:p-8 backdrop-blur-sm transition-all duration-500 hover:border-sky-500/50 hover:shadow-[0_20px_60px_rgba(56,189,248,0.2)]"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: categoryIndex * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{ scale: 1.02, y: -8 }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  className={`text-4xl p-3 rounded-xl ${category.color} bg-opacity-20 backdrop-blur-sm`}
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {category.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-slate-50">{category.title}</h3>
              </div>

              {/* Skills List */}
              <div className="space-y-5">
                {category.skills.map((skill, skillIndex) => (
                  <SkillBar
                    key={skillIndex}
                    skill={skill}
                    index={skillIndex}
                    color={category.color}
                  />
                ))}
              </div>

              {/* Hover Glow Effect */}
              <div
                className={`absolute inset-0 ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10 blur-xl`}
              />
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-slate-400 text-sm">
            Continuously learning and adapting to new technologies and best practices
          </p>
        </motion.div>
      </div>
    </section>
  );
}


