"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    // Honeypot field for spam bots – real users never see/fill this
    website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const formRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(formRef, { once: true, amount: 0.2 });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "", website: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
  };

  const socialLinks: SocialLink[] = [
    {
      name: "GitHub",
      url: "https://github.com",
      icon: "💻",
      color: "from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com",
      icon: "💼",
      color: "from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700",
    },
    {
      name: "Twitter",
      url: "https://twitter.com",
      icon: "🐦",
      color: "from-sky-500 to-sky-700 hover:from-sky-400 hover:to-sky-600",
    },
    {
      name: "Email",
      url: "mailto:ayan.official.mail.id@gmail.com",
      icon: "✉️",
      color: "from-red-500 to-red-700 hover:from-red-400 hover:to-red-600",
    },
  ];

  const contactInfo = [
    {
      label: "Location",
      value: "Kolkata, India",
      icon: "📍",
      link: null,
    },
    {
      label: "Email",
      value: "ayan.official.mail.id@gmail.com",
      icon: "✉️",
      link: "mailto:ayan.official.mail.id@gmail.com",
    },
    {
      label: "Phone",
      value: "+91-8649809995",
      icon: "📱",
      link: "tel:+918649809995",
    },
  ];

  return (
    <section
      id="contact"
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
            Let's{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-purple-500">
              Connect
            </span>
          </motion.h2>
          <motion.div
            className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-6"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.p
            className="text-lg text-slate-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            I'm always open to frontend roles, freelance projects, and collaborations
            around React, Next.js, and modern web interfaces. Feel free to reach out!
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-800/50 p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-slate-50 mb-6 flex items-center gap-3">
                <span className="text-3xl">📧</span>
                Send a Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field for bots (hidden from real users) */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 }}
                >
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    placeholder="Your Name"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 }}
                >
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 }}
                >
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
                    placeholder="Your message..."
                  />
                </motion.div>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-gradient-to-r from-sky-500 via-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-sky-600 hover:via-blue-600 hover:to-purple-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-sky-500/50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          ⏳
                        </motion.span>
                        Sending...
                      </>
                    ) : submitStatus === "success" ? (
                      <>
                        <span>✓</span>
                        Message Sent!
                      </>
                    ) : submitStatus === "error" ? (
                      <>
                        <span>✕</span>
                        Error - Try Again
                      </>
                    ) : (
                      <>
                        Send Message
                        <span>→</span>
                      </>
                    )}
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                    animate={{
                      x: isSubmitting ? ["-100%", "200%"] : "-100%",
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: isSubmitting ? Infinity : 0,
                      ease: "linear",
                    }}
                  />
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            {/* Contact Details */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-800/50 p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-slate-50 mb-6 flex items-center gap-3">
                <span className="text-3xl">📞</span>
                Contact Information
              </h3>
              <div className="space-y-5">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={index}
                    href={info.link || undefined}
                    className={`flex items-start gap-4 p-4 rounded-lg border border-slate-800/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-sky-500/50 transition-all group ${
                      info.link ? "cursor-pointer" : "cursor-default"
                    }`}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <motion.span
                      className="text-3xl"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5,
                      }}
                    >
                      {info.icon}
                    </motion.span>
                    <div className="flex-1">
                      <div className="text-sm text-slate-400 mb-1">{info.label}</div>
                      <div className="text-slate-200 font-medium group-hover:text-sky-400 transition-colors">
                        {info.value}
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-800/50 p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-slate-50 mb-6 flex items-center gap-3">
                <span className="text-3xl">🌐</span>
                Follow Me
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative overflow-hidden flex flex-col items-center justify-center gap-2 p-6 rounded-xl bg-gradient-to-br ${social.color} text-white font-semibold transition-all group`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      className="text-4xl"
                      animate={{
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    >
                      {social.icon}
                    </motion.span>
                    <span className="text-sm">{social.name}</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5,
                        ease: "linear",
                      }}
                    />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Ayan Mondal. All rights reserved.
          </p>
        </motion.footer>
      </div>
    </section>
  );
}


