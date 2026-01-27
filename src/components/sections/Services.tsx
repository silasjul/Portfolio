"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Brain, Rocket, Layers } from "lucide-react";

interface Service {
  icon: typeof Code2;
  title: string;
  description: string;
  tags: string[];
}

type ServicesDict = {
  label: string;
  title: string;
  fullstack: { title: string; description: string; tags: string };
  ai: { title: string; description: string; tags: string };
  performance: { title: string; description: string; tags: string };
  architecture: { title: string; description: string; tags: string };
}

export default function Services({ dict }: { dict: ServicesDict }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const services: Service[] = [
    {
      icon: Code2,
      title: dict.fullstack.title,
      description: dict.fullstack.description,
      tags: dict.fullstack.tags.split(', '),
    },
    {
      icon: Brain,
      title: dict.ai.title,
      description: dict.ai.description,
      tags: dict.ai.tags.split(', '),
    },
    {
      icon: Rocket,
      title: dict.performance.title,
      description: dict.performance.description,
      tags: dict.performance.tags.split(', '),
    },
    {
      icon: Layers,
      title: dict.architecture.title,
      description: dict.architecture.description,
      tags: dict.architecture.tags.split(', '),
    },
  ];

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
          <span className="inline-block text-[#0077cc] text-sm tracking-[0.3em] uppercase font-medium bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full">
            {dict.label}
          </span>
          <h2 className="text-5xl md:text-7xl text-black mt-4 font-(family-name:--font-playfair)">
            {dict.title}
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
  service: Service;
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
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-[#0077cc]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-[#0077cc]/10 flex items-center justify-center mb-6 group-hover:bg-[#0077cc]/20 transition-colors duration-300">
          <Icon className="w-6 h-6 text-[#0077cc]" />
        </div>

        {/* Title */}
        <h3 className="text-2xl md:text-3xl text-black mb-4 font-(family-name:--font-playfair)">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-black/80 text-lg leading-relaxed mb-6">
          {service.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {service.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm text-black/70 bg-black/5 rounded-full border border-black/10"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
