import { useState } from "react";

// const getStatusStyle = (status) => {
//   switch (status) {
//     case "배송 완료":
//       return "text-green-600 font-semibold";
//     case "배송 중":
//       return "text-blue-500 font-semibold";
//     case "주문 처리 중":
//       return "text-yellow-600 font-semibold";
//     default:
//       return "text-gray-500";
//   }
// };

// 배송 상태가 존재 하면 배송 상태 우선!
const getStatusStyle = (status) => {
  switch (status) {
    case "Delivered":   // 
      return "text-green-600 font-semibold";
    case "In Transit":  // 배송 중
      return "text-blue-500 font-semibold";
    case "Pending":     // 배송 대기
      return "text-yellow-600 font-semibold";
    default:
      return "text-gray-500";
  }
}

// 주문 상태 
const getOrderStyle = (status) => {
  switch(status){
    case "ready":
      return "text-yellow-600 font-semibold";
    case "paid":
      return "text-blue-500 font-semibold";
  }
}

// 주문 페이지 에서 출력
// 상태는 주문처리(ready), 주문완료(paid)로 구분해서 작성한다.

export default function OrderCard({ order, handleCancelOrder }) {
  console.log(order);
  const [detail, setDetail] = useState(false);

  const handleDetailsClick = () =>{
    setDetail(prev => !prev)
  }
  
  return (
    <div key={order.id} className="border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
        <div className="flex items-baseline space-x-4">
          <span className="text-xl font-bold text-gray-800">
            {order.details.orderNumber}
          </span>
          <span className="text-sm text-gray-500">
            {order.details.orderDate}
          </span>
          <span className={`text-sm ${getStatusStyle(order.status)}`}>
            {order.status}
          </span>
        </div>
        <div className="flex-shrink-0 flex items-center space-x-2">
          {order.status === "주문 처리 중" && (
            <button
              className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              onClick={() => handleCancelOrder(order.id)}
            >
              주문 취소
            </button>
          )}
          <button
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            onClick={handleDetailsClick}
          >
            {detail ? "닫기" : "상세"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {order.products.map((product) => (
          <div
            key={product.id}
            className="flex items-center space-x-4 border-b last:border-b-0 pb-3 last:pb-0"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div className="flex-1">
              <span className="text-base font-medium text-gray-700 block">
                {product.name}
              </span>
              <div className="text-sm text-gray-500 mt-0.5">
                <p>수량: {product.quantity}개</p>
                <p>개별 가격: {product.price.toLocaleString()}원</p>
              </div>
            </div>
          </div>
        ))}
      </div>
{/* 
      {detail && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm text-gray-600">
          <p>
            <strong>주문번호:</strong> {order.details.orderNumber}
          </p>
          <p>
            <strong>주문일자:</strong> {order.details.orderDate}
          </p>
          <p>
            <strong>결제 방법:</strong> {order.details.paymentMethod}
          </p>
          <p>
            <strong>배송 주소:</strong> {order.details.shippingAddress}
          </p>
          {order.details.trackingNumber && (
            <div className="flex items-center space-x-2">
              <p>
                <strong>(CJ대한통운)운송장 번호:</strong>{" "}
                {getTrackingNumberOnly(order.details.trackingNumber)}
              </p>
              <button
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                onClick={() =>
                  handleTrackingClick(order.details.trackingNumber)
                }
              >
                배송조회
              </button>
            </div>
          )}
        </div>
      )} */}
    </div>
  );
}
