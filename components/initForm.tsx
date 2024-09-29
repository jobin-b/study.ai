import { FormEvent } from "react";

export type InitFormProps = {
  postUrl: string;
  setLoadedData: Function;
};

async function onSubmit(event: FormEvent, props: InitFormProps) {
  event.preventDefault();
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
              text: event.currentTarget.elements.initialInput.value,
            },
          ],
        },
      ],
    }),
  });

  console.log("Frontend received response: ", response);

  return response;
}

export default function InitForm(props: InitFormProps) {
  return (
    <form
      onSubmit={async (event: FormEvent) => {
        const response = await onSubmit(event, props);
        props.setLoadedData(await response.text());
      }}
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
        type="text"
        height="4"
        className="border-2 p-2 bg-indigo-950/40 border-indigo-800 h-full"
      ></input>
      <span className="btn-sm relative rounded-full bg-gray-800/40 px-2.5 py-0.5 text-xs font-normal before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,theme(colors.gray.700/.15),theme(colors.gray.700/.5))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-gray-800/60">
        <button
          type="submit"
          className="border-2 rounded-xl p-2 bg-indigo-950/40 border-gray-500 text-xl"
        >
          Generate Notes
        </button>
      </span>
    </form>
  );
}
