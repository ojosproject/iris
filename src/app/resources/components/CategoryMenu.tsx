"use client";

import { useState } from "react";
import classes from "./CategoryMenu.module.css";
import { Resource } from "@/types";
import { invoke } from "@tauri-apps/api/core";
import Button from "@/app/components/Button";

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
      <Button
        type={props.label === selectedLabel ? "PRIMARY" : "SECONDARY"}
        label={props.label}
        onClick={() => handleMenuClick(props.label)}
      />
    );
  }

  let labels = props.labels.map((label) => {
    return <CategoryMenuItem label={label} key={label} />;
  });

  return <div className={classes.resource_menu}>{labels}</div>;
}
