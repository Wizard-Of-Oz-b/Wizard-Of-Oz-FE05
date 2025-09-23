import { Shirt, PlusCircle } from "lucide-react";

export default function ProductHeader({ onClickNew }) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg">
          <Shirt className="size-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-violet-700 tracking-tight">상품 관리</h1>
          <p className="text-sm uppercase tracking-widest text-gray-400">Product Management</p>
        </div>
      </div>

      <button
        onClick={onClickNew}
        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-violet-700 hover:shadow-lg"
      >
        <PlusCircle className="size-5" /> 새 상품 추가
      </button>
    </div>
  );
}
