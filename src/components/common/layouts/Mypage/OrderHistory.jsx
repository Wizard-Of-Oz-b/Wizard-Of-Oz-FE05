import React, { useState, useEffect } from "react";
import { getMyPurchases, cancelPurchase } from "../../api/Mypage/orders.js";

// 상태 텍스트 변환 (API 값 → 화면 표시)
const getStatusLabel = (status) => {
  switch (status) {
    case "ready":
      return "주문 처리 중";
    case "shipping":
    case "배송 중":
      return "배송 중";
    case "completed":
    case "배송 완료":
      return "배송 완료";
    default:
      return "알 수 없음";
  }
};

// 상태별 스타일
const getStatusStyles = (status) => {
  switch (status) {
    case "ready":
    case "shipping":
    case "주문 처리 중":
      return "text-yellow-600 font-semibold";
    case "배송 중":
      return "text-blue-500 font-semibold";
    case "completed":
    case "배송 완료":
      return "text-green-600 font-semibold";
    default:
      return "text-gray-500";
  }
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [message, setMessage] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [orderToCancelId, setOrderToCancelId] = useState(null);

  // 주문 내역 불러오기
  const loadOrders = async () => {
    try {
      const res = await getMyPurchases();
      setOrders(res.data.results);
    } catch (err) {
      console.error("주문 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleDetailsClick = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleCancelOrder = (orderId) => {
    setMessage("");
    setOrderToCancelId(orderId);
    setShowCancelConfirm(true);
  };

  const handleConfirmCancellation = async () => {
    try {
      await cancelPurchase({
        order_item_id: orderToCancelId,
        reason: "사용자 요청",
        cancel_amount: "-",
        tax_free_amount: "0.00",
      });
      setMessage("주문이 취소되었습니다.");
      await loadOrders();
    } catch (err) {
      console.error("주문 취소 실패:", err);
      setMessage("주문 취소 중 오류가 발생했습니다.");
    } finally {
      setExpandedOrderId(null);
      setShowCancelConfirm(false);
      setOrderToCancelId(null);
    }
  };

  const handleCancelConfirmation = () => {
    setShowCancelConfirm(false);
    setOrderToCancelId(null);
  };

  const CJ_EXPRESS_URL =
    "https://www.cjlogistics.com/ko/tool/parcel/tracking-detail?parcelId=";

  const getTrackingNumberOnly = (trackingNumber) => {
    if (!trackingNumber) return null;
    const parts = trackingNumber.split(" ");
    return parts[parts.length - 1];
  };

  const handleTrackingClick = (trackingNumber) => {
    const number = getTrackingNumberOnly(trackingNumber);
    if (number) {
      window.open(
        `${CJ_EXPRESS_URL}${number}`,
        "tracking_popup",
        "width=800,height=600,scrollbars=yes"
      );
    } else {
      alert("운송장 번호를 찾을 수 없습니다.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        주문 내역을 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className="p-4 rounded-lg bg-green-100 text-green-700">
          {message}
        </div>
      )}
      {showCancelConfirm ? (
        <div className="flex flex-col items-center p-6 border border-red-300 bg-red-50 rounded-lg shadow-lg">
          <p className="font-semibold text-lg text-red-700 mb-4">
            정말 주문을 취소하시겠습니까?
          </p>
          <div className="flex space-x-4">
            <button
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              onClick={handleConfirmCancellation}
            >
              확인
            </button>
            <button
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              onClick={handleCancelConfirmation}
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.purchase_id}
                className="border rounded-lg p-4 shadow-sm"
              >
                {/* 주문 기본 정보 */}
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                  <div className="flex items-baseline space-x-4">
                    <span className="text-xl font-bold text-gray-800">
                      {order.order_number || order.purchase_id}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(order.purchased_at).toLocaleDateString()}
                    </span>
                    <span
                      className={`text-sm ${getStatusStyles(order.status)}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <div className="flex-shrink-0 flex items-center space-x-2">
                    {order.status === "ready" && (
                      <button
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        onClick={() => handleCancelOrder(order.purchase_id)}
                      >
                        주문 취소
                      </button>
                    )}
                    <button
                      className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                      onClick={() => handleDetailsClick(order.purchase_id)}
                    >
                      {expandedOrderId === order.purchase_id
                        ? "닫기"
                        : "상세"}
                    </button>
                  </div>
                </div>

                {/* 상품 목록 */}
                <div className="space-y-3">
                  {order.products?.map((product) => (
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
                          <p>
                            개별 가격: {product.price.toLocaleString()}원
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 상세 정보 */}
                {expandedOrderId === order.purchase_id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>주문번호:</strong> {order.order_number}
                    </p>
                    <p>
                      <strong>주문일자:</strong>{" "}
                      {new Date(order.purchased_at).toLocaleString()}
                    </p>
                    <p>
                      <strong>결제 방법:</strong> {order.pg || "카드"}
                    </p>
                    <p>
                      <strong>배송 주소:</strong>{" "}
                      {order.shipping_address || "미등록"}
                    </p>
                    {order.tracking_number && (
                      <div className="flex items-center space-x-2">
                        <p>
                          <strong>운송장 번호:</strong>{" "}
                          {getTrackingNumberOnly(order.tracking_number)}
                        </p>
                        <button
                          className="px-2 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                          onClick={() =>
                            handleTrackingClick(order.tracking_number)
                          }
                        >
                          배송조회
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">주문 내역이 없습니다.</p>
          )}
        </>
      )}
    </div>
  );
}
