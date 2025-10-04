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
import { timestampToString } from "@/utils/parsing";
import Dialog from "@/components/Dialog";
import useKeyPress from "@/components/useKeyPress";
import Layout from "@/components/Layout";
import {
  createCareInstruction,
  deleteCareInstruction,
  getCareInstruction,
  neighboringIds,
  updateCareInstruction,
} from "@/utils/care_instructions";

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

  async function fetchInformation(fetch_id: string) {
    const i = await getCareInstruction(fetch_id);

    if (i) {
      setId(i.id);
      setTitle(i.title);
      setContent(i.content);
      setLastUpdated(i.last_updated);

      const [previous, next] = await neighboringIds(fetch_id);
      setPreviousTopic(previous);
      setNextTopic(next);
    }
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

  async function handleOnSaveClick() {
    // If last_updated is 0, it means that this is a newly created instruction

    const i =
      lastUpdated === 0
        ? await createCareInstruction(title, content)
        : await updateCareInstruction(id, title, content);

    setOnEditMode(false);
    setId(i.id);
    setTitle(i.title);
    setContent(i.content);
    setLastUpdated(i.last_updated);

    router.replace(`/care-instructions/view/?id=${i.id}`);

    const [previous, next] = await neighboringIds(i.id);
    setPreviousTopic(previous);
    setNextTopic(next);
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
                    onClick={async () => {
                      await fetchInformation(previousTopic);
                    }}
                  >
                    Previous Topic
                  </button>
                  <button
                    className="secondary"
                    onClick={async () => {
                      await fetchInformation(nextTopic);
                    }}
                  >
                    Next Topic
                  </button>
                </div>
              ) : null}
              <h2>{title}</h2>
              {content.split("\n").map((line, index) => {
                return <p key={index}>{line}</p>;
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
                  onClick={async () => {
                    isModalOpen(false);
                    await deleteCareInstruction(id);
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
