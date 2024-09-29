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
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-md gap-6 p-8 bg-gray-800 rounded-lg shadow-lg"
      >
        <h2 className="text-3xl text-center text-white font-semibold mb-4">
          Upload Lecture Slides
        </h2>

        <div className="flex flex-col items-center">
          <input
            id="initialInput"
            name="initialInput"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="border-2 border-gray-600 rounded-xl p-3 w-full text-lg text-white bg-gray-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !file}
          className={`w-full p-3 text-lg font-semibold rounded-xl transition duration-300 ease-in-out ${
            isLoading || !file
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500"
          } text-white border-2 border-indigo-600`}
        >
          {isLoading ? "Generating..." : "Generate Notes"}
        </button>
      </form>

      {output && (
        <div className="relative mt-6 w-full max-w-8xl p-6 bg-[#2c2f42] border border-[#3b3f58] rounded-lg text-white">
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 bg-indigo-600 hover:bg-indigo-500 text-white py-1 px-3 rounded-lg text-sm"
          >
            Copy
          </button>
          <h3 className="text-xl font-semibold">Generated Notes</h3>
          <div
            className="text-gray-300 whitespace-normal"
            dangerouslySetInnerHTML={{ __html: output }}
          ></div>
        </div>
      )}
    </div>
  );
}
