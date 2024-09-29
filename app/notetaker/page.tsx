"use client";

import React, { useState } from "react";
import InitForm from "@/components/initForm";

export default function Notetaker() {
  const [responseData, setResponseData] = useState("Result appears here");

  return (
    <div className="flex flex-col w-full h-full justify-center items-center p-8">
      <h1
        className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-7xl font-semibold text-transparent"
        data-aos="fade-up"
      >
        Notetaker
      </h1>
      <InitForm postUrl="/api/summarizer" setLoadedData={setResponseData} />
      <code>{responseData}</code>
    </div>
  );
}
