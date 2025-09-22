export default function IconButton({
  title,
  onClick,
  disabled,
  children,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50 transition";

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
