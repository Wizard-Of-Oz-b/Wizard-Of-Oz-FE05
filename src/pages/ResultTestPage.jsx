import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import ProductList from "../components/common/product/ProductList";

export default function ResultTestPage() {
  const [params, setParams] = useSearchParams();

  const parseParams = () => {
    const q = params.get("q") ?? "";
    const category_id = params.get("category_id");
    const is_active_param = params.get("is_active");
    const is_active = is_active_param == null ? true : is_active_param === "true";
    const sort = params.get("sort") ?? "created_at";
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

  if (isError) return <div className="p-6 text-red-600">{String(error?.message || error)}</div>;

  return (
    <>
      <div className="px-6 py-4 max-w-5xl mx-auto overflow-x-hidden">
        <h1 className="text-xl font-bold">검색 결과</h1>
        <p className="text-sm text-gray-500 mt-1">{query.q ? `“${query.q}” 검색` : "전체 보기"}</p>
      </div>

      <ProductList
        datas={data}
        isLoading={isLoading}
        query={query}
        onSortChange={handleSortChange}
        onPageChange={handlePageChange}
      />
    </>
  );
}
