import React, { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";
import { FolderTree } from "lucide-react";

export default function CategoryFormModal({ open, onClose, category, allCategories, onSave }) {
  const isEdit = !!category?.id;

  const [name, setName] = useState(category?.name ?? "");
  const [parent, setParent] = useState(category?.parent ?? null);

  useEffect(() => {
    setName(category?.name ?? "");
    setParent(category?.parent ?? null);
  }, [open, category?.id]);

  const options = useMemo(() => {
    const selfId = category?.id;
    return (allCategories ?? []).filter((c) => c.id !== selfId);
  }, [allCategories, category?.id]);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!name.trim()) return;

    await onSave?.({
      id: category?.id,
      name: name.trim(),
      parent: parent === "" ? null : parent,
    });
    onClose?.();
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-6 md:p-7">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <FolderTree className="size-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{isEdit ? "카테고리 수정" : "새 카테고리 추가"}</h3>
            <p className="text-sm text-gray-500">이름과 상위 카테고리를 설정하세요.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 gap-4">
          {/* 이름 */}
          <div>
            <div className="text-xs text-gray-500 mb-1.5">카테고리명</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
              placeholder="예: 셔츠"
              required
            />
          </div>

          {/* 상위 */}
          <div>
            <div className="text-xs text-gray-500 mb-1.5">상위 카테고리</div>
            <select
              value={parent ?? ""}
              onChange={(e) => setParent(e.target.value === "" ? null : e.target.value)} 
              className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
            >
              <option value="">(루트)</option>
              {options.map((c) => (
                <option key={c.id} value={c.id}>
                  {"— ".repeat(c._depth ?? 0)}
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-xl px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="h-10 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white hover:bg-violet-700"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
