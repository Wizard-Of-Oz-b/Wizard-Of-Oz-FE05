import api from "../../../../lib/axios";

export async function fetchMyAddresses() {
  const { data } = await api.get("/v1/users/me/addresses/");
  return Array.isArray(data) ? data : [];
}

export async function fetchMyAddress(addressId) {
  const { data } = await api.get(`/v1/users/me/addresses/${addressId}/`);
  return data;
}
