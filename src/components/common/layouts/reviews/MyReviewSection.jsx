import { useEffect, useState } from "react";
import { listReviewsByUser, deleteReview, patchReview } from "./api";
import ReviewCard from "./ui/ReviewCard";

/**
 * 마이페이지에서 내가 작성한 리뷰 보여주는 섹션
 *
 * 사용 예시:
 * <MyReviewSection userId={me.id} isAdmin={me.role === "admin"} />
 */
export default function MyReviewSection({ userId, isAdmin = false, onToast }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 리뷰 불러오기
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await listReviewsByUser(userId, { page: 1, size: 20 });
      setReviews(data);
    } catch (e) {
      onToast?.("error", "리뷰 불러오기 실패");
      console.error(e);
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

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold mb-4">내가 작성한 리뷰</h2>

      {loading ? (
        <p className="text-gray-500 text-sm">불러오는 중...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500 text-sm">작성한 리뷰가 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <ReviewCard
              key={r.review_id}
              review={r}
              canEdit={true}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
