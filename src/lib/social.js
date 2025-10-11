import api from "./axios";

/** 내 소셜 연동 목록 가져오기 */
export async function fetchMySocialAccounts() {
  const { data } = await api.get("/v1/users/me/social-accounts/");
  return Array.isArray(data) ? data : [];
}

/** 소셜 연동 해제 */
export async function unlinkSocial(provider) {
  if (!provider) throw new Error("provider is required");
  const key = String(provider).toLowerCase();

  const list = await fetchMySocialAccounts();
  const target = list.find(
    (a) => String(a.provider).toLowerCase() === key
  );
  if (!target) {
    const err = new Error("해당 소셜 계정이 연동되어 있지 않습니다.");
    err.userMessage = "해당 소셜 계정이 연동되어 있지 않습니다.";
    throw err;
  }

  await api.delete(`/v1/users/me/social-accounts/${encodeURIComponent(target.id)}/`);
  return { ok: true, removed: target };
}
