import api from "../../../../../lib/axios";


/**
 * 리뷰 목록 가져오기
 * 1) /products/{product_id}/reviews/
 * 2) /reviews?product_id=...
 */
export async function listReviewsByProduct(productId, { page = 1, size = 20 } = {}) {
  if (!productId) return [];
  // 1) products/{id}/reviews/
  try {
    const r1 = await api.get(`/v1/products/${productId}/reviews/`, {
      params: { page, size },
    });
    return Array.isArray(r1.data) ? r1.data : (r1.data?.results || r1.data?.items || r1.data?.data || []);
  } catch {}

  // 2) reviews?product_id=
  try {
    const r2 = await api.get(`/v1/reviews/`, {
      params: { product_id: productId, page, size },
    });
    return Array.isArray(r2.data) ? r2.data : (r2.data?.results || r2.data?.items || r2.data?.data || []);
  } catch {}

  return [];
}

/** 리뷰 단건 조회 */
export async function getReview(reviewId) {
  const res = await api.get(`/v1/reviews/${reviewId}/`);
  return res.data;
}

/** 리뷰 생성 */
export async function createReview({ product_id, rating, content }) {
  const body = { product_id, rating, content };
  const res = await api.post(`/v1/reviews/`, body);
  return res.data;
}

/** 리뷰 수정 */
export async function patchReview(reviewId, { rating, content }) {
  const body = {};
  if (rating != null) body.rating = rating;
  if (content != null) body.content = content;
  const res = await api.patch(`/v1/reviews/${reviewId}/`, body);
  return res.data;
}

/** 리뷰 삭제 */
export async function deleteReview(reviewId) {
  await api.delete(`/v1/reviews/${reviewId}/`);
  return true; 
}
