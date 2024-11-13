// Page for editing Care Instructions.
// Takes parameters. Make sure to get them using useSearchParams.
"use client";

import BackButton from "@/app/components/BackButton";
import { useRouter, useSearchParams } from "next/navigation";
import classes from "./page.module.css";
import Button from "@/app/components/Button";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function EditInstructions() {
  // Params get passed from AllCareInstructions.tsx
  // If `title` is empty, you're creating a new care instruction
  // If `title` has something, we're editing a care instruction
  const params = useSearchParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [addedBy, setAddedBy] = useState("");
  const [lastUpdated, setLastUpdated] = useState(0);
  const router = useRouter();

  function handleOnSaveClick() {
    // If last_updated is 0, it means that this is a newly created instruction
    if (lastUpdated === 0) {
      invoke("create_care_instructions", {
        title: title,
        content: content,
        frequency: null,
        added_by: "Nobody", // todo: should be fixed, somehow
      }).then(() => {
        router.back();
      });
    }
  }

  return (
    <div className={classes.edit_care_instructions}>
      <div className={classes.back_button}>
        <BackButton />
      </div>

      <h1 className={classes.care_title}>Care Instructions</h1>

      <div className={classes.input_container}>
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          className={classes.input_care_title}
          type="text"
        />
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          className={classes.input_care_content}
        />
      </div>

      <div className={classes.button_save_instructions}>
        <Button
          type="PRIMARY"
          label="Save Instructions"
          onClick={handleOnSaveClick}
          disabled={title === "" || content === ""}
        />
      </div>
    </div>
  );
}
