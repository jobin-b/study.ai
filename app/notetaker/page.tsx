"use client";

import React, { useState } from "react";
import InitForm from "@/components/initForm";

export default function Notetaker() {
  return (
    <div>
      <h1>Notetaker</h1>
      <InitForm postUrl="/api/summarizer" />
    </div>
  );
}
