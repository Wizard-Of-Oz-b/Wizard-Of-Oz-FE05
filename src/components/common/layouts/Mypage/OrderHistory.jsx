import React, { useState, useEffect } from "react";

const getStatusStyles = (status) => {
  switch (status) {
    case "배송 완료":
      return "text-green-600 font-semibold";
    case "배송 중":
      return "text-blue-500 font-semibold";
    case "주문 처리 중":
      return "text-yellow-600 font-semibold";
    default:
      return "text-gray-500";
  }
};



// 이페이지에서 가져와야 할것


export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [message, setMessage] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [orderToCancelId, setOrderToCancelId] = useState(null);

  const fetchOrdersFromServer = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            status: "주문 처리 중",
            details: {
              orderNumber: "20250916-123456",
              orderDate: "2025-09-16",
              paymentMethod: "신용카드",
              shippingAddress: "서울특별시 강남구 테헤란로 123",
            },
            products: [
              {
                id: "p1",
                name: "에어팟 프로 2세대",
                quantity: 1,
                price: 329000,
                image: "/images/3.jpg",
              },
              {
                id: "p2",
                name: "Apple Pencil 2세대",
                quantity: 1,
                price: 159000,
                image: "/images/6.jpg",
              },
            ],
          },
          {
            id: 2,
            status: "배송 중",
            details: {
              orderNumber: "20250915-789012",
              orderDate: "2025-09-15",
              paymentMethod: "네이버페이",
              shippingAddress: "경기도 성남시 분당구 판교역로 1",
              trackingNumber: "1234-5678-9012",
            },
            products: [
              {
                id: "p3",
                name: "USB-C 케이블 (2m)",
                quantity: 2,
                price: 25000,
                image: "/images/4.jpg",
              },
            ],
          },
          {
            id: 3,
            status: "배송 완료",
            details: {
              orderNumber: "20250910-345678",
              orderDate: "2025-09-10",
              paymentMethod: "카카오페이",
              shippingAddress: "부산광역시 해운대구 APEC로 55",
              trackingNumber: "9876-5432-1098",
            },
            products: [
              {
                id: "p4",
                name: "맥북 에어 M3 (스타라이트)",
                quantity: 1,
                price: 1590000,
                image: "/images/5.jpg",
              },
              {
                id: "p5",
                name: "매직 마우스",
                quantity: 1,
                price: 85000,
                image: "/images/7.jpg",
              },
            ],
          },
        ]);
      }, 1000);
    });
  };

  useEffect(() => {
    const loadOrders = async () => {
      const fetchedOrders = await fetchOrdersFromServer();
      setOrders(fetchedOrders);
      setLoading(false);
    };
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

  const handleConfirmCancellation = () => {
    setOrders(orders.filter((order) => order.id !== orderToCancelId));
    setExpandedOrderId(null);
    setShowCancelConfirm(false);
    setMessage("주문이 취소되었습니다.");
    setOrderToCancelId(null);
  };

  const handleCancelConfirmation = () => {
    setShowCancelConfirm(false);
    setOrderToCancelId(null);
  };

  const CJ_EXPRESS_URL =
    "https://www.cjlogistics.com/ko/tool/parcel/tracking-detail?parcelId=";

  const getTrackingNumberOnly = (trackingNumberWithCarrier) => {
    if (!trackingNumberWithCarrier) return null;
    const parts = trackingNumberWithCarrier.split(" ");
    return parts[parts.length - 1];
  };

  const handleTrackingClick = (trackingNumberWithCarrier) => {
    const number = getTrackingNumberOnly(trackingNumberWithCarrier);

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
              <div key={order.id} className="border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                  <div className="flex items-baseline space-x-4">
                    <span className="text-xl font-bold text-gray-800">
                      {order.details.orderNumber}
                    </span>
                    <span className="text-sm text-gray-500">
                      {order.details.orderDate}
                    </span>
                    <span
                      className={`text-sm ${getStatusStyles(order.status)}`}
                    >
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
                      onClick={() => handleDetailsClick(order.id)}
                    >
                      {expandedOrderId === order.id ? "닫기" : "상세"}
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

                {expandedOrderId === order.id && (
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
                      <strong>배송 주소:</strong>{" "}
                      {order.details.shippingAddress}
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
