"use client";

import { motion } from "framer-motion";

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ questions, onSelect }: SuggestedQuestionsProps) {
  return (
    <motion.div
      key="suggested-questions"
      className="hidden sm:block absolute bottom-0 left-0 right-0 pb-4 px-8 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-wrap gap-2 pointer-events-auto">
        {questions.map((question) => (
          <motion.button
            key={question}
            onClick={() => onSelect(question)}
            className="px-4 py-2 text-sm text-black/80 bg-white/70 rounded-full border border-black/10 cursor-pointer backdrop-blur-sm"
            whileHover={{
              scale: 1.02,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderColor: "rgba(0, 119, 204, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {question}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
