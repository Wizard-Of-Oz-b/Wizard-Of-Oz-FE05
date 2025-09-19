import React, { useEffect, useMemo, useState } from 'react';
import {
  listProductStocks,
  patchProductStock,
  deleteProductStock,
  labelFromOptions,
} from '../../components/common/api/admin/productStocks';
import StockAddModal from '../../components/common/layouts/admin/products/StockAddModal';
import ConfirmModal from '../../components/common/layouts/admin/common/ConfirmModal';
import { Boxes, RefreshCw } from 'lucide-react';

function Input({ className = '', ...rest }) {
  return (
    <input
      {...rest}
      className={
        'h-10 rounded-xl bg-gray-50 px-3 text-sm outline-none border-0 shadow-sm ' +
        className
      }
    />
  );
}

export default function AdminStockPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [ordering, setOrdering] = useState('-updated_at');

  const [addOpen, setAddOpen] = useState(false);

  const [delOpen, setDelOpen] = useState(false);
  const [delTarget, setDelTarget] = useState(null);

  const fetchList = async () => {
    try {
      setLoading(true);
      const data = await listProductStocks({
        search: q || undefined,
        ordering,
      });
      setRows(
        (data || []).map((r) => ({
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
  }, [ordering]);

  const onSearch = async (e) => {
    e?.preventDefault?.();
    await fetchList();
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
    await deleteProductStock(delTarget.id);
    setDelOpen(false);
    setDelTarget(null);
    await fetchList();
  };

  const table = useMemo(
    () => (
      <div className="relative rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
        <table className="w-full table-auto text-sm">
          <colgroup className="hidden md:table-column-group">
            {[
              'w-[40%]', // 상품/옵션
              'w-[18%]', // 옵션키
              'w-[20%]', // 수정일
              'w-[12%]', // 재고
              'w-[10%]', // 기능
            ].map((cls, i) => (
              <col key={i} className={cls} />
            ))}
          </colgroup>

          <thead className="bg-gradient-to-r from-violet-600 to-violet-700 text-white text-left text-xs font-semibold uppercase tracking-wide">
            <tr>
              <th className="px-3 md:px-4 py-3 rounded-tl-2xl">상품 / 옵션</th>
              <th className="px-3 md:px-4 py-3 hidden md:table-cell">옵션키</th>
              <th className="px-3 md:px-4 py-3 hidden md:table-cell">수정일</th>
              <th className="px-3 md:px-4 py-3 text-right">재고</th>
              <th className="px-3 md:px-4 py-3 text-center rounded-tr-2xl">
                기능
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  행이 없습니다.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr
                  key={r.id}
                  className="odd:bg-white even:bg-gray-50/40 hover:bg-violet-50/50 transition-colors"
                >
                  {/* 상품/옵션 */}
                  <td className="px-3 md:px-4 py-3 align-middle">
                    <div className="font-semibold text-gray-900 truncate">
                      {r.product_name || r.product}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-500 truncate">
                      {labelFromOptions(r.options)}
                    </div>

                    {/* 보조정보 */}
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400 md:hidden">
                      <span className="truncate max-w-[40vw]">
                        {r.option_key || '-'}
                      </span>
                      <span>·</span>
                      <span className="whitespace-nowrap">
                        {r.updated_at
                          ? new Date(r.updated_at).toLocaleString()
                          : '-'}
                      </span>
                    </div>
                  </td>

                  {/* 옵션키 */}
                  <td className="px-3 md:px-4 py-3 align-middle text-xs text-gray-600 break-all hidden md:table-cell">
                    {r.option_key || '-'}
                  </td>

                  {/* 수정일  */}
                  <td className="px-3 md:px-4 py-3 align-middle text-xs text-gray-500 whitespace-nowrap hidden md:table-cell">
                    {r.updated_at
                      ? new Date(r.updated_at).toLocaleString()
                      : '-'}
                  </td>

                  {/* 재고 */}
                  <td className="px-3 md:px-4 py-3 align-middle">
                    <div className="flex items-center justify-end">
                      <input
                        type="number"
                        value={r._qty ?? 0}
                        onChange={(e) => setRowQty(r.id, e.target.value)}
                        className="h-9 w-24 rounded-lg border border-gray-200 bg-white px-2 text-right outline-none"
                      />
                    </div>
                  </td>

                  {/* 기능 */}
                  <td className="px-3 md:px-4 py-3 align-middle">
                    <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                      <button
                        className={
                          'h-9 px-3 inline-flex items-center rounded-md text-xs font-semibold text-white shrink-0 ' +
                          (r._dirty
                            ? 'bg-violet-600 hover:bg-violet-700'
                            : 'bg-gray-300')
                        }
                        disabled={!r._dirty}
                        onClick={() => saveRow(r)}
                        title="저장"
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeWidth="2"
                            d="M7 4h10l3 3v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
                          />
                          <path strokeWidth="2" d="M7 10h10" />
                        </svg>
                        <span className="hidden lg:inline ml-1">저장</span>
                      </button>

                      <button
                        className="h-9 px-3 inline-flex items-center rounded-md text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shrink-0"
                        onClick={() => requestDelete(r)}
                        title="삭제"
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <polyline strokeWidth="2" points="3 6 5 6 21 6" />
                          <path
                            strokeWidth="2"
                            d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
                          />
                          <path strokeWidth="2" d="M10 11v6M14 11v6" />
                          <path
                            strokeWidth="2"
                            d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                          />
                        </svg>
                        <span className="hidden lg:inline ml-1">삭제</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    ),
    [rows]
  );

  return (
    <div className="w-full p-5 mx-auto max-w-8xl">
      {/* 헤더 */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg">
            <Boxes className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-violet-700 tracking-tight">
              재고 관리
            </h1>
            <p className="text-sm uppercase tracking-widest text-gray-400">
              Inventory Management
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <form onSubmit={onSearch} className="flex items-center gap-2">
            <Input
              placeholder="상품명/옵션 검색"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-60"
            />
            <select
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
              className="h-10 rounded-xl bg-white px-3 text-sm outline-none border border-gray-200"
            >
              <option value="-updated_at">최신 수정순 ⬇</option>
              <option value="updated_at">최신 수정순 ⬆</option>
              <option value="-stock_quantity">재고 많음 ⬇</option>
              <option value="stock_quantity">재고 많음 ⬆</option>
            </select>
            <button
              className="h-10 px-4 rounded-xl bg-gray-900 text-white text-sm shadow hover:bg-gray-800"
              type="submit"
              disabled={loading}
            >
              검색
            </button>
          </form>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAddOpen(true)}
              className="h-10 px-4 rounded-xl bg-violet-600 text-white text-sm shadow hover:bg-violet-700"
            >
              재고 추가
            </button>
            <button
              className="h-10 px-3 rounded-xl border text-sm flex items-center gap-1"
              onClick={fetchList}
              disabled={loading}
              title="새로고침"
            >
              <RefreshCw className="w-4 h-4" /> 새로고침
            </button>
          </div>
        </div>
      </div>

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
