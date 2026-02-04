"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { Turnstile } from "@marsidev/react-turnstile";
import MessageBubble from "@/components/MessageBubble";
import { getChatToken } from "@/actions/getChatToken";

import type { AskAIDict } from "./types";
import {
  useMobileDetection,
  useDelayedTooltip,
  useScrollManagement,
  useRateLimitMessages,
  useChatLoadingState,
} from "./hooks";
import { WelcomeMessage } from "./WelcomeMessage";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { ChatInput } from "./ChatInput";

// Glass card styles extracted for cleaner JSX
const GLASS_CARD_STYLE = {
  background: "rgba(255, 255, 255, 0.25)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  boxShadow:
    "0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(255, 255, 255, 0.1), inset 0 0 16px 8px rgba(255, 255, 255, 0.2)",
};

export function AskAI({ dict }: { dict: AskAIDict }) {
  const containerRef = useRef(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  // Token state for Turnstile verification
  const [token, setToken] = useState<string | null>(null);
  const [verificationFailed, setVerificationFailed] = useState(false);
  const tokenRef = useRef<string | null>(null);

  // Keep tokenRef in sync
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  // Input state
  const [input, setInput] = useState("");

  // Custom hooks
  const isMobile = useMobileDetection();
  const showTooltip = useDelayedTooltip(isInView);

  // AI SDK chat hook
  const { messages, sendMessage, status, error } = useChat();

  // Rate limit handling and message building
  const allMessages = useRateLimitMessages(messages, error, dict);

  // Loading state
  const { isLoading, isWaitingForResponse } = useChatLoadingState(
    status,
    messages
  );

  // Scroll management
  const {
    isScrollable,
    setIsStuckToBottom,
    handleScroll,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
  } = useScrollManagement(messagesContainerRef, [allMessages, isLoading]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !tokenRef.current) return;

    setIsStuckToBottom(true);
    sendMessage(
      { text: input },
      { headers: { "X-Chat-Token": tokenRef.current } }
    );
    setInput("");
  };

  const handleTurnstileSuccess = async (turnstileToken: string) => {
    try {
      const chatToken = await getChatToken(turnstileToken);
      if (chatToken) {
        setToken(chatToken);
      } else {
        setVerificationFailed(true);
      }
    } catch {
      setVerificationFailed(true);
    }
  };

  return (
    <section
      id="ask-ai"
      ref={containerRef}
      className="relative py-10 md:py-32 px-5 sm:px-8 md:px-16 lg:px-24 bg-transparent overflow-hidden scroll-mt-32 max-w-[100vw]"
    >
      {/* Captcha - runs invisibly */}
      {!token && !verificationFailed && (
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onSuccess={handleTurnstileSuccess}
          onError={() => setVerificationFailed(true)}
          onExpire={() => setVerificationFailed(true)}
        />
      )}

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section Header */}
        <SectionHeader dict={dict} isInView={isInView} />

        {/* Chat Container */}
        <motion.div
          className="relative rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          style={GLASS_CARD_STYLE}
        >
          <GlassHighlights />

          {/* Messages Area */}
          <div className="relative">
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              {...(isScrollable ? { "data-lenis-prevent": true } : {})}
              className={`h-72 md:h-[450px] overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6 chat-scrollbar ${isScrollable ? "overscroll-contain" : "overscroll-auto"
                }`}
              style={{ touchAction: isScrollable ? "pan-y" : "auto" }}
            >
              <WelcomeMessage dict={dict} />

              <AnimatePresence mode="popLayout" initial={false}>
                {allMessages.map((message, index) => {
                  const isLastMessage = index === allMessages.length - 1;
                  const isMessageStreaming =
                    isLastMessage &&
                    message.role === "assistant" &&
                    status === "streaming";

                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      dict={dict}
                      isStreaming={isMessageStreaming}
                    />
                  );
                })}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {isWaitingForResponse && <TypingIndicator />}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              {allMessages.length === 0 && (
                <SuggestedQuestions
                  questions={dict.suggestedQuestions}
                  onSelect={setInput}
                />
              )}
            </AnimatePresence>
          </div>

          <ChatInput
            input={input}
            onInputChange={setInput}
            onSubmit={handleSendMessage}
            isLoading={isLoading}
            hasToken={!!token}
            verificationFailed={verificationFailed}
            showTooltip={showTooltip}
            isMobile={isMobile}
            dict={dict}
          />
        </motion.div>
      </div>
    </section>
  );
}

/** Section header with animated title */
function SectionHeader({
  dict,
  isInView,
}: {
  dict: AskAIDict;
  isInView: boolean;
}) {
  return (
    <motion.div
      className="text-center mb-8 md:mb-12"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <span className="inline-flex items-center gap-2 text-[#0077cc] text-sm tracking-[0.3em] uppercase font-medium bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
        <Sparkles className="w-4 h-4" />
        {dict.label}
      </span>
      <h2 className="text-3xl md:text-6xl lg:text-7xl text-black mt-4 md:mt-6 mb-3 md:mb-4 leading-tight">
        {dict.title}{" "}
        <span className="italic text-[#0077cc]">{dict.titleHighlight}</span>
      </h2>
      <p className="text-black/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
        {dict.subtitle}
      </p>
    </motion.div>
  );
}

/** Glass edge highlight effects */
function GlassHighlights() {
  return (
    <>
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute top-0 left-0 w-px h-full"
        style={{
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.9), transparent, rgba(255, 255, 255, 0.4))",
        }}
      />
    </>
  );
}
