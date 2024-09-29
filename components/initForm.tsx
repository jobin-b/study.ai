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
    >
      <label htmlFor="initialInput">Input Here</label>
      <input id="initialInput" name="initialInput" type="text"></input>
      <button type="submit">Submit</button>
    </form>
  );
}
