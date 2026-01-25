"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Brain, Rocket, Layers } from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Fullstack Development",
    description:
      "End-to-end web applications built with modern frameworks. From sleek frontends to robust backends, architected for scale.",
    tags: ["React", "Next.js", "Node.js", "TypeScript"],
  },
  {
    icon: Brain,
    title: "AI Integration",
    description:
      "Leverage cutting-edge AI to automate workflows, enhance user experiences, and unlock intelligent insights from your data.",
    tags: ["OpenAI", "LangChain", "RAG", "Agents"],
  },
  {
    icon: Rocket,
    title: "Performance & Growth",
    description:
      "Speed is revenue. We optimize for lightning-fast load times, SEO excellence, and conversion-focused architecture.",
    tags: ["Core Web Vitals", "SEO", "Analytics"],
  },
  {
    icon: Layers,
    title: "System Architecture",
    description:
      "Scalable infrastructure that grows with your business. Clean code, clear documentation, future-proof foundations.",
    tags: ["Google Cloud", "Docker", "CI/CD", "APIs"],
  },
];

export default function Services() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative min-h-screen py-16 md:py-32 px-8 md:px-16 lg:px-24 bg-transparent scroll-mt-32"
    >

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="mb-14 md:mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="text-[#0077cc] text-sm tracking-[0.3em] uppercase font-medium">
            What We Do
          </span>
          <h2 className="text-5xl md:text-7xl text-black mt-4 font-[family-name:var(--font-playfair)]">
            Services
          </h2>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
  isInView,
}: {
  service: (typeof services)[0];
  index: number;
  isInView: boolean;
}) {
  const Icon = service.icon;

  return (
    <motion.div
      className="group relative p-8 md:p-10 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/10 hover:border-[#0077cc]/30 transition-colors duration-500"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: 0.15 * index,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0077cc]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-[#0077cc]/10 flex items-center justify-center mb-6 group-hover:bg-[#0077cc]/20 transition-colors duration-300">
          <Icon className="w-6 h-6 text-[#0077cc]" />
        </div>

        {/* Title */}
        <h3 className="text-2xl md:text-3xl text-black mb-4 font-[family-name:var(--font-playfair)]">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-black/70 text-lg leading-relaxed mb-6">
          {service.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {service.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm text-black/50 bg-black/[0.05] rounded-full border border-black/10"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
