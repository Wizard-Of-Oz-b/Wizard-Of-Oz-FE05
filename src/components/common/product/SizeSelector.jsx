export default function SizeSelector({ sizes=[], value, onChange }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {sizes.map((s) => (
        <button
          key={s}
          onClick={() => onChange?.(s)}
          className={`min-w-[48px] rounded border px-3 py-2 text-sm
          ${value===s ? "border-gray-900" : "border-gray-300 hover:border-gray-500"}`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
