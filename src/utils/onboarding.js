// 소셜 로그인 시 배송지목록이 없을때 리다이렉션시키기
import api from "../lib/axios";

export async function fetchAddressCount() {
  try {
    const { data } = await api.get("/api/v1/users/me/addresses/");
    if (Array.isArray(data)) return data.length;
    return 0;
  } catch {
    return 0;
  }
}

export function firstSocialVisitKey(userId) {
  return `first_social_visit:${userId}`;
}
