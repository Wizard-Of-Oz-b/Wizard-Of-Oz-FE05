import { create } from "zustand";

export const useToastStore = create((set, get) => ({
  toastList: [],
  addToastList: (message) => {
    // 중복 검사...
    const isAlreadyShown = get().toastList?.find((el) => el.message === message);
    if (isAlreadyShown) {
      return;
    }
    const id =  Math.random();
    const toast = { id, message };
    console.log(toast, "토스트");
    set((state) => {
      // 현재 toastList가 배열인지 확인
      const currentToasts = Array.isArray(state?.toastList) ? state?.toastList : [];
      return { toastList: [...currentToasts, toast] };
    });
    // 3초 뒤에 사라지도록 설정
    setTimeout(() => {
      set((state) => ({
        toastList: state.toasts?.filter((t) => t.id !== id),
      }));
    }, 3000);
  },
}));
