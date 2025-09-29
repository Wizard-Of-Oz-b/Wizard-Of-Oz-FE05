import api from "../../../../lib/axios";

// 배송지 목록
export const getAddresses = () => api.get("/api/v1/users/me/addresses/");

// 배송지 추가
export const addAddress = (address) =>
  api.post("/api/v1/users/me/addresses/", address);

// 배송지 수정
export const updateAddress = (id, address) =>
  api.put(`/api/v1/users/me/addresses/${id}/`, address);

// 배송지 삭제
export const deleteAddress = (id) =>
  api.delete(`/api/v1/users/me/addresses/${id}/`);

// 기본 배송지 설정
export const setDefaultAddress = (id) =>
  api.post(`/api/v1/users/me/addresses/${id}/set-default/`);
