import { useRef } from "react";
import useOnClickOutside from "../../../hooks/payments/useOnclickOutside";

export default function PaymentTerms({ onClose }) {
  const modalRef = useRef(null);
  useOnClickOutside(modalRef, onClose);

  return (
    <div ref={modalRef}>
      {/* 약관 내용 */}
      <div>
      </div>
      {/* 확인 */}
      <div 
      onClick={onClose}>
        확인
        </div>
    </div>
  )
}
