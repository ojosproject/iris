/**
 * File:     useKeyPress.tsx
 * Purpose:  A hook(?) that listens for key presses and applies an event to it.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
import { useEffect } from "react";

type KeyEventMap = {
  [key: string]: (event: KeyboardEvent) => void;
};

const useKeyPress = (
  keyOrKeys: string | string[],
  action?: (event: KeyboardEvent) => void,
  keyEvents?: KeyEventMap,
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (keyEvents && keyEvents[event.key]) {
        keyEvents[event.key](event);
      } else if (Array.isArray(keyOrKeys)) {
        if (keyOrKeys.includes(event.key) && action) {
          action(event);
        }
      } else {
        if (event.key === keyOrKeys && action) {
          action(event);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keyOrKeys, action, keyEvents]);
};

export default useKeyPress;
