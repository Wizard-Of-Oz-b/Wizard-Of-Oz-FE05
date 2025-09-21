import React, { useEffect, useMemo, useState } from 'react';
import {
  listProductStocks,
  patchProductStock,
  deleteProductStock,
  labelFromOptions,
  searchProductsLite,
} from '../../components/common/api/admin/productStocks';
import StockAddModal from '../../components/common/layouts/admin/stocks/StockAddModal';
import ConfirmModal from '../../components/common/layouts/admin/common/ConfirmModal';
import StockTable from '../../components/common/layouts/admin/stocks/page/StockTable';
import InventoryHeader from '../../components/common/layouts/admin/stocks/page/InventoryHeader';
import SearchFilterCard from '../../components/common/layouts/admin/stocks/page/SearchFilterCard';

export default function AdminStockPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [ordering, setOrdering] = useState('-updated_at');

  const [addOpen, setAddOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [delTarget, setDelTarget] = useState(null);

  // 정렬 드롭다운
  const [sortOpen, setSortOpen] = useState(false);
  const sortBtnRef = React.useRef(null);

  // 목록 조회
  const fetchList = async (kwOverride) => {
    try {
      setLoading(true);
      const kw = (kwOverride ?? q ?? '').trim();

      let data = [];
      if (kw) {
        let productHits = [];
        try {
          productHits = await searchProductsLite(kw, 50);
        } catch {
          productHits = [];
        }

        if (productHits.length > 0) {
          const ids = productHits.map((p) => p.id).filter((v) => v != null);
          const calls = ids.map((pid) =>
            listProductStocks({ product: pid, ordering })
              .then((res) => res || [])
              .catch(() => [])
          );
          const chunks = await Promise.all(calls);
          const mergedMap = new Map();
          chunks.flat().forEach((row) => {
            const key = row.id ?? `${row.product}-${row.option_key ?? ''}`;
            if (!mergedMap.has(key)) mergedMap.set(key, row);
          });
          data = Array.from(mergedMap.values());
        } else {
          const stockData = (await listProductStocks({ search: kw, ordering })) || [];
          const hay = kw.toLowerCase();
          const filtered = stockData.filter((r) => {
            const parts = [
              r.product_name,
              (typeof r.product === 'string' && !/^\d+$/.test(r.product)) ? r.product : '',
              r.name,
              r.title,
              r.product_display,
              r.category_name,
              r.category,
              r.category_name_full,
              r.option_key,
              typeof r.options === 'string' ? r.options : '',
            ].filter(Boolean);
            const haystack = (parts.join(' ') || JSON.stringify(r)).toLowerCase();
            return haystack.includes(hay);
          });
          data = filtered.length > 0 ? filtered : stockData;
        }

        if (kwOverride !== undefined && kw !== q) setQ(kw);
      } else {
        data = (await listProductStocks({ ordering })) || [];
      }

      // 🔒 서버가 소프트삭제/0재고도 준다면 프런트에서 숨김
      const cleaned = (data || []).filter((r) => {
        if (r.is_deleted === true) return false;
        if (r.is_active === false) return false; // 서버 정책에 맞춰 사용
        if (Number(r.stock_quantity) === 0) return false;
        return true;
      });

      setRows(
        cleaned.map((r) => ({
          ...r,
          _qty: r.stock_quantity,
          _dirty: false,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordering]);

  // 드롭다운 외부 클릭/ESC 키다운 닫힘
  useEffect(() => {
    const onClick = (e) => {
      if (!sortOpen) return;
      if (!sortBtnRef.current) return;
      const menu = document.getElementById('sort-menu-portal');
      if (!sortBtnRef.current.contains(e.target) && !menu?.contains(e.target)) {
        setSortOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setSortOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [sortOpen]);

  const onSearch = async (kw) => {
    await fetchList(typeof kw === 'string' ? kw : undefined);
  };

  const setRowQty = (id, v) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, _qty: v, _dirty: Number(v) !== r.stock_quantity }
          : r
      )
    );
  };

  const saveRow = async (row) => {
    await patchProductStock(row.id, { stock_quantity: Number(row._qty || 0) });
    await fetchList();
  };

  const requestDelete = (row) => {
    setDelTarget(row);
    setDelOpen(true);
  };

  const confirmDelete = async () => {
    if (!delTarget?.id) return;
    const targetId = delTarget.id;
    try {
      const res = await deleteProductStock(targetId);
      setDelOpen(false);
      setDelTarget(null);

      if (res?.softDeleted) {
        setRows((prev) => prev.filter((r) => r.id !== targetId));
      } else {
        await fetchList();
      }
    } catch (e) {
      console.error('delete failed', e);
      alert(e?.message || '삭제에 실패했습니다.');
    }
  };

  const table = useMemo(
    () => (
      <StockTable
        rows={rows}
        setRowQty={setRowQty}
        saveRow={saveRow}
        requestDelete={requestDelete}
      />
    ),
    [rows]
  );

  return (
    <div className="w-full p-5 mx-auto max-w-8xl">
      {/* 헤더 */}
      <InventoryHeader
        loading={loading}
        fetchList={fetchList}
        setAddOpen={setAddOpen}
      />

      {/* 검색/정렬 카드 */}
      <SearchFilterCard
        q={q}
        setQ={setQ}
        onSearch={onSearch}
        ordering={ordering}
        setOrdering={setOrdering}
        sortOpen={sortOpen}
        setSortOpen={setSortOpen}
        sortBtnRef={sortBtnRef}
        rowsLength={rows.length}
      />

      {loading ? (
        <div className="text-sm text-gray-500">불러오는 중…</div>
      ) : (
        table
      )}

      <ConfirmModal
        open={delOpen}
        onClose={() => setDelOpen(false)}
        onConfirm={confirmDelete}
        title="해당 품목의 재고를 삭제하시겠습니까?"
        description={`${
          delTarget?.product_name ?? delTarget?.product ?? ''
        } / ${labelFromOptions(delTarget?.options)} 행을 삭제하시겠어요?`}
        confirmText="삭제"
        cancelText="취소"
        variant="error"
      />

      <StockAddModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdded={fetchList}
      />
    </div>
  );
}
