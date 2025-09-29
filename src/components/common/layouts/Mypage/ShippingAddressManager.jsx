import React, { useState, useEffect } from "react";
import {
  addMyAddress,
  deleteMyAddress,
  setMyDefaultAddress,
  getMyAddresses,
} from "../../api/Mypage/address.user";

export default function ShippingAddressManager() {
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [newRecipient, setNewRecipient] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newZipCode, setNewZipCode] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newDetailedAddress, setNewDetailedAddress] = useState("");
  const [isNewAddressDefault, setIsNewAddressDefault] = useState(false);
  const [message, setMessage] = useState("");
  const [showPostcodeModal, setShowPostcodeModal] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    try {
      const list = await getMyAddresses();
      setShippingAddresses(list);
    } catch (e) {
      setMessage("주소 불러오기에 실패하였습니다.")
    }
  }

  const handleAddAddress = async () => {
    if (!newRecipient || !newZipCode || !newAddress) {
      setMessage("받는 사람, 주소, 우편번호는 필수 입력 항목입니다.");
      return;
    }
    try {
      await addMyAddress({
        recipient: newRecipient,
        phone: newPhoneNumber,
        postcode: newZipCode,
        address1: newAddress,
        address2: newDetailedAddress,
        is_default: isNewAddressDefault,
        is_active: true,
      });
      await loadAddresses();
      setMessage("새로운 배송지가 추가되었습니다.");
      setNewRecipient("");
      setNewPhoneNumber("");
      setNewZipCode("");
      setNewAddress("");
      setNewDetailedAddress("");
      setIsNewAddressDefault(false);
    } catch (err) {
      console.error("배송지 추가 실패", err);
      setMessage("배송지 추가 실패");
    }
  };

  const handleDelete = async (address_id) => {
    try {
      await deleteMyAddress(address_id);
      await loadAddresses();
      setMessage("배송지가 삭제되었습니다.");
    } catch (err) {
      console.error("배송지 삭제 실패", err);
      setMessage("배송지 삭제 실패");
    }
  };

  const handleSetDefault = async (address_id) => {
    try {
      await setMyDefaultAddress(address_id);
      await loadAddresses();
      setMessage("기본 배송지가 변경되었습니다.");
    } catch (err) {
      console.error("기본 배송지 변경 실패", err);
      setMessage("기본 배송지 변경 실패");
    }
  };

  const defaultAddress = shippingAddresses.find((a) => a.is_default);
  const otherAddresses = shippingAddresses.filter((a) => !a.is_default);

  // 주소검색 관련
  const handleEmbedPostcode = () => {
    if (window.daum && window.daum.Postcode) {
      setShowPostcodeModal(true);
      setTimeout(() => {
        new window.daum.Postcode({
          oncomplete: function (data) {
            let fullAddress = data.roadAddress;
            let extraAddress = "";

            if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
              extraAddress += data.bname;
            }
            if (data.buildingName !== "" && data.apartment === "Y") {
              extraAddress +=
                extraAddress !== "" ? ", " + data.buildingName : data.buildingName;
            }
            if (extraAddress !== "") {
              fullAddress += " (" + extraAddress + ")";
            }

            setNewZipCode(data.zonecode);
            setNewAddress(fullAddress);
            setShowPostcodeModal(false);
            document.getElementById("newDetailedAddress").focus();
          },
          width: "100%",
          height: "100%",
        }).embed(document.getElementById("postcode-container"));
      }, 10);
    } else {
      alert("다음 우편번호 서비스가 로드되지 않았습니다.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow space-y-6">
      <h3 className="text-2xl font-semibold">배송지 관리</h3>

      {message && (
        <p className="p-3 rounded bg-gray-100 text-gray-700">{message}</p>
      )}

      {defaultAddress && (
        <div className="p-4 border border-blue-500 bg-blue-50 rounded">
          <p className="font-bold text-blue-700">기본 배송지</p>
          <p>
            {defaultAddress.recipient} ({defaultAddress.phone})
          </p>
          <p>
            {defaultAddress.postcode} {defaultAddress.address1}{" "}
            {defaultAddress.address2}
          </p>
        </div>
      )}

      {otherAddresses.map((addr) => (
        <div key={addr.address_id} className="p-4 border rounded">
          <p>
            {addr.recipient} ({addr.phone})
          </p>
          <p>
            {addr.postcode} {addr.address1} {addr.address2}
          </p>
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => handleSetDefault(addr.address_id)}
              className="px-3 py-1 border rounded text-sm"
            >
              기본으로 설정
            </button>
            <button
              onClick={() => handleDelete(addr.address_id)}
              className="px-3 py-1 border rounded text-sm text-red-600"
            >
              삭제
            </button>
          </div>
        </div>
      ))}

      <div className="p-4 border rounded bg-gray-50 space-y-2">
        <h4 className="font-semibold">새 배송지 추가</h4>
        <input
          placeholder="받는 사람"
          value={newRecipient}
          onChange={(e) => setNewRecipient(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          placeholder="연락처"
          value={newPhoneNumber}
          onChange={(e) => setNewPhoneNumber(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <div className="flex space-x-2">
          <input
            placeholder="우편번호"
            value={newZipCode}
            readOnly
            className="border p-2 rounded w-28 bg-gray-100 cursor-not-allowed"
          />
          <button
            onClick={handleEmbedPostcode}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            주소 검색
          </button>
        </div>
        <input
          placeholder="기본 주소"
          value={newAddress}
          readOnly
          className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
        />
        <input
          placeholder="상세 주소"
          value={newDetailedAddress}
          onChange={(e) => setNewDetailedAddress(e.target.value)}
          className="border p-2 rounded w-full"
          id="newDetailedAddress"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isNewAddressDefault}
            onChange={(e) => setIsNewAddressDefault(e.target.checked)}
          />
          <span>기본 배송지로 설정</span>
        </label>
        <button
          onClick={handleAddAddress}
          className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          추가
        </button>
      </div>

      {showPostcodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-3xl h-[550px] bg-white rounded-lg shadow-2xl p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h5 className="text-lg font-semibold">주소 검색</h5>
              <button
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                onClick={() => setShowPostcodeModal(false)}
              >
                &times;
              </button>
            </div>
            <div id="postcode-container" className="flex-grow min-h-0"></div>
          </div>
        </div>
      )}
    </div>
  );
}