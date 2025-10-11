import api from "../../../../lib/axios";

const _mainImageCache = new Map();

/** 관리자용: 제품 이미지 목록 */
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

/** 관리자용: 이미지 업로드 */
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
  image_urls.forEach((u) => u && fd.append("image_urls", u));
  images.forEach((f) => f && fd.append("images", f));
  alt_texts.forEach((t) => fd.append("alt_texts", t ?? ""));
  captions.forEach((c) => fd.append("captions", c ?? ""));

  fd.append("save_remote", String(!!save_remote));
  fd.append("main_index", String(Number.isFinite(main_index) ? main_index : 0));
  fd.append("replace_main", String(!!replace_main));
  fd.append("start_order", String(Number.isFinite(start_order) ? start_order : 0));

  const res = await api.post(`/v1/admin/products/${productId}/images/`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return Array.isArray(res.data) ? res.data : [];
}

/** 관리자용 대표 이미지 URL  */
export async function fetchMainImageUrl(productId) {
  if (!productId) return null;
  if (_mainImageCache.has(productId)) return _mainImageCache.get(productId);

  try {
    const list = await listProductImages(productId);
    const main = list.find((x) => x?.is_main) || list[0];
    const url = main?.image_url || main?.remote_url || main?.file_url || null;
    _mainImageCache.set(productId, url || null);
    return url || null;
  } catch {
    return null;
  }
}
