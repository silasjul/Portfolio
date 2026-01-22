"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "5+", label: "Years Experience" },
  { value: "50+", label: "Projects Delivered" },
  { value: "30+", label: "Happy Clients" },
  { value: "100%", label: "Satisfaction Rate" },
];

const expertise = [
  "React & Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "AI/ML Integration",
  "Cloud Architecture",
  "Database Design",
  "API Development",
];

export default function About() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative min-h-screen py-32 px-8 md:px-16 lg:px-24 bg-[#0a0a0a] overflow-hidden scroll-mt-32"
    >
      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-[#35a9ff]/10 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="text-[#35a9ff] text-sm tracking-[0.3em] uppercase font-medium">
                About Me
              </span>
              <h2 className="text-5xl md:text-7xl text-white mt-4 mb-8 font-[family-name:var(--font-playfair)]">
                Building the
                <br />
                <span className="italic">future</span>, today.
              </h2>
            </motion.div>

            <motion.div
              className="space-y-6 text-white/60 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <p>
                I&apos;m a fullstack developer and AI specialist who turns
                complex challenges into elegant digital solutions. My approach
                combines technical precision with creative problem-solving.
              </p>
              <p>
                Whether you&apos;re a startup looking to launch your MVP or an
                established business ready to leverage AI, I bring the expertise
                to make it happen—on time and beyond expectations.
              </p>
              <p>
                I believe in{" "}
                <span className="text-white">transparent communication</span>,{" "}
                <span className="text-white">clean code</span>, and building
                partnerships that last beyond a single project.
              </p>
            </motion.div>

            {/* Expertise Tags */}
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <span className="text-white/40 text-sm uppercase tracking-wider mb-4 block">
                Core Expertise
              </span>
              <div className="flex flex-wrap gap-3">
                {expertise.map((skill, index) => (
                  <span
                    key={skill}
                    className="px-4 py-2 text-sm text-white/70 bg-white/[0.05] rounded-full border border-white/[0.08] hover:border-[#35a9ff]/50 hover:text-white transition-all duration-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Stats */}
          <div className="flex items-center">
            <div className="grid grid-cols-2 gap-8 w-full">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    delay: 0.3 + index * 0.1,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <div className="text-5xl md:text-6xl text-[#35a9ff] font-[family-name:var(--font-playfair)] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white/40 text-sm uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
