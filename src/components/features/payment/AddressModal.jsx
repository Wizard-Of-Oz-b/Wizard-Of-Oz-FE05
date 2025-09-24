import { useRef } from "react";
import DaumPostcodeEmbed from "react-daum-postcode";
import useOnClickOutside from "../../../hooks/payments/useOnclickOutside";

export default function AddressModal({ onClose, onSearch }) {
  const modalRef = useRef(null);
  useOnClickOutside(modalRef, onClose);
  const handleComplete = (data) => {
    console.log(data)
    onSearch({
      address : data.address,
      zoneCode : data.zonecode
    })
  };


  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex justify-center items-center z-50">
      <div className="w-100" ref={modalRef}>
        <DaumPostcodeEmbed 
        onComplete={handleComplete}
        autoClose={true} 
        />
      </div>
    </div>
  );
}
