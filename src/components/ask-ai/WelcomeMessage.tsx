"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import type { AskAIDict } from "./types";

interface WelcomeMessageProps {
  dict: AskAIDict;
}

export function WelcomeMessage({ dict }: WelcomeMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-5"
    >
      {/* Avatar + Name row on mobile, just avatar on desktop */}
      <div className="flex items-center gap-2 shrink-0">
        <motion.div
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg bg-linear-to-br from-[#0077cc] to-[#003e7c]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </motion.div>
        {/* Name shown inline on mobile only */}
        <span className="text-xs text-black/50 font-medium uppercase tracking-wider sm:hidden">
          {dict.aiName}
        </span>
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Name shown above content on desktop only */}
        <span className="hidden sm:block text-xs text-black/50 font-medium uppercase tracking-wider mb-1.5">
          {dict.aiName}
        </span>
        <div className="text-black/90 text-[15px] leading-relaxed">
          <p>{dict.welcomeMessage}</p>
        </div>
      </div>
    </motion.div>
  );
}
