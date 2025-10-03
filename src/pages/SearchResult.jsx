import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import ProductList from "../components/common/product/ProductList";

export default function SearchResult() {
  const [params, setParams] = useSearchParams();

  const parseParams = () => {
    const q = params.get("q") ?? "";
    const category_id = params.get("category_id");
    const is_active_param = params.get("is_active");
    const is_active = is_active_param == null ? true : is_active_param === "true";
    const sort = params.get("sort") ?? "-created_at";
    const page = Number(params.get("page") ?? 1) || 1;
    const size = Number(params.get("size") ?? 20) || 20;
    return {
      q,
      category_id: category_id || null,
      is_active,
      sort,
      page,
      size,
    };
  };

  const [query, setQuery] = useState(parseParams());

  useEffect(() => {
    setQuery(parseParams());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const updateURL = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === "" || v === null || v === undefined) next.delete(k);
      else next.set(k, String(v));
    });
    setParams(next, { replace: true });
  };

  const { data, isLoading, isError, error } = useProducts(query);

  const handleSortChange = (sortValue) => {
    setQuery((prev) => ({ ...prev, sort: sortValue, page: 1 }));
    updateURL({ sort: sortValue, page: 1 });
  };

  const handlePageChange = (pageNum) => {
    setQuery((prev) => ({ ...prev, page: pageNum }));
    updateURL({ page: pageNum });
  };

  if (isError) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm">
          오류가 발생했어요: {String(error?.message || error)}
        </div>
      </div>
    );
  }

  const total = data?.count ?? 0;
  const hasFilters = Boolean(query.q || query.category_id);

  return (
    <>
      {/* 상단: 제목/검색어/필터칩/정렬 */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
                검색 결과
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {query.q ? (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                    검색: “{query.q}”
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                    전체 보기
                  </span>
                )}
                {query.category_id && (
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs text-indigo-700 ring-1 ring-inset ring-indigo-200">
                    category_id: {query.category_id}
                  </span>
                )}
                {isLoading ? (
                  <span className="h-5 w-20 rounded-full bg-gray-100 animate-pulse" />
                ) : (
                  <span className="text-xs text-gray-500">{total.toLocaleString()}개</span>
                )}
                {hasFilters && (
                  <button
                    type="button"
                    className="ml-1 text-xs text-gray-500 hover:text-gray-700 underline decoration-dotted"
                    onClick={() => {
                      // 필터 초기화 (q/category_id/page만 리셋)
                      setQuery((prev) => ({ ...prev, q: "", category_id: null, page: 1 }));
                      updateURL({ q: "", category_id: null, page: 1 });
                    }}
                  >
                    초기화
                  </button>
                )}
              </div>
            </div>

            {/* 정렬 선택 */}
            <div className="shrink-0">
              <label className="sr-only" htmlFor="sort">정렬</label>
              <div className="relative">
                <select
                  id="sort"
                  value={query.sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="block w-40 rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 shadow-sm focus:border-gray-300 focus:outline-none"
                >
                  <option value="-created_at">최신순</option>
                  <option value="created_at">등록 오래된순</option>
                  <option value="price">가격 낮은순</option>
                  <option value="-price">가격 높은순</option>
                  <option value="name">이름 오름차순</option>
                  <option value="-name">이름 내림차순</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
                  ▼
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        {/* 로딩 스켈레톤 (그리드 자리만) */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-100 p-3">
                <div className="aspect-[4/5] w-full rounded-lg bg-gray-100 animate-pulse" />
                <div className="mt-3 h-3 w-3/4 rounded bg-gray-100 animate-pulse" />
                <div className="mt-2 h-3 w-1/2 rounded bg-gray-100 animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* 빈 상태 */}
        {!isLoading && (data?.results?.length ?? 0) === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-gray-200">
            <div className="text-base font-medium text-gray-800">조건에 맞는 상품이 없어요.</div>
            <div className="mt-1 text-sm text-gray-500">
              필터를 조정하거나 다른 키워드로 다시 시도해 보세요.
            </div>
            {hasFilters && (
              <button
                type="button"
                className="mt-4 inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setQuery((prev) => ({ ...prev, q: "", category_id: null, page: 1 }));
                  updateURL({ q: "", category_id: null, page: 1 });
                }}
              >
                필터 초기화
              </button>
            )}
          </div>
        )}

        {/* 실제 리스트 (기존 컴포넌트 그대로 사용) */}
        <ProductList
          datas={data}
          isLoading={isLoading}
          query={query}
          onSortChange={handleSortChange}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
