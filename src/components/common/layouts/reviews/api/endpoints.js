import { assertUUID, assertRating } from "./validators";
import { normalizeReview, pickPaged } from "./normalizers";
import { rethrowWithKorean } from "./errors";
import api from "../../../../../lib/axios";

/** 목록 */
export async function listReviewsByProduct(
  productId,
  { page = 1, size = 20, ordering, withMeta = false } = {}
) {
  if (productId == null) {
    return withMeta
      ? { results: [], count: 0, next: null, previous: null, avg_rating: 0 }
      : [];
  }
  const pid = assertUUID(productId, "product_id");

  const parsePaged = (data) => {
    if (data?.items && typeof data.items === "object") {
      const { count, next, previous, results } = data.items;
      return {
        count: data.count ?? count ?? 0,
        next: next ?? null,
        previous: previous ?? null,
        results: Array.isArray(results) ? results : [],
        avg_rating: data.avg_rating ?? 0,
      };
    }
    return {
      count: data?.count ?? 0,
      next: data?.next ?? null,
      previous: data?.previous ?? null,
      results: Array.isArray(data?.results) ? data.results : [],
      avg_rating: data?.avg_rating ?? 0,
    };
  };

  try {
    const { data } = await api.get(`/v1/products/${pid}/reviews/`, {
      params: { page, size, ...(ordering ? { ordering } : {}) },
    });

    const paged = parsePaged(data);

    const results = (paged.results || []).map((raw) => {
      const n = normalizeReview(raw);
      // id/review_id 안전 보장
      const review_id = n.review_id ?? n.id ?? raw.review_id ?? raw.id ?? null;
      return { ...n, review_id, id: review_id };
    });

    return withMeta
      ? {
          results,
          count: paged.count ?? results.length,
          next: paged.next ?? null,
          previous: paged.previous ?? null,
          avg_rating: paged.avg_rating ?? 0,
        }
      : results;
  } catch (e) {
    const s = e?.response?.status;
    if (s === 404) {
      return withMeta
        ? { results: [], count: 0, next: null, previous: null, avg_rating: 0 }
        : [];
    }
    if (s === 500) {
      console.error("[리뷰 목록 500] 쿼리 파라미터/스키마 확인 필요", e?.response?.data);
    }
    rethrowWithKorean(e);
  }
}


/** 단건 조회 */
export async function getReview(reviewId) {
  const rid = assertUUID(reviewId, "review_id");
  try {
    const res = await api.get(`/v1/reviews/${rid}/`);
    const n = normalizeReview(res.data);
    const review_id = n.review_id ?? n.id ?? res.data?.review_id ?? res.data?.id ?? rid;
    return { ...n, review_id, id: review_id };
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
    const n = normalizeReview(res.data);
    const review_id = n.review_id ?? n.id ?? res.data?.review_id ?? res.data?.id ?? null;
    return { ...n, review_id, id: review_id };
  } catch (e) {
    console.error("[리뷰 생성 실패]", {
      status: e?.response?.status,
      data: e?.response?.data,
    });
    const s = e?.response?.status;

    const overrides =
      s === 403
        ? { message: "구매한 사용자만 리뷰를 작성할 수 있어요." }
        : s === 409
        ? { message: "이 상품에 대한 리뷰를 이미 작성하셨어요." }
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
    const n = normalizeReview(res.data);
    const review_id = n.review_id ?? n.id ?? res.data?.review_id ?? res.data?.id ?? rid;
    return { ...n, review_id, id: review_id };
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

/** 사용자별 목록(향후 구현) */
export async function listReviewsByUser() {
  return [];
}
