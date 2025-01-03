import { ReactNode } from "react";
import { listen } from "@tauri-apps/api/event";

type JoystickWrapperProps = {
  leftId?: string;
  rightId?: string;
  upId?: string;
  downId?: string;
  id: string;
  activeId: string;
  setActiveId: Function;
  onSelect: Function;
  children: ReactNode;
};

export default function JoystickWrapper({
  leftId,
  rightId,
  upId,
  downId,
  id,
  activeId,
  setActiveId,
  onSelect,
  children,
}: JoystickWrapperProps) {
  const isActive = activeId === id;

  listen("joystick-event", (event) => {
    console.log(event.payload);
    console.log(leftId, rightId, upId, downId);
    if (leftId && event.payload === "left") {
      setActiveId(leftId);
    } else if (rightId && event.payload === "right") {
      setActiveId(rightId);
    } else if (upId && event.payload === "up") {
      setActiveId(upId);
    } else if (downId && event.payload === "down") {
      setActiveId(downId);
    } else if (event.payload === "select") {
      onSelect();
    }
  });

  return (
    <div
      style={{
        padding: "8px",
        borderRadius: "20px",
        border: isActive ? "solid red 2px" : "",
      }}
    >
      {children}
    </div>
  );
}
