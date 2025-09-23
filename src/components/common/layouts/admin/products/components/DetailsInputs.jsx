import FieldLabel from "./FieldLabel";
import Line from "./Line";
import { Plus, Trash2 } from "lucide-react";

export default function DetailsInputs({ form, set, addRow, delRow }) {
  return (
    <>
      <FieldLabel>상세 이미지 + 문구</FieldLabel>
      <div className="space-y-2">
        {form.details.map((d, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-2">
            <input
              value={d.img}
              onChange={(e) => {
                const next = [...form.details];
                next[idx] = { ...next[idx], img: e.target.value };
                set("details", next);
              }}
              placeholder="이미지 URL"
              className="col-span-7 h-10 rounded-xl bg-gray-50 px-3 text-sm outline-none border-0 shadow-sm"
            />
            <input
              value={d.text}
              onChange={(e) => {
                const next = [...form.details];
                next[idx] = { ...next[idx], text: e.target.value };
                set("details", next);
              }}
              placeholder="설명"
              className="col-span-4 h-10 rounded-xl bg-gray-50 px-3 text-sm outline-none border-0 shadow-sm"
            />
            <button onClick={() => delRow("details", idx)} className="col-span-1 inline-flex items-center justify-center rounded-xl hover:bg-gray-100" aria-label="상세 삭제">
              <Trash2 className="size-4 text-gray-500" />
            </button>
          </div>
        ))}
        <button onClick={() => addRow("details", { img: "", text: "" })} className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200">
          <Plus className="size-4" /> 항목 추가
        </button>
      </div>
      <Line />
    </>
  );
}
