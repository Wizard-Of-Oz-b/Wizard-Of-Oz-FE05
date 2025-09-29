import api from "../../../../lib/axios";

// 특정 상품 리뷰 목록 조회
export const getProductReviews = (productId) =>
  api.get(`/api/v1/products/${productId}/reviews/`);

// 리뷰 수정
export const updateReview = (reviewId, data) =>
  api.patch(`/api/v1/reviews/${reviewId}/`, data);

// 리뷰 삭제
export const deleteReview = (reviewId) =>
  api.delete(`/api/v1/reviews/${reviewId}/`);
