"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimate } from "framer-motion";
import extractTextFromPDF from "pdf-parser-client-side";

interface Flashcard {
  topic: string;
  back: string;
}

const FlashcardApp: React.FC = () => {
  const [flashcardsData, setFlashcardsData] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flipScope, animate] = useAnimate<HTMLDivElement>();
  const [file, setFile] = useState<File | null>(null);
  const [inputText, setInputText] = useState("");

  const fetchFlashcardsData = async (text?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching flashcards data...");
      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context: [
            {
              role: "user",
              parts: [
                {
                  text:
                    text ||
                    "This Test Plan's purpose is to establish the testing methodologies and protocols essential for validating that the Wayne Utilities application aligns with the predefined requirements outlined in the Wayne Utilities Requirement Specification document.",
                },
              ],
            },
          ],
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received data:", data);

      if (!Array.isArray(data)) {
        throw new Error("Received data is not an array");
      }

      setFlashcardsData(data);
      console.log("Flashcards set:", data);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      setError("Error fetching flashcards: " + (error as Error).message);
    } finally {
      setIsLoading(false);
      console.log("Loading finished");
    }
  };

  const handlePrevCard = () => {
    setCurrentCardIndex(
      (prevIndex) =>
        (prevIndex - 1 + flashcardsData.length) % flashcardsData.length
    );
    setIsFlipped(false);
  };

  const handleFlip = () => {
    void animate(flipScope.current, {
      rotateY: isFlipped ? [180, 0] : [0, 180],
    });
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcardsData.length);
    if (isFlipped) {
      handleFlip();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    let text = inputText;

    if (file) {
      const extractedText = await extractTextFromPDF(file, "clean");
      if (extractedText) {
        text = extractedText;
      }
    }

    await fetchFlashcardsData(text);
  };

  if (isLoading) {
    return (
      <div className="text-center text-indigo-200/65">
        Loading flashcards...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 md:pb-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50">
              <span className="inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                Flashcard Quiz
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Test Your Knowledge
            </h2>
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="mx-auto max-w-sm mb-8">
            <div className="mb-4">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-2 text-gray-900 bg-gray-100 rounded"
                placeholder="Enter text for flashcards..."
              />
            </div>
            <div className="mb-4">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf"
                className="w-full p-2 text-gray-900 bg-gray-100 rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full btn-sm relative rounded-full bg-gray-800/40 px-2.5 py-1.5 text-sm font-medium text-indigo-200/65 hover:bg-gray-800/60"
            >
              Generate Flashcards
            </button>
          </form>

          {flashcardsData.length > 0 && (
            <>
              {/* Flashcard */}
              <div className="mx-auto max-w-sm">
                <div
                  className="group/card relative h-64 overflow-hidden rounded-2xl bg-gray-800 p-px cursor-pointer [perspective:1000px]"
                  onClick={handleFlip}
                >
                  <motion.div
                    ref={flipScope}
                    className="relative z-20 h-full w-full [transform-style:preserve-3d]"
                    style={{ transformOrigin: "center" }}
                  >
                    <div className="absolute inset-0 overflow-hidden rounded-[inherit] bg-gray-950 after:absolute after:inset-0 after:bg-gradient-to-br after:from-gray-900/50 after:via-gray-800/25 after:to-gray-900/50 [backface-visibility:hidden]">
                      <div className="flex items-center justify-center h-full p-6 text-center">
                        <p className="text-xl font-semibold text-indigo-200/65">
                          {flashcardsData[currentCardIndex].topic}
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 overflow-hidden rounded-[inherit] bg-gray-950 after:absolute after:inset-0 after:bg-gradient-to-br after:from-gray-900/50 after:via-gray-800/25 after:to-gray-900/50 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <div className="flex items-center justify-center h-full p-6 text-center">
                        <p className="text-xl font-semibold text-indigo-200/65">
                          {flashcardsData[currentCardIndex].back}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handlePrevCard}
                    className="btn-sm relative rounded-full bg-gray-800/40 px-2.5 py-1.5 text-sm font-medium text-indigo-200/65 hover:bg-gray-800/60"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextCard}
                    className="btn-sm relative rounded-full bg-gray-800/40 px-2.5 py-1.5 text-sm font-medium text-indigo-200/65 hover:bg-gray-800/60"
                  >
                    Next
                  </button>
                </div>

                {/* Card counter */}
                <div className="mt-4 text-center text-sm text-indigo-200/65">
                  Card {currentCardIndex + 1} of {flashcardsData.length}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default FlashcardApp;
