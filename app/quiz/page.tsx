"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Homer from "@/components/ui/homer";
import extractTextFromPDF from "pdf-parser-client-side";
import Markdown from "react-markdown";

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
  const [file, setFile] = useState<File | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !file) return;

    setIsLoading(true);

    let messageContent = input;

    if (file) {
      try {
        const extractedText = await extractTextFromPDF(file, "clean");
        if (extractedText) {
          messageContent = extractedText;
        }
      } catch (error) {
        console.error("Error extracting text from PDF:", error);
        setIsLoading(false);
        return;
      }
    }

    const userMessage: Message = { role: "user", content: messageContent };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setFile(null);

    try {
      const requestBody: any = { message: messageContent };
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
        if (data.nextToken) {
          setNextToken(data.nextToken);
        } else {
          setNextToken(null);
        }
      } else if (data.error) {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <>
      <Homer />
      <div className="flex-grow flex flex-col mx-auto w-full max-w-5xl px-4 sm:px-6 py-12">
        <div className="flex flex-col h-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50">
              <span className="text-3xl inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                Practice Quiz
              </span>
            </div>
            <h2 className="text-5xl animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle font-semibold text-transparent">
              Learn With AI
            </h2>
          </div>

          <div className="flex-grow flex flex-col">
            <div className="bg-gray-800 rounded-lg p-4 mb-4 overflow-y-auto h-[500px]">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-4">
                  Start a conversation or upload a PDF to begin.
                </div>
              )}
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
                    <Markdown>{msg.content}</Markdown>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-stretch">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-grow p-3 rounded-l-lg bg-gray-700 text-white focus:outline-none"
                  placeholder="Type your message..."
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="h-full p-3 text-md relative rounded-r-lg bg-indigo-600 font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-400"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="flex-grow p-2 text-sm text-gray-200 bg-gray-700 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                />
                {file && (
                  <span className="text-sm text-indigo-200">{file.name}</span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChatComponent;
