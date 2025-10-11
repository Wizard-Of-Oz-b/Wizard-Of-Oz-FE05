import { labelFromOptions } from '../../../../api/admin/productStocks';

export default function StockTable({ rows, setRowQty, saveRow, requestDelete }) {
  return (
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
            <th className="px-3 md:px-4 py-3 hidden md:table-cell">최근 수정일</th>
            <th className="px-3 md:px-4 py-3 text-right">재고</th>
            <th className="px-3 md:px-4 py-3 text-center rounded-tr-2xl">기능</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-10 text-center text-gray-500">
                데이터가 없습니다.
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

                  {/* 보조정보 (모바일) */}
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

                {/* 수정일 */}
                <td className="px-3 md:px-4 py-3 align-middle text-xs text-gray-500 whitespace-nowrap hidden md:table-cell">
                  {r.updated_at ? new Date(r.updated_at).toLocaleString() : '-'}
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
  );
}
