/**
 * File:     care-instructions/view/page.tsx
 * Purpose:  View or edit a specific care instruction.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { Suspense, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { CareInstruction } from "@/types/care-instructions";
import { timestampToString } from "@/utils/parsing";
import Dialog from "@/components/Dialog";
import useKeyPress from "@/components/useKeyPress";
import Layout from "@/components/Layout";

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
    invoke<CareInstruction>("get_single_care_instruction", {
      id: fetch_id,
    }).then((i) => {
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
    });
  }

  function isModalOpen(valueForModal: boolean) {
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

      router.replace(`/care-instructions/view/?id=${id}`);

      invoke("care_instructions_previous_next_ids", {
        id: id,
      }).then((previousNext) => {
        setPreviousTopic((previousNext as string[])[0]);
        setNextTopic((previousNext as string[])[1]);
      });
    });
  }

  return (
    <Layout
      title="Care Instructions"
      handleBackClick={() => router.push("/care-instructions")}
    >
      <div className={styles.careInstructionsContainer}>
        <div className={styles.inputContainer}>
          {onEditMode ? (
            <>
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                placeholder="Short Title"
                className={styles.inputCareTitle}
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
                className={styles.inputCareContent}
              />
            </>
          ) : (
            <>
              {!(id === previousTopic && id === nextTopic) ? (
                <div className={styles.topicsButton}>
                  <button
                    className="secondary"
                    onClick={() => {
                      fetchInformation(previousTopic);
                    }}
                  >
                    Previous Topic
                  </button>
                  <button
                    className="secondary"
                    onClick={() => {
                      fetchInformation(nextTopic);
                    }}
                  >
                    Next Topic
                  </button>
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
                <button
                  className="dangerPrimary"
                  onClick={() => {
                    isModalOpen(false);
                    invoke("delete_care_instructions", { id: id });
                    router.back();
                  }}
                >
                  Delete
                </button>
                <button
                  className="secondary"
                  onClick={() => {
                    isModalOpen(false);
                  }}
                >
                  Never mind
                </button>
              </div>
            </Dialog>
          )}

          {lastUpdated === 0 ? null : (
            <div className={styles.lastUpdated}>
              <div className={styles.lastUpdatedInner}>
                <p>
                  Last updated on {timestampToString(lastUpdated, "MMDDYYYY")}
                </p>
                <p>at {timestampToString(lastUpdated, "HH:MM XX")}</p>
              </div>
            </div>
          )}
        </div>

        <div className={styles.buttonSaveInstructions}>
          <div className={styles.buttonColumn}>
            {onEditMode ? (
              <button
                className="primary"
                onClick={handleOnSaveClick}
                disabled={title === "" || content === ""}
              >
                Save Instructions
              </button>
            ) : (
              <>
                <button
                  className="primary"
                  onClick={() => setOnEditMode(!onEditMode)}
                >
                  Edit Instructions
                </button>
                <button
                  className="dangerSecondary"
                  onClick={() => isModalOpen(true)}
                >
                  Delete Instructions
                </button>
                <button
                  className="secondary"
                  onClick={() => router.push("/resources")}
                >
                  Resources
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
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
