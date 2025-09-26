import { Truck, PlusCircle, RotateCw } from "lucide-react";

export default function ShipmentsHeader({ onClickRegister, onRefresh }) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg">
          <Truck className="size-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-violet-700 tracking-tight">배송 관리</h1>
          <p className="text-sm uppercase tracking-widest text-gray-400">Shipment Management</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {typeof onRefresh === "function" && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
            title="새로고침"
            aria-label="새로고침"
          >
            <RotateCw className="h-4 w-4" />
            새로고침
          </button>
        )}
        {typeof onClickRegister === "function" && (
          <button
            onClick={onClickRegister}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-violet-700 hover:shadow-lg"
            title="운송장 등록"
            aria-label="운송장 등록"
          >
            <PlusCircle className="size-5" />
            운송장 등록
          </button>
        )}
      </div>
    </div>
  );
}
