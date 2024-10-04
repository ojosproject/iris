"use client";

import { useState } from "react";
import classes from "./CategoryMenu.module.css";

export default function CategoryMenu(props: { labels: string[] }) {
  const [selectedLabel, setSelectedLabel] = useState("All");

  function CategoryMenuItem(props: { label: string }) {
    return (
      <button
        className={
          props.label === selectedLabel
            ? classes.button_selected
            : classes.button
        }
        onClick={() => {
          setSelectedLabel(props.label);
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
