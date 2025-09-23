import api from "../../../../lib/axios";

/** 위시리스트 조회 */
export async function listWishlist({ ordering, search } = {}) {
  const res = await api.get("/v1/wishlist/items/", {
    params: { ordering, search },
  });
  return res.data;
}

/** 위시리스트 추가 */
export async function addWishlist({ product_id, option_key = "", options = "" }) {
  const res = await api.post("/v1/wishlist/items/", {
    product_id,
    option_key,
    options,
  });
  return res.data;
}

/** 위시리스트 항목 삭제 */
export async function removeWishlist(wishlist_id) {
  await api.delete(`/v1/wishlist/items/${wishlist_id}/`);
}

/** 위시리스트 → 장바구니 이동 */
export async function moveWishlistToCart(wishlist_id, {
  quantity = 1,
  remove_from_wishlist = true,
} = {}) {
  const res = await api.post(
    `/v1/wishlist/items/${wishlist_id}/move-to-cart/`,
    { quantity, remove_from_wishlist }
  );
  return res.data;
}

export function adaptWishlistItem(row) {
  const optionsObj =
    row?.options && typeof row.options === "object"
      ? row.options
      : safeParseJSON(row?.options); 

  return {
    id: row.wishlist_id,
    productId: row.product_id,
    title: row.product_name,
    image: row.primary_image?.url || row.images?.[0]?.url || "/no-image.png",
    price: Number(row.price ?? 0),
    optionKey: row.option_key ?? "",
    options: optionsObj, 
    optionsText: formatOptionsForDisplay(optionsObj), 
    createdAt: row.created_at,
  };
}

function safeParseJSON(v) {
  if (!v) return null;
  if (typeof v === "object") return v;
  try {
    return JSON.parse(v);
  } catch {
    if (typeof v === "string" && v.includes("=")) {
      const obj = {};
      v.split(";").forEach((pair) => {
        const [k, val] = pair.split("=").map((s) => s?.trim());
        if (k) obj[k] = val ?? "";
      });
      return obj;
    }
    return null;
  }
}

export function formatOptionsForDisplay(optionsObj) {
  if (!optionsObj || typeof optionsObj !== "object") return "-";

  const LABEL = {
    color: "색상",
    size: "사이즈",
  };

  const kvs = Object.entries(optionsObj).map(([k, v]) => {
    const keyLabel = LABEL[k] ?? k;
    const valueText =
      v && typeof v === "object"
        ? v.display ?? v.name ?? v.value ?? JSON.stringify(v)
        : String(v ?? "");
    return `${keyLabel}: ${valueText}`;
  });

  return kvs.join(" / ");
}
