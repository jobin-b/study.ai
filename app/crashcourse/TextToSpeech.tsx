"use client";

import { useTTS } from "@cartesia/cartesia-js/react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface TextToSpeechProps {
  text: string;
}

export function TextToSpeech({ text }: TextToSpeechProps) {
  const [error, setError] = useState<string | null>(null);
  const tts = useTTS({
    apiKey: process.env.NEXT_PUBLIC_CARTESIA_API_KEY!,
    sampleRate: 44100,
  });

  useEffect(() => {
    console.log("Text received:", text);
  }, [text]);

  const handlePlay = async () => {
    if (tts.playbackStatus === "paused") {
      await tts.resume();
      return;
    }
    try {
      console.log("Starting audio playback");
      setError(null);

      const response = await tts.buffer({
        model_id: "sonic-english",
        voice: {
          mode: "id",
          id: "f146dcec-e481-45be-8ad2-96e1e40e7f32",
        },
        transcript: text,
      });

      console.log("Buffer response:", response);
      await tts.play();
      console.log("Audio playback started");
    } catch (err) {
      console.error("Error in handlePlay:", err);
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="p-6 rounded-lg bg-gray-800 shadow-lg relative">
      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-indigo-500 to-purple-400 bg-clip-text text-transparent">
        Text-to-Speech Playback
      </h3>

      <div className="text-center text-purple-300 text-lg mb-4">
        Playback Status:{" "}
        <span className="text-blue-400">{tts.playbackStatus}</span> | Buffer
        Status:{" "}
        {tts.bufferStatus === "buffering" ? (
          <Loader2 className="animate-spin inline-block w-5 h-5 text-blue-400" />
        ) : (
          <span className="text-blue-400">{tts.bufferStatus}</span>
        )}
      </div>

      <div className="space-x-4 mb-4 flex justify-center">
        <button
          onClick={handlePlay}
          disabled={tts.isWaiting}
          className={`px-6 py-2 font-semibold rounded-md transition-all
            ${
              tts.isWaiting
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            } 
            text-white shadow-md`}
        >
          {tts.isWaiting ? "Loading..." : "Play"}
        </button>

        <button
          onClick={tts.pause}
          disabled={tts.playbackStatus !== "playing"}
          className={`px-6 py-2 font-semibold rounded-md transition-all
            ${
              tts.playbackStatus !== "playing"
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            } 
            text-white shadow-md`}
        >
          Pause
        </button>
      </div>

      {error && (
        <div className="text-red-500 mt-2 text-center">Error: {error}</div>
      )}
    </div>
  );
}
