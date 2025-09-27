// features/reviews/MyReviewSection.jsx
import { useEffect, useState } from "react";
import { listReviewsByUser, deleteReview, patchReview } from "./api";
import ReviewCard from "../Mypage/ui/ReviewCard";

/**
 * 마이페이지 - 내가 작성한 리뷰 섹션
 * 사용: <MyReviewSection userId={me.user_id} onToast={(type,msg)=>...} />
 */
export default function MyReviewSection({ userId, isAdmin = false, onToast }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await listReviewsByUser(userId, { page: 1, size: 20 });
      const results = Array.isArray(data) ? data : data?.results;
      setReviews(Array.isArray(results) ? results : []);
    } catch (e) {
      console.error(e);
      onToast?.("error", "리뷰 불러오기 실패");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchReviews();
  }, [userId]);

  const handleSave = async (reviewId, { rating, content }) => {
    try {
      await patchReview(reviewId, { rating, content });
      onToast?.("success", "리뷰가 수정되었습니다.");
      fetchReviews();
    } catch (e) {
      onToast?.("error", "리뷰 수정에 실패했습니다.");
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("이 리뷰를 삭제할까요?")) return;
    try {
      await deleteReview(reviewId);
      onToast?.("success", "리뷰가 삭제되었습니다.");
      fetchReviews();
    } catch (e) {
      onToast?.("error", "리뷰 삭제에 실패했습니다.");
    }
  };

  const hasReviews = Array.isArray(reviews) && reviews.length > 0;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">내가 작성한 리뷰</h2>

      {loading ? (
        <div className="text-center py-10 text-gray-500">
          리뷰를 불러오는 중입니다...
        </div>
      ) : !hasReviews ? (
        <div className="text-center py-10 text-gray-500">
          아직 작성한 리뷰가 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <ReviewCard
              key={r.review_id}
              review={r}
              canEdit={!isAdmin || true}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
