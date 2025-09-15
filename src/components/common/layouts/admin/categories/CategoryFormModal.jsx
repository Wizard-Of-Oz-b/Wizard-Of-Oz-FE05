import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Switch from "../common/Switch";
import slugify from "../../../../features/admin/categories/slugify";
import { FolderTree } from "lucide-react";

export default function CategoryFormModal({ open, onClose, category, allCategories, onSave }) {
  const isEdit = !!category;
  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [parentId, setParentId] = useState(category?.parentId ?? null);
  const [visible, setVisible] = useState(category?.visible ?? true);
  const [sort, setSort] = useState(category?.sort ?? 1);

  useEffect(() => {
    if (!isEdit) return;
    setName(category.name);
    setSlug(category.slug);
    setParentId(category.parentId ?? null);
    setVisible(category.visible);
    setSort(category.sort);
  }, [isEdit, category]);

  const rootOptions = [{ id: null, name: "최상위 카테고리" }].concat(
    allCategories.filter((c) => c.parentId == null).map((c) => ({ id: c.id, name: c.name }))
  );

  const submit = () => {
    const payload = {
      id: isEdit ? category.id : Date.now(),
      name: name.trim(),
      slug: (slug || slugify(name)).trim() || slugify(name),
      parentId: parentId === "" ? null : parentId,
      visible: !!visible,
      sort: Number(sort) || 1,
    };
    onSave(payload);
    onClose();
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
            <p className="text-sm text-gray-500">이름, 슬러그, 상위/노출/정렬을 설정하세요.</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4">
          <div>
            <div className="text-xs text-gray-500 mb-1.5">카테고리명</div>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!isEdit) setSlug(slugify(e.target.value));
              }}
              className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
              placeholder="예: 셔츠"
            />
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1.5">슬러그</div>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
              placeholder="예: shirts"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <div className="text-xs text-gray-500 mb-1.5">상위 카테고리</div>
              <select
                value={parentId ?? ""}
                onChange={(e) => setParentId(e.target.value === "" ? null : Number(e.target.value))}
                className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
              >
                {rootOptions.map((o) => (
                  <option key={String(o.id)} value={o.id ?? ""}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1.5">정렬</div>
              <input
                type="number"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
            <div className="text-sm text-gray-700">노출</div>
            <Switch checked={visible} onChange={() => setVisible((v) => !v)} />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button onClick={onClose} className="h-10 rounded-xl px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
            취소
          </button>
          <button onClick={submit} className="h-10 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white hover:bg-violet-700">
            저장
          </button>
        </div>
      </div>
    </Modal>
  );
}
