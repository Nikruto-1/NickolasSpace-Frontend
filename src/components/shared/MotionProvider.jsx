import { useState } from "react";
import { MotionContext } from "./motionContext.js";

export default function MotionProvider({ children }) {
  const [paused, setPaused] = useState(false);
  return <MotionContext.Provider value={{ paused, toggleMotion: () => setPaused((value) => !value) }}>{children}</MotionContext.Provider>;
}
