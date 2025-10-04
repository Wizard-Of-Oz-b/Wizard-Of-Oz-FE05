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
import { AnimatePresence, motion } from "framer-motion";

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

  console.log(order?.status, "스탯", order.purchase_id, shipment);

  const [orderStyle, setOrderStyle] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [detail, setDetail] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cutOrderList, setCutOrderList] = useState([]); // 카드 하나에는 두개의 상품만 출력한다.

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

  // 화면상에서는 구매목록을 2개까지만 출력
  useEffect(() => {
    if (orderData) {
      const cutList = orderData?.results.slice(0, 2);
      setCutOrderList(cutList);
    }
  }, [orderData]);

  // 현재상태 배송상태가 가장 우선되어 표기됨
  useEffect(() => {
    if (!Loading) {
      const currentStatusKey = shipment?.results[0]?.status || order?.status;
      const statusInfo = STATUS_MAP[currentStatusKey] ?? DEFAULT_STATUS;

      console.log(shipment, order?.purchase_id.slice(0, 8), "배송테스트");
      setOrderStatus(statusInfo?.name);
      setOrderStyle(statusInfo?.style);
    }
  }, [shipment, orderData]);
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
    <AnimatePresence>
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        className="w-full border border-neutral-300 shadow-sm rounded-lg flex justify-center items-center"
      >
        {cancelPurchaseMutation.isPending ? <CartLoadingSpin /> : null}
        {isModalOpen ? (
          <DetailModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            data={orderData?.results}
          />
        ) : null}
        {/* 데스크톱 */}
        <div className="hidden lg:flex w-[97%]">
          <table className="w-full  mb-4 ">
            {/*  주문 정보 헤더 부분 */}
            <thead className="border-b border-neutral-300">
              <tr>
                <th className="p-4 text-left font-normal" colSpan="2">
                  <div className="flex gap-x-4 items-center">
                    <span className="font-bold">
                      {order?.purchase_id.slice(0, 8)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {order?.purchased_at.slice(0, 10)}
                    </span>
                    <span className={orderStyle}>{orderStatus}</span>
                  </div>
                </th>

                {/* 상세 버튼 추후 취소 버튼도 추가할것 */}
                {shipment?.total >= 1 ? (
                  <th className="p-4 text-right font-normal">
                    <button
                      onClick={onClickDetail}
                      className="text-sm text-blue-600 hover:underline cursor-pointer"
                    >
                      {detail ? "배송 정보 숨기기" : "배송 정보 보기"}
                    </button>
                  </th>
                ) : null}
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
                        주문 취소
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  {/* 배송상세 설명 */}
                  {shipment?.total >= 1 && detail ? (
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

        {/* 모바일 화면 전환 */}
        <div className="flex flex-col lg:hidden p-4">
          {/* 주문 목록 제목 */}
          <div className="flex justify-between items-start pb-3 border-b border-neutral-200 w-full">
            <div>
              <p className="font-bold text-md">
                {order?.purchase_id.slice(0, 8)}
              </p>
              <span className="font-bold text-xs text-gray-500">
                {order?.purchased_at.slice(0, 10)}
              </span>
            </div>

            <div className="flex justify-end w-20">
              <span className={`${orderStyle} text-sm`}>{orderStatus}</span>
            </div>
          </div>
          {/* 주문 목록 출력 */}
          <div>
            {cutOrderList.map((el) => (
              <OrderProductCard
                key={el.product_id + el.order_id + el.option_key}
                view="card"
                data={el}
              />
            ))}
          </div>

          <div className="py-3 text-center border-t">
            <button
              onClick={() => setIsModalOpen((prev) => !prev)}
              className="text-sm font-semibold text-gray-700 hover:text-black"
            >
              전체 상품 보기
            </button>
          </div>

          {/* 배송 정보 */}
          {shipment?.total !== 0 && (
            <div className="py-3 border-t">
              <button
                onClick={onClickDetail}
                className="text-sm text-blue-600 font-semibold"
              >
                {detail ? "배송 정보 숨기기" : "배송 정보 보기"}
              </button>
              {detail && (
                <div className="mt-2 text-sm space-y-1">
                  <p>택배업체: {shipment?.results[0].carrier}</p>
                  <p>송장번호: {shipment?.results[0].tracking_number}</p>
                </div>
              )}
            </div>
          )}

          {/* 총액 및 버튼 */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-semibold">총 주문금액</span>
              <span className="text-xl font-bold">
                {parseInt(order?.items_total).toLocaleString()} 원
              </span>
            </div>
            {order?.status === "paid" && shipment?.total === 0 && (
              <button
                onClick={onClickcancled}
                className="w-full text-center mt-3 rounded-md px-2 py-2 bg-red-500 text-white font-semibold"
              >
                주문 취소
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
