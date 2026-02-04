"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <motion.div
      key="typing-indicator"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-4"
    >
      <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#0077cc] to-[#003e7c] flex items-center justify-center shrink-0 shadow-lg">
        <Bot className="w-5 h-5 text-white" />
      </div>
      <div className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-white/60 backdrop-blur-sm">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-[#0077cc] rounded-full"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
