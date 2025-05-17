/**
 * File:     care-instructions/page.tsx
 * Purpose:  Displays all of the care instructions.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import { CareInstruction } from "@/types/care-instructions";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import styles from "./page.module.css";
import Button from "@/components/Button";
import CareInstructionsButton from "./_components/CareInstructionButton";
import useKeyPress from "../accessibility/keyboard_nav";
import { useRouter } from "next/navigation";

export default function CareInstructions() {
  const [instructions, setInstructions] = useState<CareInstruction[]>([]);
  const router = useRouter();

  useKeyPress("Escape", () => {
    router.push("/");
  });

  useEffect(() => {
    invoke<CareInstruction[]>("get_all_care_instructions").then((i) => {
      setInstructions(i);
    });
  }, []);

  return (
    <div className={styles.allInstructionsLayout}>
      <div className={styles.backButton}>
        <BackButton
          onClick={() => {
            router.push("/");
          }}
        />
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

      <div className={styles.backMenuContainer}>
        <div className={styles.buttonMenu}>
          <Button
            type="PRIMARY"
            label="Add Instructions"
            link={{
              pathname: "./care-instructions/view/",
            }}
          />

          <Button type="SECONDARY" label="Resources" link="/resources" />
        </div>
      </div>
    </div>
  );
}
