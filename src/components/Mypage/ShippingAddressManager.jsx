import { useState } from "react";

const initialAddresses = [
  {
    id: 1,
    recipient: "김민지",
    phoneNumber: "010-1234-5678",
    zipCode: "12345",
    address: "서울특별시 강남구 테헤란로 123",
    detailedAddress: "ABC빌딩 10층",
    isDefault: true,
  },
  {
    id: 2,
    recipient: "박서준",
    phoneNumber: "010-9876-5432",
    zipCode: "54321",
    address: "경기도 성남시 분당구 판교역로 1",
    detailedAddress: "판교테크노밸리",
    isDefault: false,
  },
];

export default function ShippingAddressManager() {
  const [shippingAddresses, setShippingAddresses] = useState(initialAddresses);
  const [addMessage, setAddMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [newRecipient, setNewRecipient] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newZipCode, setNewZipCode] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newDetailedAddress, setNewDetailedAddress] = useState("");
  const [isNewAddressDefault, setIsNewAddressDefault] = useState(false);

  const handleOpenPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        let fullAddress = data.roadAddress;
        let extraAddress = '';

        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddress += data.bname;
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddress += (extraAddress !== '' ? ', ' + data.buildingName : data.buildingName);
        }
        if (extraAddress !== '') {
          fullAddress += ' (' + extraAddress + ')';
        }

        setNewZipCode(data.zonecode);
        setNewAddress(fullAddress);
        
        document.getElementById('newDetailedAddress').focus();
      }
    }).open();
  };

  const handleAddAddress = () => {
    if (!newRecipient || !newAddress || !newZipCode) {
      setAddMessage("받는 사람, 주소, 우편번호는 필수 입력 항목입니다.");
      return;
    }

    setAddMessage("");

    if (isNewAddressDefault) {
      const updatedAddresses = shippingAddresses.map(addr => ({ ...addr, isDefault: false }));
      setShippingAddresses(updatedAddresses);
    }

    const newAddressItem = {
      id: Date.now(),
      recipient: newRecipient,
      phoneNumber: newPhoneNumber,
      zipCode: newZipCode,
      address: newAddress,
      detailedAddress: newDetailedAddress,
      isDefault: isNewAddressDefault,
    };

    setShippingAddresses(prevAddresses => [...prevAddresses, newAddressItem]);

    setNewRecipient("");
    setNewPhoneNumber("");
    setNewZipCode("");
    setNewAddress("");
    setNewDetailedAddress("");
    setIsNewAddressDefault(false);
    
    setAddMessage("새로운 배송지가 추가되었습니다.");
  };

  const handleDeleteAddress = (id) => {
    setDeletingId(id);
  };

  const handleConfirmDelete = () => {
    const updatedAddresses = shippingAddresses.filter(addr => addr.id !== deletingId);
    setShippingAddresses(updatedAddresses);
    setDeletingId(null);
    setAddMessage("배송지가 삭제되었습니다.");
  };

  const handleCancelDelete = () => {
    setDeletingId(null);
  };

  const handleSetDefault = (id) => {
    const updatedAddresses = shippingAddresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id ? true : false,
    }));
    setShippingAddresses(updatedAddresses);
  };

  const defaultAddress = shippingAddresses.find(addr => addr.isDefault);
  const otherAddresses = shippingAddresses.filter(addr => !addr.isDefault);

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow">
      <h3 className="text-2xl font-semibold"></h3>

      {addMessage && (
        <div className={`p-3 rounded-lg ${addMessage.includes("추가되었습니다") || addMessage.includes("삭제되었습니다") ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {addMessage}
        </div>
      )}
      
      {defaultAddress && (
        <div className="p-6 border border-blue-500 bg-blue-50 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-lg text-blue-700">기본 배송지</span>
            <span className="text-xs text-blue-500 font-medium">기본 주소</span>
          </div>
          <p className="font-medium">{defaultAddress.recipient} ({defaultAddress.phoneNumber})</p>
          <p className="text-gray-600">{defaultAddress.zipCode} {defaultAddress.address} {defaultAddress.detailedAddress}</p>
        </div>
      )}

      {otherAddresses.length > 0 && (
        <div className="space-y-4">
          {otherAddresses.map((addr) => (
            <div key={addr.id} className="p-4 border rounded-lg relative">
              <p className="font-medium">{addr.recipient} ({addr.phoneNumber})</p>
              <p className="text-gray-600">{addr.zipCode} {addr.address} {addr.detailedAddress}</p>
              
              {deletingId === addr.id ? (
                <div className="flex justify-end mt-2 space-x-2">
                  <span className="text-sm text-red-600">정말로 삭제하시겠습니까?</span>
                  <button
                    className="px-3 py-1 text-sm rounded-lg text-red-500 border border-red-300 hover:bg-red-50 transition"
                    onClick={handleConfirmDelete}
                  >
                    확인
                  </button>
                  <button
                    className="px-3 py-1 text-sm rounded-lg text-gray-500 border border-gray-300 hover:bg-gray-100 transition"
                    onClick={handleCancelDelete}
                  >
                    취소
                  </button>
                </div>
              ) : (
                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    className="px-3 py-1 text-sm rounded-lg text-gray-500 border border-gray-300 hover:bg-gray-100 transition"
                    onClick={() => handleSetDefault(addr.id)}
                  >
                    기본 배송지로 설정
                  </button>
                  <button
                    className="px-3 py-1 text-sm rounded-lg text-red-500 border border-red-300 hover:bg-red-50 transition"
                    onClick={() => handleDeleteAddress(addr.id)}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-6 p-6 bg-gray-50 rounded-xl shadow-inner">
        <h4 className="text-xl font-semibold">새로운 배송지 추가</h4>
        
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 font-medium">받는 사람</label>
            <input
              type="text"
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newRecipient}
              onChange={(e) => setNewRecipient(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 font-medium">연락처</label>
            <input
              type="text"
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPhoneNumber}
              onChange={(e) => setNewPhoneNumber(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 font-medium">주소</label>
            <div className="flex space-x-2">
              <input
                type="text"
                className="px-4 py-2 w-28 border rounded-lg bg-gray-100 cursor-not-allowed"
                placeholder="우편번호"
                value={newZipCode}
                readOnly
              />
              <button
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                onClick={handleOpenPostcode}
              >
                주소 검색
              </button>
            </div>
          </div>
          <input
            type="text"
            className="px-4 py-2 w-full border rounded-lg bg-gray-100 cursor-not-allowed"
            placeholder="기본 주소"
            value={newAddress}
            readOnly
          />
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 font-medium">상세 주소</label>
            <input
              type="text"
              id="newDetailedAddress"
              className="px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="상세 주소 (예: 101동 1004호)"
              value={newDetailedAddress}
              onChange={(e) => setNewDetailedAddress(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isNewAddressDefault"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={isNewAddressDefault}
              onChange={(e) => setIsNewAddressDefault(e.target.checked)}
            />
            <label htmlFor="isNewAddressDefault" className="text-gray-600 font-medium">기본 배송지로 설정</label>
          </div>
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <button
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            onClick={() => {
              setNewRecipient("");
              setNewPhoneNumber("");
              setNewZipCode("");
              setNewAddress("");
              setNewDetailedAddress("");
              setIsNewAddressDefault(false);
              setAddMessage("");
            }}
          >
            취소
          </button>
          <button
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            onClick={handleAddAddress}
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}