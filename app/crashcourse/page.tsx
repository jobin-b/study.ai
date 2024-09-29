"use client";
import React, { useState } from "react";
import { TextToSpeech } from "./TextToSpeech";
import { Loader2 } from "lucide-react";

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
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await fetch("/api/pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process PDF");
      }

      const data = await response.json();
      setTranscript(data.transcript);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing the PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Crash Course PDF to Speech</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="mb-2 block"
        />
        <button
          type="submit"
          disabled={!file || isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {isLoading ? (
            <Loader2 className="animate-spin inline-block mr-2" />
          ) : null}
          Process PDF
        </button>
      </form>

      {isLoading && (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          <span className="ml-2">Processing PDF...</span>
        </div>
      )}

      {transcript && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Transcript</h2>
          <TextToSpeech text={transcript} />
        </div>
      )}
    </div>
  );
}
