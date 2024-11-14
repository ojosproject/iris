// Page for editing Care Instructions.
// Takes parameters. Make sure to get them using useSearchParams.
"use client";

import BackButton from "@/app/components/BackButton";
import { useRouter, useSearchParams } from "next/navigation";
import classes from "./page.module.css";
import Button from "@/app/components/Button";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { CareInstruction } from "@/types";
import { timestampToString } from "@/helper";

export default function EditInstructions() {
  // Params get passed from AllCareInstructions.tsx
  // If `title` is empty, you're creating a new care instruction
  // If `title` has something, we're editing a care instruction
  const params = useSearchParams();
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [addedBy, setAddedBy] = useState("");
  const [lastUpdated, setLastUpdated] = useState(0);
  const [onEditMode, setOnEditMode] = useState(false);
  const [nextTopic, setNextTopic] = useState("");
  const [previousTopic, setPreviousTopic] = useState("");
  const router = useRouter();

  function fetchInformation(fetch_id: string) {
    invoke("get_single_care_instruction", { id: fetch_id })
      .then((i) => {
        setId((i as CareInstruction).id);
        setTitle((i as CareInstruction).title);
        setContent((i as CareInstruction).content);
        setAddedBy((i as CareInstruction).added_by);
        setLastUpdated((i as CareInstruction).last_updated);

        invoke("care_instructions_previous_next_ids", {
          id: fetch_id,
        }).then((previousNext) => {
          setPreviousTopic((previousNext as string[])[0]);
          setNextTopic((previousNext as string[])[1]);
        });
      })
      .catch((e) => console.log(e));
  }

  useEffect(() => {
    let paramsId = params.get("id");
    if (paramsId) {
      fetchInformation(paramsId);
    } else {
      setOnEditMode(true);
    }
  }, []);

  function handleOnSaveClick() {
    // If last_updated is 0, it means that this is a newly created instruction

    invoke(
      lastUpdated === 0
        ? "create_care_instructions"
        : "update_care_instructions",
      {
        id: id,
        title: title,
        content: content,
        frequency: null,
        added_by: "Nobody", // todo: should be fixed, somehow
      },
    ).then((i) => {
      setOnEditMode(false);
      setId((i as CareInstruction).id);
      setTitle((i as CareInstruction).title);
      setContent((i as CareInstruction).content);
      setAddedBy((i as CareInstruction).added_by);
      setLastUpdated((i as CareInstruction).last_updated);

      router.replace(`/care_instructions/view/?id=${id}`);

      invoke("care_instructions_previous_next_ids", {
        id: id,
      }).then((previousNext) => {
        setPreviousTopic((previousNext as string[])[0]);
        setNextTopic((previousNext as string[])[1]);
      });
    });
  }

  return (
    <div className={classes.edit_care_instructions}>
      <div className={classes.back_button}>
        <BackButton />
      </div>

      <h1 className={classes.care_title}>Care Instructions</h1>

      <div className={classes.input_container}>
        {onEditMode ? (
          <>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="Short Title"
              className={classes.input_care_title}
              type="text"
            />
            <textarea
              value={content}
              placeholder="Enter a detailed description of how to care for your loved one."
              onChange={(e) => {
                setContent(e.target.value);
              }}
              className={classes.input_care_content}
            />
          </>
        ) : (
          <>
            {!(id === previousTopic && id === nextTopic) ? (
              <div className={classes.topics_button}>
                <Button
                  type="SECONDARY"
                  label="Previous Topic"
                  onClick={() => {
                    fetchInformation(previousTopic);
                  }}
                />
                <Button
                  type="SECONDARY"
                  label="Next Topic"
                  onClick={() => {
                    fetchInformation(nextTopic);
                  }}
                />
              </div>
            ) : null}
            <h2>{title}</h2>
            {content.split("\n").map((line) => {
              return <p key={line}>{line}</p>;
            })}
          </>
        )}
        {lastUpdated === 0 ? null : (
          <div className={classes.last_updated}>
            <div className={classes.last_updated_inner}>
              <p>Added by {addedBy}</p>
              <p>
                Last updated on {timestampToString(lastUpdated, "MMDDYYYY")}
              </p>
              <p>at {timestampToString(lastUpdated, "TIME")}</p>
            </div>
          </div>
        )}
      </div>

      <div className={classes.button_save_instructions}>
        <div className={classes.button_column}>
          {onEditMode ? (
            <Button
              type="PRIMARY"
              label="Save Instructions"
              onClick={handleOnSaveClick}
              disabled={title === "" || content === ""}
            />
          ) : (
            <>
              <Button
                type="PRIMARY"
                label="Edit Instructions"
                onClick={() => setOnEditMode(!onEditMode)}
              />
              <Button
                type="SECONDARY"
                label="Resources"
                onClick={() => router.push("/resources")}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}