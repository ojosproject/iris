// Button.tsx
// Ojos Project
//
// This is a Button component that is styled with the Iris Branding Guidelines.

import Link from "next/link";
import classes from "./Button.module.css";
import { CSSProperties, MouseEventHandler } from "react";
import { UrlObject } from "url";

export default function Button(props: {
  type: "PRIMARY" | "SECONDARY";
  label: string;
  onClick?: MouseEventHandler;
  link?: UrlObject | string;
  disabled?: boolean;
  style?: CSSProperties;
}) {
  return props.onClick ? (
    <button
      className={
        props.type === "PRIMARY"
          ? classes.button_iris_primary
          : classes.button_iris_secondary
      }
      disabled={props.disabled}
      onClick={props.onClick}
      style={props.style}
    >
      {props.label}
    </button>
  ) : (
    <Link href={props.link!}>
      <button
        className={
          props.type === "PRIMARY"
            ? classes.button_iris_primary
            : classes.button_iris_secondary
        }
        style={props.style}
      >
        {props.label}
      </button>
    </Link>
  );
}
