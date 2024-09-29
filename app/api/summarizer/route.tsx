import { remark } from "remark";
import html from "remark-html";

async function getPostData(markdownRaw: string): Promise<any> {
  // Use remark to convert markdown into HTML string
  const processedContent = await remark().use(html).process(markdownRaw);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return contentHtml;
}

const runBoard = async (req: Request, endpointURL: string) => {
  const $key = process.env.GEMINI_KEY;
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
  const responseHTML = await getPostData(responseBody);

  console.log("Summarizer response: ", responseHTML);

  return new Response(responseHTML, {
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
