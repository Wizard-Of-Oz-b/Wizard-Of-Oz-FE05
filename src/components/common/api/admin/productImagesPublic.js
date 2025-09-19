import api from "../../../../lib/axios";


const _mainImageCache = new Map();

/** 엔드포인트 : v1/products/{id}/images/ */
export async function listProductImagesPublic(productId) {
  if (!productId) return [];
  try {
    const res = await api.get(`/v1/products/${productId}/images/`, {
      validateStatus: (s) => (s >= 200 && s < 300) || s === 401 || s === 404,
    });
    if (Array.isArray(res.data)) return res.data;
    return [];
  } catch {
    return [];
  }
}

/** 대표 이미지 URL 가져오기 */
export async function fetchPublicMainImageUrl(productId) {
  if (!productId) return null;
  if (_mainImageCache.has(productId)) return _mainImageCache.get(productId);

  const list = await listProductImagesPublic(productId);
  const main = list.find((x) => x?.is_main) || list[0];
  const url = main?.image_url || main?.remote_url || main?.file_url || null;

  _mainImageCache.set(productId, url || null);
  return url || null;
}
