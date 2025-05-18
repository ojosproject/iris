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
import styles from "./page.module.css";
import Button from "@/components/Button";
import CareInstructionsButton from "./_components/CareInstructionButton";
import useKeyPress from "@/components/useKeyPress";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";

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
    <Layout
      title="Care Instructions"
      handleBackClick={() => {
        router.push("/");
      }}
    >
      <div className={styles.allInstructionsLayout}>
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
    </Layout>
  );
}
