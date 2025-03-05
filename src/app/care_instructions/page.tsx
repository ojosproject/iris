// /care_instructions/page.tsx
// Ojos Project
//
// Displays all of the care instructions.
"use client";
import { CareInstruction } from "./types";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import BackButton from "../core/components/BackButton";
import classes from "./page.module.css";
import Button from "../core/components/Button";
import CareInstructionsButton from "./components/CareInstructionButton";
import Helper from "../core/components/helper_screen";

export default function CareInstructions() {
  const [instructions, setInstructions] = useState([] as CareInstruction[]);
  const [isHelperModalOpen, setIsHelperModalOpen] = useState(false);

  useEffect(() => {
    setIsHelperModalOpen(true);
    invoke("get_all_care_instructions").then((i) => {
      setInstructions(i as CareInstruction[]);
    });
  }, []);

  return (
    <>
    {isHelperModalOpen && (
        <Helper
          title="Care Instructions Guide"
          content="Add new care instructions using the add button. 
          Please enter in a title and the instructions before saving. 
          You can view each instructions by tapping the slides, 
          editing and deleting instructions is available by clicking the corresponding buttons!
          Resources are also available at the bottom right. Thank you."
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Button
              type="PRIMARY"
              label="Close"
              onClick={() => {
                setIsHelperModalOpen(!isHelperModalOpen);
              }}
            />
          </div>
        </Helper>
      )}

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
  </>
  );

}
