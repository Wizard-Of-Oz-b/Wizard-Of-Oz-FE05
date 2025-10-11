export const DEFAULT_STATUS = {
  name: "알 수 없음",
  style: "text-gray-500",
};

export const STATUS_MAP = {
  // 배송 상태
  delivered: {
    name: "배송 완료",
    style: "text-green-600 font-semibold",
  },
  in_transit: {
    name: "배송 중",
    style: "text-blue-500 font-semibold",
  },
  pending: {
    name: "배송 대기",
    style: "text-yellow-600 font-semibold",
  },
  // 주문 상태
  ready: {
    name: "결제 전",
    style: "text-yellow-600 font-semibold",
  },
  paid: {
    name: "결제 완료",
    style: "text-blue-500 font-semibold",
  },
  canceled: {
    name: "결제 취소",
    style: "text-red-500 font-semibold",
  },
};
