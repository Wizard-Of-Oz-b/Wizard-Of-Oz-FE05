import api from "../../../../lib/axios";

// 내 배송지 목록
export async function getMyAddresses() {
  const { data } = await api.get("/v1/users/me/addresses/");
  return Array.isArray(data) ? data : [];
}

// 내 배송지 단건 조회
export async function getMyAddress(addressId) {
  const { data } = await api.get(`/v1/users/me/addresses/${addressId}/`);
  return data;
}

// 배송지 추가
export async function addMyAddress(addr) {
  const body = {
    recipient: String(addr.recipient || "").trim(),
    phone: addr.phone ? String(addr.phone).trim() : "",
    postcode: String(addr.postcode || "").trim(),
    address1: String(addr.address1 || "").trim(),
    address2: addr.address2 ? String(addr.address2).trim() : "",
  };
  const { data } = await api.post("/v1/users/me/addresses/", body);
  return data;
}

// 배송지 수정
export async function updateMyAddress(addressId, body) {
  const { data } = await api.patch(`/v1/users/me/addresses/${addressId}/`, body);
  return data;
}

// 배송지 삭제
export async function deleteMyAddress(addressId) {
  await api.delete(`/v1/users/me/addresses/${addressId}/`);
}

// 기본 배송지 설정
export async function setMyDefaultAddress(addressId) {
  await api.post(`/v1/users/me/addresses/${addressId}/set-default/`);
}
