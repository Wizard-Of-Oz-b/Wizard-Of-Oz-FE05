import { setToken } from "../../../../lib/auth";
import api from "../../../../lib/axios";

export async function registerUser(payload) {
  // payload: { email, password, nickname, phone_number, address }
  const res = await api.post("/api/v1/auth/register", payload);
  return res.data;
}
export async function loginUser({ email, password }) {
  const res = await api.post("/api/v1/auth/login", { email, password });
  const { access, refresh } = res.data || {};
  if (access || refresh) setToken({ access, refresh });
  return res.data;
}