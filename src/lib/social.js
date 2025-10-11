import api from "./axios";

/** 소셜 연동 해제 */
export async function unlinkSocial(provider) {
  if (!provider) throw new Error("provider is required");
  const url = `/v1/auth/social/${encodeURIComponent(provider)}/unlink/`;
  const { data } = await api.delete(url);
  return data;
}
