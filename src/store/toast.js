import { create } from "zustand";

export const useToastStore = create((set) => ({
  toastList: [],
  addToastList: (message) => {
    const id = Date.now();
    set((state) => ({
      toastList: [...state.toastList, {id, message}]
    }));
    // 1.5초 뒤에 사라지도록 설정
    setTimeout(() => {
      set((state)=> ({
        toastList: state.toasts.filter((t) => t.id !== id)
      }))
    }, 1500)
  },
}));
