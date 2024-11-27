"use client";
import { CSSProperties } from "react";
import classes from "./ForwardButton.module.css";

export default function ForwardButton(props: {
onClick?: Function;
style?: CSSProperties;
color?: "BLACK" | "WHITE";
}) {
return (
    <img
    onClick={() => (props.onClick ? props.onClick() : console.log("nothing happened"))}
    src={
        props.color === "WHITE"
        ? "/images/chevron-forward-outline-white.svg"
        : "/images/chevron-forward-outline.svg"
    }
    width={50}
    height={50}
    className={classes.ForwardButton}
    style={props.style}
    />
);
}
