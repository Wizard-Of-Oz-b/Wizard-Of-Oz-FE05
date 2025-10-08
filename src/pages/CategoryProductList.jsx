import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import useCategoryIndexFromConstants from "../components/common/layouts/header/useCategoryIndexFromConstants";
import ProductList from "../components/common/product/ProductList";
import CategoryResultsHeader from "../components/common/product/category/CategoryResultsHeader";
import CategoryEmptyState from "../components/common/product/category/CategoryEmptyState";
import ProductGridSkeleton from "../components/common/product/category/ProductGridSkeleton";

const shallowEqual = (a, b) => {
  if (a === b) return true;
  if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
  const ak = Object.keys(a), bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak) { if (a[k] !== b[k]) return false; }
  return true;
};

export default function CategoryProductList() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(sp.get("page") || 1);
  const sort = sp.get("sort") || "-created_at";
  const primaryParam = sp.get("primary") || null;
  const itemParam = sp.get("item") ? decodeURIComponent(sp.get("item")) : null;
  const qParam = (sp.get("q") || "").trim();
  const categoryIdParam = sp.get("category_id") || null;

  const { ready, findCategoryIds } = useCategoryIndexFromConstants();

  const [query, setQuery] = useState({
    q: "",
    category_id: null,
    primary: primaryParam,
    is_active: true,
    sort,
    page,
    size: 20,
  });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    console.log("[Page] URL params", { page, sort, primaryParam, itemParam, qParam, categoryIdParam });

    if (categoryIdParam) {
      const next = { q: "", category_id: categoryIdParam, primary: primaryParam, is_active: true, sort, page, size: 20 };
      if (!shallowEqual(query, next)) setQuery(next);
      setEnabled(true);
      return;
    }

    if (primaryParam && itemParam) {
      if (!ready) { setEnabled(false); return; }

      const cands = findCategoryIds(primaryParam, itemParam);
      console.log("[Page] findCategoryIds", { primaryParam, itemParam, cands });

      if (cands.length) {
        const cid = cands[0].id;
        const next = { q: "", category_id: cid, primary: primaryParam, is_active: true, sort, page, size: 20 };
        if (!shallowEqual(query, next)) setQuery(next);
        setEnabled(true);

        const qs = new URLSearchParams(sp);
        qs.set("category_id", cid);
        qs.delete("q");
        navigate({ pathname: "/products/list", search: `?${qs.toString()}` }, { replace: true });
        return;
      }

      const next = { q: itemParam, category_id: null, primary: primaryParam, is_active: true, sort, page, size: 20 };
      if (!shallowEqual(query, next)) setQuery(next);
      setEnabled(true);
      return;
    }

    const next = { q: qParam, category_id: null, primary: primaryParam, is_active: true, sort, page, size: 20 };
    if (!shallowEqual(query, next)) setQuery(next);
    setEnabled(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryIdParam, primaryParam, itemParam, qParam, sort, page, ready, findCategoryIds, navigate]);

  const { data: products, isLoading, isError, error } = useProducts(query, { enabled });

  const handleSortChange = (v) =>
    setQuery((prev) => {
      const next = { ...prev, sort: v || "-created_at", page: 1 };
      return shallowEqual(prev, next) ? prev : next;
    });

  const handlePageChange = (p) =>
    setQuery((prev) => {
      const next = { ...prev, page: p };
      return shallowEqual(prev, next) ? prev : next;
    });

  const handleRemoveChip = (type) => {
    if (type === "primary") {
      setQuery((prev) => ({ ...prev, primary: null, category_id: null, q: "", page: 1 }));
    } else if (type === "item") {
      setQuery((prev) => ({ ...prev, category_id: null, q: "", page: 1 }));
    } else if (type === "q") {
      setQuery((prev) => ({ ...prev, q: "", page: 1 }));
    }
  };

  if (isError) return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
      <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm">
        오류가 발생했어요: {String(error)}
      </div>
    </div>
  );

  const total = products?.count ?? 0;

  return (
    <>
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-gray-100">
        <CategoryResultsHeader
          primary={primaryParam}
          item={itemParam}
          categoryId={categoryIdParam}
          total={total}
          keyword={query.q}
          view="grid"
          onRemoveChip={handleRemoveChip}
          onToggleView={() => {}}
          sortValue={query.sort}
          onChangeSort={handleSortChange}
        />
      </div>

      {/* 본문 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
        {isLoading && <ProductGridSkeleton count={12} />}

        {/* 빈 상태 */}
        {!isLoading && (products?.results?.length ?? 0) === 0 && (
          <CategoryEmptyState
            title="조건에 맞는 상품이 없어요."
            hint={
              (query.q || categoryIdParam)
                ? "필터를 조정하거나 다른 키워드로 다시 시도해 보세요."
                : "아직 상품이 없거나 검색 조건이 비어있어요."
            }
          />
        )}

        {/* 리스트 */}
        <ProductList
          datas={products}
          isLoading={isLoading}
          query={query}
          onSortChange={handleSortChange}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
