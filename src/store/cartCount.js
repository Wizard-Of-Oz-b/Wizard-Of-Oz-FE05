// 장바구니에 담겨있는 상품이 몇개인지.....
// bottle-gwon님의 useCart.js를 활용하여 제작하였습니다.
import { create } from "zustand";

export const useCartCount = create((set, get) => ({
  count: 0,
  set: (n) => set({ count: Math.max(0, Number(n) || 0) }),
  inc: (d = 1) => set((s) => ({ count: Math.max(0, s.count + (Number(d) || 0)), })), 
  dec: (d = 1) => set((s) => ({ count: Math.max(0, s.count - (Number(d) || 0)), })),
  reset: () => set({ count: 0 }),
  get: () => get().count,
}));
