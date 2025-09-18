import { useState, useEffect } from "react";

const MOCK_REVIEWS = [
  {
    id: 1,
    productName: "에어팟 프로 2세대",
    productImage: "/images/1.jpg",
    reviewDate: "2025-09-10",
    rating: 5,
    reviewTitle: "음질 최고! 만족합니다!",
    reviewContent: "배송도 빠르고 음질이 정말 훌륭합니다. 노이즈 캔슬링 기능도 기대 이상이네요. 디자인도 깔끔해서 너무 좋아요.",
  },
  {
    id: 2,
    productName: "코튼 블렌드 스웨트셔츠",
    productImage: "/images/2.jpg",
    reviewDate: "2025-08-25",
    rating: 4,
    reviewTitle: "편하고 좋아요",
    reviewContent: "재질이 부드러워서 착용감이 좋습니다. 색상도 화면과 거의 비슷하고, 일상에서 편하게 입기 좋아요. 다만 사이즈가 조금 크게 나온 것 같아요.",
  },
];

const renderStars = (rating) => {
  return "⭐".repeat(rating);
};

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); 
  const [editedContent, setEditedContent] = useState(""); 
  const [editedRating, setEditedRating] = useState(0); 
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchReviews = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(MOCK_REVIEWS);
        }, 1000);
      });
    };

    const loadReviews = async () => {
      setIsLoading(true);
      const fetchedReviews = await fetchReviews();
      setReviews(fetchedReviews);
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
    const updatedReviews = reviews.map((review) =>
      review.id === id ? { 
        ...review, 
        reviewContent: editedContent,
        rating: editedRating
      } : review
    );
    setReviews(updatedReviews);
    setEditingId(null);
    setEditedContent("");
    setEditedRating(0);
    setMessage("리뷰가 성공적으로 수정되었습니다.");
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
    return (
      <div className="text-center py-10 text-gray-500">
        아직 작성한 리뷰가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold"></h3>
      
      {message && (
        <div className="p-4 rounded-lg bg-green-100 text-green-700">
          {message}
        </div>
      )}

      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex items-start space-x-4">
            {/* 상품 이미지 */}
            <img src={review.productImage} alt={review.productName} className="w-24 h-24 object-cover rounded-lg" />
            
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
                      {star <= editedRating ? '⭐' : '☆'}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-yellow-400">
                  {renderStars(review.rating)}
                </div>
              )}
              
              <p className="text-gray-800 font-semibold">{review.reviewTitle}</p>
              
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