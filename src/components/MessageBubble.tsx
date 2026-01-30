import { UIMessage } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bot } from "lucide-react";
import MarkdownParser from "@/components/MarkdownParser";
import { useMemo, useState, useEffect } from "react";
import type { AskAIDict } from "@/components/sections/AskAI";
import BookingWrapper from "@/components/BookingWrapper";
import { RainbowButton } from "./ui/rainbow-button";

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
  
  // Check if CTA should be shown based on tool call
  const ctaRequested = shouldShowCTA(message);
  
  // Delay CTA appearance to ensure smooth transition after streaming ends
  const [ctaVisible, setCtaVisible] = useState(false);
  
  useEffect(() => {
    // Only show CTA when:
    // 1. Tool requested it
    // 2. Not currently streaming
    // 3. Message has actual content (prevents flash during initial render)
    if (ctaRequested && !isStreaming && content.length > 0) {
      // Small delay to let the content settle before showing CTA
      const timer = setTimeout(() => setCtaVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setCtaVisible(false);
    }
  }, [ctaRequested, isStreaming, content.length]);

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
          <div className="text-black/90 text-[15px] leading-relaxed flex flex-col gap-2">
            {parsedContent}
          </div>
          
          {/* Booking CTA Button */}
          <AnimatePresence mode="wait">
            {ctaVisible && (
              <motion.div
                key="cta-button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -5, height: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mt-4 overflow-hidden w-fit shadow-lg rounded-full"
              >
                <BookingWrapper theme="light">
                <RainbowButton className="rounded-full p-5 cursor-pointer shadow-lg">
                  {dict.bookingButton}
                </RainbowButton>
                </BookingWrapper>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}