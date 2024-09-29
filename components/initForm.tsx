import { FormEvent, useState } from "react";
import extractTextFromPDF from "pdf-parser-client-side";

export type InitFormProps = {
  postUrl: string;
  setLoadedData: Function;
};

export default function InitForm(props: InitFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
          $key: "bb-582y3b5v6s3p4x3d5o4s633u201z4a491f1123ri3965f1s3b7",
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

      props.setLoadedData(await response.text());
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing the PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full h-full p-8 gap-8 justify-center items-stretch"
    >
      <label
        htmlFor="initialInput"
        className="text-center text-2xl text-indigo-200/65"
        data-aos="fade-up"
        data-aos-delay={200}
      >
        Enter your lecture slides here
      </label>
      <input
        id="initialInput"
        name="initialInput"
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="border-2 p-2 bg-indigo-950/40 border-indigo-800 h-full"
      ></input>
      <button
        type="submit"
        className="border-2 rounded-xl bg-indigo-950/40 border-gray-500 text-xl"
      >
        Generate Notes
      </button>
    </form>
  );
}
