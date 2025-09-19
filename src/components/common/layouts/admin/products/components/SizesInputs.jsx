import FieldLabel from './FieldLabel';
import Line from './Line';
import { Plus, Trash2 } from 'lucide-react';

export default function SizesInputs({ form, set, addRow, delRow }) {
  const sizes = Array.isArray(form?.sizes) ? form.sizes : [];

  return (
    <>
      <FieldLabel>사이즈</FieldLabel>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s, idx) => (
          <div key={idx} className="flex items-center gap-1">
            <input
              value={s ?? ''} 
              onChange={(e) => {
                const next = [...sizes];
                next[idx] = e.target.value ?? '';
                set('sizes', next);
              }}
              className="h-9 w-20 rounded-xl bg-gray-50 px-2 text-sm outline-none border-0 shadow-sm"
            />
            <button
              onClick={() => delRow('sizes', idx)}
              className="p-1 rounded-lg hover:bg-gray-100"
              aria-label="사이즈 삭제"
            >
              <Trash2 className="size-4 text-gray-500" />
            </button>
          </div>
        ))}
        <button
          onClick={() => addRow('sizes', '')}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200"
        >
          <Plus className="size-4" /> 사이즈 추가
        </button>
      </div>
      <Line />
    </>
  );
}
