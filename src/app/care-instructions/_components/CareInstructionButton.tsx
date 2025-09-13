/**
 * File:     CareInstructionButton.tsx
 * Purpose:  A clickable button to navigate to a care instruction.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
import { CareInstruction } from "@/types/care-instructions";
import styles from "./CareInstructionButton.module.css";
import Link from "next/link";
import truncateText from "@/utils/truncate";

export default function CareInstructionButton(props: {
  instruction: CareInstruction;
}) {
  const { id } = props.instruction;
  const title = truncateText(props.instruction.title, 100);
  const content = truncateText(props.instruction.content, 250);

  return (
    <Link
      style={{ color: "black", textDecoration: "none" }}
      href={{
        pathname: "./care-instructions/view/",
        query: { id },
      }}
    >
      <div className={styles.singleCareInstruction}>
        <h3>{title}</h3>
        <p>{content}</p>

        <p className={styles.tapMessage}>Tap for more...</p>
      </div>
    </Link>
  );
}
