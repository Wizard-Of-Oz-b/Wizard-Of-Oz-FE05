// 식 정규화

export function normalizeId(row) {
  if (!row) return undefined;
  return row.id ?? row.product_id ?? row.pk ?? row["Product id"] ?? row["product id"];
}

export function normalizeProduct(row = {}) {
  const id = normalizeId(row);
  return {
    id,
    name: row.name ?? row.Name ?? "",
    price: row.price ?? row.Price ?? 0,
    category: row.category ?? row.Category ?? "-",
    is_active: row.is_active ?? row["Is active"] ?? false,
    created_at: row.created_at ?? row["Created at"] ?? null,
    image_url: row.image_url ?? row.thumbnail ?? null,
    sku: row.sku ?? row.SKU ?? row["sku id"] ?? undefined,
  };
}
