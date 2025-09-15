import React, { useEffect, useMemo, useState } from 'react';
import { Percent, PlusCircle } from 'lucide-react';
import CouponFilters from '../../components/common/layouts/admin/coupons/CouponFilters';
import CouponTable from '../../components/common/layouts/admin/coupons/CouponTable';
import Pagination from '../../components/common/layouts/admin/coupons/Pagination';
import CouponFormModal from '../../components/common/layouts/admin/coupons/CouponFormModal';
import DeleteConfirmModal from '../../components/common/layouts/admin/coupons/DeleteConfirmModal';
import {
  fmtMoney,
  getStatus,
  toYMD,
  startOfWeek,
  endOfWeek,
} from '../../utils/admin/couponUtils';
import mockCoupons from '../../components/features/admin/coupons/mockCoupons';


export default function CouponPromoAdminPage() {
  const PAGE_SIZE = 10;
  const [coupons, setCoupons] = useState(mockCoupons);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [delOpen, setDelOpen] = useState(false);
  const [delTarget, setDelTarget] = useState(null);

  const now = new Date();

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    const fStart = startDateFilter ? new Date(startDateFilter) : null;
    const fEnd = endDateFilter ? new Date(endDateFilter) : null;

    return coupons.filter((c) => {
      const st = getStatus(now, c);
      const byKw =
        !kw ||
        c.code.toLowerCase().includes(kw) ||
        (c.name || '').toLowerCase().includes(kw);
      const byStatus = !statusFilter || st === statusFilter;

      const cStart = c.startDate ? new Date(c.startDate) : null;
      const cEnd = c.endDate ? new Date(c.endDate) : null;

      const couponStart = cStart || new Date(-8640000000000000);
      const couponEnd = cEnd || new Date(8640000000000000);
      const filterStart = fStart || new Date(-8640000000000000);
      const filterEnd = fEnd || new Date(8640000000000000);

      const byDate = couponStart <= filterEnd && filterStart <= couponEnd;
      return byKw && byStatus && byDate;
    });
  }, [coupons, q, statusFilter, startDateFilter, endDateFilter, now]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(
    () => setPage(1),
    [q, statusFilter, startDateFilter, endDateFilter]
  );

  // CRUD
  const handleSave = (payload) => {
    setCoupons((prev) => {
      const exists = prev.some((c) => c.id === payload.id);
      return exists
        ? prev.map((c) => (c.id === payload.id ? { ...c, ...payload } : c))
        : [payload, ...prev];
    });
  };
  const toggleActive = (id) =>
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  const confirmDelete = (id) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    setDelOpen(false);
  };

  // Quick range
  const setToday = () => {
    const t = new Date();
    const ymd = toYMD(t);
    setStartDateFilter(ymd);
    setEndDateFilter(ymd);
  };
  const setThisWeek = () => {
    const s = startOfWeek(new Date());
    const e = endOfWeek(new Date());
    setStartDateFilter(toYMD(s));
    setEndDateFilter(toYMD(e));
  };
  const setThisMonth = () => {
    const t = new Date();
    const s = new Date(t.getFullYear(), t.getMonth(), 1);
    const e = new Date(t.getFullYear(), t.getMonth() + 1, 0);
    setStartDateFilter(toYMD(s));
    setEndDateFilter(toYMD(e));
  };
  const clearRange = () => {
    setStartDateFilter('');
    setEndDateFilter('');
  };

  // Pagination handlers
  const goFirst = () => setPage(1);
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(pageCount, p + 1));
  const goLast = () => setPage(pageCount);

  // Modal handlers
  const openCreate = () => {
    setEditTarget(null);
    setFormOpen(true);
  };
  const openEdit = (c) => {
    setEditTarget(c);
    setFormOpen(true);
  };
  const openDelete = (c) => {
    setDelTarget(c);
    setDelOpen(true);
  };

  return (
    <div className="w-full p-5 mx-auto max-w-8xl">
      {/* 헤더 */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg">
            <Percent className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-violet-700 tracking-tight">
              쿠폰 / 프로모션
            </h1>
            <p className="text-sm uppercase tracking-widest text-gray-400">
              Coupons & Promotions
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-violet-700 hover:shadow-lg"
        >
          <PlusCircle className="size-5" /> 쿠폰 생성하기
        </button>
      </div>

      {/* 필터 */}
      <CouponFilters
        q={q}
        setQ={setQ}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        startDateFilter={startDateFilter}
        endDateFilter={endDateFilter}
        setStartDateFilter={setStartDateFilter}
        setEndDateFilter={setEndDateFilter}
        setToday={setToday}
        setThisWeek={setThisWeek}
        setThisMonth={setThisMonth}
        clearRange={clearRange}
      />

      {/* 테이블 */}
      <CouponTable
        items={pageData}
        now={now}
        onEdit={openEdit}
        onToggleActive={toggleActive}
        onDelete={openDelete}
      />

      {/* 페이지네이션 */}
      <Pagination
        page={page}
        pageCount={pageCount}
        goFirst={goFirst}
        goPrev={goPrev}
        goNext={goNext}
        goLast={goLast}
      />

      {/* 모달 */}
      <CouponFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        coupon={editTarget}
        onSave={handleSave}
      />
      <DeleteConfirmModal
        open={delOpen}
        onClose={() => setDelOpen(false)}
        target={delTarget}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
