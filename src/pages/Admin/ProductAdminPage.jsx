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
import { fetchCategories } from '../../components/common/api/admin/categoryService';
import { buildCategoryPathMap } from '../../lib/categoryPath';
import api from '../../lib/axios';

export default function ProductAdminPage() {
  const [categoryMap, setCategoryMap] = useState({});
  const PAGE_SIZE = 10;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const [delOpen, setDelOpen] = useState(false);
  const [delTarget, setDelTarget] = useState(null);

  const getId = (row) => row?.id || null;

  const onEdit = async (row) => {
    const id = row?.id ?? row?.product_id ?? row?.pk;
    if (!id) return;

    try {
      const { data } = await api.get(`/v1/admin/products/${id}/`);
      setEditTarget(data);
      setFormOpen(true);
    } catch (e) {
      console.error('상세 조회 실패:', e);
    }
  };

  const fetchList = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await listProducts({ page: 1, pageSize: 50 });
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
    (async () => {
      await fetchList();
      try {
        const cats = await fetchCategories();
        const { map } = buildCategoryPathMap(cats || []);
        setCategoryMap(map);
      } catch (e) {
        console.warn('category map fail:', e?.message || e);
        setCategoryMap({});
      }
    })();
  }, []);

  const filtered = products.filter((p) => {
    const matchCategory = selectedCategory
      ? p.category === selectedCategory
      : true;
    const kw = q.trim().toLowerCase();
    const matchQuery = kw ? (p.name || '').toLowerCase().includes(kw) : true;
    return matchCategory && matchQuery;
  });

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [q, selectedCategory]);
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const toggleAvailable = async (row) => {
    const id = getId(row);
    if (!id) return;

    const prev = products;
    const next = prev.map((p) =>
      getId(p) === id ? { ...p, is_active: !p.is_active } : p
    );
    setProducts(next);

    try {
      const changed = next.find((p) => getId(p) === id);
      await toggleAvailableAPI(id, changed.is_active);
    } catch (e) {
      console.error(e);
      setProducts(prev);
      setError(e.message || '상태 변경에 실패하였습니다.');
    }
  };

  // 저장(생성/수정) 후 목록 새로고침 + 저장결과 반환
  const handleSave = async (payload, isEditFlag) => {
    try {
      setError('');

      const mustUpdate = !!(isEditFlag || payload?.id);
      let saved;

      if (mustUpdate) {
        if (!payload?.id) payload.id = editTarget?.id;
        saved = await updateProduct(payload.id, payload);
      } else {
        saved = await createProduct(payload);
      }

      await fetchList();
      setFormOpen(false);
      setEditTarget(null);

      return saved; // 모달에서 이어서 사용
    } catch (e) {
      console.error(e);
      setError(e.message || '변경사항 저장에 실패했습니다.');
      throw e;
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

      {loading && (
        <div className="mt-2 text-sm text-gray-500">불러오는 중…</div>
      )}
      {error && <div className="mt-2 text-sm text-red-500">⚠ {error}</div>}

      <ProductFilter
        q={q}
        setQ={setQ}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <ProductTable
        pageData={pageData}
        toggleAvailable={toggleAvailable}
        onEdit={onEdit}
        onRequestDelete={requestDelete}
        categoryMap={categoryMap}
      />

      <Pagination
        page={page}
        pageCount={pageCount}
        onChange={(next) => setPage(Math.min(Math.max(1, next), pageCount))}
        className="mt-6"
      />

      {/* 모드 바뀔 때마다 리마운트 */}
      <ProductFormModal
        key={editTarget ? `edit-${editTarget.id}` : 'create'}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initial={editTarget}
      />

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
