"use client";

import { useState } from "react";
import classes from "./CategoryMenu.module.css";
import { Resource } from "@/types";
import { invoke } from "@tauri-apps/api/core";

export default function CategoryMenu(props: {
  labels: string[];
  resources: Resource[];
  setResources: Function;
}) {
  const [selectedLabel, setSelectedLabel] = useState("All");

  function handleMenuClick(label: string) {
    setSelectedLabel(label);

    invoke("get_resources").then((r) => {
      props.setResources(
        label === "All"
          ? r
          : (r as Resource[]).filter(
              (resource) =>
                resource.category.toLowerCase() === label.toLowerCase(),
            ),
      );
    });
  }

  function CategoryMenuItem(props: { label: string }) {
    return (
      <button
        className={
          props.label === selectedLabel
            ? classes.button_selected
            : classes.button
        }
        onClick={() => {
          handleMenuClick(props.label);
        }}
      >
        {props.label}
      </button>
    );
  }

  let labels = props.labels.map((label) => {
    return <CategoryMenuItem label={label} key={label} />;
  });

  return <div className={classes.resource_menu}>{labels}</div>;
}
