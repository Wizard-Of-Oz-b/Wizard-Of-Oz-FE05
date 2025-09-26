import api from "../../../../lib/axios";

const ADMIN_API_BASE_RAW = import.meta?.env?.VITE_ADMIN_API_BASE ?? "/v1/admin";

const join = (base, tail = "") => {
  const b = (api.defaults.baseURL || "").replace(/\/+$/, "");
  let p = `${(base || "").replace(/\/+$/, "")}${tail}`;
  if (b.endsWith("/api") && p.startsWith("/api/")) p = p.replace(/^\/api\//, "/");
  return p;
};

export function normalizeCategory(c) {
  return {
    id: c.id,
    name: c.name,
    parent: c.parent ?? null,
    level: c.level, 
    path: c.path ?? "",
    children_count: c.children_count ?? 0,
    created_at: c.created_at ?? "",
    updated_at: c.updated_at ?? "",
  };
}

/** 목록 조회 */
export async function fetchCategories(params = {}) {
  const { level, parent, search, ordering } = params;
  const res = await api.get(join(ADMIN_API_BASE_RAW, "/categories/"), {
    params: {
      level: level || undefined,
      parent: parent || undefined,
      search: search || undefined,
      ordering: ordering || undefined,
    },
  });
  const raw = Array.isArray(res?.data) ? res.data : [];
  return raw.map(normalizeCategory);
}

/** 단건 조회 */
export async function fetchCategory(id) {
  const { data } = await api.get(join(ADMIN_API_BASE_RAW, `/categories/${id}/`));
  return normalizeCategory(data);
}

/** 생성 */
export async function createCategory({ name, parent = null }) {
  const body = { name, parent };
  const { data } = await api.post(join(ADMIN_API_BASE_RAW, "/categories/"), body);
  return normalizeCategory(data);
}

export async function updateCategory(id, { name, parent = null }) {
  const body = { name, parent };
  const { data } = await api.patch(join(ADMIN_API_BASE_RAW, `/categories/${id}/`), body);
  return normalizeCategory(data);
}

export async function removeCategory(id) {
  return api.delete(join(ADMIN_API_BASE_RAW, `/categories/${id}/`));
}
