import publicApi from "../../../../lib/axiosPublic";
import { normalizeOptions } from "../../../../utils/normalizeOptions";

/** 대표 이미지 URL만 문자열로 추출 */
export function extractImageUrl(row = {}) {
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

export const normalizeProduct = (row = {}) => ({
  id: row.product_id || row.id,
  name: row.name || "",
  price: Number(row.price ?? 0),
  is_active: !!row.is_active,
  category: row.category_id || null,
  category_name: row.category_name || "",
  options: normalizeOptions(row.options),
  created_at: row.created_at,
  updated_at: row.updated_at,
  image_url: extractImageUrl(row),
});

/**
 * 퍼블릭 제품 목록
 * - 추가 이미지 엔드포인트 호출하지 않음!
 */
export async function fetchProductsPublic(params = {}) {
  const {
    q,
    category_id,
    is_active = true,
    sort = "-created_at",
    page = 1,
    size = 20,
    min_price,
    max_price,
  } = params;

  const baseParams = {
    q: q || undefined,
    category_id: category_id || undefined,
    is_active,
    ordering: sort,
    page,
    size,
    min_price: min_price ?? undefined,
    max_price: max_price ?? undefined,
  };

  const res = await publicApi.get("/v1/products/", { params: baseParams });
  const data = res.data || {};
  const list = Array.isArray(data.results) ? data.results : [];
  return {
    count: data.count ?? list.length,
    results: list.map(normalizeProduct),
  };
}
