import { useState } from "react";
import DaumPostcodeEmbed from "react-daum-postcode";

export default function AddressModal({ onClose, onSearch }) {
  
  const handleComplete = (data) => {

    console.log(data)
    console.log('heello')
    onSearch({
      address : data.address,
      zoneCode : data.zonecode
    })
  };


  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex justify-center items-center z-50">
      <div className="w-100">
        <DaumPostcodeEmbed 
        onComplete={handleComplete}
        autoClose={true} 
        />
      </div>
      <button onClick={onClose} className="text-2xl">
        &times;
      </button>
    </div>
  );
}
