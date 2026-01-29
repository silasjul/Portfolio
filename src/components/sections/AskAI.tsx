"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Send, Sparkles, User, Bot, Loader2 } from "lucide-react";

type AskAIDict = {
  label: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  placeholder: string;
  sendButton: string;
  suggestedQuestions: string[];
  aiName: string;
  welcomeMessage: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function AskAI({ dict }: { dict: AskAIDict }) {
  const containerRef = useRef(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: dict.welcomeMessage,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isStuckToBottom, setIsStuckToBottom] = useState(true);

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
    }
  }, []);

  // Auto-scroll when messages change or typing state changes, if stuck to bottom
  useEffect(() => {
    if (isStuckToBottom) {
      scrollToBottom(true);
    }
  }, [messages, isTyping, isStuckToBottom, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
    };

    // Force stick to bottom when user sends a message
    setIsStuckToBottom(true);
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response - replace with actual API call
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Thank you for your question! This is a placeholder response. Connect this to your AI backend to provide real answers about your services and capabilities.",
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section
      id="ask-ai"
      ref={containerRef}
      className="relative py-16 md:py-32 px-8 md:px-16 lg:px-24 bg-transparent overflow-hidden scroll-mt-32"
    >
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="inline-flex items-center gap-2 text-[#0077cc] text-sm tracking-[0.3em] uppercase font-medium bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4" />
            {dict.label}
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl text-black mt-6 mb-4 font-(family-name:--font-playfair) leading-tight">
            {dict.title}{" "}
            <span className="italic text-[#0077cc]">{dict.titleHighlight}</span>
          </h2>
          <p className="text-black/70 text-lg max-w-2xl mx-auto leading-relaxed">
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
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            onWheel={(e) => e.stopPropagation()}
            data-lenis-prevent
            className="h-100 md:h-[450px] overflow-y-auto overscroll-contain p-6 md:p-8 space-y-6 chat-scrollbar"
          >
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} dict={dict} />
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#0077cc] to-[#003e7c] flex items-center justify-center shrink-0 shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-white/60 backdrop-blur-sm">
                    <motion.div
                      className="flex gap-1.5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
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
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Suggested Questions */}
          <AnimatePresence>
            {messages.length === 1 && (
              <motion.div
                className="px-6 md:px-8 pb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-wrap gap-2">
                  {dict.suggestedQuestions.map((question, index) => (
                    <motion.button
                      key={question}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="px-4 py-2 text-sm text-black/80 bg-white/50 rounded-full border border-black/10 cursor-pointer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.7)", borderColor: "rgba(0, 119, 204, 0.3)" }}
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

          {/* Input Area */}
          <div className="p-4 md:p-6 border-t border-white/30">
            <div className="relative flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={dict.placeholder}
                  className="w-full px-6 py-4 pr-14 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 focus:border-[#0077cc]/50 focus:outline-none focus:ring-2 focus:ring-[#0077cc]/20 text-black placeholder:text-black/40 transition-all duration-300"
                  style={{
                    boxShadow:
                      "inset 0 2px 4px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.05)",
                  }}
                />
              </div>
              <motion.button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="w-14 h-14 rounded-full bg-linear-to-br from-[#0077cc] to-[#003e7c] disabled:from-black/20 disabled:to-black/30 flex items-center justify-center text-white shadow-lg disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
                whileHover={!inputValue.trim() || isTyping ? {} : { scale: 1.05 }}
                whileTap={!inputValue.trim() || isTyping ? {} : { scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                {isTyping ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 bg-[#0077cc]/5 rounded-full blur-3xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#0077cc]/5 rounded-full blur-3xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.7 }}
        />
      </div>
    </section>
  );
}

function MessageBubble({
  message,
  dict,
}: {
  message: Message;
  dict: AskAIDict;
}) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={`flex items-start gap-4 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <motion.div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ${isUser
          ? "bg-black/80"
          : "bg-linear-to-br from-[#0077cc] to-[#003e7c]"
          }`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </motion.div>

      {/* Message Content */}
      <div
        className={`max-w-[80%] ${isUser ? "text-right" : ""}`}
      >
        {!isUser && (
          <span className="text-xs text-black/50 font-medium uppercase tracking-wider mb-1.5 block">
            {dict.aiName}
          </span>
        )}
        <div
          className={`px-5 py-4 rounded-2xl ${isUser
            ? "bg-black/80 text-white rounded-tr-sm"
            : "bg-white/60 backdrop-blur-sm text-black/90 rounded-tl-sm border border-white/40"
            }`}
          style={
            !isUser
              ? {
                boxShadow:
                  "0 4px 16px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
              }
              : {
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
              }
          }
        >
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
