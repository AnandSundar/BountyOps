"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AIBadgeProps {
  className?: string;
  size?: "sm" | "md";
}

export function AIBadge({ className = "", size = "sm" }: AIBadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 ${size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2 py-1 text-sm"} ${className}`}
    >
      <Sparkles className={`${size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} text-teal-400`} />
      <span className="text-teal-300 font-medium">AI</span>
    </motion.span>
  );
}
