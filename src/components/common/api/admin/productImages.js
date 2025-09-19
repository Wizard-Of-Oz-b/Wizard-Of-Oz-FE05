import api from "../../../../lib/axios";

// --- 캐시(페이지 머무는 동안) ---
const _mainImageCache = new Map();

/** 관리자용: 제품 이미지 목록  */
export async function listProductImages(productId, params = {}) {
  if (!productId) throw new Error("productId가 필요합니다.");
  const res = await api.get(`/v1/admin/products/${productId}/images/`, {
    params: {
      ordering: params.ordering || undefined,
      search: params.search || undefined,
    },
  });
  return Array.isArray(res.data) ? res.data : [];
}

/** 관리자용: 이미지 업로드 (URL/파일 모두 가능하도록데쓰) */
export async function uploadProductImages(
  productId,
  {
    image_urls = [], 
    images = [], 
    save_remote = true,
    main_index = 0,
    replace_main = false,
    start_order = 0,
    alt_texts = [],
    captions = [],
  } = {}
) {
  if (!productId) throw new Error("productId가 필요합니다.");

  const fd = new FormData();
  (image_urls || []).forEach((u) => u && fd.append("image_urls", u));
  (images || []).forEach((f) => f && fd.append("images", f));
  (alt_texts || []).forEach((t) => fd.append("alt_texts", t ?? ""));
  (captions || []).forEach((c) => fd.append("captions", c ?? ""));

  fd.append("save_remote", String(!!save_remote));
  fd.append("main_index", String(Number.isFinite(main_index) ? main_index : 0));
  fd.append("replace_main", String(!!replace_main));
  fd.append("start_order", String(Number.isFinite(start_order) ? start_order : 0));

  const res = await api.post(`/v1/admin/products/${productId}/images/`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return Array.isArray(res.data) ? res.data : [];
}

/** 공개용: 제품 이미지 목록 */
export async function listProductImagesPublic(productId) {
  if (!productId) return [];
  try {
    const res = await api.get(`/v1/products/${productId}/images/`, {
      validateStatus: (s) => (s >= 200 && s < 300) || s === 401 || s === 404,
    });
    return Array.isArray(res.data) ? res.data : [];
  } catch {
    return [];
  }
}

/** 관리자용 대표 이미지 URL */
export async function fetchMainImageUrl(productId) {
  if (!productId) return null;
  if (_mainImageCache.has(productId)) return _mainImageCache.get(productId);

  try {
    const list = await listProductImages(productId);
    const main = list.find((x) => x.is_main) || list[0];
    const url = main?.image_url || main?.remote_url || main?.file_url || null;
    _mainImageCache.set(productId, url || null);
    return url || null;
  } catch (e) {
    console.error("fetchMainImageUrl error:", e);
    return null;
  }
}

/** 공개용 대표 이미지 URL */
export async function fetchPublicMainImageUrl(productId) {
  if (!productId) return null;
  if (_mainImageCache.has(productId)) return _mainImageCache.get(productId);

  const pub = await listProductImagesPublic(productId);
  if (pub.length) {
    const main = pub.find((x) => x.is_main) || pub[0];
    const url = main?.image_url || main?.remote_url || main?.file_url || null;
    _mainImageCache.set(productId, url || null);
    return url || null;
  }

  try {
    const adm = await listProductImages(productId);
    const main = adm.find((x) => x.is_main) || adm[0];
    const url = main?.image_url || main?.remote_url || main?.file_url || null;
    _mainImageCache.set(productId, url || null);
    return url || null;
  } catch {
    return null;
  }
}
