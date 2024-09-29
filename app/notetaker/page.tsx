"use client";

import React from "react";
import InitForm from "@/components/initForm";
import Homer from "@/components/ui/homer";

export default function Notetaker() {
  return (
    <>
      <Homer></Homer>
      <div className="flex flex-row w-full justify-center">
        <div className="flex flex-col items-center p-8 w-2/3">
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50">
              <span className="inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent text-3xl">
                Lecture Assistant
              </span>
            </div>
            <h1
              className="w-full text-center animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-5xl font-semibold text-transparent"
              data-aos="fade-up"
            >
              Take Notes For Me
            </h1>
          </div>
          <InitForm postUrl="/api/summarizer" />
        </div>
      </div>
    </>
  );
}
