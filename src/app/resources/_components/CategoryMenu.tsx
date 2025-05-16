/**
 * File:     CategoryMenu.tsx
 * Purpose:  Generates a menu based on all Resource.category in the database.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import { useState } from "react";
import styles from "./CategoryMenu.module.css";
import { Resource } from "@/types/resources";
import { invoke } from "@tauri-apps/api/core";
import Button from "@/components/Button";

type CategoryMenuProps = {
  labels: string[];
  setResources: (resources: Resource[]) => void;
};

export default function CategoryMenu({
  labels,
  setResources,
}: CategoryMenuProps) {
  const [selectedLabel, setSelectedLabel] = useState("all");

  function handleMenuClick(label: string) {
    setSelectedLabel(label);

    invoke<Resource[]>("get_resources").then((r) => {
      setResources(
        label === "all"
          ? r
          : r.filter((resource) => resource.category.toLowerCase() === label),
      );
    });
  }

  function CategoryMenuItem({ label }: { label: string }) {
    return (
      <Button
        type={label === selectedLabel ? "PRIMARY" : "SECONDARY"}
        label={label}
        onClick={() => handleMenuClick(label)}
        style={{ textTransform: "capitalize" }}
      />
    );
  }

  return (
    <div className={styles.resourceMenu}>
      {labels.map((label) => {
        return <CategoryMenuItem label={label} key={label} />;
      })}
    </div>
  );
}
