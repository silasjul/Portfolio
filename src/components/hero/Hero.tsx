"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="relative h-full flex flex-col justify-center md:justify-end pb-8 md:pb-32 px-8">
      <div>
        {/* Mobile layout */}
        <motion.h1 className="md:hidden text-[3.25rem] select-none leading-[1.1]">
          <motion.div
            initial={{ opacity: 0, y: 30, color: "#35a9ff" }}
            animate={{ opacity: 1, y: 0, color: "#000000" }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
          >
            Smarter
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30, color: "#35a9ff" }}
            animate={{ opacity: 1, y: 0, color: "#000000" }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.275 }}
          >
            Fullstack & AI
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30, color: "#35a9ff" }}
            animate={{ opacity: 1, y: 0, color: "#000000" }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.35 }}
          >
            Engineered for growth.
          </motion.div>
        </motion.h1>

        {/* Desktop layout */}
        <motion.h1 className="hidden md:block text-8xl xl:text-[8.5rem] select-none leading-[1.1]">
          <motion.div
            initial={{ opacity: 0, y: 30, color: "#35a9ff" }}
            animate={{ opacity: 1, y: 0, color: "#000000" }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
          >
            Smarter
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30, color: "#35a9ff" }}
            animate={{ opacity: 1, y: 0, color: "#000000" }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.275 }}
          >
            Fullstack & AI
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30, color: "#35a9ff" }}
            animate={{ opacity: 1, y: 0, color: "#000000" }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.35 }}
          >
            Engineered for growth.
          </motion.div>
        </motion.h1>
      </div>
    </div>
  );
}
