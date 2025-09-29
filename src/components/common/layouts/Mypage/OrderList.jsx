import { useState } from "react";
import { useGetMyAllOrders } from "../../../../hooks/payments/useOrderPayment";
import OrderEmpty from "../../../features/mypage-order/OrderEmpty";
import OrderCard from "../../../features/mypage-order/OrderCard";

export default function OrderList() {
  // orderId 가져오기 => userOrderList
  // orderId 별로 상품가져오기  => 이거 카드에서 직접 조회
  // orderId로 배송 조회 이건 카드에서 직접 조회 하기

  //
  const {
    data: userOrderList,
    isLoading: orderLoading,
    isError: orderIsError,
    error: orderError,
  } = useGetMyAllOrders();
  console.log(userOrderList, "리스트");
  if (orderLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        주문 내역을 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 표시할 데이터가 없으면 빈화면 안내 출력*/}
      {userOrderList?.results.length === 0 ? (
        <OrderEmpty />
      ) : (
        <div className="flex flex-col gap-2 justify-center items-center">
          {userOrderList.results.map((el) => (
            <OrderCard key={el.purchase_id} order={el} />
          ))}
        </div>
      )}

      {/* userOrderList를 map을 사용해서 id는 purchase_id 오더카드로 출력 */}
      {/* 오더카드에서는 purchase_id를 넘겨 받는다. */}
      {/* 오더카드에서는 상품 요약 사진 출력 */}
      {/* 각 상품 상태값 사용 */}
    </div>
  );
}
