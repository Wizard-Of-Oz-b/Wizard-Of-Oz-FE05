import api from "../../../../lib/axios";

// 리스트 (관리자용)
export async function listShipments({ page=1, size=20 } = {}) {
  const res = await api.get('/v1/shipments/', { params: { page, size } });
  return Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
}

// 상세 (공용)
export async function getShipment(id) {
  const res = await api.get(`/v1/shipments/${id}/`);
  return res.data;
}

// 등록 (운송장 연결) — 주문ID + 운송장번호 + 택배사/코드
export async function registerShipment({ purchase_id, tracking_number, carrier, carrier_code }) {
  const body = { purchase_id, tracking_number, carrier, carrier_code };
  const res = await api.post('/v1/shipments/register/', body);
  return res.data;
}

export async function syncShipment({ tracking_number, carrier, carrier_code, events, payload }) {
  const res = await api.post('/v1/shipments/sync/', {
    tracking_number, carrier, carrier_code, events, payload
  });
  return res.data;
}

// 배송 상태/라벨 유틸
export const SHIPMENT_STATUS_LABEL = {
  pending: '접수',
  in_transit: '이동중',
  out_for_delivery: '배송출발',
  delivered: '배송완료',
  canceled: '취소',
  returned: '반송',
};

export function fmtShipDate(d) {
  if (!d) return '-';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return '-';
  const mm = String(dt.getMonth()+1).padStart(2,'0');
  const dd = String(dt.getDate()).padStart(2,'0');
  return `${dt.getFullYear()}-${mm}-${dd}`;
}


export const normalizeShipmentStatus = (s) => {
  if (!s) return '';
  const key = String(s).trim().toLowerCase().replace(/\s+/g, '_');
  if (SHIPMENT_STATUS_LABEL[key]) return key;
  if (key === 'deliverd') return 'delivered';
  return key;
};