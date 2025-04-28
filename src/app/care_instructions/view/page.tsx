// care_instructions/view/page.tsx
// Ojos Project
"use client";
import BackButton from "@/app/components/BackButton";
import { useRouter, useSearchParams } from "next/navigation";
import classes from "./page.module.css";
import Button from "@/app/components/Button";
import { Suspense, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { CareInstruction } from "../types";
import { timestampToString } from "@/app/helper";
import Dialog from "@/app/components/Dialog";
import useKeyPress from "@/app/accessibility/keyboard_nav";

function EditInstructions() {
  // Params get passed from AllCareInstructions.tsx
  // If `id` is empty, you're creating a new care instruction
  // If `id` has something, we're editing a care instruction
  const params = useSearchParams();
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [addedBy, setAddedBy] = useState("");
  const [lastUpdated, setLastUpdated] = useState(0);
  const [onEditMode, setOnEditMode] = useState(false);
  const [nextTopic, setNextTopic] = useState("");
  const [previousTopic, setPreviousTopic] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  useKeyPress("Escape", () => {
    if (onEditMode) {
      if (title.trim() === "" && content.trim() === "") {
        setOnEditMode(false);
        router.back();
      } else {
        setOnEditMode(false);
      }
    } else if (modalOpen) {
      setModalOpen(false);
    } else {
      router.back();
    }
  });

  useKeyPress("Enter", () => {
    if (onEditMode && title.trim() !== "" && content.trim() !== "") {
      handleOnSaveClick();
    }
  });

  function fetchInformation(fetch_id: string) {
    invoke<CareInstruction>("get_single_care_instruction", { id: fetch_id })
      .then((i) => {
        setId(i.id);
        setTitle(i.title);
        setContent(i.content);
        setAddedBy(i.added_by);
        setLastUpdated(i.last_updated);

        invoke("care_instructions_previous_next_ids", {
          id: fetch_id,
        }).then((previousNext) => {
          setPreviousTopic((previousNext as string[])[0]);
          setNextTopic((previousNext as string[])[1]);
        });
      })
      .catch((e) => console.log(e));
  }

  function isModalOpen(valueForModal: boolean) {
    console.log("CLICKED DELETE");
    if (valueForModal === false) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }
    setModalOpen(valueForModal);
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

    invoke<CareInstruction>(
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
      setId(i.id);
      setTitle(i.title);
      setContent(i.content);
      setAddedBy(i.added_by);
      setLastUpdated(i.last_updated);

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
    <div className={classes.care_instructions_container}>
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
              spellCheck={true}
            />
            <textarea
              value={content}
              placeholder="Enter a detailed description of how to care for your loved one."
              spellCheck={true}
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
        {modalOpen && (
          <Dialog
            title="Are you sure?"
            content={"Deleted care instructions cannot be recovered."}
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
                type="DANGER-PRIMARY"
                label="Delete"
                onClick={() => {
                  isModalOpen(false);
                  invoke("delete_care_instructions", { id: id });
                  router.back();
                }}
              />
              <Button
                type="SECONDARY"
                label="Never mind"
                onClick={() => {
                  isModalOpen(false);
                }}
              />
            </div>
          </Dialog>
        )}

        {lastUpdated === 0 ? null : (
          <div className={classes.last_updated}>
            <div className={classes.last_updated_inner}>
              <p>
                Last updated on {timestampToString(lastUpdated, "MMDDYYYY")}
              </p>
              <p>at {timestampToString(lastUpdated, "HH:MM XX")}</p>
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
                type="DANGER-SECONDARY"
                label="Delete Instructions"
                onClick={() => isModalOpen(true)}
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

// Required to prevent
// https://github.com/ojosproject/iris/issues/36
export default function EditInstructionsWrapper() {
  return (
    <Suspense>
      <EditInstructions />
    </Suspense>
  );
}
