export default function IconWithBadge({ onClick, children, count, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center cursor-pointer justify-center ${className}`}
      aria-label="icon-button"
    >
      <span className="relative inline-block w-7 h-7">
        {children}
        {count > 0 && (
          <span
            className="
              absolute -top-1 -right-1
              min-w-[18px] h-[18px] px-1
              rounded-full bg-rose-600 text-white text-[10px] font-bold
              leading-[18px] text-center
              shadow pointer-events-none select-none
            "
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </span>
    </button>
  );
}
