import { useEffect, useRef, useState } from "react";
import UserAddressCard from "./UserAddressCard";
import useOnClickOutside from "../../../hooks/payments/useOnclickOutside";

// 사용자의 주소리스틀 출력하고 선택할 수 있게한다.

// addressList 데이터를 받아서 선택 할 수 있게 한다. 선택은 id로 구분한다.
export default function UserAddressModal({
  isOpen,
  onClose,
  checkAddress,
  addressList,
  currentAddressId,
}) {
  const [select, setSelect] = useState(currentAddressId || null); //address_id 저장
  console.log(addressList, "주소오오옷");
  // Todo: is_active 인지 체크 할것
  // Todo: active인 주소리스트 출력
  const modalRef = useRef(null);
  useOnClickOutside(modalRef, onClose);

  // 외부 스크롤 방지 로직
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // 제대로 데이터가 넘오 오지 않으면 출력 안함
  if (!addressList || !onClose || !checkAddress) {
    return;
  }

  // 활성 중인것만 가져온다.
  const filterList = addressList.filter((addr) => addr.is_active === true);
  console.log(filterList, "필터");
  const handleCheckAddress = (addressId) => {
    setSelect(addressId);
  };

  const setShipAddress = () =>{
    if(!select){
      // 나중에 모달창으로 출력할것
      console.log('아무것도 선택하지 않았습니다.')
    }else{
      const resultAddress = filterList.find((el) => el.address_id === select)
      console.log(resultAddress, '결과')
      checkAddress(resultAddress);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center fixed inset-0 w-full h-full bg-black/50 z-50">
      <div
        className="flex flex-col rounded-2xl py-3 items-center gap-3 w-full max-w-xl h-[550px] bg-white"
        ref={modalRef}
      >
        <div className="flex w-full justify-between items-center p-4 border-b border-gray-400">
          <h2 className="text-xl font-bold">배송지 선택</h2>
          <button onClick={onClose} className="text-2xl">
            &times;
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-4 space-y-3">
          {filterList?.map((el) => (
            <UserAddressCard
              key={el.address_id}
              data={el}
              onSelect={handleCheckAddress}
              select={select}
            />
          ))}
        </div>

        <div className="flex justify-center w-full p-4 border-t border-gray-400">
          <button
            type="button"
            onClick={setShipAddress}
            className="bg-black text-white px-6 py-2 rounded-lg cursor-pointer"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
