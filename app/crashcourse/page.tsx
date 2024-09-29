"use client";
import React, { useState } from "react";
import { TextToSpeech } from "./TextToSpeech";
import { Loader2 } from "lucide-react";
import extractTextFromPDF from "pdf-parser-client-side";
import Homer from "@/components/ui/homer";

export default function CrashCoursePage() {
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    setIsLoading(true);
    const text = await extractTextFromPDF(file, "clean");

    try {
      console.log("Transcripting...");
      const response = await fetch("/api/crashcourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          $key: process.env.GEMINI_KEY,
          context: [
            {
              role: "user",
              parts: [
                {
                  text,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process text");
      }

      const data = await response.text();
      const parsedData = JSON.parse(data.replace(/^data: /, ""));
      const extractedTranscript =
        parsedData[1].outputs.context[1].parts[0].text;

      setTranscript(extractedTranscript);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing the PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white">
      <Homer />
      <div className="max-w-4xl mx-auto">
        <div className="mx-auto max-w-4xl pb-12 text-center">
          <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50">
            <span className="inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent text-3xl">
              Crash Course
            </span>
          </div>
          <h1 className="text-5xl animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle font-semibold text-transparent">
            Lecture Material to Audio Summary
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 ">
          <div className="flex justify-center">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full max-w-xs text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 transition-colors"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!file || isLoading}
              className={`w-full max-w-xs py-2 rounded-lg text-lg font-medium transition-colors 
        ${
          isLoading
            ? "bg-gray-700 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-500 to-indigo-200"
        } text-white`}
            >
              {isLoading ? (
                <Loader2 className="animate-spin inline-block mr-2" />
              ) : null}
              {isLoading ? "Processing..." : "Process PDF"}
            </button>
          </div>
        </form>

        {transcript && (
          <div className="mt-10 p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent mb-4">
              Transcript
            </h2>
            <TextToSpeech text={transcript} />
          </div>
        )}
      </div>
    </div>
  );
}
