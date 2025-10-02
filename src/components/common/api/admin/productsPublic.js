import publicApi from "../../../../lib/axiosPublic";

function pickImageUrl(row = {}) {
  if (!row || typeof row !== "object") return null;

  if (typeof row.image_url === "string" && row.image_url.trim()) {
    return row.image_url.trim();
  }

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

const normalizeProduct = (row = {}) => ({
  id: row.product_id || row.id,
  name: row.name || "",
  price: Number(row.price ?? 0),
  is_active: !!row.is_active,
  category: row.category_id || null,
  category_name: row.category_name || "",
  options: row.options ?? null,
  created_at: row.created_at,
  updated_at: row.updated_at,
  image_url: pickImageUrl(row),
});

/** 퍼블릭 제품 목록 */
export async function fetchProductsPublic(opts = {}) {
  const {
    q = "",
    category_id = null,
    is_active = true,
    sort = "-created_at", // DRF라면 ordering 사용
    page = 1,
    size = 20,
    min_price,
    max_price,
  } = opts;

  // 기본 쿼리스트링 (DRF 기준: ordering)
  const baseParams = {
    q: q || undefined,
    category_id: category_id || undefined, // ✅ 핵심
    is_active: typeof is_active === "boolean" ? is_active : undefined,
    ordering: sort || undefined,           // 서버가 sort를 쓰면 이 라인만 sort로 변경
    page: Number(page) || 1,
    size: Number(size) || 20,
    min_price: min_price ?? undefined,
    max_price: max_price ?? undefined,
  };

  const call = async (paramsToUse) => {
    const res = await publicApi.get("/v1/products/", { params: paramsToUse });
    const data = res.data ?? {};
    const list = Array.isArray(data.results)
      ? data.results
      : Array.isArray(data)
      ? data
      : [];
    return {
      count: data.count ?? list.length,
      results: list.map(normalizeProduct),
    };
  };

  // 1) 기본 시도
  try {
    return await call(baseParams);
  } catch (err) {
    console.warn("fetchProductsPublic step1 failed", {
      status: err?.response?.status,
      data: err?.response?.data,
    });
  }

  const p2 = { ...baseParams };
  delete p2.ordering;
  try {
    return await call(p2);
  } catch (err) {
    console.warn("fetchProductsPublic step2 failed", {
      status: err?.response?.status,
      data: err?.response?.data,
    });
  }

  // 3) 검색어 q도 제거 폴백
  const p3 = { ...p2 };
  delete p3.q;
  return await call(p3); // 실패 시 에러 throw
}

export { normalizeProduct, pickImageUrl };