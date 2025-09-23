import { Boxes, RefreshCcw, PlusCircle } from 'lucide-react';

export default function InventoryHeader({ loading, fetchList, setAddOpen }) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg">
          <Boxes className="size-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-violet-700 tracking-tight">
            재고 관리
          </h1>
          <p className="text-sm uppercase tracking-widest text-gray-400">
            Inventory Management
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={fetchList}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-white/80 backdrop-blur border border-black/10 px-3 py-2 text-sm hover:bg-white shadow-sm"
          title="새로고침"
        >
          <RefreshCcw className="w-4 h-4" />
          새로고침
        </button>

        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-violet-700 hover:shadow-lg"
        >
          <PlusCircle className="size-5" />
          재고 추가
        </button>
      </div>
    </div>
  );
}
