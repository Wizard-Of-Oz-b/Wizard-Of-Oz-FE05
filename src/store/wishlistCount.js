import { create } from "zustand";

export const useWishlistCount = create((set) => ({
  count: 0,
  set: (n) => set({ count: Math.max(0, Number(n) || 0) }),
  inc: (d = 1) => set((s) => ({ count: s.count + (Number(d) || 0) })),
  dec: (d = 1) => set((s) => ({ count: Math.max(0, s.count - (Number(d) || 0)) })),
}));
