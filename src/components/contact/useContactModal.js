import { useContext } from "react";
import { ContactModalContext } from "./contactModalCore.js";

export default function useContactModal() {
  const value = useContext(ContactModalContext);
  if (!value) {
    throw new Error("useContactModal must be used inside ContactModalProvider");
  }
  return value;
}
