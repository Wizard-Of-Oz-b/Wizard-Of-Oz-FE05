// 색상 선택 코드

export default function ColorSwatches({ colors = [], value, onChange, isDisabled }) {
  return (
    <div className="mt-2 flex items-center gap-3">
      {colors.map((c) => {
        const disabled = typeof isDisabled === "function" ? isDisabled(c) : false;
        return(
        <button
          key={c.code}
          onClick={() => !disabled && onChange?.(c.code)}
          title={`${c.name} (${c.code})${disabled ? " - 품절" : ""}`}
          disabled={disabled}
          className={`h-8 w-8 rounded-full border
            ${value === c.code ? "border-gray-900" : "border-gray-300"}
            ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
          style={{ backgroundColor: c.hex }}
        />
        );
      })}
    </div>
  );
}
