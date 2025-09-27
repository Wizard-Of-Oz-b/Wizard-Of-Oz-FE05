import React, { useState, useEffect } from "react";
import { Sparkles, Eye, EyeOff } from "lucide-react";

/* ====================== */
/*  준비중 안내 + 데모 보기 */
/* ====================== */
export default function MyReviewsPage() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <section className="space-y-6">
      {/* 안내 카드 */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-gray-100 grid place-items-center">
            <Sparkles className="w-5 h-5 text-gray-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">마이페이지 리뷰는 준비 중이에요</h3>
            <p className="text-sm text-gray-600 mt-1">
              마이페이지에서 내가 작성한 리뷰를 한 번에 확인하는 기능을 준비 중입니다. <br />
              리뷰 작성·수정·삭제는 각 <span className="font-medium">상품 상세 페이지</span>에서 이용해주세요. 🙂
            </p>

            <button
              onClick={() => setShowDemo((v) => !v)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              {showDemo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showDemo ? "데모(목업) 숨기기" : "데모(목업) 보기"}
            </button>
          </div>
        </div>
      </div>

      {/* 데모(목업) 영역: 실제 API 연결 없음 */}
      {showDemo && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h4 className="text-base font-semibold mb-4">데모: 내가 작성한 리뷰 (목업)</h4>
          <MyReviewsDemo />
        </div>
      )}
    </section>
  );
}

/* ====================== */
/*  데모(목업) 컴포넌트    */
/* ====================== */
const MOCK_REVIEWS = [
  {
    id: 1,
    productName: "에어팟 프로 2세대",
    productImage: "/images/1.jpg",
    reviewDate: "2025-09-10",
    rating: 5,
    reviewTitle: "음질 최고! 만족합니다!",
    reviewContent:
      "배송도 빠르고 음질이 정말 훌륭합니다. 노이즈 캔슬링 기능도 기대 이상이네요. 디자인도 깔끔해서 너무 좋아요.",
  },
  {
    id: 2,
    productName: "코튼 블렌드 스웨트셔츠",
    productImage: "/images/2.jpg",
    reviewDate: "2025-08-25",
    rating: 4,
    reviewTitle: "편하고 좋아요",
    reviewContent:
      "재질이 부드러워서 착용감이 좋습니다. 색상도 화면과 거의 비슷하고, 일상에서 편하게 입기 좋아요. 다만 사이즈가 조금 크게 나온 것 같아요.",
  },
];

const renderStars = (rating) => "⭐".repeat(rating);

function MyReviewsDemo() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedRating, setEditedRating] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // 목업 로드
    const loadReviews = async () => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 500));
      setReviews(MOCK_REVIEWS);
      setIsLoading(false);
    };
    loadReviews();
  }, []);

  const handleEditClick = (review) => {
    setEditingId(review.id);
    setEditedContent(review.reviewContent);
    setEditedRating(review.rating);
    setMessage("");
  };

  const handleSaveClick = (id) => {
    const updated = reviews.map((r) =>
      r.id === id ? { ...r, reviewContent: editedContent, rating: editedRating } : r
    );
    setReviews(updated);
    setEditingId(null);
    setEditedContent("");
    setEditedRating(0);
    setMessage("리뷰가 성공적으로 수정되었습니다. (데모)");
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
      {message && (
        <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm">{message}</div>
      )}

      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-start gap-4">
            <img
              src={review.productImage}
              alt={review.productName}
              className="w-24 h-24 object-cover rounded-lg"
            />

            <div className="flex-1 space-y-2">
              <p className="text-sm text-gray-500">{review.reviewDate}</p>
              <h4 className="text-lg font-bold">{review.productName}</h4>

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

              <p className="text-gray-800 font-semibold">{review.reviewTitle}</p>

              {editingId === review.id ? (
                <textarea
                  className="w-full h-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              ) : (
                <p className="text-gray-600">{review.reviewContent}</p>
              )}
            </div>

            <div className="flex-shrink-0">
              {editingId === review.id ? (
                <div className="flex gap-2">
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
