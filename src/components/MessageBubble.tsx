import { UIMessage } from "ai";
import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";
import MarkdownParser from "@/components/MarkdownParser";
import { useMemo } from "react";
import type { AskAIDict } from "@/components/sections/AskAI";

// Helper to extract text content from a UIMessage
function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export default function MessageBubble({
  message,
  dict,
}: {
  message: UIMessage;
  dict: AskAIDict;
}) {
  const isUser = message.role === "user";
  console.log(message)
  const content = getMessageText(message);

  // Memoize parsed markdown to avoid re-parsing on every render
  const parsedContent = useMemo(() => MarkdownParser(content), [content]);

  if (isUser) {
    // User messages keep the bubble style
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex items-start gap-4 flex-row-reverse"
      >
        {/* Avatar */}
        <motion.div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg bg-black/80"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <User className="w-5 h-5 text-white" />
        </motion.div>

        {/* Message Content */}
        <div className="max-w-[80%] text-right">
          <div
            className="px-5 py-4 rounded-2xl bg-black/80 text-white rounded-tr-sm"
            style={{ boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)" }}
          >
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // AI messages - full width, no bubble
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex items-start gap-4"
      >
        {/* Avatar */}
        <motion.div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg bg-linear-to-br from-[#0077cc] to-[#003e7c]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Bot className="w-5 h-5 text-white" />
        </motion.div>

        {/* Message Content - full width, no bubble */}
        <div className="flex-1 min-w-0">
          <span className="text-xs text-black/50 font-medium uppercase tracking-wider mb-1.5 block">
            {dict.aiName}
          </span>
          <div className="text-black/90 text-[15px] leading-relaxed">
            {parsedContent}
          </div>
        </div>
      </motion.div>
    </>
  );
}