"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Homer from "@/components/ui/homer";

interface Message {
  role: "user" | "ai";
  content: string;
}

const AIChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const requestBody: any = { message: input };
      if (nextToken) {
        requestBody.nextToken = nextToken;
      }

      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();

      if (data.response) {
        const aiMessage: Message = { role: "ai", content: data.response };
        setMessages((prev) => [...prev, aiMessage]);
        // Update the next token for the next request
        if (data.nextToken) {
          setNextToken(data.nextToken);
        } else {
          // If no nextToken is provided, reset it
          setNextToken(null);
        }
      } else if (data.error) {
        console.error("Error:", data.error);
        // Optionally, display an error message to the user
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Homer />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="pb-12 md:pb-20">
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50">
              <span className="text-3xl inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                Practice Quiz
              </span>
            </div>
            <h2 className="text-5xl animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle font-semibold text-transparent">
              Chat With AI
            </h2>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 h-96 overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`mb-4 ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-700 text-indigo-200"
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow p-2 rounded-l-lg bg-gray-700 text-white focus:outline-none"
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button
              type="submit"
              className="btn-sm relative rounded-r-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-400"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AIChatComponent;
