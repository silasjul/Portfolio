"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Send, Sparkles, Bot, Loader2, ShieldCheck } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";
import { useChat, type UIMessage } from "@ai-sdk/react";
import MessageBubble from "@/components/MessageBubble";
import { Turnstile } from '@marsidev/react-turnstile';
import { getChatToken } from '@/actions/getChatToken';

export type AskAIDict = {
  label: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  placeholder: string;
  placeholderShort: string;
  sendButton: string;
  suggestedQuestions: string[];
  aiName: string;
  welcomeMessage: string;
  rateLimitMessage: string;
  bookingButton: string;
  verifyingBrowser: string;
  verificationFailed: string;
};

export default function AskAI({ dict }: { dict: AskAIDict }) {
  const containerRef = useRef(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const [isStuckToBottom, setIsStuckToBottom] = useState(true);
  const [input, setInput] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [verificationFailed, setVerificationFailed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Detect mobile screen size for shorter placeholder
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Delay tooltip appearance until after section animation completes
  useEffect(() => {
    if (isInView && !showTooltip) {
      const timer = setTimeout(() => setShowTooltip(true), 1100); // 0.2s delay + 0.8s duration + 0.1s buffer
      return () => clearTimeout(timer);
    }
  }, [isInView, showTooltip]);
  // Store token in a ref so sendMessage always has access to latest value
  const tokenRef = useRef<string | null>(null);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  // Use the AI SDK's useChat hook for streaming
  // Token is passed dynamically via sendMessage headers, not baked into transport
  const { messages, sendMessage, status, error } = useChat();

  // Track rate limit errors with the message ID they apply to
  const [rateLimitForMessage, setRateLimitForMessage] = useState<Set<string>>(new Set());
  // Track previous error to detect when a NEW rate limit error occurs
  const prevErrorRef = useRef<Error | undefined>(undefined);

  // Handle rate limit errors - only add response when error first appears
  useEffect(() => {
    const errorMsg = error?.message?.toLowerCase() ?? "";
    const isRateLimitError = errorMsg.includes("rate limit") || errorMsg.includes("high traffic");

    // Only process if this is a new error (error changed from undefined/different to rate limit)
    const errorChanged = error !== prevErrorRef.current;
    prevErrorRef.current = error;

    if (isRateLimitError && errorChanged) {
      // Find the last user message that doesn't have an assistant response
      const userMessages = messages.filter(m => m.role === "user");
      if (userMessages.length > 0) {
        const lastUserMsg = userMessages[userMessages.length - 1];
        // Check if this user message already has a response
        const lastUserIndex = messages.findIndex(m => m.id === lastUserMsg.id);
        const nextMsg = messages[lastUserIndex + 1];

        // Only add rate limit response if there's no assistant message after
        if (!nextMsg || nextMsg.role === "user") {
          setRateLimitForMessage(prev => {
            if (prev.has(lastUserMsg.id)) return prev;
            const next = new Set(prev);
            next.add(lastUserMsg.id);
            return next;
          });
        }
      }
    }
  }, [error, messages]);

  // Build the display messages list with rate limit responses inserted
  const allMessages = useMemo(() => {
    if (rateLimitForMessage.size === 0) return messages;

    const result: UIMessage[] = [];

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      result.push(msg);

      // After a user message, check if we need to add a rate limit response
      if (msg.role === "user" && rateLimitForMessage.has(msg.id)) {
        // Only add if there's no real assistant message following
        const nextMsg = messages[i + 1];
        if (!nextMsg || nextMsg.role === "user") {
          const toolCallId = `cta-${msg.id}`;
          result.push({
            id: `rate-limit-${msg.id}`,
            role: "assistant",
            parts: [
              {
                type: "text",
                text: dict.rateLimitMessage,
              },
              {
                type: "tool-display_cta",
                toolCallId,
                state: "result",
                input: { shouldShow: true },
                output: { shouldShow: true },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } as any,
            ],
            createdAt: new Date(),
          } as UIMessage);
        }
      }
    }

    return result;
  }, [messages, rateLimitForMessage, dict.rateLimitMessage]);

  const isLoading = status === "streaming" || status === "submitted";

  // Show typing indicator only when submitted AND no streaming content yet
  // This prevents the indicator from appearing after streaming has started
  const hasStreamingContent = useMemo(() => {
    if (messages.length === 0) return false;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role !== "assistant") return false;
    // Check if assistant message has any text content
    return lastMsg.parts.some(p => p.type === "text" && p.text.length > 0);
  }, [messages]);

  const isWaitingForResponse = status === "submitted" && !hasStreamingContent;

  const scrollToBottom = useCallback((instant = false) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: instant ? "instant" : "smooth",
      });
    }
  }, []);

  // Check if user is at the bottom (within 50px threshold)
  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsStuckToBottom(isAtBottom);
      // Update scrollable state
      setIsScrollable(scrollHeight > clientHeight);
    }
  }, []);

  // Only prevent page scroll when chat is scrollable and scroll would stay within bounds
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isScrollable = scrollHeight > clientHeight;

    if (!isScrollable) {
      // Chat is not overflowing, allow page scroll
      return;
    }

    const scrollingDown = e.deltaY > 0;
    const scrollingUp = e.deltaY < 0;
    const isAtTop = scrollTop <= 0;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight;

    // Only stop propagation if the scroll would stay within the chat
    if ((scrollingDown && !isAtBottom) || (scrollingUp && !isAtTop)) {
      e.stopPropagation();
    }
  }, []);

  // Track touch start position for mobile scroll handling
  const touchStartRef = useRef<{ y: number; scrollTop: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!messagesContainerRef.current) return;
    touchStartRef.current = {
      y: e.touches[0].clientY,
      scrollTop: messagesContainerRef.current.scrollTop,
    };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!messagesContainerRef.current || !touchStartRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isContentScrollable = scrollHeight > clientHeight;

    // If chat content is not scrollable, allow page scroll (don't prevent default)
    if (!isContentScrollable) {
      return;
    }

    const touchY = e.touches[0].clientY;
    const deltaY = touchStartRef.current.y - touchY;
    const scrollingDown = deltaY > 0;
    const scrollingUp = deltaY < 0;
    const isAtTop = scrollTop <= 0;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 1; // +1 for rounding

    // Allow page scroll if at boundaries and trying to scroll beyond
    if ((scrollingUp && isAtTop) || (scrollingDown && isAtBottom)) {
      return;
    }

    // Prevent page scroll only when scrolling within chat bounds
    e.stopPropagation();
  }, []);

  // Auto-scroll when messages change or loading state changes, if stuck to bottom
  useEffect(() => {
    if (isStuckToBottom) {
      scrollToBottom(true);
    }
  }, [allMessages, isLoading, isStuckToBottom, scrollToBottom]);

  // Check scrollability on mount and when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      setIsScrollable(scrollHeight > clientHeight);
    }
  }, [allMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !tokenRef.current) return;
    // Force stick to bottom when user sends a message
    setIsStuckToBottom(true);
    // Pass token dynamically via headers option
    sendMessage({ text: input }, {
      headers: {
        'X-Chat-Token': tokenRef.current,
      },
    });
    setInput("");
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };

  return (
    <section
      id="ask-ai"
      ref={containerRef}
      className="relative py-10 md:py-32 px-5 sm:px-8 md:px-16 lg:px-24 bg-transparent overflow-hidden scroll-mt-32 max-w-[100vw]"
    >
      {/* Captcha Logic - runs invisibly in background */}
      {!token && !verificationFailed && (
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onSuccess={async (t) => {
            try {
              const chatToken = await getChatToken(t);
              if (chatToken) {
                setToken(chatToken);
              } else {
                setVerificationFailed(true);
              }
            } catch {
              setVerificationFailed(true);
            }
          }}
          onError={() => setVerificationFailed(true)}
          onExpire={() => setVerificationFailed(true)}
        />
      )}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section Header */}
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

        {/* Chat Container */}
        <motion.div
          className="relative rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          style={{
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(255, 255, 255, 0.1), inset 0 0 16px 8px rgba(255, 255, 255, 0.2)",
          }}
        >
          {/* Top edge highlight */}
          <div
            className="pointer-events-none absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent)",
            }}
          />
          {/* Left edge highlight */}
          <div
            className="pointer-events-none absolute top-0 left-0 w-px h-full"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.9), transparent, rgba(255, 255, 255, 0.4))",
            }}
          />

          {/* Messages Area */}
          <div className="relative">
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              {...(isScrollable ? { 'data-lenis-prevent': true } : {})}
              className={`h-72 md:h-[450px] overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6 chat-scrollbar ${isScrollable ? 'overscroll-contain' : 'overscroll-auto'
                }`}
              style={{ touchAction: isScrollable ? 'pan-y' : 'auto' }}
            >
              {/* Welcome message - always shown first */}
              <WelcomeMessage dict={dict} />

              {/* Chat messages from AI SDK */}
              <AnimatePresence mode="popLayout" initial={false}>
                {allMessages.map((message, index) => {
                  // Check if this is the last assistant message and we're still streaming
                  const isLastMessage = index === allMessages.length - 1;
                  const isMessageStreaming = isLastMessage && message.role === "assistant" && status === "streaming";

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

              {/* Typing Indicator - only shown when waiting, not during streaming */}
              <AnimatePresence mode="wait">
                {isWaitingForResponse && (
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
                            animate={{
                              y: [0, -6, 0],
                            }}
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
                )}
              </AnimatePresence>

            </div>

            {/* Suggested Questions - overlaid at bottom of messages area */}
            <AnimatePresence mode="wait">
              {allMessages.length === 0 && (
                <motion.div
                  key="suggested-questions"
                  className="hidden sm:block absolute bottom-0 left-0 right-0 pb-4 px-8 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-wrap gap-2 pointer-events-auto">
                    {dict.suggestedQuestions.map((question) => (
                      <motion.button
                        key={question}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="px-4 py-2 text-sm text-black/80 bg-white/70 rounded-full border border-black/10 cursor-pointer backdrop-blur-sm"
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.9)", borderColor: "rgba(0, 119, 204, 0.3)" }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        {question}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 md:p-6 border-t border-white/30">
            <div className="relative flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isMobile ? dict.placeholderShort : dict.placeholder}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 focus:border-[#0077cc]/50 focus:outline-none focus:ring-2 focus:ring-[#0077cc]/20 text-black placeholder:text-black/40 placeholder:truncate transition-all duration-300 text-sm sm:text-base"
                  style={{
                    boxShadow:
                      "inset 0 2px 4px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.05)",
                  }}
                />
              </div>
              <Tooltip open={showTooltip && (!token || verificationFailed)}>
                <TooltipTrigger asChild>
                  <motion.button
                    type="submit"
                    disabled={!input.trim() || isLoading || !token}
                    className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-full bg-linear-to-br from-[#0077cc] to-[#003e7c] disabled:from-black/20 disabled:to-black/30 flex items-center justify-center text-white shadow-lg disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
                    whileHover={!input.trim() || isLoading ? {} : { scale: 1.05 }}
                    whileTap={!input.trim() || isLoading ? {} : { scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  sideOffset={8}
                  className="bg-white/90 backdrop-blur-sm text-black border border-black/10 shadow-lg"
                  arrowClassName="bg-white/90 fill-white/90"
                >
                  {verificationFailed ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{dict.verificationFailed}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#0077cc] animate-pulse" />
                      <span>{dict.verifyingBrowser}</span>
                      <Spinner className="w-3 h-3 text-[#0077cc]" />
                    </div>
                  )}
                </TooltipContent>
              </Tooltip>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

// Welcome message component (shown before any chat messages)
function WelcomeMessage({ dict }: { dict: AskAIDict }) {
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

