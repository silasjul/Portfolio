"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Send, Sparkles, User, Bot, Loader2 } from "lucide-react";
import { useChat, type UIMessage } from "@ai-sdk/react";

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

// Helper to extract text content from a UIMessage
function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("");
}

// Markdown parser with proper newline and formatting support
function parseMarkdown(text: string): React.ReactNode[] {
  let key = 0;

  // Process inline formatting within a line
  const processInline = (str: string): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;

    // Match: **bold**, `code` - we'll handle these with regex
    // Bold must have ** on both sides, code must have ` on both sides
    const regex = /(\*\*(.+?)\*\*|`([^`]+)`)/g;
    let match;

    while ((match = regex.exec(str)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        nodes.push(str.slice(lastIndex, match.index));
      }

      if (match[2]) {
        // Bold **text**
        nodes.push(<strong key={`b-${key++}`}>{match[2]}</strong>);
      } else if (match[3]) {
        // Inline code `text`
        nodes.push(
          <code key={`c-${key++}`} className="bg-black/10 px-1.5 py-0.5 rounded text-sm font-mono">
            {match[3]}
          </code>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < str.length) {
      nodes.push(str.slice(lastIndex));
    }

    return nodes.length > 0 ? nodes : [str];
  };

  // Process a single line and return appropriate element
  const processLine = (line: string, idx: number): React.ReactNode => {
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      return <br key={`br-${key++}`} />;
    }

    // Heading: # ## ###
    if (trimmed.startsWith('### ')) {
      return <h4 key={`h4-${key++}`} className="font-semibold text-base mt-3 mb-1">{processInline(trimmed.slice(4))}</h4>;
    }
    if (trimmed.startsWith('## ')) {
      return <h3 key={`h3-${key++}`} className="font-semibold text-lg mt-4 mb-1">{processInline(trimmed.slice(3))}</h3>;
    }
    if (trimmed.startsWith('# ')) {
      return <h2 key={`h2-${key++}`} className="font-bold text-xl mt-4 mb-2">{processInline(trimmed.slice(2))}</h2>;
    }

    // Horizontal rule: --- or ***
    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      return <hr key={`hr-${key++}`} className="my-4 border-black/20" />;
    }

    // Bullet point: * or - at start of line (not italic)
    if (/^[\*\-]\s/.test(trimmed)) {
      return (
        <div key={`li-${key++}`} className="flex gap-2 ml-2">
          <span className="text-black text-lg leading-none mt-0.5">•</span>
          <span>{processInline(trimmed.slice(2))}</span>
        </div>
      );
    }

    // Numbered list: 1. 2. etc
    const numberedMatch = trimmed.match(/^(\d+)\.\s(.+)/);
    if (numberedMatch) {
      return (
        <div key={`ol-${key++}`} className="flex gap-2 ml-2">
          <span className="text-[#0077cc] min-w-[1.5em]">{numberedMatch[1]}.</span>
          <span>{processInline(numberedMatch[2])}</span>
        </div>
      );
    }

    // Regular paragraph
    return <p key={`p-${key++}`} className="mb-1">{processInline(line)}</p>;
  };

  // First, extract and handle code blocks
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  const segments: { type: 'text' | 'code'; content: string; language?: string }[] = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'code', content: match[2].trim(), language: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) });
  }

  // Process each segment
  const result: React.ReactNode[] = [];

  for (const segment of segments) {
    if (segment.type === 'code') {
      result.push(
        <pre key={`code-${key++}`} className="bg-black/10 rounded-lg p-4 my-3 overflow-x-auto">
          <code className="text-sm font-mono whitespace-pre">{segment.content}</code>
        </pre>
      );
    } else {
      // Split text into lines and process each
      const lines = segment.content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        result.push(processLine(lines[i], i));
      }
    }
  }

  return result;
}

export default function AskAI({ dict }: { dict: AskAIDict }) {
  const containerRef = useRef(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const [isStuckToBottom, setIsStuckToBottom] = useState(true);
  const [input, setInput] = useState("");

  // Use the AI SDK's useChat hook for streaming
  const { messages, sendMessage, status } = useChat();

  const isLoading = status === "streaming" || status === "submitted";
  // Only show typing indicator when waiting for response, not while streaming
  const isWaitingForResponse = status === "submitted";

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

  // Auto-scroll when messages change or loading state changes, if stuck to bottom
  useEffect(() => {
    if (isStuckToBottom) {
      scrollToBottom(true);
    }
  }, [messages, isLoading, isStuckToBottom, scrollToBottom]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    // Force stick to bottom when user sends a message
    setIsStuckToBottom(true);
    sendMessage({ text: input });
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
              {/* Welcome message - always shown first */}
              <WelcomeMessage key="welcome" dict={dict} />

              {/* Chat messages from AI SDK */}
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  dict={dict}
                  getMessageText={getMessageText}
                />
              ))}
            </AnimatePresence>

            {/* Typing Indicator - only shown when waiting, not during streaming */}
            <AnimatePresence>
              {isWaitingForResponse && (
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
            {messages.length === 0 && (
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
          <form onSubmit={handleSendMessage} className="p-4 md:p-6 border-t border-white/30">
            <div className="relative flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
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
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-14 h-14 rounded-full bg-linear-to-br from-[#0077cc] to-[#003e7c] disabled:from-black/20 disabled:to-black/30 flex items-center justify-center text-white shadow-lg disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
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
            </div>
          </form>
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

// Welcome message component (shown before any chat messages)
function WelcomeMessage({ dict }: { dict: AskAIDict }) {
  return (
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

      {/* Message Content - full width, no bubble (matches AI messages) */}
      <div className="flex-1 min-w-0">
        <span className="text-xs text-black/50 font-medium uppercase tracking-wider mb-1.5 block">
          {dict.aiName}
        </span>
        <div className="text-black/90 text-[15px] leading-relaxed">
          <p>{dict.welcomeMessage}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Message bubble for chat messages from AI SDK
function MessageBubble({
  message,
  dict,
  getMessageText,
}: {
  message: UIMessage;
  dict: AskAIDict;
  getMessageText: (message: UIMessage) => string;
}) {
  const isUser = message.role === "user";
  const content = getMessageText(message);

  // Memoize parsed markdown to avoid re-parsing on every render
  const parsedContent = useMemo(() => parseMarkdown(content), [content]);

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
  );
}
