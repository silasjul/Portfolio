"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

interface Capability {
  id: number;
  title: string;
  category: string;
  description: string;
  tech: string[];
}

type WorksDict = {
  label: string;
  title: string;
  subtitle: string;
  aiApps: { title: string; category: string; description: string; tech: string };
  customWeb: { title: string; category: string; description: string; tech: string };
  business: { title: string; category: string; description: string; tech: string };
  ecommerce: { title: string; category: string; description: string; tech: string };
}

export default function Works({ dict }: { dict: WorksDict }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const capabilities: Capability[] = [
    {
      id: 1,
      title: dict.aiApps.title,
      category: dict.aiApps.category,
      description: dict.aiApps.description,
      tech: dict.aiApps.tech.split(', '),
    },
    {
      id: 2,
      title: dict.customWeb.title,
      category: dict.customWeb.category,
      description: dict.customWeb.description,
      tech: dict.customWeb.tech.split(', '),
    },
    {
      id: 3,
      title: dict.business.title,
      category: dict.business.category,
      description: dict.business.description,
      tech: dict.business.tech.split(', '),
    },
    {
      id: 4,
      title: dict.ecommerce.title,
      category: dict.ecommerce.category,
      description: dict.ecommerce.description,
      tech: dict.ecommerce.tech.split(', '),
    },
  ];

  return (
    <section
      id="works"
      ref={containerRef}
      className="relative py-16 md:py-32 px-6 sm:px-8 md:px-16 lg:px-24 bg-transparent scroll-mt-32 max-w-[100vw] overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="mb-10 sm:mb-14 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div>
            <span className="inline-block text-[#0077cc] text-sm tracking-[0.3em] uppercase font-medium bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full">
              {dict.label}
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl text-black mt-4 font-(family-name:--font-playfair)">
              {dict.title}
            </h2>
          </div>
          <p className="text-black/70 text-lg max-w-md mt-6 md:mt-0">
            {dict.subtitle}
          </p>
        </motion.div>

        {/* Capabilities List */}
        <div className="space-y-4">
          {capabilities.map((item, index) => (
            <CapabilityRow
              key={item.id}
              item={item}
              index={index}
              isInView={isInView}
              isHovered={hoveredId === item.id}
              onHover={() => setHoveredId(item.id)}
              onLeave={() => setHoveredId(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CapabilityRow({
  item,
  index,
  isInView,
  isHovered,
  onHover,
  onLeave,
}: {
  item: Capability;
  index: number;
  isInView: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: 0.1 * index,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div
        className="block py-8 border-b border-black/10 hover:border-black/30 transition-colors duration-300 cursor-default"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left side - Number & Title */}
          <div className="flex items-center gap-6 md:gap-10">
            <span className="text-black/30 text-sm tabular-nums font-medium">
              0{index + 1}
            </span>
            <div>
              <h3 className="text-2xl md:text-4xl text-black font-(family-name:--font-playfair) group-hover:text-[#0077cc] transition-colors duration-300">
                {item.title}
              </h3>
              <span className="text-black/60 text-sm mt-1 block">
                {item.category}
              </span>
            </div>
          </div>

          {/* Right side - Tech */}
          <div className="hidden lg:flex gap-2">
            {item.tech.map((tech: string) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm text-black/70 bg-black/5 rounded-full border border-black/10"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Description - always visible on mobile, expandable on hover for desktop */}
        <p className="md:hidden text-black/70 text-base max-w-2xl pt-4 pl-10">
          {item.description}
        </p>
        <motion.div
          className="hidden md:block overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isHovered ? "auto" : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-black/70 text-lg max-w-2xl pt-4 pl-16 md:pl-20">
            {item.description}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
