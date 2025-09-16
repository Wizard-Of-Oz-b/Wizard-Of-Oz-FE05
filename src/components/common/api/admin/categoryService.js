import api from "../../../../lib/axios";

const SERVER_SUPPORTS_CATEGORY_CODE = false;

export function apiToUi(node) {
  if (!node) return null;
  const ui = {
    id: node.category_id,
    name: node.name,
    parentId: node.parent_id ?? null,
    categoryCode: node.category_code ?? undefined,
  };
  if (Array.isArray(node.children)) ui.children = node.children.map(apiToUi);
  return ui;
}

export function uiToApiDraft(model) {
  const draft = {
    name: model.name?.trim() ?? "",
    parent_id: model.parentId ?? null,
  };
  if (SERVER_SUPPORTS_CATEGORY_CODE && model.categoryCode != null) {
    draft.category_code = Number(model.categoryCode);
  }
  return draft;
}

export async function fetchCategories(params = { tree: true }) {
  const res = await api.get("/v1/categories/", { params });
  const data = Array.isArray(res?.data) ? res.data : [];
  return data.map(apiToUi);
}

export async function createCategory(model) {
  const res = await api.post("/v1/categories/", uiToApiDraft(model));
  return apiToUi(res?.data);
}

export async function updateCategory(id, model) {
  const res = await api.patch(`/v1/categories/${id}/`, uiToApiDraft(model));
  return apiToUi(res?.data);
}

export async function removeCategory(id) {
  return api.delete(`/v1/categories/${id}/`);
}
