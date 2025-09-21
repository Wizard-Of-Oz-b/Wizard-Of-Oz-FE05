import api from '../../../../lib/axios';
import { fromOptionQS } from './optionQS';

/* ------------------- 공통 유틸 ------------------- */
function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (data && typeof data === 'object') {
    const k = Object.keys(data).find((x) => Array.isArray(data[x]));
    if (k) return data[k];
  }
  return [];
}

/* ------------------- 재고 관련 API ------------------- */

/** 목록(배열) */
export async function listProductStocks(params = {}) {
  const res = await api.get('/v1/admin/product-stocks/', {
    params: {
      product: params.product || undefined,
      option_key: params.option_key || undefined,
      search: params.search || undefined,
      ordering: params.ordering || '-updated_at',
    },
  });
  return unwrapList(res.data);
}

export async function createProductStock(payload) {
  const body = {
    product: payload.product,
    option_key: String(payload.option_key || ''),
    options:
      typeof payload.options === 'string'
        ? payload.options
        : JSON.stringify(payload.options ?? {}),
    stock_quantity: Number(payload.stock_quantity || 0),
  };
  const res = await api.post('/v1/admin/product-stocks/', body);
  return res.data;
}

/** 부분 수정 */
export async function patchProductStock(id, patch) {
  const body = {
    ...(patch.product ? { product: patch.product } : {}),
    ...(patch.option_key != null ? { option_key: String(patch.option_key) } : {}),
    ...(patch.options != null
      ? {
          options:
            typeof patch.options === 'string'
              ? patch.options
              : JSON.stringify(patch.options),
        }
      : {}),
    ...(patch.stock_quantity != null
      ? { stock_quantity: Number(patch.stock_quantity) }
      : {}),
  };
  const res = await api.patch(`/v1/admin/product-stocks/${id}/`, body);
  return res.data;
}

/** 삭제 */
export async function deleteProductStock(id) {
  const res = await api.delete(`/v1/admin/product-stocks/${id}/`);
  return res.data;
}

export function labelFromOptions(options) {
  if (options && typeof options === 'object') {
    return objectToLabel(options);
  }
  if (typeof options === 'string') {
    const qsObj = fromOptionQS(options);
    if (Object.keys(qsObj).length) return objectToLabel(qsObj);
    try {
      const obj = JSON.parse(options);
      if (obj && typeof obj === 'object') return objectToLabel(obj);
    } catch {}
  }
  return '-';
}

function objectToLabel(obj) {
  const nice = [];
  if (obj.color) nice.push(`색상:${obj.color}`);
  if (obj.size) nice.push(`사이즈:${obj.size}`);
  Object.keys(obj).forEach((k) => {
    if (k === 'color' || k === 'size') return;
    nice.push(`${k}:${obj[k]}`);
  });
  return nice.join(' / ') || '-';
}

/** 제품 검색(라이트) — 서버 검색 미지원 대비 로컬 필터 폴백 포함 */
export async function searchProductsLite(q, size = 12, extra = {}) {
  const page_size = Math.max(1, Math.min(Number(size) || 12, 50));
  const kw = (q || '').trim();

  // 1) 가능한 다양한 키로 시도 (서버가 어떤 걸 보든 잡히게)
  const paramsFirst = {
    page: 1,
    page_size,
    ...(kw
      ? {
          q: kw,
          search: kw,
          name: kw,
          product_name: kw,
          keyword: kw,
          query: kw,
        }
      : {}),
    ...(extra.search ? { search: extra.search } : {}),
    ...(extra.category ? { category: extra.category } : {}),
    ordering: extra.ordering || '-created_at',
    ...(extra.is_active === undefined ? {} : { is_active: extra.is_active }),
  };

  const res1 = await api.get('/v1/admin/products/', { params: paramsFirst });
  let items = unwrapList(res1.data);

  // 2) 폴백: 서버가 검색을 안 먹으면 무검색으로 재요청 후 로컬 부분일치 필터
  if (kw && items.length === 0) {
    const res2 = await api.get('/v1/admin/products/', {
      params: {
        page: 1,
        page_size,
        ...(extra.category ? { category: extra.category } : {}),
        ordering: extra.ordering || '-created_at',
        ...(extra.is_active === undefined ? {} : { is_active: extra.is_active }),
      },
    });
    const all = unwrapList(res2.data);
    const hay = kw.toLowerCase();

    items = all
      .filter((p) =>
        [
          p?.name || '',
          p?.category_name || p?.category || p?.category_name_full || '',
        ]
          .join(' ')
          .toLowerCase()
          .includes(hay)
      )
      .slice(0, page_size);
  }

  // 3) 정규화 반환
  return items.map((p) => ({
    id: p.product_id || p.id,
    name: p.name,
    category_name: p.category_name || p.category || p.category_name_full,
    price: p.price,
    options: p.options || [],
  }));
}
