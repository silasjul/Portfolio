"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollSvg() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 -left-12.5 w-[110vw] pointer-events-none -z-10"
      style={{ transform: "translateY(50%)" }}
    >
      <svg
        width="100%"
        height="auto"
        viewBox="0 0 1986 591"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <motion.path
          d="M4.18457 24.6473L593.185 124.647C484.351 232.981 275.685 447.647 263.685 435.147C253.43 424.466 174.185 247.647 189.185 247.647C201.429 247.647 725.518 390.481 987.685 457.147L1205.18 299.147L1977.68 566.647"
          stroke="black"
          strokeWidth="50"
          strokeLinecap="round"
          style={{
            pathLength,
          }}
        />
      </svg>
    </div>
  );
}
