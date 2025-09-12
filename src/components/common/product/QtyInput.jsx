export default function QtyInput({ value=1, onChange }) {
  return (
    <div className="flex items-center rounded border border-gray-300">
      <button className="px-3 py-2" onClick={() => onChange?.(Math.max(1, value-1))}>-</button>
      <input
        className="w-12 text-center outline-none"
        value={value}
        onChange={(e) => onChange?.(Math.max(1, Number(e.target.value) || 1))}
      />
      <button className="px-3 py-2" onClick={() => onChange?.(value+1)}>+</button>
    </div>
  );
}
