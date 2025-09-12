/**
 * File:     CareInstructionButton.tsx
 * Purpose:  A clickable button to navigate to a care instruction.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
import { CareInstruction } from "@/types/care-instructions";
import styles from "./CareInstructionButton.module.css";
import Link from "next/link";

export default function CareInstructionButton(props: {
  instruction: CareInstruction;
}) {
  return (
    <Link
      className={styles.link}
      href={{
        pathname: "./care-instructions/view/",
        query: { id: props.instruction.id },
      }}
    >
      <div className={styles.singleCareInstruction}>
        <h3>{props.instruction.title}</h3>
        <p>{props.instruction.content}</p>

        <p className={styles.tapMessage}>Tap for more...</p>
      </div>
    </Link>
  );
}
