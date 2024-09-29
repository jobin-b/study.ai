const runBoard = async (req: Request, endpointURL: string) => {
  const $key = "bb-582y3b5v6s3p4x3d5o4s633u201z4a491f1123ri3965f1s3b7";
  if (!$key) {
    return Error("BB_COMMUNITY_KEY is not set");
  }

  const body = (await req.json()) as { $key: string };

  body.$key = $key;

  const response = await fetch(endpointURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const responseData = (await response.text()).replace(/^data: /, "");
  const responseJSON = JSON.parse(responseData);
  const responseBody = responseJSON[1].outputs.context[1].parts[0].text;

  console.log("Summarizer response: ", responseBody);

  return new Response(responseBody, {
    status: response.status,
    statusText: response.statusText,
  });
};

export function POST(req: Request) {
  console.log("Got post request for summarizer");

  const url =
    "https://breadboard-community.wl.r.appspot.com/boards/@AdorableCoyote/studyai-summarizer.bgl.api/run";

  return runBoard(req, url);
}
