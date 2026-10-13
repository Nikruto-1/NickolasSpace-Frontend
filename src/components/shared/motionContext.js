import { createContext } from "react";

export const MotionContext = createContext({ paused: false, toggleMotion: () => {} });
