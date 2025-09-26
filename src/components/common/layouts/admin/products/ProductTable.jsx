import Switch from '../common/Switch';
import { Pencil, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import React, { useEffect, useMemo, useState } from 'react';
import api from '../../../../../lib/axios';

dayjs.extend(utc);
dayjs.extend(timezone);

/* ---------- 유틸 ---------- */
const formatPrice = (value) => {
  if (value == null) return '0원';
  const n = Number(value);
  if (Number.isFinite(n))
    return new Intl.NumberFormat('ko-KR').format(n) + '원';
  const [int, frac] = String(value).split('.');
  const intFmt = new Intl.NumberFormat('ko-KR').format(Number(int || 0));
  return frac ? `${intFmt}.${frac}원` : `${intFmt}원`;
};

const formatKST = (ts) =>
  ts ? dayjs.utc(ts).tz('Asia/Seoul').format('YYYY년 MM월 DD일 HH:mm') : '-';

const shortUuid = (val) => {
  if (!val) return '(신규)';
  const s = String(val);
  return s.length > 8 ? `${s.slice(0, 4)}…${s.slice(-4)}` : s;
};

const safeId = (row) =>
  row?.id ??
  row?.uuid ??
  row?.product_id ??
  row?.pk ??
  row?.ID ??
  row?.Id ??
  row?.['Product id'] ??
  row?.['product id'] ??
  null;

const categoryIdOf = (row) => {
  const c =
    row?.category ??
    row?.category_id ??
    row?.category_uuid ??
    row?.categoryId ??
    row?.Category ??
    null;
  if (!c) return null;
  return typeof c === 'object'
    ? c.id ?? c.uuid ?? c.pk ?? c.ID ?? c.Id ?? null
    : c;
};

const safeCategoryPath = (row, categoryMap) => {
  if (row?.category_path) return row.category_path;
  if (row?.categoryFullName) return row.categoryFullName;
  if (row?.categoryPath) return row.categoryPath;
  const cid = categoryIdOf(row);
  if (cid && categoryMap && categoryMap[cid]) return categoryMap[cid];
  if (cid) return shortUuid(cid);
  return '-';
};

// 우선순위: image_url → thumbnail → image
const getInlineImage = (row) =>
  row?.image_url ?? row?.thumbnail ?? row?.image ?? null;

/* ---------- 컴포넌트 ---------- */
export default function ProductTable({
  pageData = [],
  toggleAvailable,
  onRequestDelete,
  onEdit,
  categoryMap = {},
}) {
  const COLS = [
    'w-[140px]',
    'w-[100px]',
    'w-[240px]',
    '',
    'w-[120px]',
    'w-[90px]',
    'w-[180px]',
    'w-[160px]',
  ];

  // ★ 썸네일
  const [thumbMap, setThumbMap] = useState({});

  // 이 페이지에서 썸네일이 비어있는 상품 id만 뽑음
  const idsNeedingThumb = useMemo(() => {
    return pageData
      .map((p) => {
        const id = safeId(p);
        const inline = getInlineImage(p);
        if (!id) return null;
        if (inline) return null;
        if (thumbMap[id]) return null;
        return id;
      })
      .filter(Boolean);
  }, [pageData, thumbMap]);

  // ★ 부족한 썸네일을 이미지 API로 채움
  useEffect(() => {
    if (!idsNeedingThumb.length) return;

    let cancelled = false;

    (async () => {
      try {
        const results = await Promise.allSettled(
          idsNeedingThumb.map((pid) =>
            api
              .get(`/v1/admin/products/${pid}/images/`)
              .then((res) => ({
                pid,
                data: Array.isArray(res.data) ? res.data : [],
              }))
          )
        );

        const next = {};
        for (const r of results) {
          if (r.status !== 'fulfilled') continue;
          const { pid, data } = r.value;
          if (!data || data.length === 0) continue;

          const main = data.find((x) => x.is_main) || data[0];

          const url =
            main?.image_url || main?.file_url || main?.remote_url || null;

          if (url) next[pid] = url;
        }

        if (!cancelled && Object.keys(next).length) {
          setThumbMap((prev) => ({ ...prev, ...next }));
        }
      } catch (e) {}
    })();

    return () => {
      cancelled = true;
    };
  }, [idsNeedingThumb]);

  return (
    <div className="relative overflow-x-auto rounded-2xl shadow-lg bg-white">
      <table className="w-full min-w-[1120px] table-fixed">
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
              const id = safeId(p);
              const code = shortUuid(id);
              const key = id || `row-${idx}`;

              const inlineImg = getInlineImage(p);
              const imgSrc = inlineImg || (id ? thumbMap[id] : null);

              const catPath = safeCategoryPath(p, categoryMap);

              return (
                <tr
                  key={key}
                  className="odd:bg-white even:bg-gray-50/40 hover:bg-violet-50/50 transition-colors"
                >
                  <td className="px-4 py-3 align-middle whitespace-nowrap">
                    <span className="font-mono text-[13px] text-gray-800">
                      {code}
                    </span>
                  </td>

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

                  <td className="px-4 py-3 align-middle whitespace-nowrap text-gray-700">
                    <span title={catPath} className="block truncate">
                      {catPath}
                    </span>
                  </td>

                  <td className="px-4 py-3 align-middle">
                    <span className="block max-w-[520px] truncate font-semibold text-gray-800">
                      {p.name ?? ''}
                    </span>
                  </td>

                  <td className="px-4 py-3 align-middle text-right font-semibold text-violet-700 whitespace-nowrap">
                    {formatPrice(p.price)}
                  </td>

                  <td className="px-4 py-3 align-middle text-center">
                    <Switch
                      checked={!!p.is_active}
                      onChange={() => toggleAvailable(p)}
                      disabled={!id}
                    />
                  </td>

                  <td className="px-4 py-3 align-middle text-center text-gray-600 whitespace-nowrap">
                    {formatKST(p.created_at)}
                  </td>

                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(p)}
                        disabled={!id}
                        className="h-8 px-2 inline-flex items-center gap-1 rounded-md bg-violet-600 text-xs font-medium text-white hover:bg-violet-700 transition disabled:opacity-50"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        수정
                      </button>
                      <button
                        type="button"
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
