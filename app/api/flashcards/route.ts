import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(
    "https://breadboard-community.wl.r.appspot.com/boards/@AdorableHyena/flashcard.bgl.api/run",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.text(); // Get the response as text instead of trying to parse JSON

  return new NextResponse(data, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
