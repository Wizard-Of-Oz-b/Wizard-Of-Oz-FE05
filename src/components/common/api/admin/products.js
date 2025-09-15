const BASE = "/api/v1/products";

async function jsonOrThrow(res) {
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `HTTP ${res.status}`);
  }
  try { return await res.json(); } catch { return null; }
}

export async function listProducts({ q = "", category = "", page = 1, pageSize = 50 } = {}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  if (page) params.set("page", String(page));
  if (pageSize) params.set("page_size", String(pageSize));

  const url = params.toString() ? `${BASE}/?${params}` : `${BASE}/`;
  const res = await fetch(url, { credentials: "include" });
  return jsonOrThrow(res);
}

export async function createProduct(payload) {
  const res = await fetch(`${BASE}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  return jsonOrThrow(res);
}

export async function updateProduct(id, payload) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  return jsonOrThrow(res);
}

export async function deleteProduct(id) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return jsonOrThrow(res); 
}

export async function toggleAvailableAPI(id, is_available) {
  // 1) 전용 엔드포인트가 있으면: /{id}/toggle-available
  // const res = await fetch(`${BASE}/${id}/toggle-available`, { method: "POST", credentials: "include" });
  // return jsonOrThrow(res);

  // 2) 없다면 일반 업데이트로 플래그만 보냄
  return updateProduct(id, { is_available });
}
