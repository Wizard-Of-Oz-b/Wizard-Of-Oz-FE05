import { Search } from 'lucide-react';
import Chip from './Chip';

export default function SearchPhase({
  query,
  setQuery,
  doSearch,
  loading,
  results,
  parseOptions,
  pickProduct,
}) {
  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <label className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.isComposing) {
                doSearch();
              }
            }}
            placeholder="상품명 검색"
            className="w-full h-11 pl-9 pr-3 rounded-xl bg-gray-50 ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-violet-300"
            aria-label="상품명 검색"
          />
        </label>
        <button
          onClick={doSearch}
          className="h-11 px-4 rounded-xl bg-violet-600 text-white font-semibold shadow hover:bg-violet-700 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          disabled={loading}
        >
          검색
        </button>
      </div>

      <div className="min-h-[200px]" aria-busy={loading ? 'true' : 'false'}>
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl ring-1 ring-slate-200 p-4 shadow-sm">
                <div className="h-4 w-2/3 bg-gray-100 rounded mb-2" />
                <div className="h-3 w-1/2 bg-gray-100 rounded mb-2" />
                <div className="h-3 w-1/3 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {results.map((p) => {
              const { colors, sizes } = parseOptions(p.options);
              return (
                <button
                  key={p.id}
                  onClick={() => pickProduct(p)}
                  className="group text-left rounded-xl ring-1 ring-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-[1px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                >
                  <div className="font-semibold text-gray-900 truncate">{p.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {p.category_name || '-'} · ₩{Number(p.price || 0).toLocaleString()}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <Chip tone="violet">색상 {colors.length}</Chip>
                    <Chip tone="indigo">사이즈 {sizes.length}</Chip>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="p-6 text-center text-sm text-gray-500">검색 결과가 없습니다.</div>
        )}
      </div>
    </div>
  );
}
