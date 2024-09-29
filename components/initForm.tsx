import { FormEvent, useState } from "react";
import extractTextFromPDF from "pdf-parser-client-side";

export type InitFormProps = {
  postUrl: string;
};

export default function InitForm(props: InitFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) return;

    setIsLoading(true);
    const text = await extractTextFromPDF(file, "clean");

    try {
      const response = await fetch(props.postUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context: [
            {
              role: "user",
              parts: [
                {
                  text: text,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process PDF");
      }

      const result = await response.text();
      setOutput(result);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing the PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      alert("Copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-col items-stretch justify-stretch gap-6 pb-8 max-w-6xl">
      {output && (
        <div className="relative w-full bg-gray-800 rounded-lg">
          <div className="w-full p-4 bg-gray-700 rounded-t-lg">
            <button
              onClick={handleCopy}
              className="absolute top-3.5 right-3.5 bg-indigo-600 hover:bg-indigo-500 text-white py-1 px-4 rounded-md text-md"
            >
              Copy
            </button>
            <h3 className="text-xl font-semibold">Generated Notes</h3>
          </div>
          <div className="overflow-y-auto h-[480px] p-6">
            <div
              className="text-gray-300 whitespace-normal"
              dangerouslySetInnerHTML={{ __html: output }}
            ></div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full flex-grow flex flex-col items-stretch justify-stretch gap-6 rounded-lg shadow-xl"
      >
        <input
          id="initialInput"
          name="initialInput"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="flex-grow p-3 text-lg text-gray-200 bg-gray-700 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
        />

        <button
          type="submit"
          disabled={isLoading || !file}
          className={`w-full p-3 text-lg font-semibold rounded-lg transition duration-300 ease-in-out ${
            isLoading || !file
              ? "bg-gradient-to-r from-gray-600 to-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-indigo-400"
          } text-white`}
        >
          {isLoading ? "Generating..." : "Generate Notes"}
        </button>
      </form>
    </div>
  );
}
