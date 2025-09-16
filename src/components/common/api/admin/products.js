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


import api from "../../../../lib/axios";
import { normalizeProduct, normalizeId } from "../../../../lib/normalize";

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

export async function listProducts(params = {}) {
  const res = await api.get("/v1/products/", { params: {
    page: params.page ?? 1,
    page_size: params.pageSize ?? 50,
    q: params.q || undefined,
    category: params.category || undefined,
  }});
  return unwrapList(res.data).map(normalizeProduct);
}

function ensureId(x) {
  const id = typeof x === "object" ? normalizeId(x) : x;
  if (id == null || id === "" || id === "undefined") throw new Error("Product id가 없습니다.");
  return id;
}

export async function createProduct(payload) {
  const res = await api.post("/v1/products/", payload);
  return normalizeProduct(res.data);
}

export async function updateProduct(idOrObj, payload) {
  const id = ensureId(idOrObj);
  const res = await api.patch(`/v1/products/${id}/`, payload);
  return normalizeProduct(res.data);
}

export async function deleteProduct(idOrObj) {
  const id = ensureId(idOrObj);
  const res = await api.delete(`/v1/products/${id}/`);
  return res.data;
}

export async function toggleAvailableAPI(idOrObj, is_active) {
  const id = ensureId(idOrObj);
  const res = await api.patch(`/v1/products/${id}/`, { is_active });
  return normalizeProduct(res.data);
}
