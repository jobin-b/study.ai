"use client";
import React, { useState } from "react";
import { TextToSpeech } from "./TextToSpeech";
import { Loader2 } from "lucide-react";
import extractTextFromPDF from "pdf-parser-client-side";

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
    <div className="min-h-screen bg-gray-900 text-white py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-400 bg-clip-text text-transparent mb-6">
          Crash Course PDF to Speech
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 transition-colors"
          />

          <button
            type="submit"
            disabled={!file || isLoading}
            className={`w-full py-2 rounded-lg text-lg font-medium transition-colors 
              ${
                isLoading
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              } text-white`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin inline-block mr-2" />
            ) : null}
            {isLoading ? "Processing..." : "Process PDF"}
          </button>
        </form>

        {isLoading && (
          <div className="flex items-center justify-center mt-6 space-x-2">
            <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
            <span className="text-lg text-indigo-400">Processing PDF...</span>
          </div>
        )}

        {transcript && (
          <div className="mt-10 p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-400 bg-clip-text text-transparent mb-4">
              Transcript
            </h2>
            <TextToSpeech text={transcript} />
          </div>
        )}
      </div>
    </div>
  );
}
