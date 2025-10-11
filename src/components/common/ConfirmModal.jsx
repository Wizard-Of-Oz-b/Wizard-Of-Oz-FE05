import { useEffect, useRef } from "react";
import useOnClickOutside from "../../hooks/payments/useOnclickOutside";
import { AnimatePresence, motion } from "framer-motion";

//사용처 - 마이페이지, 장바구니 확인 창
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "확인",
  cancelText = "닫기",
}) {
  const modalRef = useRef(null);
  useOnClickOutside(modalRef, onClose); // 외부클릭 하면 닫을 수 있게

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    // cleanup 함수: 모달이 닫힐 때 body의 overflow 스타일을 원래대로 되돌림
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  //열린거 아니면 얼리 리턴
  if (!isOpen) {
    return;
  }
  console.log(title, "모달 테스트");
  return (
    <AnimatePresence>
      <div className="fixed inset-0 w-full h-full bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-md"
          ref={modalRef}
        >
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="mt-2 text-gray-600">{message}</p>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 space-y-2 space-y-reverse sm:space-y-0 rounded-b-lg">
            <button
              type="button"
              className="w-full sm:w-auto justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className="w-full sm:w-auto justify-center rounded-md border border-transparent px-4 py-2 bg-red-600 text-base font-medium text-white shadow-sm hover:bg-red-700"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
