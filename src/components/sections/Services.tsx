"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (reduced intensity for subtlety)
    const rotateXValue = ((y - centerY) / centerY) * -4;
    const rotateYValue = ((x - centerX) / centerX) * 4;

    // Calculate glare position (percentage)
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTransform({
      rotateX: rotateXValue,
      rotateY: rotateYValue,
      scale: 1.02,
    });
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform({ rotateX: 0, rotateY: 0, scale: 1 });
    setGlarePosition({ x: 50, y: 50 });
  };

  // Dynamic shadow based on tilt - subtle layered glow effect
  const shadowX = transform.rotateY * 1.5;
  const shadowY = -transform.rotateX * 1.5;
  const hoveredShadow = `${shadowX}px ${shadowY + 8}px 25px rgba(200, 50, 150, 0.06), ${shadowX * 1.5}px ${shadowY + 16}px 50px rgba(200, 50, 150, 0.04), 0 0 60px rgba(200, 50, 150, 0.02)`;
  const defaultShadow = "0 4px 20px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.05)";

  return (
    <div style={{ perspective: "1000px" }}>
      <motion.div
        ref={cardRef}
        className={`group relative p-8 md:p-10 rounded-2xl backdrop-blur-sm overflow-hidden transition-colors duration-500 ${isHovered
            ? "bg-white/75 border border-[#c83296]/10"
            : "bg-white/60 border border-black/10"
          }`}
        initial={{ opacity: 0, y: 50, boxShadow: defaultShadow }}
        animate={
          isInView
            ? {
              opacity: 1,
              y: 0,
              rotateX: transform.rotateX,
              rotateY: transform.rotateY,
              scale: transform.scale,
              boxShadow: isHovered ? hoveredShadow : defaultShadow,
            }
            : {}
        }
        transition={{
          duration: 0.7,
          delay: 0.15 * index,
          ease: [0.25, 0.1, 0.25, 1],
          rotateX: { duration: 0.15, ease: "easeOut" },
          rotateY: { duration: 0.15, ease: "easeOut" },
          scale: { duration: 0.2, ease: "easeOut" },
          boxShadow: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Glare/shine effect */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 40%, transparent 70%)`,
          }}
        />

        {/* Border glow effect */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(200, 50, 150, 0.03) 0%, transparent 50%)`,
          }}
        />

        {/* Content with 3D lift */}
        <div
          className="relative z-10"
          style={{
            transform: isHovered ? "translateZ(30px)" : "translateZ(0px)",
            transition: "transform 0.3s ease-out",
          }}
        >
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl bg-[#0077cc]/10 flex items-center justify-center mb-6 group-hover:bg-[#0077cc]/20 transition-all duration-300"
            style={{
              transform: isHovered ? "translateZ(20px)" : "translateZ(0px)",
              transition: "transform 0.3s ease-out, background-color 0.3s",
            }}
          >
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
    </div>
  );
}
