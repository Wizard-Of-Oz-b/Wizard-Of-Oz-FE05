import { Search, ArrowDownAZ, ArrowUpAZ } from 'lucide-react';
import SortMenuPortal from './SortMenuPortal';

export default function SearchFilterCard({
  q,
  setQ,
  onSearch, 
  ordering,
  setOrdering,
  sortOpen,
  setSortOpen,
  sortBtnRef,
  rowsLength,
}) {
  const handleSearchInputKeyDown = (e) => {
    const isEnter = e.key === 'Enter';
    const composing = e.isComposing || e.nativeEvent?.isComposing;
    if (isEnter && !composing) {
      e.preventDefault();
      onSearch(e.currentTarget.value); // ✅ 현재 인풋 값으로 즉시 검색
    }
  };

  return (
    <div
      className="mb-6 flex flex-col md:flex-row gap-3 items-center justify-between rounded-2xl bg-white/90 shadow-md backdrop-blur-md p-4"
      style={{ overflow: 'visible' }}
    >
      {/* 검색 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.querySelector('input');
          onSearch(input?.value ?? q);   // ✅ submit 시에도 현재 값으로 검색
        }}
        className="relative w-full md:max-w-sm"
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={handleSearchInputKeyDown}
          placeholder="상품명/옵션 검색…"
          className="h-10 w-full rounded-xl bg-gray-50 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
        />
        <button type="submit" className="sr-only">
          검색
        </button>
      </form>

      {/* 정렬 + 카운트 */}
      <div className="flex items-center gap-3">
        {/* 정렬 버튼 */}
        <div className="relative">
          <button
            ref={sortBtnRef}
            type="button"
            onClick={() => setSortOpen((o) => !o)}
            className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
          >
            {ordering === '-updated_at' && (
              <>
                <ArrowDownAZ className="w-4 h-4 text-gray-600" />
                최신 수정순
              </>
            )}
            {ordering === 'updated_at' && (
              <>
                <ArrowUpAZ className="w-4 h-4 text-gray-600" />
                최신 수정순
              </>
            )}
            {ordering === '-stock_quantity' && (
              <>
                <ArrowDownAZ className="w-4 h-4 text-gray-600" />
                재고 많은 순
              </>
            )}
            {ordering === 'stock_quantity' && (
              <>
                <ArrowUpAZ className="w-4 h-4 text-gray-600" />
                재고 적은 순
              </>
            )}
          </button>

          {/* 포털 드롭다운 */}
          <SortMenuPortal
            anchorRef={sortBtnRef}
            open={sortOpen}
            ordering={ordering}
            onSelect={setOrdering}
            onClose={() => setSortOpen(false)}
          />
        </div>

        <div className="text-xs text-gray-500">
          총 <b>{rowsLength}</b>개
        </div>
      </div>
    </div>
  );
}
