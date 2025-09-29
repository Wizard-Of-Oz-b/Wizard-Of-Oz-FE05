import { useState } from "react";
import { useGetPurchaseDetail } from "../../../hooks/mypage/useUserOrder";
import OrderProductCard from "./OrderProductCard";

// 배송 상태가 존재 하면 배송 상태 우선!
const getStatusStyle = (status) => {
  switch (status) {
    case "delivered": //
      return "text-green-600 font-semibold";
    case "in transit": // 배송 중
      return "text-blue-500 font-semibold";
    case "pending": // 배송 대기
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

const getOrdername = (status) => {
  switch (status) {
    case "ready":
      return "결제 전";
    case "paid":
      return "주문 완료";
  }
};

// 주문 페이지 에서 출력
// 상태는 주문처리(ready), 주문완료(paid)로 구분해서 작성한다.
// 상품은 result를 map으로 출력해야 한다.

export default function OrderCard({ order }) {
  // order는 주문 번호, 합계 등을 담은 객체
  console.log(order);
  const {
    data: orderData, // count, results배열 출력
    isLoading,
    isError,
    error,
  } = useGetPurchaseDetail(order.purchase_id);

  const orderStatus = getOrdername(order?.status);
  const orderStyle = getOrderStyle(order?.status);
  console.log(orderData, "test");

  if (isLoading) {
    return (
      <>
        {/* 차후 스켈레톤 적용하자 */}
        로딩중
      </>
    );
  }
  console.log(orderData?.results.length, "길이");
  if (isError) {
    return <>임시 에러</>;
  }
  console.log(orderStatus, "스테이터스");

  return (
    <div className="w-3/4 border shadow-sm rounded-lg flex justify-center items-center">
      <table className="w-[97%]  mb-4 ">
        {/*  주문 정보 헤더 부분 */}
        <thead className="border-b border-l-gray-200">
          <tr>
            <th className="p-4 text-left font-normal" colSpan="2">
              <div className="flex gap-x-4 items-center">
                <span className="font-bold">{order?.purchase_id}</span>
                <span className="text-sm text-gray-700">
                  {order?.purchased_at.slice(0, 10)}
                </span>
                <span className={orderStyle}>{orderStatus}</span>
              </div>
            </th>

            {/* 상세 버튼 추후 취소 버튼도 추가할것 */}
            <th className="p-4 text-right font-normal">
              <button className="text-sm text-gray-600 hover:underline">
                상세보기
              </button>
            </th>
          </tr>
        </thead>

        {/*  상품 목록 바디 부분  */}
        <tbody>
          {orderData?.results.map((el) => (
            <OrderProductCard key={el.product_id + el.order_id} data={el} />
          ))}
        </tbody>

        {/* 4 전체 합계 푸터 부분 */}
        <tfoot className="border-t border-gray-200">
          <tr>
            <td className="p-4 text-right font-bold text-base" colSpan="3">
              총 {parseInt(order?.items_total).toLocaleString()} 원
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
