import { FormEvent } from "react";

export type InitFormProps = {
  postUrl: string;
};

async function onSubmit(event: FormEvent, props: InitFormProps) {
  event.preventDefault();
  fetch(props.postUrl, {
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
}

export default function InitForm(props: InitFormProps) {
  return (
    <form
      onSubmit={(event: FormEvent) => {
        onSubmit(event, props);
      }}
    >
      <label htmlFor="initialInput">Input Here</label>
      <input id="initialInput" name="initialInput" type="text"></input>
      <button type="submit">Submit</button>
    </form>
  );
}
