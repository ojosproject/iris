"use client";
import { CSSProperties } from "react";
import classes from "./ForwardButton.module.css";

export default function ForwardButton(props: {
    onClick?: Function;
    style?: CSSProperties;
    disabled?: boolean;
    color?: "BLACK" | "WHITE";
}) {
    const handleClick = () => {
        if (props.disabled) {
            return;
        }
        props.onClick ? props.onClick() : console.log("nothing happened");
    };

    const buttonStyle: CSSProperties = {
        ...props.style,
        opacity: props.disabled ? 0.5 : 1,
        cursor: props.disabled ? "not-allowed" : "pointer",
    };

    const iconSrc =
        props.color === "WHITE"
            ? "/images/chevron-forward-outline-white.svg"
            : "/images/chevron-forward-outline.svg";

    return (
        <img
            onClick={handleClick}
            src={iconSrc}
            width={50}
            height={50}
            className={classes.ForwardButton}
            style={buttonStyle}
            alt="Forward"
        />
    );
}
