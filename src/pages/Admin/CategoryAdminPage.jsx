import React, { useEffect, useMemo, useState } from 'react';
import {
  Tags,
  PlusCircle,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Search,
} from 'lucide-react';
import {
  IconButton,
  Modal,
  CategoryFormModal,
  DeleteConfirmModal,
  CategoryTable,
} from '../../components/common/layouts/admin/categories';
import {
  buildTree,
  flattenTree,
  bySort,
} from '../../components/features/admin/categories/tree';
import mockCategories from '../../components/features/admin/categories/mockCategories';

export default function CategoryAdminPage() {
  const PAGE_SIZE = 9;

  const [categories, setCategories] = useState(mockCategories);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const [delOpen, setDelOpen] = useState(false);
  const [delTarget, setDelTarget] = useState(null);

  const filtered = useMemo(() => {
    const byQ = q.trim().toLowerCase();
    const list = byQ
      ? categories.filter(
          (c) =>
            c.name.toLowerCase().includes(byQ) ||
            c.slug.toLowerCase().includes(byQ)
        )
      : categories.slice();
    const tree = buildTree(list);
    return flattenTree(tree);
  }, [categories, q]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [q]);

  // CRUD
  const handleSave = (payload) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === payload.id);
      if (exists)
        return prev.map((c) =>
          c.id === payload.id ? { ...c, ...payload } : c
        );
      return [...prev, { ...payload, product_count: 0 }];
    });
  };

  const toggleVisible = (id) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
    );
  };

  const confirmDelete = (id) => {
    const hasChildren = categories.some((c) => c.parentId === id);
    if (hasChildren) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setDelOpen(false);
  };

  const move = (id, dir = -1) => {
    setCategories((prev) => {
      const target = prev.find((c) => c.id === id);
      if (!target) return prev;
      const siblings = prev
        .filter((c) => c.parentId === target.parentId)
        .sort(bySort);
      const idx = siblings.findIndex((s) => s.id === id);
      const swapWith = siblings[idx + dir];
      if (!swapWith) return prev;

      const copy = prev.slice();
      const a = copy.find((c) => c.id === target.id);
      const b = copy.find((c) => c.id === swapWith.id);
      const tmp = a.sort;
      a.sort = b.sort;
      b.sort = tmp;
      return copy;
    });
  };

  const openCreate = () => {
    setEditTarget(null);
    setFormOpen(true);
  };
  const openEdit = (cat) => {
    setEditTarget(cat);
    setFormOpen(true);
  };
  const openDelete = (cat) => {
    setDelTarget(cat);
    setDelOpen(true);
  };
  const hasChildren = (id) => categories.some((c) => c.parentId === id);

  // Pagination
  const goFirst = () => setPage(1);
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(pageCount, p + 1));
  const goLast = () => setPage(pageCount);

  return (
    <div className="w-full p-5 mx-auto max-w-8xl">
      {/* 헤더 */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg">
            <Tags className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-violet-700 tracking-tight">
              카테고리 관리
            </h1>
            <p className="text-sm uppercase tracking-widest text-gray-400">
              Category Management
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-violet-700 hover:shadow-lg"
        >
          <PlusCircle className="size-5" /> 새 카테고리
        </button>
      </div>

      {/* 필터 */}
      <div className="mb-6 flex flex-col md:flex-row gap-3 items-center justify-between rounded-2xl bg-white/90 shadow-md backdrop-blur-md p-4">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="카테고리명/슬러그 검색…"
            className="h-10 w-full rounded-xl bg-gray-50 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
          />
        </div>
      </div>

      {/* 테이블 */}
      <CategoryTable
        pageData={pageData}
        toggleVisible={toggleVisible}
        move={move}
        openEdit={openEdit}
        openDelete={openDelete}
      />

      {/* 페이지네이션 */}
      <div className="mt-6 flex justify-center gap-2 items-center">
        <IconButton
          title="첫 페이지"
          onClick={goFirst}
          disabled={page <= 1}
          className="h-9 w-9 p-0 rounded-full border-gray-200 text-gray-600 hover:text-violet-700 disabled:cursor-not-allowed"
        >
          <ChevronsLeft className="size-4" />
        </IconButton>

        <IconButton
          title="이전"
          onClick={goPrev}
          disabled={page <= 1}
          className="h-9 w-9 p-0 rounded-full border-gray-200 text-gray-600 hover:text-violet-700 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="size-4" />
        </IconButton>

        <span className="px-2 text-sm font-medium tabular-nums select-none">
          <span className="font-semibold text-violet-700">페이지 {page}</span> /{' '}
          {pageCount}
        </span>

        <IconButton
          title="다음"
          onClick={goNext}
          disabled={page >= pageCount}
          className="h-9 w-9 p-0 rounded-full border-gray-200 text-gray-600 hover:text-violet-700 disabled:cursor-not-allowed"
        >
          <ChevronRight className="size-4" />
        </IconButton>

        <IconButton
          title="마지막"
          onClick={goLast}
          disabled={page >= pageCount}
          className="h-9 w-9 p-0 rounded-full border-gray-200 text-gray-600 hover:text-violet-700 disabled:cursor-not-allowed"
        >
          <ChevronsRight className="size-4" />
        </IconButton>
      </div>

      {/* 모달 */}
      <CategoryFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        category={editTarget}
        allCategories={categories}
        onSave={handleSave}
      />
      <DeleteConfirmModal
        open={delOpen}
        onClose={() => setDelOpen(false)}
        category={delTarget}
        hasChildren={delTarget ? hasChildren(delTarget.id) : false}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
