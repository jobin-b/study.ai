import { NextRequest, NextResponse } from "next/server";

const TIMEOUT_MS = 30000; // 30 seconds timeout

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const url =
      "https://breadboard-community.wl.r.appspot.com/boards/@AdorableHyena/super-tester.bgl.json";
    const endpointURL = url.replace(/\.json$/, ".api/run");

    const $key = process.env.GEMINI_KEY;
    if (!$key) {
      console.error("GEMINI_KEY is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    console.log("Sending request to:", endpointURL);
    console.log(
      "Request body:",
      JSON.stringify({
        $key,
        context: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
      })
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(endpointURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        $key,
        context: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      JSON.stringify(Object.fromEntries(response.headers))
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    let aiResponse = "";
    let stopReading = false;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      console.log("Received chunk:", buffer);

      const events = buffer.split("\n\n");
      buffer = events.pop() || "";

      for (const event of events) {
        if (event.trim()) {
          const [, eventData] = event.split("data: ");
          if (eventData) {
            const parsedEvent = JSON.parse(eventData);
            console.log("Parsed event:", parsedEvent);

            if (parsedEvent[0] === "output" && parsedEvent[1].outputs?.output) {
              for (const output of parsedEvent[1].outputs.output) {
                if (
                  output.role === "model" &&
                  output.parts &&
                  output.parts[0].text
                ) {
                  aiResponse += output.parts[0].text + "\n";
                }
              }
            } else if (parsedEvent[0] === "input") {
              console.log("Received 'input' event, stopping read.");
              stopReading = true;
              break;
            }
          }
        }
      }

      if (stopReading) {
        await reader.cancel();
        break;
      }
    }

    if (aiResponse) {
      // Send the AI response as a JSON object
      return NextResponse.json({ response: aiResponse.trim() });
    } else {
      return NextResponse.json(
        { error: "No response received from AI" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
