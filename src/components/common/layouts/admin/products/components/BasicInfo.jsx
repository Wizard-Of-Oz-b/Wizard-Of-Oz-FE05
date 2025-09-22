import { useEffect, useState, useCallback } from 'react';
import FieldLabel from './FieldLabel';
import CategorySelectModal from './CategorySelectModal';
import { fetchCategories } from '../../../../api/admin/categoryService';

const levelToLabel = (lv) => {
  const s = String(lv || '').toLowerCase();
  if (s === 'l1') return '대분류';
  if (s === 'l2') return '중분류';
  if (s === 'l3') return '소분류';
  return s || '-';
};
const parentOf = (row) =>
  row.parent !== undefined
    ? row.parent ?? null
    : row.parentId !== undefined
    ? row.parentId ?? null
    : null;

const buildIdMap = (list) => {
  const m = new Map();
  (list || []).forEach((r) => m.set(r.id, r));
  return m;
};

const makePathLabel = (id, byId) => {
  const names = [];
  let cur = byId.get(id);
  let guard = 0;
  while (cur && guard++ < 50) {
    names.push(cur.name);
    const pid = parentOf(cur);
    cur = pid ? byId.get(pid) : null;
  }
  names.reverse();
  return names.join(' > ');
};

export default function BasicInfo({ form, set }) {
  const [catOpen, setCatOpen] = useState(false);
  const [catLabel, setCatLabel] = useState('');
  const [catLevel, setCatLevel] = useState('');
  const [catMap, setCatMap] = useState(null);
  const [catErr, setCatErr] = useState('');

  const ensureCatMap = useCallback(async () => {
    if (catMap) return catMap;
    try {
      const list = await fetchCategories();
      const m = buildIdMap(list || []);
      setCatMap(m);
      return m;
    } catch (e) {
      setCatErr(
        e?.response?.data?.detail ||
          e?.message ||
          '카테고리를 불러오지 못했습니다.'
      );
      return null;
    }
  }, [catMap]);

  const refreshLabel = useCallback(
    async (id) => {
      if (!id) {
        setCatLabel('');
        setCatLevel('');
        return;
      }
      const m = await ensureCatMap();
      if (!m) return;
      const node = m.get(id);
      if (!node) {
        setCatLabel(`선택됨: ${id}`);
        setCatLevel('');
        return;
      }
      setCatLabel(makePathLabel(id, m));
      setCatLevel(node.level || '');
    },
    [ensureCatMap]
  );

  useEffect(() => {
    if (form.category) refreshLabel(form.category);
  }, [form.category, refreshLabel]);

  return (
    <section className="lg:col-span-2">
      <div className="rounded-2xl border border-gray-100 p-5 space-y-4">
        {/* 상품 고유 ID(UUID) */}
        <div>
          <FieldLabel>상품 고유 ID</FieldLabel>
          <input
            value={form.id || ''}
            readOnly
            placeholder="자동으로 생성됩니다"
            className="h-11 w-full rounded-xl bg-gray-100 px-3 text-sm outline-none border border-gray-200 shadow-sm read-only:opacity-70"
            title="서버에서 자동 생성되는 UUID"
          />
          <p className="mt-1 text-[11px] text-gray-500">
            * 저장 시 서버에서 자동 생성되는 식별자입니다.
          </p>
        </div>

        <div>
          <FieldLabel>상품명</FieldLabel>
          <input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="예: 블록테크 파카"
            className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
          />
        </div>

        <div className="grid gap-3">
          <div>
            <FieldLabel>가격(원)</FieldLabel>
            <input
              type="number"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
            />
          </div>
          <div>
            <FieldLabel>판매 상태</FieldLabel>
            <select
              value={form.is_available ? 'y' : 'n'}
              onChange={(e) => set('is_available', e.target.value === 'y')}
              className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
            >
              <option value="y">판매중</option>
              <option value="n">중지</option>
            </select>
          </div>
        </div>

        {/* 카테고리 선택 */}
        <div>
          <FieldLabel>카테고리 *</FieldLabel>
          <button
            onClick={() => setCatOpen(true)}
            className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm text-left shadow-sm hover:bg-gray-100"
          >
            {form.category ? (
              <div className="flex items-center justify-between gap-3">
                <span className="truncate">
                  {catLabel || `선택됨: ${form.category}`}
                </span>
                {catLevel && (
                  <span className="shrink-0 text-[11px] text-slate-500">
                    {levelToLabel(catLevel)}
                  </span>
                )}
              </div>
            ) : (
              '카테고리 선택'
            )}
          </button>
          {catErr && <p className="mt-1 text-xs text-rose-600">⚠ {catErr}</p>}

          <CategorySelectModal
            open={catOpen}
            onClose={() => setCatOpen(false)}
            value={form.category}
            onChange={async ({ id }) => {
              set('category', id);
              await refreshLabel(id);
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          {/* 대표 썸네일 URL */}
          <div>
            <FieldLabel>대표 썸네일 URL</FieldLabel>
            <input
              value={form.image_url}
              onChange={(e) => set('image_url', e.target.value)}
              placeholder="https://…"
              className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
            />
            {/^https?:\/\/\S+/.test(String(form.image_url || '')) && (
              <div className="mt-2">
                <img
                  src={form.image_url}
                  alt="thumbnail preview"
                  className="h-24 w-36 object-cover rounded-md border border-gray-100"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
