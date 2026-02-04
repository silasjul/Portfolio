"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { UIMessage } from "@ai-sdk/react";
import type { AskAIDict } from "./types";

/**
 * Detects if the screen is mobile-sized
 */
export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

/**
 * Delays tooltip appearance until after section animation completes
 */
export function useDelayedTooltip(isInView: boolean, delay = 1100) {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (isInView && !showTooltip) {
      const timer = setTimeout(() => setShowTooltip(true), delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, showTooltip, delay]);

  return showTooltip;
}

/**
 * Manages scroll behavior for the chat messages container
 */
export function useScrollManagement(
  messagesContainerRef: React.RefObject<HTMLDivElement | null>,
  dependencies: unknown[]
) {
  const [isStuckToBottom, setIsStuckToBottom] = useState(true);
  const [isScrollable, setIsScrollable] = useState(false);
  const touchStartRef = useRef<{ y: number; scrollTop: number } | null>(null);

  const scrollToBottom = useCallback(
    (instant = false) => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: instant ? "instant" : "smooth",
        });
      }
    },
    [messagesContainerRef]
  );

  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsStuckToBottom(isAtBottom);
      setIsScrollable(scrollHeight > clientHeight);
    }
  }, [messagesContainerRef]);

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (!messagesContainerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const contentIsScrollable = scrollHeight > clientHeight;

      if (!contentIsScrollable) return;

      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;
      const isAtTop = scrollTop <= 0;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight;

      if ((scrollingDown && !isAtBottom) || (scrollingUp && !isAtTop)) {
        e.stopPropagation();
      }
    },
    [messagesContainerRef]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!messagesContainerRef.current) return;
      touchStartRef.current = {
        y: e.touches[0].clientY,
        scrollTop: messagesContainerRef.current.scrollTop,
      };
    },
    [messagesContainerRef]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!messagesContainerRef.current || !touchStartRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const isContentScrollable = scrollHeight > clientHeight;

      if (!isContentScrollable) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartRef.current.y - touchY;
      const scrollingDown = deltaY > 0;
      const scrollingUp = deltaY < 0;
      const isAtTop = scrollTop <= 0;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 1;

      if ((scrollingUp && isAtTop) || (scrollingDown && isAtBottom)) return;

      e.stopPropagation();
    },
    [messagesContainerRef]
  );

  // Auto-scroll when dependencies change, if stuck to bottom
  useEffect(() => {
    if (isStuckToBottom) {
      scrollToBottom(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, isStuckToBottom, scrollToBottom]);

  // Check scrollability when dependencies change
  useEffect(() => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      setIsScrollable(scrollHeight > clientHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    isStuckToBottom,
    setIsStuckToBottom,
    isScrollable,
    scrollToBottom,
    handleScroll,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
  };
}

/**
 * Handles rate limit errors and builds display messages with rate limit responses
 */
export function useRateLimitMessages(
  messages: UIMessage[],
  error: Error | undefined,
  dict: AskAIDict
) {
  const [rateLimitForMessage, setRateLimitForMessage] = useState<Set<string>>(
    new Set()
  );
  const prevErrorRef = useRef<Error | undefined>(undefined);

  useEffect(() => {
    const errorMsg = error?.message?.toLowerCase() ?? "";
    const isRateLimitError =
      errorMsg.includes("rate limit") || errorMsg.includes("high traffic");

    const errorChanged = error !== prevErrorRef.current;
    prevErrorRef.current = error;

    if (isRateLimitError && errorChanged) {
      const userMessages = messages.filter((m) => m.role === "user");
      if (userMessages.length > 0) {
        const lastUserMsg = userMessages[userMessages.length - 1];
        const lastUserIndex = messages.findIndex(
          (m) => m.id === lastUserMsg.id
        );
        const nextMsg = messages[lastUserIndex + 1];

        if (!nextMsg || nextMsg.role === "user") {
          setRateLimitForMessage((prev) => {
            if (prev.has(lastUserMsg.id)) return prev;
            const next = new Set(prev);
            next.add(lastUserMsg.id);
            return next;
          });
        }
      }
    }
  }, [error, messages]);

  const allMessages = useMemo(() => {
    if (rateLimitForMessage.size === 0) return messages;

    const result: UIMessage[] = [];

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      result.push(msg);

      if (msg.role === "user" && rateLimitForMessage.has(msg.id)) {
        const nextMsg = messages[i + 1];
        if (!nextMsg || nextMsg.role === "user") {
          const toolCallId = `cta-${msg.id}`;
          result.push({
            id: `rate-limit-${msg.id}`,
            role: "assistant",
            parts: [
              { type: "text", text: dict.rateLimitMessage },
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

  return allMessages;
}

/**
 * Determines if the chat is in a loading/streaming state
 */
export function useChatLoadingState(status: string, messages: UIMessage[]) {
  const isLoading = status === "streaming" || status === "submitted";

  const hasStreamingContent = useMemo(() => {
    if (messages.length === 0) return false;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role !== "assistant") return false;
    return lastMsg.parts.some((p) => p.type === "text" && p.text.length > 0);
  }, [messages]);

  const isWaitingForResponse = status === "submitted" && !hasStreamingContent;

  return { isLoading, isWaitingForResponse };
}
