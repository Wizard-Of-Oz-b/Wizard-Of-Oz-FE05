import { assertUUID, assertRating } from "./validators";
import { normalizeReview, pickPaged } from "./normalizers";
import { rethrowWithKorean } from "./errors";
import api from "../../../../../lib/axios";

/** 목록 */
export async function listReviewsByProduct(productId, { page = 1, size = 20, ordering, withMeta = false } = {}) {
  if (productId == null) {
    return withMeta
      ? { results: [], count: 0, next: null, previous: null, avg_rating: 0 }
      : [];
  }
  const pid = assertUUID(productId, "product_id");
  try {
    const { data } = await api.get(`/v1/products/${pid}/reviews/`, {
      params: { page, size, ...(ordering ? { ordering } : {}) },
    });
    const paged = pickPaged(data);
    const results = paged.results.map(normalizeReview);
    return withMeta
      ? { results, count: paged.count, next: paged.next, previous: paged.previous, avg_rating: paged.avg_rating }
      : results;
  } catch (e) {
    if ([401, 403].includes(e?.response?.status)) rethrowWithKorean(e);
    return withMeta ? { results: [], count: 0, next: null, previous: null, avg_rating: 0 } : [];
  }
}

/** 단건 조회 */
export async function getReview(reviewId) {
  const rid = assertUUID(reviewId, "review_id");
  try {
    const res = await api.get(`/v1/reviews/${rid}/`);
    return normalizeReview(res.data);
  } catch (e) {
    rethrowWithKorean(e);
  }
}

/** 생성 */
export async function createReview({ product_id, rating, content, images }) {
  const pid = assertUUID(product_id, "product_id");
  const r = assertRating(rating);
  const body = { rating: r, content: String(content ?? "").trim() };
  if (Array.isArray(images) && images.length) body.images = images;

  try {
    const res = await api.post(`/v1/products/${pid}/reviews/`, body, {
      headers: { "Content-Type": "application/json" },
    });
    return normalizeReview(res.data);
  } catch (e) {
    const s = e?.response?.status;
    const overrides =
      s === 403 ? { message: "구매한 사용자만 리뷰를 작성할 수 있어요." }
    : s === 409 ? { message: "이 상품에 대한 리뷰를 이미 작성하셨어요." }
    : undefined;
    rethrowWithKorean(e, overrides);
  }
}

/** 수정 */
export async function patchReview(reviewId, { rating, content, images } = {}) {
  const rid = assertUUID(reviewId, "review_id");
  const body = {};
  if (rating != null) body.rating = assertRating(rating);
  if (content != null) body.content = String(content).trim();
  if (Array.isArray(images)) body.images = images;

  try {
    const res = await api.patch(`/v1/reviews/${rid}/`, body);
    return normalizeReview(res.data);
  } catch (e) {
    rethrowWithKorean(e);
  }
}

/** 삭제 */
export async function deleteReview(reviewId) {
  const rid = assertUUID(reviewId, "review_id");
  try {
    await api.delete(`/v1/reviews/${rid}/`);
    return true;
  } catch (e) {
    rethrowWithKorean(e);
  }
}

/** 사용자별 목록 */
export async function listReviewsByUser() {
  return [];
}
