import { ShoppingCart } from "lucide-react";

export default function StickyActionBar({
  selectedCount,
  onClearSelection,
  onRemoveSelected,
  onAddSelected,
}) {
  if (selectedCount <= 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-40">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm">선택 {selectedCount}개</span>
          <div className="flex items-center gap-2">
            <button onClick={onClearSelection} className="rounded-xl border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100">
              선택 해제
            </button>
            <button onClick={onRemoveSelected} className="rounded-xl border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100">
              선택 삭제
            </button>
            <button onClick={onAddSelected} className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm text-white hover:opacity-90">
              <ShoppingCart className="h-4 w-4" />
              선택 담기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
