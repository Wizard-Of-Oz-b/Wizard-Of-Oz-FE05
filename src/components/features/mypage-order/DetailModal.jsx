import { useEffect, useRef } from "react";
import useOnClickOutside from "../../../hooks/payments/useOnclickOutside";
import OrderProductCard from "./OrderProductCard";
import { AnimatePresence, motion } from "framer-motion";

export default function DetailModal({ data, isOpen, onClose }) {
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

  // 열려 있지 않으면 아무것도 출력 안함
  if (!isOpen) {
    return;
  }
  console.log("open");
  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 w-full h-full bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 
        p-4"
      >
        <motion.div
          initial={{ y: 300, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -300, opacity: 0 }}
          ref={modalRef}
          className="bg-white rounded-lg shadow-lg w-full max-w-2xl flex flex-col"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200 shadow-md">
            <p className="font-bold text-xl">상품 상세보기</p>
            <button onClick={onClose} className="text-2xl font-bold cursor-pointer">
              &times;
            </button>
          </div>

          <div className="p-4 max-h-[60vh] overflow-y-auto mypage-detail-modal">
            {data && data.length > 0 ? (
              <div>
                {data.map((el) => (
                  <OrderProductCard
                    view="card"
                    key={el.order_id + el.product_name}
                    data={el}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                표시할 데이터가 없습니다.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
