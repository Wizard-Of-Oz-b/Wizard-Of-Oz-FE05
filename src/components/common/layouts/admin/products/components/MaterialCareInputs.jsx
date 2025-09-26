import FieldLabel from "./FieldLabel";
import { Plus, Trash2 } from "lucide-react";

export default function MaterialCareInputs({ form, set, addRow, delRow }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <FieldLabel>소재 (행 단위)</FieldLabel>
        <div className="space-y-2">
          {form.material.map((m, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                value={m}
                onChange={(e) => {
                  const next = [...form.material];
                  next[idx] = e.target.value;
                  set("material", next);
                }}
                className="h-10 flex-1 rounded-xl bg-gray-50 px-3 text-sm outline-none border-0 shadow-sm"
              />
              <button onClick={() => delRow("material", idx)} className="p-2 rounded-lg hover:bg-gray-100" aria-label="소재 삭제">
                <Trash2 className="size-4 text-gray-500" />
              </button>
            </div>
          ))}
          <button onClick={() => addRow("material", "")} className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200">
            <Plus className="size-4" /> 추가
          </button>
        </div>
      </div>
      <div>
        <FieldLabel>세탁/케어 (줄단위)</FieldLabel>
        <div className="space-y-2">
          {form.care.map((c, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                value={c}
                onChange={(e) => {
                  const next = [...form.care];
                  next[idx] = e.target.value;
                  set("care", next);
                }}
                className="h-10 flex-1 rounded-xl bg-gray-50 px-3 text-sm outline-none border-0 shadow-sm"
              />
              <button onClick={() => delRow("care", idx)} className="p-2 rounded-lg hover:bg-gray-100" aria-label="케어 삭제">
                <Trash2 className="size-4 text-gray-500" />
              </button>
            </div>
          ))}
          <button onClick={() => addRow("care", "")} className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200">
            <Plus className="size-4" /> 추가
          </button>
        </div>
      </div>
    </div>
  );
}
