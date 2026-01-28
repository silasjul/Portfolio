"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type AboutDict = {
  label: string;
  title: string;
  titleItalic: string;
  titleEnd: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  directComm: string;
  competitiveRates: string;
  paragraph3End: string;
  skillsLabel: string;
  skills: string;
  value1: string;
  value1Label: string;
  value2: string;
  value2Label: string;
  value3: string;
  value3Label: string;
  value4: string;
  value4Label: string;
}

export default function About({ dict }: { dict: AboutDict }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const values = [
    { value: dict.value1, label: dict.value1Label },
    { value: dict.value2, label: dict.value2Label },
    { value: dict.value3, label: dict.value3Label },
    { value: dict.value4, label: dict.value4Label },
  ];

  const expertise = dict.skills.split(', ');

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
              <span className="inline-block text-[#0077cc] text-sm tracking-[0.3em] uppercase font-medium bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full">
                {dict.label}
              </span>
              <h2 className="text-5xl md:text-7xl text-black mt-4 mb-8 font-(family-name:--font-playfair)">
                {dict.title}
                <br />
                <span className="italic">{dict.titleItalic}</span> {dict.titleEnd}
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
                {dict.paragraph1}
              </p>
              <p>
                {dict.paragraph2}
              </p>
              <p>
                {dict.paragraph3}{" "}
                <span className="text-black font-medium">{dict.directComm}</span>,{" "}
                <span className="text-black font-medium">{dict.competitiveRates}</span>, {dict.paragraph3End}
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
                {dict.skillsLabel}
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
                  className="relative p-4 md:p-8 rounded-[20px] overflow-hidden"
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    delay: 0.3 + index * 0.1,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  style={{
                    background: "rgba(255, 255, 255, 0.21)",
                    backdropFilter: "blur(17px)",
                    WebkitBackdropFilter: "blur(17px)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(255, 255, 255, 0.1), inset 0 0 12px 6px rgba(255, 255, 255, 0.15)",
                  }}
                >
                  {/* Top edge highlight */}
                  <div
                    className="pointer-events-none absolute top-0 left-0 right-0 h-[1px]"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)",
                    }}
                  />
                  {/* Left edge highlight */}
                  <div
                    className="pointer-events-none absolute top-0 left-0 w-[1px] h-full"
                    style={{
                      background: "linear-gradient(180deg, rgba(255, 255, 255, 0.8), transparent, rgba(255, 255, 255, 0.3))",
                    }}
                  />
                  <div className="relative z-10 text-2xl md:text-5xl text-[#0077cc] font-(family-name:--font-playfair) mb-1 md:mb-2">
                    {item.value}
                  </div>
                  <div className="relative z-10 text-black/70 text-xs md:text-sm uppercase tracking-wider font-medium">
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
