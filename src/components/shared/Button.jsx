export default function Button({ href, children, variant = "solid", className = "", ...props }) {
  const Tag = href ? "a" : "button";

  return (
    <Tag
      href={href}
      className={`inline-flex min-h-11 items-center justify-center rounded-md px-6 py-3 text-[15px] font-medium transition-colors duration-200 ${
        variant === "solid"
          ? "bg-accent text-ink hover:bg-accent-hover disabled:opacity-50"
          : "border border-control text-paper hover:bg-paper/5 hover:border-accent disabled:opacity-50"
      } ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
