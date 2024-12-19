import { ReactNode, useState } from "react";
import { listen } from "@tauri-apps/api/event";

type JoystickWrapperProps = {
  left?: string;
  right?: string;
  up?: string;
  down?: string;
  id: string;
  onInput: Function;
  children: ReactNode;
};

export default function JoystickWrapper({
  left,
  right,
  up,
  down,
  id,
  onInput,
  children,
}: JoystickWrapperProps) {
  const [isActive, setIsActive] = useState(false);

  listen("joystick-event", (event) => {
    console.log(event.payload);
  });

  return (
    <div
      id={id}
      style={{ padding: "5px", border: isActive ? "solid red 2px" : "" }}
    >
      {children}
    </div>
  );
}
