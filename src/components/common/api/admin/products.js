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

/** 안전하게 id 추출하기 */
function ensureId(x) {
  const id = typeof x === "object" ? normalizeId(x) : x;
  if (id == null || id === "" || id === "undefined") {
    throw new Error("Product id가 없습니다.");
  }
  return id;
}

/** 대표 이미지 URL만 "문자열"로 추출 */
function pickImageUrl(row = {}) {
  if (!row || typeof row !== "object") return null;

  if (typeof row.image_url === "string" && row.image_url.trim()) return row.image_url.trim();

  const pi = row.primary_image;
  if (typeof pi === "string" && pi.trim()) return pi.trim();
  if (pi && typeof pi.url === "string" && pi.url.trim()) return pi.url.trim();

  const imgs = row.images;
  if (Array.isArray(imgs) && imgs.length) {
    const first =
      imgs.find((x) => typeof x?.url === "string" && x.url.trim()) ?? imgs[0];
    if (typeof first === "string" && first.trim()) return first.trim();
    if (typeof first?.url === "string" && first.url.trim()) return first.url.trim();
    if (typeof first?.image_url === "string" && first.image_url.trim()) return first.image_url.trim();
    if (typeof first?.remote_url === "string" && first.remote_url.trim()) return first.remote_url.trim();
    if (typeof first?.file_url === "string" && first.file_url.trim()) return first.file_url.trim();
  }

  const gal = row.gallery;
  if (Array.isArray(gal) && gal.length) {
    const g0 = gal[0];
    if (typeof g0 === "string" && g0.trim()) return g0.trim();
    if (typeof g0?.url === "string" && g0.url.trim()) return g0.url.trim();
  }
  return null;
}

/**
 * 상품 목록 (Admin)
 * - 엔드포인트: /v1/admin/products/
 */
export async function listProducts(params = {}) {
  const {
    page = 1,
    pageSize = 50,
    q,
    search,
    category,
  } = params;

  const safePageSize = Math.max(1, Math.min(Number(pageSize) || 50, 100));

  const query = {
    page,
    page_size: safePageSize,
    ...(q ? { q } : {}),
    ...(search ? { search } : {}),
    ...(category ? { category } : {}),
  };

  const res = await api.get("/v1/admin/products/", { params: query });

  return unwrapList(res.data).map((row) => {
    const base = normalizeProduct ? normalizeProduct(row) : row;
    return { ...base, image_url: pickImageUrl(row) };
  });
}

/** 생성 (Admin) */
export async function createProduct(payload) {
  const res = await api.post("/v1/admin/products/", payload);
  const row = res.data;
  const base = normalizeProduct ? normalizeProduct(row) : row;
  return { ...base, image_url: pickImageUrl(row) };
}

/** 수정 (Admin) */
export async function updateProduct(idOrObj, payload) {
  const id = ensureId(idOrObj);
  const res = await api.patch(`/v1/admin/products/${id}/`, payload);
  const row = res.data;
  const base = normalizeProduct ? normalizeProduct(row) : row;
  return { ...base, image_url: pickImageUrl(row) };
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
  const row = res.data;
  const base = normalizeProduct ? normalizeProduct(row) : row;
  return { ...base, image_url: pickImageUrl(row) };
}

export { ensureId, unwrapList };
