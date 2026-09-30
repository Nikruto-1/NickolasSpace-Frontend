export default function Button({ href, children, variant = "solid", className = "", ...props }) {
  const Tag = href ? "a" : "button";

  return (
    <Tag
      href={href}
      className={`inline-flex items-center justify-center px-7 py-3.5 text-[15px] font-semibold transition-all duration-300 ${
        variant === "solid"
          ? "bg-[#E8E8E4] text-[#15181C] hover:-translate-y-0.5 hover:bg-white hover:text-[#15181C]"
          : "border border-[rgba(232,232,228,.4)] text-[#E8E8E4] hover:bg-[#E8E8E4] hover:text-[#15181C]"
      } ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
