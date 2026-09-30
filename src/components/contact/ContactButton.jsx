import Button from "../shared/Button.jsx";
import useContactModal from "./useContactModal.js";

export default function ContactButton({ children, className = "", variant = "solid", ...props }) {
  const { openContactModal } = useContactModal();

  return (
    <Button type="button" onClick={openContactModal} variant={variant} className={className} {...props}>
      {children}
    </Button>
  );
}
