import React, { useEffect, useMemo, useState } from "react";
import { Tags, PlusCircle, Search, RefreshCcw } from "lucide-react";
import CategoryTable from "../../components/common/layouts/admin/categories/CategoryTable";
import CategoryFormModal from "../../components/common/layouts/admin/categories/CategoryFormModal";
import DeleteConfirmModal from "../../components/common/layouts/admin/categories/DeleteConfirmModal";
import IconButton from "../../components/common/layouts/admin/common/IconButton";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  removeCategory,
} from "../../components/common/api/admin/categoryService";
import { normalizeToTree, flattenTree } from "../../lib/categoryTree";

export default function CategoryAdminPage() {
  const PAGE_SIZE = 12;

  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const [delOpen, setDelOpen] = useState(false);
  const [delTarget, setDelTarget] = useState(null);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const list = await fetchCategories({ tree: true });
      setTree(normalizeToTree(list));
    } catch (e) {
      const code = e?.response?.status;
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : "") ||
        e?.message ||
        "카테고리를 불러오지 못했습니다.";
      setErr(code ? `[${code}] ${msg}` : msg);
      setTree([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const flat = useMemo(() => {
    const arr = flattenTree(tree);
    const keyword = q.trim().toLowerCase();
    if (!keyword) return arr;
    return arr.filter((c) => String(c.name).toLowerCase().includes(keyword));
  }, [tree, q]);

  const total = flat.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageData = flat.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => setPage(1), [q]);

  async function handleSave({ id, name, parentId }) {
    if (!name?.trim()) return;
    if (id) await updateCategory(id, { name, parentId });
    else await createCategory({ name, parentId });
    setFormOpen(false);
    await load();
  }

  async function confirmDelete() {
    if (!delTarget?.id) return;
    try {
      await removeCategory(delTarget.id);
      setDelOpen(false);
      await load();
    } catch (e) {
      const code = e?.response?.status;
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : "") ||
        e?.message ||
        "삭제에 실패했습니다.";
      alert(code ? `[${code}] ${msg}` : msg);
    }
  }

  return (
    <div className="w-full p-5 mx-auto max-w-8xl">
      {/* 헤더 */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg">
            <Tags className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-violet-700 tracking-tight">카테고리 관리</h1>
            <p className="text-sm uppercase tracking-widest text-gray-400">Category Management</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="inline-flex items-center gap-2 rounded-xl bg-white/80 backdrop-blur border border-black/10 px-3 py-2 text-sm hover:bg-white shadow-sm"
          >
            <RefreshCcw className="w-4 h-4" />
            새로고침
          </button>
          <button
            onClick={() => { setEditTarget(null); setFormOpen(true); }}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-violet-700 hover:shadow-lg"
          >
            <PlusCircle className="size-5" /> 새 카테고리
          </button>
        </div>
      </div>

      {/* 필터 */}
      <div className="mb-6 flex flex-col md:flex-row gap-3 items-center justify-between rounded-2xl bg-white/90 shadow-md backdrop-blur-md p-4">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="카테고리명 검색…"
            className="h-10 w-full rounded-xl bg-gray-50 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
          />
        </div>
        <div className="text-xs text-gray-500">총 <b>{total}</b>개</div>
      </div>

      {/* 에러/로딩 */}
      {err && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700 text-sm">
          {err}
        </div>
      )}
      {loading ? (
        <div className="py-16 text-center text-sm text-gray-500">불러오는 중…</div>
      ) : (
        <>
          <CategoryTable
            pageData={pageData}
            openEdit={(row) => { setEditTarget(row); setFormOpen(true); }}
            openDelete={(row) => { setDelTarget(row); setDelOpen(true); }}
          />

          {/* 페이지네이션 */}
          <div className="mt-6 flex justify-center gap-2 items-center">
            <IconButton title="첫 페이지" onClick={() => setPage(1)} disabled={page <= 1}>«</IconButton>
            <IconButton title="이전" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>‹</IconButton>
            <span className="px-2 text-sm font-medium tabular-nums select-none">
              <span className="font-semibold text-violet-700">페이지 {page}</span> / {pageCount}
            </span>
            <IconButton title="다음" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page >= pageCount}>›</IconButton>
            <IconButton title="마지막" onClick={() => setPage(pageCount)} disabled={page >= pageCount}>»</IconButton>
          </div>
        </>
      )}

      {/* 모달 */}
      <CategoryFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        category={editTarget}
        allCategories={flattenTree(tree)}
        onSave={handleSave}
      />
      <DeleteConfirmModal
        open={delOpen}
        onClose={() => setDelOpen(false)}
        category={delTarget}
        hasChildren={false} 
        onConfirm={confirmDelete}
      />
    </div>
  );
}
