import React, { useState, useEffect } from "react";

const getStatusStyles = (status) => {
  switch (status) {
    case '배송 완료':
      return 'text-green-600 font-semibold';
    case '배송 중':
      return 'text-blue-500 font-semibold';
    case '주문 처리 중':
      return 'text-yellow-600 font-semibold';
    default:
      return 'text-gray-500';
  }
};

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
            productName: "에어팟 프로 2세대",
            quantity: 1,
            price: 329000,
            status: "주문 처리 중",
            productImage: "/images/3.jpg",
            details: {
              orderNumber: "20250916-123456",
              orderDate: "2025-09-16",
              paymentMethod: "신용카드",
              shippingAddress: "서울특별시 강남구 테헤란로 123",
            }
          },
          {
            id: 2,
            productName: "USB-C 케이블",
            quantity: 2,
            price: 25000,
            status: "배송 중", 
            productImage: "/images/4.jpg",
            details: {
              orderNumber: "20250915-789012",
              orderDate: "2025-09-15",
              paymentMethod: "네이버페이",
              shippingAddress: "경기도 성남시 분당구 판교역로 1",
              trackingNumber: "CJ대한통운 1234-5678-9012"
            }
          },
          {
            id: 3,
            productName: "맥북 에어 M3",
            quantity: 1,
            price: 1590000,
            status: "배송 완료", 
            productImage: "/images/5.jpg",
            details: {
              orderNumber: "20250910-345678",
              orderDate: "2025-09-10",
              paymentMethod: "카카오페이",
              shippingAddress: "부산광역시 해운대구 APEC로 55",
              trackingNumber: "우체국택배 9876-5432-1098"
            }
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
    setOrders(orders.filter(order => order.id !== orderToCancelId));
    setExpandedOrderId(null);
    setShowCancelConfirm(false);
    setMessage("주문이 취소되었습니다.");
    setOrderToCancelId(null);
  };

  const handleCancelConfirmation = () => {
    setShowCancelConfirm(false);
    setOrderToCancelId(null);
  };

  const trackingUrls = {
    'CJ대한통운': 'https://www.cjlogistics.com/ko/tool/parcel/tracking-detail?parcelId=',
    '우체국택배': 'https://service.epost.go.kr/trace.RetrieveRegiPrclDeliv.comm?sid1=',
  };

  const handleTrackingClick = (trackingNumberWithCarrier) => {
    const [carrier, number] = trackingNumberWithCarrier.split(' ');
    const baseUrl = trackingUrls[carrier];

    if (baseUrl) {
      window.open(`${baseUrl}${number}`, 'tracking_popup', 'width=800,height=600,scrollbars=yes');
    } else {
      alert("해당 택배사의 배송조회 URL을 찾을 수 없습니다.");
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
          <p className="font-semibold text-lg text-red-700 mb-4">정말 주문을 취소하시겠습니까?</p>
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
                <div className="flex items-center space-x-4">
                  <img 
                    src={order.productImage} 
                    alt={order.productName} 
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-lg">{order.productName}</span>
                      <span className={`text-sm ${getStatusStyles(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <p>수량: {order.quantity}개</p>
                      <p>가격: {order.price.toLocaleString()}원</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center space-x-2">
                    {order.status === '주문 처리 중' && (
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
                      {expandedOrderId === order.id ? '닫기' : '상세'}
                    </button>
                  </div>
                </div>
                
                {expandedOrderId === order.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                    <p><strong>주문번호:</strong> {order.details.orderNumber}</p>
                    <p><strong>주문일자:</strong> {order.details.orderDate}</p>
                    <p><strong>결제 방법:</strong> {order.details.paymentMethod}</p>
                    <p><strong>배송 주소:</strong> {order.details.shippingAddress}</p>
                    {order.details.trackingNumber && (
                      <div className="flex items-center space-x-2">
                        <p><strong>운송장 번호:</strong> {order.details.trackingNumber}</p>
                        <button
                          className="px-2 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                          onClick={() => handleTrackingClick(order.details.trackingNumber)}
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