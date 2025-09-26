import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";

const base = (api.defaults?.baseURL || "").replace(/\/+$/, "");
const PREFIX = base.endsWith("/api") ? "/v1" : "/api/v1";
const CART_BASE = `${PREFIX}/carts`;

const CART_QK = ["userCart"];

function parseOptionsString(str) {
  if (!str || typeof str !== "string") return null;
  const obj = {};
  str.split(";").forEach((pair) => {
    const [k, v] = pair.split("=").map((s) => s?.trim());
    if (k) obj[k] = v ?? "";
  });
  return Object.keys(obj).length ? obj : null;
}

async function getCartData() {
  try {
    const { data } = await api.get(`${CART_BASE}/me/`);
    return data;
  } catch (e) {
    const s = e?.response?.status;
    if (s === 400 || s === 401 || s === 403) {
      return { items: [], count: 0, total: 0 };
    }
    throw e;
  }
}

async function patchCartData({ id, updatedData }) {
  const { data } = await api.patch(`${CART_BASE}/items/${id}/`, updatedData);
  return data;
}

async function deleteCartItem({ productId, optionKey }) {
  const qs = `option_key=${encodeURIComponent(option_key ?? "")}`;
  const { data } = await api.post(
    `${CART_BASE}/items/by-product/${product_id}/`,
    { quantity },
  { params: { option_key } }
  );
  return data;
}

export function useCart(params) {
  return useQuery({
    queryKey: [...CART_QK, params],
    queryFn: getCartData,
    staleTime: 0,
  });
}

export function usePatchCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patchCartData,
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_QK }),
  });
}

export function useDeleteCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_QK }),
  });
}


export async function addCartItem({
  product_id,
  option_key,
  quantity = 1,
  options,
}) {
  if (!product_id) throw new Error("product_id required");

  const payload = {
    product: product_id,
    option_key: String(option_key ?? ""),
    quantity: Number.isFinite(quantity) ? quantity : 1,
  };
  if (options && typeof options === "object") payload.options = options;

  const { data } = await api.post(`${CART_BASE}/items/`, payload);
  return data;
}
