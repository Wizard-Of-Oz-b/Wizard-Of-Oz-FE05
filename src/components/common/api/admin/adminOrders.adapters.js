export function mapStatusToKorean(apiStatus) {
  switch (apiStatus) {
    case "ready": return "주문접수";
    case "paid": return "결제완료";
    case "preparing": return "상품준비";
    case "shipping": return "배송중";
    case "delivered": return "배송완료";
    case "cancel_requested": return "취소요청";
    case "canceled": return "취소완료";
    case "refund_requested": return "환불요청";
    case "refunded": return "환불완료";
    default: return "주문접수";
  }
}

export function mapKoreanToStatus(kor) {
  switch (kor) {
    case "주문접수": return "ready";
    case "결제완료": return "paid";
    case "상품준비": return "preparing";
    case "배송중": return "shipping";
    case "배송완료": return "delivered";
    case "취소요청": return "cancel_requested";
    case "취소완료": return "canceled";
    case "환불요청": return "refund_requested";
    case "환불완료": return "refunded";
    default: return "ready";
  }
}

// 서버 status로 request 유추 (서버가 별도 필드를 안 준 케이스)
function buildRequestFromStatus(row) {
  if (row?.status === "cancel_requested") {
    return { type: "cancel", reason: row?.request_reason || "" };
  }
  if (row?.status === "refund_requested") {
    return { type: "refund", reason: row?.request_reason || "" };
  }
  return null;
}

export function adaptAdminOrderHeader(row) {
  const id = row.purchase_id;
  const orderNo = row.pg_tid || String(id).split("-")[0];

  return {
    id,
    orderNo,
    customer: row.user_email || "(이메일 없음)",
    amount: Number(row.amount || 0),
    status: mapStatusToKorean(row.status),
    created_at: row.purchased_at,
    items: [],
    request: buildRequestFromStatus(row), 
    carrier: "",
    trackingNo: "",
    pg: row.pg || "",
    pg_tid: row.pg_tid || "",
  };
}

export function adaptOrderItems(items = []) {
  return items.map((it) => ({
    id: it.item_id,
    name: it.product_name,
    image_url: it.thumbnail_url || undefined,
    option: it.options || it.option_key || "",
    qty: Number(it.quantity || 0),
    price: Number(it.unit_price || 0),
    _meta: {
      order_id: it.order_id,
      product_id: it.product_id,
      sku: it.sku,
      option_key: it.option_key,
    },
  }));
}
