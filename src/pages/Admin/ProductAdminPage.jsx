import React, { useEffect, useState } from "react";
import {
  ProductHeader,
  ProductFilter,
  ProductTable,
  Pagination,
} from "../../components/common/layouts/admin/products";
import { mockProducts } from "../../components/features/admin/products/mockProducts";
import ProductFormModal from "../../components/common/layouts/admin/products/ProductFormModal";
import DeleteConfirmModal from "../../components/common/layouts/admin/products/DeleteConfirmModal";

export default function ProductAdminPage() {
  const PAGE_SIZE = 5;

  // 목록 & UI 상태
  const [products, setProducts] = useState(mockProducts);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // 모달
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // 삭제 모달
  const [delOpen, setDelOpen] = useState(false);
  const [delTarget, setDelTarget] = useState(null);

  // 필터링
  const filtered = products.filter((p) => {
    const matchCategory = selectedCategory ? p.category === selectedCategory : true;
    const kw = q.trim().toLowerCase();
    const matchQuery = kw
      ? (p.name || "").toLowerCase().includes(kw) ||
        (p.sku || "").toLowerCase().includes(kw)
      : true;
    return matchCategory && matchQuery;
  });

  // 페이지네이션
  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 검색/필터 변경 시 첫 페이지로 이동
  useEffect(() => {
    setPage(1);
  }, [q, selectedCategory]);

  // 현재 페이지가 범위를 벗어나면 보정
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  // 액션들
  const toggleAvailable = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, is_available: !p.is_available } : p
      )
    );
  };

  const handleSave = (payload, isEdit) => {
    setProducts((prev) => {
      if (isEdit) {
        return prev.map((p) => (p.id === payload.id ? { ...p, ...payload } : p));
      }
      const row = payload.id ? payload : { ...payload, id: Date.now() };
      return [row, ...prev];
    });
  };

  // 삭제
  const requestDelete = (product) => {
    setDelTarget(product);
    setDelOpen(true);
  };

  const confirmDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDelOpen(false);
    setDelTarget(null);
  };

  return (
    <div className="w-full p-5 mx-auto max-w-8xl">
      {/* 헤더 */}
      <ProductHeader
        onClickNew={() => {
          setEditTarget(null);
          setFormOpen(true);
        }}
      />

      {/* 필터 */}
      <ProductFilter
        q={q}
        setQ={setQ}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* 테이블 */}
      <ProductTable
        pageData={pageData}
        toggleAvailable={toggleAvailable}
        onEdit={(p) => {
          setEditTarget(p);
          setFormOpen(true);
        }}
        onRequestDelete={requestDelete}
      />

      {/* 페이지네이션 */}
      <Pagination
        page={page}
        pageCount={pageCount}
        onChange={(next) => {
          const clamped = Math.min(Math.max(1, next), pageCount);
          setPage(clamped);
        }}
        className="mt-6"
      />

      {/* 추가/수정 모달 */}
      <ProductFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initial={editTarget}
      />

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        open={delOpen}
        onClose={() => setDelOpen(false)}
        product={delTarget}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
