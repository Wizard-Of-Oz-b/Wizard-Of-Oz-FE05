import { useRef } from "react";
import { termsText } from "../../../constants/terms";
import useOnClickOutside from "../../../hooks/payments/useOnclickOutside";

export default function TermsModal({ onClose, setAgree }) {
  const modalRef = useRef(null);
  useOnClickOutside(modalRef, onClose);
  const terms = termsText;

  const onClickAgree = () => {
    setAgree(true);
    onClose();
  };
  return (
    <div className="flex flex-col justify-center items-center fixed inset-0 w-full h-full backdrop-blur-xs z-50">
      <div
        className="flex flex-col border shadow-2xl rounded-lg py-3 items-center  w-full max-w-xl h-[600px] bg-white"
        ref={modalRef}
      >
        <div className="flex w-full justify-between items-center px-4 py-2 border-b border-gray-200 shadow-md">
          <h2 className="text-xl font-bold">배송 약관</h2>
          <button onClick={onClose} className="text-2xl font-bold">
            &times;
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-4 space-y-3 payment-address">
          {terms}
        </div>

        <div className="flex justify-center w-full p-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClickAgree}
            className="bg-black text-white px-6 py-2 rounded-lg cursor-pointer"
          >
            동의 합니다.
          </button>
        </div>
      </div>
    </div>
  );
}
