// src/components/common/layouts/admin/products/StockAddModal.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { X, Search, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  searchProductsLite,
  createProductStock,
} from '../../../api/admin/productStocks';
import { toOptionQS } from '../../../api/admin/optionQS';

/* ---------- 작은 UI 유틸 ---------- */
const Chip = ({ children, tone = 'slate' }) => {
  const TONE = {
    slate: 'bg-slate-50 text-slate-700 ring-slate-200',
    violet: 'bg-violet-50 text-violet-700 ring-violet-200',
    indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    rose: 'bg-rose-50 text-rose-700 ring-rose-200',
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[11px] ring-1 ${TONE}`}
    >
      {children}
    </span>
  );
};

const QtyInput = ({ value, onChange, className = '' }) => {
  const set = (v) => onChange?.(String(Math.max(0, Number(v) || 0)));
  return (
    <div
      className={`inline-flex items-center rounded-xl ring-1 ring-slate-200 bg-white overflow-hidden shadow-sm ${className}`}
    >
      <button
        type="button"
        onClick={() => set((Number(value) || 0) - 1)}
        className="h-9 w-9 grid place-items-center hover:bg-slate-50 active:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
        aria-label="수량 감소"
      >
        <ChevronLeft className="w-4 h-4 text-slate-600" />
      </button>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => set(e.target.value)}
        className="h-9 w-16 text-right px-2 outline-none border-0"
      />
      <button
        type="button"
        onClick={() => set((Number(value) || 0) + 1)}
        className="h-9 w-9 grid place-items-center hover:bg-slate-50 active:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
        aria-label="수량 증가"
      >
        <ChevronRight className="w-4 h-4 text-slate-600" />
      </button>
    </div>
  );
};

/* ---------- 옵션 파싱 ---------- */
function parseOptions(opts = []) {
  const color =
    opts.find(
      (o) => (o?.id || '').toUpperCase() === 'OPT_COLOR' || o?.type === 'color'
    )?.values || [];
  const size =
    opts.find(
      (o) => (o?.id || '').toUpperCase() === 'OPT_SIZE' || o?.type === 'size'
    )?.values || [];
  const colors = color.map((v) => ({
    code: v.value,
    label: v.display || v.value,
    hex: v.hexCode,
  }));
  const sizes = size.map((v) => ({
    code: v.value,
    label: v.display || v.value,
  }));
  return { colors, sizes };
}
function cartesian(colors, sizes) {
  const C = colors.length ? colors : [{ code: '-', label: '-' }];
  const S = sizes.length ? sizes : [{ code: '-', label: '-' }];
  const rows = [];
  C.forEach((c) => {
    S.forEach((s) => {
      rows.push({
        key: `C:${c.code}|S:${s.code}`,
        color: c,
        size: s,
        checked: false,
        qty: 0,
      });
    });
  });
  return rows;
}

export default function StockAddModal({ open, onClose, onAdded }) {
  const [phase, setPhase] = useState('search'); // 'search' | 'matrix'
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const [picked, setPicked] = useState(null);
  const parsed = useMemo(() => parseOptions(picked?.options), [picked]);
  const [rows, setRows] = useState([]);

  const checkedCount = rows.filter((r) => r.checked && r.qty > 0).length;
  const totalQty = rows.reduce(
    (acc, r) => acc + (r.checked ? Number(r.qty || 0) : 0),
    0
  );

  const doSearch = async () => {
    setLoading(true);
    try {
      const items = await searchProductsLite(query, 12);
      setResults(items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setPhase('search');
      setQuery('');
      setResults([]);
      setPicked(null);
      setRows([]);
    }
  }, [open]);

  const pickProduct = (p) => {
    setPicked(p);
    const { colors, sizes } = parseOptions(p.options);
    setRows(cartesian(colors, sizes));
    setPhase('matrix');
  };

  const toggleRow = (i) =>
    setRows((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, checked: !r.checked } : r))
    );
  const setQty = (i, v) =>
    setRows((prev) =>
      prev.map((r, idx) =>
        idx === i ? { ...r, qty: Math.max(0, Number(v || 0)) } : r
      )
    );
  const selectAll = (checked) =>
    setRows((prev) => prev.map((r) => ({ ...r, checked })));

  const toQS = (r) => {
    const obj = {
      color: r.color?.code && r.color.code !== '-' ? r.color.code : undefined,
      size: r.size?.code && r.size.code !== '-' ? r.size.code : undefined,
    };
    const qs = toOptionQS(obj);
    return qs || 'default';
  };

  const submit = async () => {
    if (!picked?.id) return;
    const targets = rows.filter((r) => r.checked && r.qty > 0);
    if (!targets.length) {
      alert('수량이 1 이상인 조합을 선택하세요.');
      return;
    }
    setLoading(true);
    try {
      for (const r of targets) {
        const qs = toQS(r);
        await createProductStock({
          product: picked.id,
          option_key: qs,
          options: qs,
          stock_quantity: r.qty,
        });
      }
      onAdded?.();
      onClose?.();
    } catch (e) {
      alert(e?.message || '추가 실패');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-3 bg-black/35 backdrop-blur-sm">
      <div
        className="w-full max-w-4xl rounded-3xl bg-white/95 backdrop-blur ring-1 ring-black/5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] flex flex-col"
        style={{ maxHeight: '80vh' }}
      >
        {/* 헤더 */}
        <div className="relative flex items-center justify-between px-6 py-4 bg-white/80 rounded-t-3xl">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent" />
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow">
              <Check className="w-4 h-4" />
            </span>
            <div className="font-semibold tracking-wide">
              {phase === 'search'
                ? '재고 추가 · 상품 선택'
                : '재고 추가 · 옵션 선택'}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 active:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            aria-label="닫기"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        {/* 본문 (스크롤) */}
        <div
          className="px-6 py-4 overflow-y-auto scrollbar-hide"
          style={{ maxHeight: 'calc(80vh - 56px - 72px)' }}
        >
          {/* 검색 단계 */}
          {phase === 'search' && (
            <div className="space-y-5">
              <div className="flex gap-2">
                <label className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && doSearch()}
                    placeholder="상품명 검색"
                    className="w-full h-11 pl-9 pr-3 rounded-xl bg-gray-50 ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-violet-300"
                    aria-label="상품명 검색"
                  />
                </label>
                <button
                  onClick={doSearch}
                  className="h-11 px-4 rounded-xl bg-violet-600 text-white font-semibold shadow hover:bg-violet-700 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                  disabled={loading}
                >
                  검색
                </button>
              </div>

              {/* 스켈레톤 */}
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-xl ring-1 ring-slate-200 p-4 shadow-sm"
                    >
                      <div className="h-4 w-2/3 bg-gray-100 rounded mb-2" />
                      <div className="h-3 w-1/2 bg-gray-100 rounded mb-2" />
                      <div className="h-3 w-1/3 bg-gray-100 rounded" />
                    </div>
                  ))}
                </div>
              )}

              {/* 결과 카드 */}
              {!loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.map((p) => {
                    const { colors, sizes } = parseOptions(p.options);
                    return (
                      <button
                        key={p.id}
                        onClick={() => pickProduct(p)}
                        className="group text-left rounded-xl ring-1 ring-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-[1px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                      >
                        <div className="font-semibold text-gray-900 truncate">
                          {p.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {p.category_name || '-'} · ₩
                          {Number(p.price || 0).toLocaleString()}
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs">
                          <Chip tone="violet">색상 {colors.length}</Chip>
                          <Chip tone="indigo">사이즈 {sizes.length}</Chip>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {!loading && results.length === 0 && (
                <div className="p-6 text-center text-sm text-gray-500">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          )}

          {phase === 'matrix' && (
            <div className="space-y-5">
              {/* 선택 요약 카드 */}
              <div className="rounded-xl ring-1 ring-slate-200 bg-white p-4 shadow-sm">
                <div className="font-semibold text-gray-900">
                  {picked?.name}
                </div>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  <Chip tone="violet">색상 {parsed.colors.length}</Chip>
                  <Chip tone="indigo">사이즈 {parsed.sizes.length}</Chip>
                </div>
              </div>

              {/* 액션 라인 */}
              <div className="flex items-center justify-between">
                <div className="hidden md:flex items-center gap-2 text-xs">
                  <span className="inline-flex h-6 items-center rounded-full bg-violet-50 px-2 font-medium text-violet-700 ring-1 ring-violet-200">
                    선택 {rows.filter((r) => r.checked && r.qty > 0).length}개
                  </span>
                  <span className="inline-flex h-6 items-center rounded-full bg-indigo-50 px-2 font-medium text-indigo-700 ring-1 ring-indigo-200">
                    총 수량{' '}
                    {rows.reduce(
                      (a, r) => a + (r.checked ? Number(r.qty || 0) : 0),
                      0
                    )}
                  </span>
                </div>

                {/* 세그먼트 컨트롤 */}
                <div className="inline-flex overflow-hidden rounded-xl ring-1 ring-slate-200 bg-white shadow-sm">
                  <button
                    onClick={() => setPhase('search')}
                    className="px-3 h-9 text-sm hover:bg-slate-50 active:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                    title="상품 다시 선택"
                  >
                    상품 다시 선택
                  </button>
                  <div className="w-px bg-slate-200" />
                  <button
                    onClick={() => selectAll(true)}
                    className="px-3 h-9 text-sm hover:bg-slate-50 active:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                    title="전체선택"
                  >
                    전체선택
                  </button>
                  <div className="w-px bg-slate-200" />
                  <button
                    onClick={() => selectAll(false)}
                    className="px-3 h-9 text-sm text-rose-600 hover:bg-rose-50/60 active:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
                    title="해제"
                  >
                    해제
                  </button>
                </div>
              </div>

              {/* 테이블 래퍼: ring + scroll shadows (검은 테두리 제거) */}
              <div className="relative rounded-2xl ring-1 ring-slate-200 overflow-hidden bg-white">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white/90 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white/90 to-transparent" />

                <table className="w-full table-auto">
                  <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
                    <tr className="text-[11px] uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-2 text-left">옵션</th>
                      <th className="px-4 py-2 text-center w-[120px]">선택</th>
                      <th className="px-4 py-2 text-right w-[180px]">수량</th>
                    </tr>
                    <tr>
                      <td colSpan={3}>
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                      </td>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {rows.map((r, idx) => {
                      const checked = r.checked;
                      return (
                        <tr
                          key={r.key}
                          className={[
                            'transition-colors',
                            checked
                              ? 'bg-violet-50/60'
                              : 'odd:bg-white even:bg-slate-50/40 hover:bg-violet-50',
                          ].join(' ')}
                        >
                          {/* 옵션 라벨 */}
                          <td className="px-4 py-2">
                            <div className="flex flex-wrap items-center gap-2 text-[13px] text-slate-800">
                              {/* 색상 */}
                              {r.color?.label && r.color.label !== '-' && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 ring-1 ring-slate-200">
                                  {r.color?.hex && (
                                    <span
                                      className="h-3 w-3 rounded-full ring-1 ring-slate-300"
                                      style={{ backgroundColor: r.color.hex }}
                                    />
                                  )}
                                  <span className="text-slate-600">색상</span>
                                  <span className="font-medium">
                                    {r.color.label}
                                  </span>
                                </span>
                              )}
                              {/* 사이즈 */}
                              {r.size?.label && r.size.label !== '-' && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 ring-1 ring-slate-200">
                                  <span className="text-slate-600">사이즈</span>
                                  <span className="font-medium">
                                    {r.size.label}
                                  </span>
                                </span>
                              )}
                              {/* 기본 */}
                              {(!r.color?.label || r.color.label === '-') &&
                                (!r.size?.label || r.size.label === '-') && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 ring-1 ring-slate-200">
                                    <span className="font-medium">기본</span>
                                  </span>
                                )}
                            </div>
                          </td>

                          {/* 선택 체크 */}
                          <td className="px-4 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={r.checked}
                              onChange={() => toggleRow(idx)}
                              className="h-4 w-4 accent-violet-600"
                              aria-label="옵션 선택"
                            />
                          </td>

                          {/* 수량 스테퍼 */}
                          <td className="px-4 py-2 text-right">
                            <QtyInput
                              value={r.qty}
                              onChange={(v) => setQty(idx, v)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 bg-white/80 backdrop-blur rounded-b-3xl">
          <div className="flex items-center gap-2 text-xs">
            {phase === 'matrix' && (
              <>
                <Chip tone="violet">선택 {checkedCount}개</Chip>
                <Chip tone="indigo">총 수량 {totalQty}</Chip>
                {!checkedCount && (
                  <Chip tone="rose">선택된 항목이 없습니다</Chip>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="h-11 px-4 rounded-xl bg-slate-100 text-sm hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            >
              취소
            </button>
            <button
              onClick={submit}
              disabled={loading || phase !== 'matrix' || checkedCount === 0}
              className="h-11 px-6 rounded-xl bg-violet-600 text-white font-semibold shadow hover:bg-violet-700 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            >
              선택한 항목 추가
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
