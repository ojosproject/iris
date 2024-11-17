// CareInstructionButton.tsx
// Ojos Project
import { CareInstruction } from "../types";
import classes from "./CareInstructionButton.module.css";
import Link from "next/link";

export default function CareInstructionButton(props: {
  instruction: CareInstruction;
}) {
  return (
    <Link
      style={{ color: "black", textDecoration: "none" }}
      href={{
        pathname: "./care_instructions/view/",
        query: { id: props.instruction.id },
      }}
    >
      <div className={classes.single_care_instruction}>
        <h3>{props.instruction.title}</h3>
        <p>{props.instruction.content}</p>

        <p className={classes.tap_message}>Tap for more...</p>
      </div>
    </Link>
  );
}
