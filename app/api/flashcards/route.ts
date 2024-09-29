import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Ensure the GEMINI_KEY is in the environment variables
    const GEMINI_KEY = process.env.GEMINI_KEY;
    if (!GEMINI_KEY) {
      throw new Error("GEMINI_KEY is not set in environment variables");
    }

    // Add the GEMINI_KEY to the body
    const bodyWithKey = {
      ...body,
      $key: GEMINI_KEY,
    };

    const response = await fetch(
      "https://breadboard-community.wl.r.appspot.com/boards/@AdorableHyena/flashcard.bgl.api/run",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyWithKey),
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.text();

    // Process the response to extract flashcards
    const processedData = processFlashcardsData(data);

    return NextResponse.json(processedData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in flashcards API:", error);
    return NextResponse.json(
      { error: "Error processing flashcards request" },
      { status: 500 }
    );
  }
}

function processFlashcardsData(data: string): any {
  try {
    // Parse the outer JSON structure
    const parsedData = JSON.parse(data.replace(/^data: /, ""));

    // Navigate to the part containing the flashcards JSON string
    const flashcardsJsonString = parsedData[1].outputs.context[3].parts[0].text;

    // Extract the actual JSON array string from the text
    const match = flashcardsJsonString.match(/```json\n([\s\S]*?)\n```/);
    if (!match) {
      throw new Error("Could not find flashcards data in the response");
    }

    // Parse the inner JSON array
    const flashcardsArray = JSON.parse(match[1]);

    return flashcardsArray;
  } catch (error) {
    console.error("Error processing flashcards data:", error);
    throw new Error("Failed to process flashcards data");
  }
}
