"use client";

import { motion } from "framer-motion";

type HeroDict = {
  line1: string;
  line2: string;
  line3: string;
}

export default function Hero({ dict }: { dict: HeroDict }) {
  return (
    <div className="hero-padding-3xl relative h-full flex flex-col justify-end pb-24 sm:pb-28 md:pb-32 xl:pb-40 px-5 sm:px-8">
      <div>
        {/* Mobile layout - positioned lower with fluid text sizing */}
        <motion.h1 className="md:hidden hero-title-mobile select-none leading-[1.05] tracking-tight">
          <motion.div
            initial={{ opacity: 0, y: 24, color: "#35a9ff" }}
            animate={{ opacity: 1, y: 0, color: "#000000" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            {dict.line1}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24, color: "#35a9ff" }}
            animate={{ opacity: 1, y: 0, color: "#000000" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.225 }}
          >
            {dict.line2}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24, color: "#35a9ff" }}
            animate={{ opacity: 1, y: 0, color: "#000000" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          >
            {dict.line3}
          </motion.div>
        </motion.h1>

        {/* Scroll indicator for mobile */}
        <motion.div
          className="md:hidden flex items-center gap-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div
            className="w-5 h-8 rounded-full border-2 border-black/40 flex justify-center pt-1.5"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div className="w-1 h-2 bg-black/50 rounded-full" />
          </motion.div>
          <span className="text-sm text-black/50 font-medium tracking-wide">Scroll</span>
        </motion.div>

        {/* Desktop layout */}
        <motion.h1 className="hero-title-3xl hidden md:block text-8xl xl:text-[8.5rem] select-none leading-[1.1]">
          <motion.div
            initial={{ opacity: 0, y: 30, color: "#35a9ff" }}
            animate={{ opacity: 1, y: 0, color: "#000000" }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
          >
            {dict.line1}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30, color: "#35a9ff" }}
            animate={{ opacity: 1, y: 0, color: "#000000" }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.275 }}
          >
            {dict.line2}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30, color: "#35a9ff" }}
            animate={{ opacity: 1, y: 0, color: "#000000" }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.35 }}
          >
            {dict.line3}
          </motion.div>
        </motion.h1>
      </div>
    </div>
  );
}
