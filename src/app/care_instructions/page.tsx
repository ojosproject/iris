// /care_instructions/page.tsx
// Ojos Project
//
// Displays all of the care instructions.
"use client";
import { CareInstruction } from "./types";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import classes from "./page.module.css";
import Button from "../components/Button";
import CareInstructionsButton from "./components/CareInstructionButton";
import useKeyPress from "../accessibility/keyboard_nav";
import { useRouter } from "next/navigation";

export default function CareInstructions() {
  const [instructions, setInstructions] = useState([] as CareInstruction[]);
  const router = useRouter();

  useKeyPress("Escape", () => {
    router.back();
  });

  useEffect(() => {
    invoke("get_all_care_instructions").then((i) => {
      setInstructions(i as CareInstruction[]);
    });
  }, []);

  return (
    <div className={classes.all_instructions_layout}>
      <div className={classes.back_button}>
        <BackButton />
      </div>

      <h1>Care Instructions</h1>
      {instructions.length === 0 ? (
        <p>There are no care instructions recorded.</p>
      ) : (
        instructions.map((instruction) => {
          return (
            <CareInstructionsButton
              key={instruction.id}
              instruction={instruction}
            />
          );
        })
      )}

      <div className={classes.button_menu_container}>
        <div className={classes.button_menu}>
          <Button
            type="PRIMARY"
            label="Add Instructions"
            link={{
              pathname: "./care_instructions/view/",
            }}
          />

          <Button type="SECONDARY" label="Resources" link="/resources" />
        </div>
      </div>
    </div>
  );
}
