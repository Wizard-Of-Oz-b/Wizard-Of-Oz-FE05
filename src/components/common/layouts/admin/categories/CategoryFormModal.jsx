import React, { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";
import { FolderTree } from "lucide-react";

const GENDER = { male: 1, female: 2 };

const GROUP = { top: 1, bottom: 2, shoes: 3 };

const DETAIL_OPTIONS = {
  top: [
    { value: "sportswear", label: "스포츠웨어(1)" },
    { value: "shortSleeve", label: "반팔(2)" },
    { value: "longSleeve", label: "긴팔(3)" },
    { value: "outer", label: "아우터(4)" },
  ],
  bottom: [
    { value: "shorts", label: "반바지(1)" },
    { value: "pants", label: "긴바지(2)" },
    { value: "jeans", label: "청바지(3)" },
    { value: "slacks", label: "슬렉스(4)" },
  ],
  shoes: [
    { value: "sneakers", label: "스니커즈(1)" },
    { value: "dressShoes", label: "구두(2)" },
    { value: "sandals", label: "샌들/슬리퍼(3)" },
  ],
};

function getDetailDigit(group, detail) {
  if (detail === "all") return 0;
  const idx = DETAIL_OPTIONS[group]?.findIndex((o) => o.value === detail) ?? -1;
  return idx >= 0 ? idx + 1 : 0;
}

function makeCode(g, t, d) {
  const hundreds = GENDER[g] ?? 0;
  const tens = GROUP[t] ?? 0;
  const ones = getDetailDigit(t, d);
  return hundreds * 100 + tens * 10 + ones;
}

export default function CategoryFormModal({
  open,
  onClose,
  category,
  allCategories,
  onSave,
}) {
  const isEdit = !!category?.id;

  const [name, setName] = useState(category?.name ?? "");
  const [parentId, setParentId] = useState(category?.parentId ?? null);

  const [categoryCode, setCategoryCode] = useState(
    category?.categoryCode?.toString?.() ?? ""
  );

  const [gender, setGender] = useState("male");
  const [group, setGroup] = useState("top");
  const [detail, setDetail] = useState("all");

  useEffect(() => {
    setDetail("all");
  }, [group]);

  useEffect(() => {
  if (parentId === null) {
    setCategoryCode("");
    setGender("male");
    setGroup("top");
    setDetail("all");
  }
}, [parentId]);

  useEffect(() => {
    setName(category?.name ?? "");
    setParentId(category?.parentId ?? null);
    setCategoryCode(category?.categoryCode?.toString?.() ?? "");
  }, [open, category?.id]);

  const options = useMemo(() => {
    const selfId = category?.id;
    return (allCategories ?? []).filter((c) => c.id !== selfId);
  }, [allCategories, category?.id]);

  const handleAutoCode = () => {
    const code = makeCode(gender, group, detail);
    setCategoryCode(String(code));
  };

const handleSubmit = async (e) => {
  e?.preventDefault?.();
  if (!name.trim()) return;

  await onSave?.({
    id: category?.id,
    name: name.trim(),
    parentId,
    categoryCode: parentId === null
      ? undefined
      : (categoryCode === "" ? undefined : Number(categoryCode)),
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
              value={parentId ?? ""}
              onChange={(e) =>
                setParentId(e.target.value === "" ? null : Number(e.target.value))
              }
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

          {parentId !== null && (
          
          <div className="rounded-xl border border-gray-100 p-3">
            <div className="mb-2 text-sm font-semibold text-gray-700">카테고리 코드(선택)</div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              {/* 성별 */}
              <div>
                <div className="text-xs text-gray-500 mb-1">성별</div>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="h-10 w-full rounded-lg bg-gray-50 px-2 text-sm"
                >
                  <option value="male">남성(1)</option>
                  <option value="female">여성(2)</option>
                </select>
              </div>

              {/* 종류 */}
              <div>
                <div className="text-xs text-gray-500 mb-1">종류</div>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="h-10 w-full rounded-lg bg-gray-50 px-2 text-sm"
                >
                  <option value="top">상의(1)</option>
                  <option value="bottom">하의(2)</option>
                  <option value="shoes">신발(3)</option>
                </select>
              </div>

              {/* 세부 */}
              <div>
                <div className="text-xs text-gray-500 mb-1">세부항목</div>
                <select
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  className="h-10 w-full rounded-lg bg-gray-50 px-2 text-sm"
                >
                  <option value="all">전체(0)</option>
                  {DETAIL_OPTIONS[group]?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 미리보기 + 적용 */}
              <div>
                <div className="text-xs text-gray-500 mb-1">미리보기</div>
                <div className="h-10 w-full rounded-lg bg-white px-3 flex items-center justify-between border border-gray-200">
                  <span className="text-sm text-gray-700 tabular-nums">
                    {makeCode(gender, group, detail)}
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoCode}
                    className="text-xs px-2 py-1 rounded-md border border-gray-200 hover:bg-gray-50"
                  >
                    적용
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-2">
              <input
                type="number"
                inputMode="numeric"
                value={categoryCode}
                onChange={(e) => setCategoryCode(e.target.value)}
                placeholder="직접 입력도 가능 (예: 111)"
                className="h-10 w-full rounded-lg bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
              />
              <p className="mt-1 text-[11px] text-gray-500">
                * 백: 성별(1=남, 2=여) / 십: 군(1=상의,2=하의,3=신발) / 일: 세부(0=전체, 1~)
              </p>
            </div>
          </div>
          )}

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
