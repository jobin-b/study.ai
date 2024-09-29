"use client";

import React, { useState } from "react";
import InitForm from "@/components/initForm";

export default function Notetaker() {
  const [responseData, setResponseData] = useState("Result appears here");

  return (
    <div>
      <h1>Notetaker</h1>
      <InitForm postUrl="/api/summarizer" setLoadedData={setResponseData} />
      <p>{responseData}</p>
    </div>
  );
}
