import api from "../../../../lib/axios";
import { useWishlistCount } from "../../../../store/wishlistCount";

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
export async function moveWishlistToCart(
  wishlist_id,
  { quantity = 1, remove_from_wishlist = true } = {}
) {
  const res = await api.post(
    `/v1/wishlist/items/${wishlist_id}/move-to-cart/`,
    { quantity, remove_from_wishlist }
  );
  return adaptCartItemFromMove(res.data);
}

/** wishlist row */
export function adaptWishlistItem(row) {
  const optionsObj =
    row?.options && typeof row.options === "object"
      ? row.options
      : safeParseJSON(row?.options);

  return {
    id: row.wishlist_id,
    productId: row.product_id,
    title: row.product_name,
    image: pickImage(row),
    price: Number(row.price ?? 0),
    optionKey: row.option_key ?? "",
    options: optionsObj,
    optionsText: formatOptionsForDisplay(optionsObj),
    createdAt: row.created_at,
  };
}

/** move-to-cart */
export function adaptCartItemFromMove(row) {
  const optionsObj = safeParseJSON(row?.options);
  return {
    id: row.id,
    productId: row.product,
    title: row.product_name,
    image: pickImage(row),
    unitPrice: Number(row.unit_price ?? 0),
    quantity: Number(row.quantity ?? 1),
    optionKey: row.option_key ?? "",
    options: optionsObj,
    optionsText: formatOptionsForDisplay(optionsObj),
    addedAt: row.added_at,
  };
}

/** 이미지 선택 유틸 */
function pickImage(row) {
  const v = row?.image_url ?? row?.primary_image ?? row?.images?.[0];
  if (!v) return "/no-image.png";
  if (typeof v === "string") return v || "/no-image.png";
  if (typeof v === "object") return v?.url || "/no-image.png";
  return "/no-image.png";
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

/** 옵션 표시 포맷 */
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

export async function fetchWishlistCount() {
  const rows = await listWishlist();
  return Array.isArray(rows) ? rows.length : 0;
}