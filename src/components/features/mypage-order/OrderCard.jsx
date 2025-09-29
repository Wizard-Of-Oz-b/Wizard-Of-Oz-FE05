import { useState } from "react";
import { useGetPurchaseDetail } from "../../../hooks/mypage/useUserOrder";

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
    case "Delivered": //
      return "text-green-600 font-semibold";
    case "In Transit": // 배송 중
      return "text-blue-500 font-semibold";
    case "Pending": // 배송 대기
      return "text-yellow-600 font-semibold";
    default:
      return "text-gray-500";
  }
};

// 주문 상태
const getOrderStyle = (status) => {
  switch (status) {
    case "ready":
      return "text-yellow-600 font-semibold";
    case "paid":
      return "text-blue-500 font-semibold";
  }
};

// 주문 페이지 에서 출력
// 상태는 주문처리(ready), 주문완료(paid)로 구분해서 작성한다.

export default function OrderCard({ order }) {
  // order는 주문 번호다
  console.log(order);
  const {
    data: orderData,
    isLoading,
    isError,
    error,
  } = useGetPurchaseDetail(order.purchase_id);
  console.log(orderData ,'test')
  const [detail, setDetail] = useState(false);

  const handleDetailsClick = () => {
    setDetail((prev) => !prev);
  };
  const handleCancelOrder = () => {
    console.log("주문 취소");
  };
  if(isLoading){
    return(
    <>
    {/* 차후 스켈레톤 적용하자 */}
      로딩중
    </>
    )
  }

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      
    </div>
  );
}
