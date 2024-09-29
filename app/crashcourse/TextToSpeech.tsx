import { useTTS } from "@cartesia/cartesia-js/react";
import { useEffect } from "react";
import { config } from "dotenv";

config(); // Load environment variables

interface TextToSpeechProps {
  text: string;
}

export function TextToSpeech({ text }: TextToSpeechProps) {
  const tts = useTTS({
    apiKey: process.env.CARTESIA_API_KEY!,
    sampleRate: 44100,
  });

  const handlePlay = async () => {
    // Begin buffering the audio.
    const response = await tts.buffer({
      model_id: "sonic-english",
      voice: {
        mode: "id",
        id: "f146dcec-e481-45be-8ad2-96e1e40e7f32",
      },
      transcript: text,
    });

    // Immediately play the audio. (You can also buffer in advance and play later.)
    await tts.play();
  };

  return (
    <div>
      <button onClick={handlePlay}>Play</button>

      <div>
        {tts.playbackStatus} | {tts.bufferStatus} | {tts.isWaiting}
      </div>
    </div>
  );
}
