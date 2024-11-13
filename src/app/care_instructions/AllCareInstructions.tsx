import { CareInstruction } from "@/types";
import BackButton from "../components/BackButton";
import classes from "./AllCareInstructions.module.css";
import Button from "../components/Button";

export default function FullCareInstructions(props: {
  instructions: CareInstruction[];
}) {
  return (
    <>
      <BackButton />
      <div className={classes.all_instructions_layout}>
        <h1>Care Instructions</h1>
        {props.instructions.length === 0 ? (
          <p>There are no care instructions recorded.</p>
        ) : null}
      </div>
      <div className={classes.button_menu_container}>
        <div className={classes.button_menu}>
          <Button type="PRIMARY" label="Add Instructions" onClick={() => {}} />
          <Button type="SECONDARY" label="Resources" link="/resources" />
        </div>
      </div>
    </>
  );
}