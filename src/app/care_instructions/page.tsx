// page.tsx
// Ojos Project
//
// Displays all of the care instructions.
"use client";
import { CareInstruction } from "@/types";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import AllCareInstructions from "./AllCareInstructions";

export default function CareInstructions() {
  const [instructions, setInstructions] = useState([] as CareInstruction[]);

  useEffect(() => {
    invoke("get_care_instructions").then((i) => {
      setInstructions(i as CareInstruction[]);
    });
  });

  return <AllCareInstructions instructions={instructions} />;
}
