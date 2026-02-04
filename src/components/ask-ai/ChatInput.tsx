"use client";

import { motion } from "framer-motion";
import { Send, Loader2, ShieldCheck } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";
import type { AskAIDict } from "./types";

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  hasToken: boolean;
  verificationFailed: boolean;
  showTooltip: boolean;
  isMobile: boolean;
  dict: AskAIDict;
}

export function ChatInput({
  input,
  onInputChange,
  onSubmit,
  isLoading,
  hasToken,
  verificationFailed,
  showTooltip,
  isMobile,
  dict,
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as unknown as React.FormEvent);
    }
  };

  const isDisabled = !input.trim() || isLoading || !hasToken;

  return (
    <form onSubmit={onSubmit} className="p-4 md:p-6 border-t border-white/30">
      <div className="relative flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isMobile ? dict.placeholderShort : dict.placeholder}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 focus:border-[#0077cc]/50 focus:outline-none focus:ring-2 focus:ring-[#0077cc]/20 text-black placeholder:text-black/40 placeholder:truncate transition-all duration-300 text-sm sm:text-base"
            style={{
              boxShadow:
                "inset 0 2px 4px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          />
        </div>
        <Tooltip open={showTooltip && (!hasToken || verificationFailed)}>
          <TooltipTrigger asChild>
            <motion.button
              type="submit"
              disabled={isDisabled}
              className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-full bg-linear-to-br from-[#0077cc] to-[#003e7c] disabled:from-black/20 disabled:to-black/30 flex items-center justify-center text-white shadow-lg disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
              whileHover={isDisabled ? {} : { scale: 1.05 }}
              whileTap={isDisabled ? {} : { scale: 0.95 }}
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
  );
}
