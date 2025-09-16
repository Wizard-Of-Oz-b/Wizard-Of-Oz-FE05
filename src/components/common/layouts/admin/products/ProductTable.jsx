import Switch from '../common/Switch';
import { Pencil, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';

export default function ProductTable({
  pageData,
  toggleAvailable,
  onRequestDelete,
  onEdit,
}) {
  const getId = (row) =>
    row?.id ?? row?.product_id ?? row?.pk ?? row?.['Product id'] ?? row?.['product id'];

  const getCode = (row) => {
    const sku =
      row?.sku ?? row?.SKU ?? row?.['sku id'] ?? row?.['SKU ID'] ?? row?.['Sku'] ?? undefined;
    const id = getId(row);
    return (sku ?? id ?? '-').toString();
  };

  const getCategory = (row) => row?.category ?? row?.Category ?? '-';
  const getImage = (row) => row?.image_url ?? row?.thumbnail ?? row?.image ?? null;

  const getCreatedAt = (row) => {
    const raw = row?.created_at ?? row?.['Created at'] ?? null;
    if (!raw) return '-';
    const d = dayjs(raw);
    return d.isValid() ? d.format('YYYY년 MM월 DD일 HH:mm') : String(raw);
  };

  const COLS = [
    'w-[140px]', 
    'w-[100px]',
    'w-[140px]',
    '', 
    'w-[120px]',
    'w-[90px]',
    'w-[180px]',
    'w-[160px]',
  ];

  return (
    <div className="relative overflow-x-auto rounded-2xl shadow-lg bg-white">
      <table className="w-full min-w-[1000px] table-fixed">
        <colgroup>
          {COLS.map((cls, i) => (
            <col key={i} className={cls || undefined} />
          ))}
        </colgroup>

        <thead className="bg-gradient-to-r from-violet-600 to-violet-700 text-white text-left text-xs font-semibold uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 rounded-tl-2xl">상품코드</th>
            <th className="px-4 py-3">썸네일</th>
            <th className="px-4 py-3">카테고리</th>
            <th className="px-4 py-3">상품명</th>
            <th className="px-4 py-3 text-right">가격</th>
            <th className="px-4 py-3 text-center">판매</th>
            <th className="px-4 py-3 text-center">등록일</th>
            <th className="px-4 py-3 text-center rounded-tr-2xl">기능</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 text-sm">
          {pageData.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-10 text-center text-gray-500">
                상품이 없습니다.
              </td>
            </tr>
          ) : (
            pageData.map((p, idx) => {
              const id = getId(p);
              const code = getCode(p);
              const key = id ?? code ?? `row-${idx}`;
              const imgSrc = getImage(p);

              return (
                <tr
                  key={key}
                  className="odd:bg-white even:bg-gray-50/40 hover:bg-violet-50/50 transition-colors"
                >
                  {/* 상품코드 */}
                  <td className="px-4 py-3 align-middle whitespace-nowrap">
                    <span className="font-mono text-[13px] text-gray-800">{code}</span>
                  </td>

                  {/* 썸네일 */}
                  <td className="px-4 py-3 align-middle">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={(p.name ?? 'thumbnail') + ''}
                        className="h-14 w-20 object-cover rounded-md shadow-sm"
                      />
                    ) : (
                      <div className="h-14 w-20 rounded-md bg-gray-100 grid place-items-center text-xs text-gray-400">
                        없음
                      </div>
                    )}
                  </td>

                  {/* 카테고리 */}
                  <td className="px-4 py-3 align-middle whitespace-nowrap text-gray-700">
                    {getCategory(p)}
                  </td>

                  {/* 상품명 */}
                  <td className="px-4 py-3 align-middle">
                    <span className="block max-w-[520px] truncate font-semibold text-gray-800">
                      {p.name ?? p.Name ?? ''}
                    </span>
                  </td>

                  {/* 가격 */}
                  <td className="px-4 py-3 align-middle text-right font-semibold text-violet-700 whitespace-nowrap">
                    {(p.price ?? p.Price ?? 0).toLocaleString()}원
                  </td>

                  {/* 판매 토글 */}
                  <td className="px-4 py-3 align-middle text-center">
                    <Switch
                      checked={!!p.is_active || !!p['Is active']}
                      onChange={() => toggleAvailable(p)}
                      disabled={!id}
                    />
                  </td>

                  {/* 등록일 */}
                  <td className="px-4 py-3 align-middle text-center text-gray-600 whitespace-nowrap">
                    {getCreatedAt(p)}
                  </td>

                  {/* 기능 */}
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(p)}
                        disabled={!id}
                        className="h-8 px-2 inline-flex items-center gap-1 rounded-md bg-violet-600 text-xs font-medium text-white hover:bg-violet-700 transition disabled:opacity-50"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        수정
                      </button>

                      <button
                        onClick={() => onRequestDelete(p)}
                        disabled={!id}
                        className="h-8 px-2 inline-flex items-center gap-1 rounded-md bg-red-600 text-xs font-medium text-white hover:bg-red-700 transition disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
