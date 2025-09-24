/**
 * ReviewSection 컴포넌트
 *
 * 상품 상세 페이지 등에 바로 끼워 넣어서 사용할 수 있는 리뷰 섹션입니다.
 * 디벨롭 중입니다.
 * 사용 예시:
 * 
 * import ReviewSection from "@/components/reviews/ReviewSection";
 *
 * export default function ProductDetailPage({ product }) {
 *   const me = { id: 123 }; // 현재 로그인한 사용자
 *   return (
 *     <div>
 *       { 상품 상세 영역 } 
 *       <ReviewSection
 *         productId={product.id}         // 리뷰를 불러올 상품 ID
 *         currentUserId={me?.id}         // 현재 로그인한 사용자 ID
 *         isAdmin={true}              //      관리자일 경우 모든 리뷰 수정/삭제 가능
 *         onToast={(type, msg) => myToast(type, msg)} // (선택) 토스트 연결
 *       />
 *     </div>
 *   );
 * }
 * 
 *
 * props 설명:
 * - productId: 리뷰를 가져올 상품 ID
 * - currentUserId: 현재 로그인한 사용자 ID
 * - isAdmin: 관리자 여부 (기본값 false)
 * - initialReviews: 초기 리뷰 배열 (API 연결 전 테스트용)
 * - enableCreate: 리뷰 작성 가능 여부 (기본값 true)
 * - onCreate: 리뷰 생성 시 호출되는 함수 (기본 POST 대체 가능)
 * - pageSize: 페이지당 리뷰 개수 (기본값 20)
 * - onToast: 토스트 콜백 (type, message) 
 **/

import React, { useEffect, useState } from "react";
import ReviewCard from "./ui/ReviewCard";
import StarRating from "./ui/StarRating";
import {
  listReviewsByProduct,
  createReview,
  patchReview,
  deleteReview,
} from "./api";
import { useAuth } from "../../../../context/AuthContext";

export default function ReviewSection({
  productId,
  currentUserId,
  isAdmin = false,
  initialReviews = [],
  enableCreate = true,
  onCreate,
  pageSize = 20,
  onToast,
}) {
  const { user, isLoggedIn } = useAuth?.() || { user: null, isLoggedIn: false };
  const authedUserId = currentUserId ?? user?.id ?? null;

  const [rows, setRows] = useState(initialReviews);
  const [loading, setLoading] = useState(false);

  // 작성 상태
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canCreate = enableCreate && !!authedUserId;

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!productId) return;
      setLoading(true);
      try {
        const list = await listReviewsByProduct(productId, { page: 1, size: pageSize });
        if (alive && list && list.length) setRows(list);
      } catch (e) {
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [productId, pageSize]);

  const toast = (type, msg) => {
    if (onToast) onToast(type, msg);
    else if (type === "error") console.error(msg);
    else console.log(msg);
  };

  const handleCreate = async () => {
    if (!productId) return;
    if (!authedUserId) {
      toast("error", "리뷰를 작성하려면 로그인하세요.");
      return;
    }
    if (!rating || !content.trim()) {
      toast("error", "별점과 내용을 입력해주세요.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = { product_id: productId, rating, content };
      const created = onCreate ? await onCreate(payload) : await createReview(payload);
      setRows((prev) => [{ ...created, user_id: authedUserId }, ...prev]);
      setRating(0);
      setContent("");
      toast("success", "리뷰가 등록되었습니다.");
    } catch (e) {
      const msg = e?.response?.data?.detail || e?.message || "리뷰 등록에 실패했습니다.";
      toast("error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSave = async (reviewId, patch) => {
    try {
      const res = await patchReview(reviewId, patch);
      setRows((prev) =>
        prev.map((r) => (r.review_id === reviewId || r.id === reviewId ? { ...r, ...patch } : r))
      );
      toast("success", "리뷰가 수정되었습니다.");
      return res;
    } catch (e) {
      toast("error", e?.response?.data?.detail || e?.message || "리뷰 수정에 실패했습니다.");
      throw e;
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setRows((prev) => prev.filter((r) => (r.review_id ?? r.id) !== reviewId));
      toast("success", "리뷰가 삭제되었습니다.");
    } catch (e) {
      toast("error", e?.response?.data?.detail || e?.message || "리뷰 삭제에 실패했습니다.");
    }
  };

  const canEditReview = (r) => isAdmin || `${r.user_id}` === `${authedUserId}`;

return (
  <section className="w-full rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
    <header className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
      <h2 className="text-[15px] font-semibold text-gray-900 tracking-tight">리뷰</h2>
      <span className="text-xs text-gray-500">총 {rows.length.toLocaleString()}개</span>
    </header>

    {/* 작성 폼: 로그인한 사람만 */}
      {canCreate ? (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <StarRating value={rating} onChange={setRating} size={20} />
            <button
              onClick={handleCreate}
              disabled={submitting}
              className="inline-flex items-center rounded-md bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-900 disabled:opacity-50"
            >
              등록
            </button>
          </div>
          <div className="mt-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-200 bg-white p-2 text-sm outline-none placeholder:text-gray-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
              placeholder="상품 사용 후기를 남겨주세요."
            />
          </div>
        </div>
      ) : enableCreate && (
        <div className="mb-6 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 flex items-center justify-between">
          <span>리뷰를 작성하려면 로그인해 주세요.</span>
          {typeof onLoginClick === "function" && (
            <button
              onClick={onLoginClick}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-white"
            >
              로그인
            </button>
          )}
        </div>
      )}

    {/* 목록 */}
    {loading ? (
      <div className="py-10 text-center text-sm text-gray-500">불러오는 중…</div>
    ) : rows.length === 0 ? (
      <div className="py-8 text-center text-sm text-gray-500">아직 작성된 리뷰가 없습니다.</div>
    ) : (
      <ul className="divide-y divide-gray-100">
        {rows.map((r) => (
          <li key={r.review_id ?? r.id} className="py-4">
            <ReviewCard
              review={r}
              canEdit={canEditReview(r)}
              onSave={handleSave}
              onDelete={handleDelete}
              className="!border-0 !shadow-none !p-0"
              actionClassName="text-xs text-gray-500 hover:text-gray-800"
            />
          </li>
        ))}
      </ul>
    )}
  </section>
);
}