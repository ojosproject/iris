// page.tsx
// Ojos Project
//
// Displays all of the care instructions.
import { CareInstruction } from "@/types";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export default function AllCareInstructions() {
  const [instructions, setInstructions] = useState([] as CareInstruction[]);

  useEffect(() => {
    invoke("get_care_instructions").then((i) => {
      setInstructions(i as CareInstruction[]);
    });
  });

  return <div></div>;
}
