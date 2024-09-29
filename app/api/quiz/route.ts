import { NextRequest, NextResponse } from "next/server";

const TIMEOUT_MS = 30000; // 30 seconds timeout

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { message, nextToken } = await req.json();
    if (!message && !nextToken) {
      return NextResponse.json(
        { error: "Message or nextToken is required" },
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

    // Build the request body for the external API
    const requestBody: any = { $key };
    if (nextToken) {
      requestBody.$next = nextToken;
      requestBody.text = {
        role: "user",
        parts: [{ text: message }],
      };
    } else {
      requestBody.context = [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ];
    }

    console.log("Request body:", JSON.stringify(requestBody));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(endpointURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
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
    let nextTokenFromAPI = null;

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
              const outputs = parsedEvent[1].outputs.output;
              // Find the last 'model' output
              for (let i = outputs.length - 1; i >= 0; i--) {
                const output = outputs[i];
                if (
                  output.role === "model" &&
                  output.parts &&
                  output.parts[0].text
                ) {
                  // Capture only the latest AI response
                  aiResponse = output.parts[0].text.trim();
                  break;
                }
              }
            } else if (parsedEvent[0] === "input") {
              console.log("Received 'input' event, stopping read.");
              // Extract the 'next' token
              nextTokenFromAPI = parsedEvent[2];
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
      // Send the AI response and the 'next' token as JSON
      return NextResponse.json({
        response: aiResponse,
        nextToken: nextTokenFromAPI,
      });
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
