export function normalizeId(row) {
  if (!row) return undefined;
  return (
    row.id ??
    row.uuid ??
    row.product_id ??
    row.pk ??
    row.ID ??
    row.Id ??
    row["Product id"] ??
    row["product id"]
  );
}

export function normalizeProduct(p = {}) {
  // id
  const id =
    p.id ??
    p.uuid ??
    p.product_id ??
    p.pk ??
    p.ID ??
    p.Id ??
    p["Product id"] ??
    p["product id"];

  // category (uuid 문자열로)
  let category =
    p.category ??
    p.category_id ??
    p.category_uuid ??
    p.categoryId ??
    p.Category ??
    null;

  let category_path =
    p.category_path ??
    p.category_full_name ??
    p.categoryFullName ??
    p.categoryPath ??
    null;

  if (category && typeof category === "object") {
    category_path =
      category_path ||
      category.path ||
      category.full_name ||
      category.fullName ||
      null;
    category =
      category.id ||
      category.uuid ||
      category.pk ||
      category.ID ||
      category.Id ||
      null;
  }

  return {
    id: id || null,
    name: p.name ?? p.Name ?? "",
    price: p.price ?? p.Price ?? 0,
    category: category || null,          // uuid 문자열
    category_path: category_path || null, // 경로 문자열(있으면 표시)
    is_active: !!(p.is_active ?? p.isActive),
    image_url: p.image_url ?? p.thumbnail ?? p.image ?? null,
    created_at: p.created_at ?? p.createdAt ?? null,
    updated_at: p.updated_at ?? p.updatedAt ?? null,
  };
}
