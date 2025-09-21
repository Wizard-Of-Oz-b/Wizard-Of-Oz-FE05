import React, { useEffect, useMemo, useState } from 'react';
import { createProductStock, searchProductsLite } from '../../../api/admin/productStocks';
import { toOptionQS } from '../../../api/admin/optionQS';
import ModalHeader from './modal/ModalHeader';
import SearchPhase from './modal/SearchPhase';
import MatrixPhase from './modal/MatrixPhase';
import ModalFooter from './modal/ModalFooter';
import Chip from './modal/Chip';
import QtyInput from './modal/QtyInput';
import { parseOptions, cartesian, toHaystack } from './modal/options';

export default function StockAddModal({ open, onClose, onAdded }) {
  const [phase, setPhase] = useState('search');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const [picked, setPicked] = useState(null);
  const parsed = useMemo(() => parseOptions(picked?.options), [picked]);
  const [rows, setRows] = useState([]);

  const checkedCount = rows.filter((r) => r.checked && r.qty > 0).length;
  const totalQty = rows.reduce((acc, r) => acc + (r.checked ? Number(r.qty || 0) : 0), 0);

  const doSearch = async () => {
    const kw = (query || '').trim();
    if (!kw) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const items = await searchProductsLite(kw, 50);
      const hay = kw.toLowerCase();
      const filtered = (items || []).filter((p) => toHaystack(p).includes(hay));
      setResults(filtered);
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
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, checked: !r.checked } : r)));
  const setQty = (i, v) =>
    setRows((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, qty: Math.max(0, Number(v || 0)) } : r))
    );
  const selectAll = (checked) => setRows((prev) => prev.map((r) => ({ ...r, checked })));

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
        <ModalHeader phase={phase} onClose={onClose} />

        {/* 본문 */}
        <div className="px-6 py-4 overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(80vh - 56px - 72px)' }}>
          {phase === 'search' && (
            <SearchPhase
              query={query}
              setQuery={setQuery}
              doSearch={doSearch}
              loading={loading}
              results={results}
              parseOptions={parseOptions}
              pickProduct={pickProduct}
            />
          )}

          {phase === 'matrix' && (
            <MatrixPhase
              picked={picked}
              parsed={parsed}
              rows={rows}
              toggleRow={toggleRow}
              setQty={setQty}
              selectAll={selectAll}
              setPhase={setPhase}
              Chip={Chip}
              QtyInput={QtyInput}
            />
          )}
        </div>

        {/* 푸터 */}
        <ModalFooter
          phase={phase}
          checkedCount={checkedCount}
          totalQty={totalQty}
          loading={loading}
          onClose={onClose}
          onSubmit={submit}
          Chip={Chip}
        />
      </div>
    </div>
  );
}
