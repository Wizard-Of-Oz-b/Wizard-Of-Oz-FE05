import { Search } from "lucide-react";

export default function CategoryEmptyState({ title = "조건에 맞는 상품이 없어요.", hint }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="h-1 w-full bg-gradient-to-r from-indigo-300/60 via-fuchsia-300/60 to-pink-300/60" />

      <div className="p-10 text-center">
        <div className="mx-auto mb-5 grid place-items-center">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-indigo-200/40 blur-xl" aria-hidden />
            <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
              <Search className="h-7 w-7 text-gray-500" />
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold tracking-tight text-gray-900">{title}</h3>
        {hint && <p className="mt-2 text-sm text-gray-500">{hint}</p>}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500">
          <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">철자 확인</span>
          <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">키워드 단순화</span>
          <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">카테고리 재선택</span>
        </div>
      </div>
    </div>
  );
}
