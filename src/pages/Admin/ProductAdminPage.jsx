import React, { useEffect, useState } from "react";
import {
  ProductHeader,
  ProductFilter,
  ProductTable,
  Pagination,
} from "../../components/common/layouts/admin/products";
import ProductFormModal from "../../components/common/layouts/admin/products/ProductFormModal";
import DeleteConfirmModal from "../../components/common/layouts/admin/products/DeleteConfirmModal";

import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct as deleteProductAPI,
  toggleAvailableAPI,
} from "../../components/common/api/admin/products";

export default function ProductAdminPage() {
  const PAGE_SIZE = 5;

  // 목록 & UI 상태
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // 모달
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // 삭제 모달
  const [delOpen, setDelOpen] = useState(false);
  const [delTarget, setDelTarget] = useState(null);

  // ====== 서버 목록 로드 ======
  const fetchList = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await listProducts({ pageSize: 1000 });
      const items = Array.isArray(data) ? data : (data?.items ?? []);
      setProducts(items);
    } catch (e) {
      console.error(e);
      setError(e.message || "목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

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

  // 검색/필터 변경 시 첫 페이지로
  useEffect(() => {
    setPage(1);
  }, [q, selectedCategory]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const toggleAvailable = async (id) => {
    const prev = products;
    const next = prev.map((p) =>
      p.id === id ? { ...p, is_available: !p.is_available } : p
    );
    setProducts(next);
    try {
      const changed = next.find((p) => p.id === id);
      await toggleAvailableAPI(id, changed.is_available);
    } catch (e) {
      console.error(e);
      alert("상태 변경 실패. 되돌립니다.");
      setProducts(prev);
    }
  };

  const handleSave = async (payload, isEdit) => {
    try {
      setError("");
      if (isEdit) {
        const updated = await updateProduct(payload.id, payload);
        setProducts((prev) =>
          prev.map((p) => (p.id === payload.id ? { ...p, ...(updated || payload) } : p))
        );
      } else {
        const created = await createProduct(payload);
        const row = created?.id ? created : { ...payload, id: Date.now() };
        setProducts((prev) => [row, ...prev]);
      }
      setFormOpen(false);
      setEditTarget(null);
    } catch (e) {
      console.error(e);
      setError(e.message || "저장에 실패했습니다.");
      alert("저장에 실패했습니다.");
    }
  };

  const requestDelete = (product) => {
    setDelTarget(product);
    setDelOpen(true);
  };

  const confirmDelete = async (id) => {
    const prev = products;
    setProducts(prev.filter((p) => p.id !== id));
    try {
      await deleteProductAPI(id);
      setDelOpen(false);
      setDelTarget(null);
    } catch (e) {
      console.error(e);
      alert("삭제 실패. 되돌립니다.");
      setProducts(prev);
    }
  };

  return (
    <div className="w-full p-5 mx-auto max-w-8xl">
      {/* 헤더 */}
      <ProductHeader
        onClickNew={() => {
          setEditTarget(null);
          setFormOpen(true);
        }}
        rightExtra={
          <button
            onClick={fetchList}
            className="ml-2 rounded-lg border px-3 py-1 text-sm"
            title="새로고침"
          >
            새로고침
          </button>
        }
      />

      {/* 상태 표시 */}
      {loading && <div className="mt-2 text-sm text-gray-500">불러오는 중…</div>}
      {error && <div className="mt-2 text-sm text-red-500">⚠ {error}</div>}

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
        onConfirm={() => delTarget && confirmDelete(delTarget.id)}
      />
    </div>
  );
}
