"use client";

import React, { useState, useEffect } from "react";

interface Flashcard {
  topic: string;
  back: string;
}

const FlashcardApp: React.FC = () => {
  const [flashcardsData, setFlashcardsData] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFlashcardsData();
  }, []);

  const fetchFlashcardsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          $key: "bb-5u30382r5t3h705q576e3z17102c223t623f5a6f4o2h2pz442",
          context: [
            {
              role: "user",
              parts: [
                {
                  text: "This Test Plan's purpose is to establish the testing methodologies and protocols essential for validating that the Wayne Utilities application aligns with the predefined requirements outlined in the Wayne Utilities Requirement Specification document. It serves as a comprehensive roadmap for the testing team, facilitating thorough evaluation to guarantee the application's quality and dependability prior to release. Along with this, it would serve as a proper comprehensive guide for parties aside from the testing team to view the testing approach done by the team",
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch flashcards data");
      }

      const text = await response.text();
      console.log("Raw response:", text);

      // Parse the outer JSON structure
      const data = JSON.parse(text.replace(/^data: /, ""));

      // Navigate to the part containing the flashcards JSON string
      const flashcardsJsonString = data[1].outputs.context[3].parts[0].text;

      // Extract the actual JSON array string from the text
      const match = flashcardsJsonString.match(/```json\n([\s\S]*?)\n```/);
      if (!match) {
        throw new Error("Could not find flashcards data in the response");
      }

      // Parse the inner JSON array
      const flashcardsArray: Flashcard[] = JSON.parse(match[1]);

      console.log("Parsed flashcards:", flashcardsArray);

      setFlashcardsData(flashcardsArray);
    } catch (error) {
      console.error("Full error:", error);
      setError("Error fetching flashcards: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcardsData.length);
    setIsFlipped(false);
  };

  const handlePrevCard = () => {
    setCurrentCardIndex(
      (prevIndex) =>
        (prevIndex - 1 + flashcardsData.length) % flashcardsData.length
    );
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
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

  if (flashcardsData.length === 0) {
    return (
      <div className="text-center text-indigo-200/65">
        No flashcards available.
      </div>
    );
  }

  const currentCard = flashcardsData[currentCardIndex];

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

          {/* Flashcard */}
          <div className="mx-auto max-w-sm">
            <div
              className="group/card relative h-64 overflow-hidden rounded-2xl bg-gray-800 p-px cursor-pointer"
              onClick={handleFlip}
            >
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 after:absolute after:inset-0 after:bg-gradient-to-br after:from-gray-900/50 after:via-gray-800/25 after:to-gray-900/50">
                <div className="flex items-center justify-center h-full p-6 text-center">
                  <p className="text-xl font-semibold text-indigo-200/65">
                    {isFlipped ? currentCard.back : currentCard.topic}
                  </p>
                </div>
              </div>
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
        </div>
      </div>
    </section>
  );
};

export default FlashcardApp;
