"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="relative h-full flex flex-col justify-end pb-32 px-8">
      <div>
        <motion.h1 className="text-6xl sm:text-8xl xl:text-[8.5rem] select-none">
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
