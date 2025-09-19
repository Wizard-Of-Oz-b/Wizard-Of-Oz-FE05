// import api from "../../../../lib/axios";

// function unwrapList(data) {
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.results)) return data.results;
//   if (Array.isArray(data?.items)) return data.items;
//   if (Array.isArray(data?.data)) return data.data;
//   if (data && typeof data === "object") {
//     const k = Object.keys(data).find((x) => Array.isArray(data[x]));
//     if (k) return data[k];
//   }
//   return [];
// }

// function buildBodyAndHeaders(payload, isPartial = false) {
//   const hasFile = Object.values(payload || {}).some((v) => v instanceof File);
//   if (!hasFile) {
//     // JSON
//     return { body: payload, headers: undefined };
//   }
//   const fd = new FormData();
//   Object.entries(payload || {}).forEach(([k, v]) => {
//     if (v === undefined || v === null) return;
//     if (v instanceof File) fd.append(k, v);
//     else fd.append(k, typeof v === "boolean" ? String(v) : String(v));
//   });
//   return { body: fd, headers: { "Content-Type": "multipart/form-data" } };
// }

// /** 목록 조회 */
// export async function listProducts({ page = 1, pageSize = 50, q = "", category = "" } = {}) {
//   const res = await api.get("/v1/products/", {
//     params: {
//       page,
//       page_size: pageSize,
//       q: q || undefined,
//       category: category || undefined,
//     },
//   });
//   return unwrapList(res.data);
// }

// /* 생성 */
// export async function createProduct(payload) {
//   const { body, headers } = buildBodyAndHeaders(payload, false);
//   const res = await api.post("/v1/products/", body, { headers });
//   return res.data;
// }

// /* 수정(PATCH)  */
// export async function updateProduct(id, payload) {
//   const { body, headers } = buildBodyAndHeaders(payload, true);
//   const res = await api.patch(`/v1/products/${id}/`, body, { headers });
//   return res.data;
// }

// /* 삭제 */
// export async function deleteProduct(id) {
//   const res = await api.delete(`/v1/products/${id}/`);
//   return res.data;
// }

// /* 판매상태 토글  */
// export async function toggleAvailableAPI(id, is_active) {
//   const res = await api.patch(`/v1/products/${id}/`, { is_active });
//   return res.data;
// }


// src/components/common/api/admin/products.js
import api from "../../../../lib/axios";
import { normalizeProduct, normalizeId } from "../../../../lib/normalize";

/** 다양한 페이로드 포맷을 안전하게 배열로 풀어주는 유틸 */
function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (data && typeof data === "object") {
    const k = Object.keys(data).find((x) => Array.isArray(data[x]));
    if (k) return data[k];
  }
  return [];
}

/** 안전한 id 추출 */
function ensureId(x) {
  const id = typeof x === "object" ? normalizeId(x) : x;
  if (id == null || id === "" || id === "undefined") {
    throw new Error("Product id가 없습니다.");
  }
  return id;
}

/**
 * 상품 목록 (Admin)
 * - 엔드포인트: /v1/admin/products/
 * - 쿼리: page, page_size, q | search, category
 * - 응답: 배열(기존 호출부 호환)
 */
export async function listProducts(params = {}) {
  const {
    page = 1,
    pageSize = 50,            // 과한 사이즈 방지
    q,
    search,                   // 백엔드가 search를 기대할 수도 있으니 둘 다 지원
    category,
  } = params;

  const safePageSize = Math.max(1, Math.min(Number(pageSize) || 50, 100)); // 최대 100 권장

  const query = {
    page,
    page_size: safePageSize,
    ...(q ? { q } : {}),
    ...(search ? { search } : {}),
    ...(category ? { category } : {}),
  };

  // ✅ Admin 전용 엔드포인트로 교체
  const res = await api.get("/v1/admin/products/", { params: query });

  // 호출부 호환을 위해 배열만 반환 (normalize까지)
  return unwrapList(res.data).map(normalizeProduct);
}

/** 생성 (Admin) */
export async function createProduct(payload) {
  const res = await api.post("/v1/admin/products/", payload);
  return normalizeProduct(res.data);
}

/** 수정 (Admin) */
export async function updateProduct(idOrObj, payload) {
  const id = ensureId(idOrObj);
  const res = await api.patch(`/v1/admin/products/${id}/`, payload);
  return normalizeProduct(res.data);
}

/** 삭제 (Admin) */
export async function deleteProduct(idOrObj) {
  const id = ensureId(idOrObj);
  const res = await api.delete(`/v1/admin/products/${id}/`);
  return res.data;
}

/** 판매상태 토글 (Admin) */
export async function toggleAvailableAPI(idOrObj, is_active) {
  const id = ensureId(idOrObj);
  const res = await api.patch(`/v1/admin/products/${id}/`, { is_active });
  return normalizeProduct(res.data);
}

export { ensureId, unwrapList };
