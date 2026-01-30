import { UIMessage } from "ai";
import { motion } from "framer-motion";
import { User, Bot, Calendar } from "lucide-react";
import MarkdownParser from "@/components/MarkdownParser";
import { useMemo } from "react";
import type { AskAIDict } from "@/components/sections/AskAI";
import BookingWrapper from "@/components/BookingWrapper";

// Helper to extract text content from a UIMessage
function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

// Check if the display_cta tool was called with shouldShow: true
function shouldShowCTA(message: UIMessage): boolean {
  if (message.role !== "assistant") return false;
  
  return message.parts.some((part) => {
    // Tool invocations have type like "tool-display_cta"
    if (part.type === "tool-display_cta" && "output" in part && part.output) {
      const output = part.output as { shouldShow?: boolean };
      return output.shouldShow === true;
    }
    return false;
  });
}

export default function MessageBubble({
  message,
  dict,
  isStreaming = false,
}: {
  message: UIMessage;
  dict: AskAIDict;
  isStreaming?: boolean;
}) {
  const isUser = message.role === "user";
  const content = getMessageText(message);
  

  console.log(message)
  // Only show CTA when streaming is done and tool was called
  const showCTA = !isStreaming && shouldShowCTA(message);

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
          
          {/* Booking CTA Button */}
          {showCTA && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mt-4"
            >
              <BookingWrapper theme="light">
                <motion.button
                  className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white font-medium rounded-full shadow-lg cursor-pointer"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Calendar className="w-4 h-4" />
                  Book a Discovery Call
                </motion.button>
              </BookingWrapper>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}