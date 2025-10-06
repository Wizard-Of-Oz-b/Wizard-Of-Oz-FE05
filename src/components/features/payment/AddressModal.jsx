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

  const daumStyle = {
    border: '1px'
  }
  return (
    <div className="fixed inset-0 w-full h-full backdrop-blur-xs flex justify-center items-center z-50">
      <div className="w-100 border" ref={modalRef}>
        <DaumPostcodeEmbed 
        onComplete={handleComplete}
        autoClose={true}
        style={daumStyle} 
        />
      </div>
    </div>
  );
}
