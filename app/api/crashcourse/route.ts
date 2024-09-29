import { NextResponse } from "next/server";

export async function POST(request: Request) {
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
  console.log(bodyWithKey);

  const response = await fetch(
    "https://breadboard-community.wl.r.appspot.com/boards/@AdorableHyena/crashcouse.bgl.api/run",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyWithKey),
    }
  );
  console.log(response.status);

  const data = await response.text(); // Get the response as text instead of trying to parse JSON

  return new NextResponse(data, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
