export default function ModalFooter({ phase, checkedCount, totalQty, loading, onClose, onSubmit, Chip }) {
  return (
    <div className="flex items-center justify-between gap-3 px-6 py-4 bg-white/80 backdrop-blur rounded-b-3xl">
      <div className="flex items-center gap-2 text-xs">
        {phase === 'matrix' && (
          <>
            <Chip tone="violet">선택 {checkedCount}개</Chip>
            <Chip tone="indigo">총 수량 {totalQty}</Chip>
            {!checkedCount && <Chip tone="rose">선택된 항목이 없습니다</Chip>}
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onClose}
          className="h-11 px-4 rounded-xl bg-slate-100 text-sm hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
        >
          취소
        </button>
        <button
          onClick={onSubmit}
          disabled={loading || phase !== 'matrix' || checkedCount === 0}
          className="h-11 px-6 rounded-xl bg-violet-600 text-white font-semibold shadow hover:bg-violet-700 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
        >
          선택한 항목 추가
        </button>
      </div>
    </div>
  );
}
