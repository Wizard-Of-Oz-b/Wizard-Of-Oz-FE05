import FieldLabel from "./FieldLabel";
import Line from "./Line";
import { Plus, Trash2 } from "lucide-react";

export default function GalleryInputs({ form, set, addRow, delRow }) {
  return (
    <>
      <FieldLabel>갤러리 이미지 URL (최대 6장)</FieldLabel>
      <div className="space-y-2">
        {form.gallery.map((g, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              value={g}
              onChange={(e) => {
                const next = [...form.gallery];
                next[idx] = e.target.value;
                set("gallery", next.slice(0, 6));
              }}
              placeholder="https://…"
              className="h-10 flex-1 rounded-xl bg-gray-50 px-3 text-sm outline-none border-0 shadow-sm"
            />
            <button onClick={() => delRow("gallery", idx)} className="p-2 rounded-lg hover:bg-gray-100" aria-label="갤러리 삭제">
              <Trash2 className="size-4 text-gray-500" />
            </button>
          </div>
        ))}
        <button
          onClick={() => {
            if ((form.gallery || []).length >= 6) return;
            addRow("gallery", "");
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200"
        >
          <Plus className="size-4" /> 이미지 추가
        </button>
      </div>
      <Line />
    </>
  );
}
