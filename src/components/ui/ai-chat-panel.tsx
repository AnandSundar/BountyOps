"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AILoading } from "./ai-loading";
import { Sparkles, X, Send, Bot, User, ChevronDown } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  messages: Message[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
  suggestions?: string[];
}

export function AIChatPanel({
  isOpen,
  onClose,
  title = "AI Assistant",
  messages,
  onSendMessage,
  isLoading = false,
  suggestions = [],
}: AIChatPanelProps) {
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const [localLoading, setLocalLoading] = useState(isLoading);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  useEffect(() => {
    setLocalLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  const handleSend = async () => {
    if (!input.trim() || localLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setLocalMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLocalLoading(true);

    try {
      await onSendMessage(userMessage.content);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setInput(suggestion);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: suggestion,
      timestamp: new Date(),
    };
    setLocalMessages((prev) => [...prev, userMessage]);
    setLocalLoading(true);
    try {
      await onSendMessage(suggestion);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 h-[70vh] bg-slate-900 border-t border-slate-700 rounded-t-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-500/20 rounded-lg">
                  <Bot className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p className="text-xs text-slate-400">AI-powered assistant</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-slate-400 hover:text-white"
              >
                <ChevronDown className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {localMessages.length === 0 && (
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 text-teal-400 mx-auto mb-4" />
                  <p className="text-slate-400">Ask me anything about this report</p>
                </div>
              )}

              {localMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="p-2 bg-teal-500/20 rounded-lg h-fit">
                      <Bot className="w-4 h-4 text-teal-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-teal-600 text-white"
                        : "bg-slate-800 text-slate-200"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="p-2 bg-slate-700 rounded-lg h-fit">
                      <User className="w-4 h-4 text-slate-300" />
                    </div>
                  )}
                </motion.div>
              ))}

              {localLoading && (
                <div className="flex gap-3">
                  <div className="p-2 bg-teal-500/20 rounded-lg h-fit">
                    <Bot className="w-4 h-4 text-teal-400" />
                  </div>
                  <AILoading message="Thinking..." />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && localMessages.length === 0 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full border border-slate-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  disabled={localLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || localLoading}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
