import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
const CART_KEY = "local_cart_v1";

const CART = {
  list: "/v1/carts/me/",
  add: "/v1/carts/items/",
  item: (id) => `/v1/carts/items/${id}/`,
  updateQuantity: (id) => `/v1/carts/items/${id}/quantity/`,
  updateItem: (id) => `/v1/carts/items/${id}/update/`,
  removeByProduct: (productId) => `/v1/carts/items/by-product/${productId}/`,
  clear: "/v1/carts/clear/",
};

// ---------- Local Storage helpers ----------
function loadLocal() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveLocal(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

// 동일 상품(옵션 포함) 병합용 키
function itemKey({ product_id, options }) {
  return `${product_id}::${JSON.stringify(options || {})}`;
}

// ---------- 서버/로컬 공용 fetch ----------
async function fetchCart() {
  try {
    const { data } = await api.get(CART.list);
    // 서버 응답 형태에 맞게 items 꺼내기
    return Array.isArray(data) ? data : (data.items ?? data.results ?? []);
  } catch (e) {
    // 서버 미구현 또는 404면 로컬 폴백
    if ([404, 400, 501].includes(e?.response?.status)) {
      return loadLocal();
    }
    throw e;
  }
}

export function useCart() {
  const qc = useQueryClient();

  // 목록
  const { data: items = [], isLoading, isError, error } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    staleTime: 60_000,
  });

  // 합계/개수
  const totalCount = items.reduce((acc, it) => acc + (it.quantity ?? 1), 0);
  const totalPrice = items.reduce((acc, it) => acc + (it.price ?? 0) * (it.quantity ?? 1), 0);

  // ---------- 공용 낙관적 setter ----------
  const setOptimistic = (updater) => {
    qc.setQueryData(["cart"], (prev = []) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      // 로컬 스토리지에도 동기화 (서버 폴백 대비)
      saveLocal(next);
      return next;
    });
  };

  // ---------- Add Item ----------
  // 사용법: addItem({ product_id, quantity, options }, { title, price, image })
  const addItem = useMutation({
    mutationFn: async (vars) => {
      const { payload } = normalize(vars);
      // 서버 시도
      try {
        const { data } = await api.post(CART.add, payload);
        return Array.isArray(data) ? data[0] : (data.item ?? data);
      } catch (e) {
        // 서버 미구현이면 로컬 추가
        if ([404, 400, 501].includes(e?.response?.status)) {
          const curr = loadLocal();
          const k = itemKey(payload);
          const exist = curr.find((c) => itemKey(c) === k);
          if (exist) {
            exist.quantity = (exist.quantity ?? 1) + (payload.quantity ?? 1);
            saveLocal([...curr]);
            return exist;
          }
          const localItem = {
            id: `_local_${Date.now()}`,
            ...payload,
          };
          saveLocal([localItem, ...curr]);
          return localItem;
        }
        throw e;
      }
    },
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: ["cart"] });
      const prev = qc.getQueryData(["cart"]);
      const { payload, view } = normalize(vars);

      // 낙관적 반영 (같은 상품/옵션이면 수량만 +)
      setOptimistic((curr) => {
        const k = itemKey(payload);
        const idx = curr.findIndex((c) => itemKey(c) === k);
        if (idx >= 0) {
          const copy = [...curr];
          copy[idx] = {
            ...copy[idx],
            quantity: (copy[idx].quantity ?? 1) + (payload.quantity ?? 1),
          };
          return copy;
        }
        // 새로운 아이템 낙관적 추가 (화면 표시용 view 필드 포함)
        const optimistic = {
          id: `_tmp_${Date.now()}`,
          product_id: payload.product_id,
          quantity: payload.quantity ?? 1,
          options: payload.options ?? {},
          title: view?.title,
          price: view?.price,
          image: view?.image,
        };
        return [optimistic, ...curr];
      });

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["cart"], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // ---------- Add Many ----------
  // 사용: addMany([{ payload, view }, ...])
  const addMany = useMutation({
    mutationFn: async (vars) => {
      const arr = Array.isArray(vars) ? vars : [];
      try {
        // 서버가 일괄 추가를 지원한다면(예: /items/bulk/) 거기로 보내고,
        // 없다면 순차 호출
        if (false) {
          // await api.post('/items/bulk/', {items: arr.map(v=>v.payload)})
        }
        const results = [];
        for (const v of arr) {
          const { payload } = normalize(v);
          const { data } = await api.post(CART.add, payload);
          results.push(Array.isArray(data) ? data[0] : (data.item ?? data));
        }
        return results;
      } catch (e) {
        if ([404, 400, 501].includes(e?.response?.status)) {
          const curr = loadLocal();
          const next = [...curr];
          for (const v of arr) {
            const { payload } = normalize(v);
            const k = itemKey(payload);
            const exist = next.find((c) => itemKey(c) === k);
            if (exist) {
              exist.quantity = (exist.quantity ?? 1) + (payload.quantity ?? 1);
            } else {
              next.unshift({ id: `_local_${Date.now()}_${Math.random()}`, ...payload });
            }
          }
          saveLocal(next);
          return next;
        }
        throw e;
      }
    },
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: ["cart"] });
      const prev = qc.getQueryData(["cart"]);
      const arr = Array.isArray(vars) ? vars : [];
      setOptimistic((curr) => {
        let next = [...curr];
        for (const v of arr) {
          const { payload, view } = normalize(v);
          const k = itemKey(payload);
          const idx = next.findIndex((c) => itemKey(c) === k);
          if (idx >= 0) {
            next[idx] = {
              ...next[idx],
              quantity: (next[idx].quantity ?? 1) + (payload.quantity ?? 1),
            };
          } else {
            next = [
              {
                id: `_tmp_${Date.now()}_${Math.random()}`,
                product_id: payload.product_id,
                quantity: payload.quantity ?? 1,
                options: payload.options ?? {},
                title: view?.title,
                price: view?.price,
                image: view?.image,
              },
              ...next,
            ];
          }
        }
        return next;
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["cart"], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // ---------- Update Qty ----------
  const updateQty = useMutation({
    mutationFn: async ({ cart_item_id, quantity }) => {
      try {
        const { data } = await api.patch(CART.item(cart_item_id), { quantity });
        return data;
      } catch (e) {
        if ([404, 400, 501].includes(e?.response?.status)) {
          const curr = loadLocal();
          const idx = curr.findIndex((c) => c.id === cart_item_id);
          if (idx >= 0) {
            curr[idx].quantity = quantity;
            saveLocal([...curr]);
          }
          return null;
        }
        throw e;
      }
    },
    onMutate: async ({ cart_item_id, quantity }) => {
      await qc.cancelQueries({ queryKey: ["cart"] });
      const prev = qc.getQueryData(["cart"]);
      setOptimistic((curr) =>
        curr.map((c) => (c.id === cart_item_id ? { ...c, quantity } : c))
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["cart"], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });

  // ---------- Remove ----------
  const removeItem = useMutation({
    mutationFn: async ({ cart_item_id }) => {
      try {
        await api.delete(CART.item(cart_item_id));
        return true;
      } catch (e) {
        if ([404, 400, 501].includes(e?.response?.status)) {
          // 로컬에서 제거
          const curr = loadLocal().filter((c) => c.id !== cart_item_id);
          saveLocal(curr);
          return true;
        }
        throw e;
      }
    },
    onMutate: async ({ cart_item_id }) => {
      await qc.cancelQueries({ queryKey: ["cart"] });
      const prev = qc.getQueryData(["cart"]);
      setOptimistic((curr) => curr.filter((c) => c.id !== cart_item_id));
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["cart"], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });

  // ---------- Clear ----------
  const clear = useMutation({
    mutationFn: async () => {
      try {
        await api.post(CART.clear);
        return true;
      } catch (e) {
        if ([404, 400, 501].includes(e?.response?.status)) {
          saveLocal([]);
          return true;
        }
        throw e;
      }
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["cart"] });
      const prev = qc.getQueryData(["cart"]);
      setOptimistic([]);
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["cart"], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });

  return {
    items,
    totalCount,
    totalPrice,
    isLoading,
    isError,
    error,

    addItem: (payload, view) => addItem.mutateAsync({ payload, view }),
    addMany: (arr) => addMany.mutateAsync(arr), // [{payload, view}, ...]
    updateQty: (cart_item_id, quantity) => updateQty.mutateAsync({ cart_item_id, quantity }),
    removeItem: (cart_item_id) => removeItem.mutateAsync({ cart_item_id }),
    clear: () => clear.mutateAsync(),
  };
}

// vars가 (payload, view) 두 개로 올 수도 있고, {payload, view}로 올 수도 있어 정규화
function normalize(vars) {
  if (vars?.payload) return vars;
  // (payload, view) 형태일 때
  if (Array.isArray(vars)) {
    const [payload, view] = vars;
    return { payload, view };
  }
  return { payload: vars, view: undefined };
}
