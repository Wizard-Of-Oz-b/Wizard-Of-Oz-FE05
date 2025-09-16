import React, { useEffect, useState } from 'react';
import {
  ProductHeader,
  ProductFilter,
  ProductTable,
  Pagination,
} from '../../components/common/layouts/admin/products';
import ProductFormModal from '../../components/common/layouts/admin/products/ProductFormModal';
import ConfirmModal from '../../components/common/layouts/admin/products/ConfirmModal';

import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct as deleteProductAPI,
  toggleAvailableAPI,
} from '../../components/common/api/admin/products';

export default function ProductAdminPage() {
  const PAGE_SIZE = 5;

  // 목록 & UI 상태
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // 모달
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // 삭제 모달
  const [delOpen, setDelOpen] = useState(false);
  const [delTarget, setDelTarget] = useState(null);

  const getId = (row) =>
    row?.id ??
    row?.product_id ??
    row?.pk ??
    row?.['Product id'] ??
    row?.['product id'];

  // ====== 서버 목록 로드 ======
  const fetchList = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await listProducts({ pageSize: 1000 });
      const items = Array.isArray(data) ? data : data?.items ?? [];
      setProducts(items);
    } catch (e) {
      console.error(e);
      setError(e.message || '목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filtered = products.filter((p) => {
    const matchCategory = selectedCategory
      ? p.category === selectedCategory
      : true;
    const kw = q.trim().toLowerCase();
    const matchQuery = kw
      ? (p.name || '').toLowerCase().includes(kw) ||
        (p.sku || '').toLowerCase().includes(kw)
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

  const toggleAvailable = async (row) => {
    const id = row?.id ?? row?.product_id ?? row?.pk;
    if (!id) {
      console.warn('상품 ID 없음:', row);
      return;
    }

    const prev = products;
    const next = prev.map((p) =>
      (p.id ?? p.product_id ?? p.pk) === id
        ? { ...p, is_active: !p.is_active }
        : p
    );
    setProducts(next);

    try {
      const changed = next.find((p) => (p.id ?? p.product_id ?? p.pk) === id);
      await toggleAvailableAPI(id, changed.is_active);
    } catch (e) {
      console.error(e);
      setProducts(prev);
      setError(e.message || '상태 변경에 실패하였습니다.');
    }
  };
  const handleSave = async (payload, isEdit) => {
    try {
      setError('');
      if (isEdit) {
        await updateProduct(payload.id, payload);
      } else {
        await createProduct(payload);
      }
      await fetchList();
      setFormOpen(false);
      setEditTarget(null);
    } catch (e) {
      console.error(e);
      setError(e.message || '변경사항 저장에 실패했습니다.');
    }
  };

  const requestDelete = (product) => {
    setDelTarget(product);
    setDelOpen(true);
  };

  const confirmDelete = async (id) => {
    const prev = products;
    setProducts(prev.filter((p) => getId(p) !== id));
    try {
      await deleteProductAPI(id);
      setDelOpen(false);
      setDelTarget(null);
    } catch (e) {
      console.error(e);
      setProducts(prev);
      setError(e.message || '해당 상품 삭제에 실패하였습니다.');
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
      {loading && (
        <div className="mt-2 text-sm text-gray-500">불러오는 중…</div>
      )}
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
      <ConfirmModal
        open={delOpen}
        onClose={() => setDelOpen(false)}
        title="상품 삭제"
        description={`${
          delTarget?.name ?? ''
        } 상품을 삭제하시겠어요? 이 작업은 되돌릴 수 없습니다.`}
        variant="error"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={() => delTarget && confirmDelete(getId(delTarget))}
      />
    </div>
  );
}
