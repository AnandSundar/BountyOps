"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AILoadingProps {
  className?: string;
  message?: string;
}

export function AILoading({ className = "", message = "AI is thinking..." }: AILoadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 ${className}`}
    >
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Sparkles className="w-5 h-5 text-teal-400" />
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-teal-400/20 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      </div>
      <div className="flex-1 space-y-2">
        <motion.div
          className="h-3 bg-slate-700 rounded w-3/4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 bg-slate-700 rounded w-16"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ 
                repeat: Infinity, 
                duration: 1, 
                delay: i * 0.15 
              }}
            />
          ))}
        </div>
      </div>
      <span className="text-sm text-slate-400">{message}</span>
    </motion.div>
  );
}

export function AIPulseSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="h-16 bg-slate-800/50 rounded-lg border border-slate-700/50"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}
