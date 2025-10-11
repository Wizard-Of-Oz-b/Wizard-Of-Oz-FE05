export default function SizeSelector({ sizes = [], value, onChange, isDisabled }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {sizes.map((s) => {
        const disabled = typeof isDisabled === "function" ? isDisabled(s) : false;
        return (
        <button
          key={s}
          onClick={() => !disabled && onChange?.(s)}
          disabled={disabled}
          className={`min-w-[48px] rounded border px-3 py-2 text-sm
            ${value === s ? "border-gray-900" : "border-gray-300 hover:border-gray-500"}
            ${disabled ? "opacity-40 cursor-not-allowed hover:border-gray-300" : ""}`}
          title={disabled ? "품절" : undefined}
        >
          {s}
        </button>
        );
      })}
    </div>
  );
}
