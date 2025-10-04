import { useEffect, useState } from "react";
import {
  useCancelPurchase,
  useGetPurchaseDetail,
  useGetShipmentInfo,
} from "../../../hooks/mypage/useUserOrder";
import OrderProductCard from "./OrderProductCard";
import CartLoadingSpin from "../cart/CartLoadingSpin";
import DetailModal from "./DetailModal";
import OrderCardSkeleton from "../../skeletons/OrderCardSkeleton";
import { DEFAULT_STATUS, STATUS_MAP } from "../../../constants/orderStatus";


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
  } = useGetPurchaseDetail(order?.purchase_id);

  const {
    data: shipment,
    isLoading: isShipLoading,
    isError: isShipError,
    error: shipError,
  } = useGetShipmentInfo(order?.purchase_id);
  const cancelPurchaseMutation = useCancelPurchase();
  // 로딩
  const Loading = isLoading || isShipLoading;
  // 에러
  const pageError = isError || isShipError;

  console.log(order?.status, "스탯", order.purchase_id);


  // 현재상태 배송상태가 가장 우선되어 표기됨
  const currentStatusKey = shipment?.status || order?.status;
  const statusInfo = STATUS_MAP[currentStatusKey] ?? DEFAULT_STATUS;
  const orderStatus = statusInfo.name;
  const orderStyle = statusInfo.style;


  const [detail, setDetail] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cutOrderList, setCutOrderList] = useState([]) // 카드 하나에는 두개의 상품만 출력한다.

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


  useEffect(()=>{
    if(orderData){
      const cutList = orderData?.results.slice(0,2)
      setCutOrderList(cutList);
    }
  },[orderData])
  //order 없으면 얼리 리턴
  if (!order) {
    return;
  }
  if (Loading) {
    return (
      <div className="space-y-4 w-full">
        <OrderCardSkeleton />
      </div>
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
  console.log(orderStatus, isModalOpen, "스테이터스");

  return (
    <div className="w-full border border-neutral-300 shadow-sm rounded-lg flex justify-center items-center">
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
        <thead className="border-b border-neutral-300">
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
            {shipment?.total !== 0 ? <th className="p-4 text-right font-normal">
              <button
                onClick={onClickDetail}
                className="text-sm text-gray-600 hover:underline cursor-pointer"
              >
                운송 확인
              </button>
            </th> : null}
            
          </tr>
        </thead>

        {/*  상품 목록 바디 부분  */}
        <tbody>
          {cutOrderList.map((el) => (
            <OrderProductCard
              key={el.product_id + el.order_id + el.option_key}
              data={el}
            />
          ))}
          <tr>
            <td>
              <button onClick={() => setIsModalOpen((prev) => !prev)}>
                상세 보기
              </button>
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
