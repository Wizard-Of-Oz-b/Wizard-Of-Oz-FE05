import { useState } from "react";
import {
  useCancelPurchase,
  useGetPurchaseDetail,
  useGetShipmentInfo,
} from "../../../hooks/mypage/useUserOrder";
import OrderProductCard from "./OrderProductCard";
import CartLoadingSpin from "../cart/CartLoadingSpin";
import DetailModal from "./DetailModal";

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

const getStatusName = (status) => {
  switch (status) {
    case "delivered": // 배송완료
      return "배송 완료";
    case "in transit": // 배송 중
      return "배송 중";
    case "pending": // 배송 대기
      return "배송 대기";
    default:
      return "알수 없음";
  }
};

// 주문 상태
const getOrderStyle = (status) => {
  switch (status) {
    case "ready":
      return "text-yellow-600 font-semibold";
    case "paid":
      return "text-blue-500 font-semibold";
    case "canceled":
      return "text-red-500 font-semibold";
  }
};

const getOrdername = (status) => {
  switch (status) {
    case "ready":
      return "결제 전";
    case "paid":
      return "결제 완료";
    case "canceled":
      return "결제 취소";
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

  const {
    data: shipment,
    isLoading: isShipLoading,
    isError: isShipError,
    error: shipError,
  } = useGetShipmentInfo(order.purchase_id);
  const cancelPurchaseMutation = useCancelPurchase();
  // 로딩
  const Loading = isLoading || isShipLoading;
  // 에러
  const pageError = isError || isShipError;

  console.log(order?.status, "스탯", order.purchase_id);
  const orderStatus =
    shipment?.total === 0
      ? getOrdername(order?.status)
      : getStatusName(shipment?.results[0].status);
  const orderStyle =
    shipment?.total === 0
      ? getOrderStyle(order?.status)
      : getStatusStyle(shipment?.results[0].status);

  const [detail, setDetail] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClickDetail = () => {
    setDetail((prev) => !prev);
  };

  const onClickcancled = () => {
    if (window.confirm("정말로 이 주문을 취소하시겠습니까?")) {
      cancelPurchaseMutation.mutate(order.purchase_id);
    }
    console.log("취소");
  };

  console.log(shipment?.results, "test");

  if (Loading) {
    return (
      <>
        {/* 차후 스켈레톤 적용하자 */}
        로딩중
      </>
    );
  }
  if (pageError) {
    return (
      <div>
        임시 에러
        <span>{error}</span>
        <span>{shipError}</span>
      </div>
    );
  }
  console.log(orderData?.results.length, "길이");
  console.log(orderStatus,isModalOpen, "스테이터스");

  return (
    <div className="w-full border shadow-sm rounded-lg flex justify-center items-center">
      {cancelPurchaseMutation.isPending ? <CartLoadingSpin /> : null}
      {isModalOpen ? (
        <DetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={orderData?.results}
        />
      ) : null}

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
              <button
                onClick={onClickDetail}
                className="text-sm text-gray-600 hover:underline cursor-pointer"
              >
                운송 확인
              </button>
            </th>
          </tr>
        </thead>

        {/*  상품 목록 바디 부분  */}
        <tbody>
          {orderData?.results.map((el) => (
            <OrderProductCard
              key={el.product_id + el.order_id + el.option_key}
              data={el}
            />
          ))}
          <tr>
            <td>
              <button onClick={() => setIsModalOpen(prev => !prev)}>상세 보기</button>
            </td>
          </tr>
        </tbody>

        {/* 전체 합계 푸터 부분 */}
        <tfoot className="border-t border-gray-200">
          <tr>
            <td className="p-4" colSpan="3">
              <div className="flex flex-col items-end">
                <span className="font-bold">
                  총 {parseInt(order?.items_total).toLocaleString()} 원
                </span>
                {order?.status === "paid" && shipment?.total === 0 ? (
                  <button
                    onClick={onClickcancled}
                    className="border border-gray-300 rounded-lg px-2 py-0.5 mt-1 bg-red-400 text-white"
                  >
                    결제 취소
                  </button>
                ) : null}
              </div>
            </td>
          </tr>
          <tr>
            <td>
              {/* 배송상세 설명 */}
              {shipment?.results.length >= 1 && detail ? (
                <div className="flex flex-col">
                  <span className="text-gray-600">
                    택배업체 : {shipment?.results[0].carrier}
                  </span>
                  <span className="text-gray-600">
                    송장번호 : {shipment?.results[0].tracking_number}
                  </span>
                </div>
              ) : (
                ""
              )}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
