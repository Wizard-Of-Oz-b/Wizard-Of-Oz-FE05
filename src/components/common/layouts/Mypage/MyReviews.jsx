import { useState, useEffect } from "react";
import { getProductReviews, updateReview } from "../../api/Mypage/reviews.js";

const renderStars = (rating) => {
  const safeRating = Math.min(Math.max(rating, 0), 5);
  return "⭐".repeat(safeRating);
};

export default function MyReviews({ productId = 1 }) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedRating, setEditedRating] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true);
        const res = await getProductReviews(productId);
        const mappedReviews = res.data.results.map((r) => ({
          id: r.review_id,
          reviewContent: r.content,
          reviewDate: new Date(r.created_at).toLocaleDateString(),
          rating: r.rating,
        }));
        setReviews(mappedReviews);
      } catch (err) {
        console.error("리뷰 불러오기 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadReviews();
  }, [productId]);

  const handleEditClick = (review) => {
    setEditingId(review.id);
    setEditedContent(review.reviewContent);
    setEditedRating(review.rating);
    setMessage("");
  };

  const handleSaveClick = async (id) => {
    try {
      await updateReview(id, {
        content: editedContent,
        rating: editedRating,
      });
      const updatedReviews = reviews.map((review) =>
        review.id === id
          ? { ...review, reviewContent: editedContent, rating: editedRating }
          : review
      );
      setReviews(updatedReviews);
      setMessage("리뷰가 성공적으로 수정되었습니다.");
    } catch (err) {
      console.error("리뷰 수정 실패:", err);
      setMessage("리뷰 수정 중 오류가 발생했습니다.");
    } finally {
      setEditingId(null);
      setEditedContent("");
      setEditedRating(0);
    }
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditedContent("");
    setEditedRating(0);
    setMessage("");
  };

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">리뷰를 불러오는 중입니다...</div>;
  }

  if (reviews.length === 0) {
    return <div className="text-center py-10 text-gray-500">아직 작성한 리뷰가 없습니다.</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">내 리뷰</h3>
      {message && (
        <div className="p-4 rounded-lg bg-green-100 text-green-700">{message}</div>
      )}

      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="flex-1 space-y-2">
              <p className="text-sm text-gray-500">{review.reviewDate}</p>

              {editingId === review.id ? (
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="cursor-pointer text-2xl"
                      onClick={() => setEditedRating(star)}
                    >
                      {star <= editedRating ? "⭐" : "☆"}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-yellow-400">{renderStars(review.rating)}</div>
              )}

              {editingId === review.id ? (
                <textarea
                  className="w-full h-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              ) : (
                <p className="text-gray-600">{review.reviewContent}</p>
              )}
            </div>

            <div className="flex-shrink-0">
              {editingId === review.id ? (
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1 text-sm rounded-lg text-white bg-black hover:bg-gray-800 transition"
                    onClick={() => handleSaveClick(review.id)}
                  >
                    저장
                  </button>
                  <button
                    className="px-3 py-1 text-sm rounded-lg text-gray-600 border border-gray-300 hover:bg-gray-100 transition"
                    onClick={handleCancelClick}
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  className="px-3 py-1 text-sm rounded-lg text-gray-600 border border-gray-300 hover:bg-gray-100 transition"
                  onClick={() => handleEditClick(review)}
                >
                  수정
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
