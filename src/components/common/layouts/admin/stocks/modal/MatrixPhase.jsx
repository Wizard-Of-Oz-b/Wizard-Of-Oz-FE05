export default function MatrixPhase({
  picked,
  parsed,
  rows,
  toggleRow,
  setQty,
  selectAll,
  setPhase,
  Chip,
  QtyInput,
}) {
  return (
    <div className="space-y-5">
      {/* 요약 */}
      <div className="rounded-xl ring-1 ring-slate-200 bg-white p-4 shadow-sm">
        <div className="font-semibold text-gray-900">{picked?.name}</div>
        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
          <Chip tone="violet">색상 {parsed.colors.length}</Chip>
          <Chip tone="indigo">사이즈 {parsed.sizes.length}</Chip>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="inline-flex h-6 items-center rounded-full bg-violet-50 px-2 font-medium text-violet-700 ring-1 ring-violet-200">
            선택 {rows.filter((r) => r.checked && r.qty > 0).length}개
          </span>
          <span className="inline-flex h-6 items-center rounded-full bg-indigo-50 px-2 font-medium text-indigo-700 ring-1 ring-indigo-200">
            총 수량 {rows.reduce((a, r) => a + (r.checked ? Number(r.qty || 0) : 0), 0)}
          </span>
        </div>

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

      {/* 테이블 */}
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
                    checked ? 'bg-violet-50/60' : 'odd:bg-white even:bg-slate-50/40 hover:bg-violet-50',
                  ].join(' ')}
                >
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap items-center gap-2 text-[13px] text-slate-800">
                      {r.color?.label && r.color.label !== '-' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 ring-1 ring-slate-200">
                          {r.color?.hex && (
                            <span
                              className="h-3 w-3 rounded-full ring-1 ring-slate-300"
                              style={{ backgroundColor: r.color.hex }}
                            />
                          )}
                          <span className="text-slate-600">색상</span>
                          <span className="font-medium">{r.color.label}</span>
                        </span>
                      )}
                      {r.size?.label && r.size.label !== '-' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 ring-1 ring-slate-200">
                          <span className="text-slate-600">사이즈</span>
                          <span className="font-medium">{r.size.label}</span>
                        </span>
                      )}
                      {(!r.color?.label || r.color.label === '-') &&
                        (!r.size?.label || r.size.label === '-') && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 ring-1 ring-slate-200">
                            <span className="font-medium">기본</span>
                          </span>
                        )}
                    </div>
                  </td>

                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={r.checked}
                      onChange={() => toggleRow(idx)}
                      className="h-4 w-4 accent-violet-600"
                      aria-label="옵션 선택"
                    />
                  </td>

                  <td className="px-4 py-2 text-right">
                    <QtyInput value={r.qty} onChange={(v) => setQty(idx, v)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
