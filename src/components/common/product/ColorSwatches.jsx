// 색상 선택 코드

export default function ColorSwatches({ colors=[], value, onChange }) {
  return (
    <div className="mt-2 flex items-center gap-3">
      {colors.map((c) => (
        <button
          key={c.code}
          onClick={() => onChange?.(c.code)}
          title={`${c.name} (${c.code})`}
          className={`h-8 w-8 rounded-full border ${value===c.code ? "border-gray-900" : "border-gray-300"}`}
          style={{ backgroundColor: c.hex }}
        />
      ))}
    </div>
  );
}
