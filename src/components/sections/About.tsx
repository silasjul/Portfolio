"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const values = [
  { value: "Fresh", label: "Perspectives" },
  { value: "100%", label: "Dedication" },
  { value: "Fair", label: "Pricing" },
  { value: "Direct", label: "Communication" },
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
      className="relative min-h-screen py-16 md:py-32 px-8 md:px-16 lg:px-24 bg-transparent overflow-hidden scroll-mt-32"
    >

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="text-[#0077cc] text-sm tracking-[0.3em] uppercase font-medium">
                About Us
              </span>
              <h2 className="text-5xl md:text-7xl text-black mt-4 mb-8 font-[family-name:var(--font-playfair)]">
                Ready to build
                <br />
                <span className="italic">your</span> vision.
              </h2>
            </motion.div>

            <motion.div
              className="space-y-6 text-black/90 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <p>
                We&apos;re a team of fullstack developers passionate about turning ideas into
                polished digital products. We specialize in modern web technologies
                and AI integration, always staying current with the latest tools
                and best practices.
              </p>
              <p>
                We&apos;re currently building our freelance practice and looking for
                projects where we can deliver real value. Whether it&apos;s a startup
                MVP, a business website, or an AI-powered tool—we&apos;re ready to
                invest the time and effort to make it exceptional.
              </p>
              <p>
                What you get working with us:{" "}
                <span className="text-black font-medium">direct communication</span>,{" "}
                <span className="text-black font-medium">competitive rates</span>, and
                a team genuinely invested in your project&apos;s success.
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
              <span className="text-black/70 text-sm uppercase tracking-wider mb-4 block font-medium">
                Technical Skills
              </span>
              <div className="flex flex-wrap gap-3">
                {expertise.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 text-sm text-black/90 bg-white/50 backdrop-blur-sm rounded-full border border-black/20 hover:border-[#0077cc]/50 hover:text-black transition-all duration-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Values */}
          <div className="flex items-center">
            <div className="grid grid-cols-2 gap-4 md:gap-8 w-full">
              {values.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="relative p-4 md:p-8 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/10"
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    delay: 0.3 + index * 0.1,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <div className="text-2xl md:text-5xl text-[#0077cc] font-[family-name:var(--font-playfair)] mb-1 md:mb-2">
                    {item.value}
                  </div>
                  <div className="text-black/70 text-xs md:text-sm uppercase tracking-wider font-medium">
                    {item.label}
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
