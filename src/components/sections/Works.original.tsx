"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    category: "Fullstack",
    description:
      "High-performance online store with AI-powered product recommendations and seamless checkout experience.",
    image: "/api/placeholder/800/600",
    tech: ["Next.js", "Stripe", "PostgreSQL"],
    color: "#35a9ff",
  },
  {
    id: 2,
    title: "AI Document Assistant",
    category: "AI Integration",
    description:
      "Intelligent document processing system that extracts, summarizes, and answers questions from uploaded files.",
    image: "/api/placeholder/800/600",
    tech: ["Python", "OpenAI", "React"],
    color: "#ff6b35",
  },
  {
    id: 3,
    title: "SaaS Dashboard",
    category: "Web App",
    description:
      "Real-time analytics dashboard with custom visualizations and automated reporting capabilities.",
    image: "/api/placeholder/800/600",
    tech: ["React", "D3.js", "Node.js"],
    color: "#35ffa9",
  },
  {
    id: 4,
    title: "Booking System",
    category: "Fullstack",
    description:
      "Modern appointment scheduling platform with calendar integration and automated reminders.",
    image: "/api/placeholder/800/600",
    tech: ["Next.js", "Prisma", "Twilio"],
    color: "#a935ff",
  },
];

export default function Works() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section
      id="works"
      ref={containerRef}
      className="relative min-h-screen py-32 px-8 md:px-16 lg:px-24 bg-transparent scroll-mt-32"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="mb-20 flex flex-col md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div>
            <span className="text-[#0077cc] text-sm tracking-[0.3em] uppercase font-medium">
              Portfolio
            </span>
            <h2 className="text-5xl md:text-7xl text-black mt-4 font-(family-name:--font-playfair)">
              Selected Works
            </h2>
          </div>
          <p className="text-black/50 text-lg max-w-md mt-6 md:mt-0">
            A curated selection of projects that showcase my expertise in
            building digital experiences.
          </p>
        </motion.div>

        {/* Projects List */}
        <div className="space-y-4">
          {projects.map((project, index) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={index}
              isInView={isInView}
              isHovered={hoveredId === project.id}
              onHover={() => setHoveredId(project.id)}
              onLeave={() => setHoveredId(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectRow({
  project,
  index,
  isInView,
  isHovered,
  onHover,
  onLeave,
}: {
  project: (typeof projects)[0];
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
      <a
        href="#"
        className="block py-8 border-b border-black/10 hover:border-black/30 transition-colors duration-300"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left side - Number & Title */}
          <div className="flex items-center gap-6 md:gap-10">
            <span className="text-black/20 text-sm tabular-nums">
              0{index + 1}
            </span>
            <div>
              <h3 className="text-2xl md:text-4xl text-black font-(family-name:--font-playfair) group-hover:text-[#0077cc] transition-colors duration-300">
                {project.title}
              </h3>
              <span className="text-black/40 text-sm mt-1 block">
                {project.category}
              </span>
            </div>
          </div>

          {/* Right side - Tech */}
          <div className="hidden lg:flex gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm text-black/50 bg-black/3 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Expandable description on hover (desktop only) */}
        <motion.div
          className="hidden md:block overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isHovered ? "auto" : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-black/50 text-lg max-w-2xl pt-4 pl-16 md:pl-20">
            {project.description}
          </p>
        </motion.div>
      </a>
    </motion.div>
  );
}
