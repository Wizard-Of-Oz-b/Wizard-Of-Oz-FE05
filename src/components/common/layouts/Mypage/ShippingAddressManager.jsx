import React, { useState, useEffect } from "react";
import {
  addMyAddress,
  deleteMyAddress,
  setMyDefaultAddress,
  getMyAddresses,
} from "../../api/Mypage/address.user";
import {
  MapPin, Home, CheckCircle2, Star, Trash2, Plus, Search
} from "lucide-react";

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
  <div className="space-y-6">
    {/* 헤더 */}
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900">배송지 관리</h3>
        <p className="mt-1 text-sm text-neutral-600">기본 배송지와 추가 배송지를 한 곳에서 편하게 관리하세요.</p>
      </div>
      <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 border border-violet-200 text-[11px] text-violet-700">
        <MapPin className="h-3.5 w-3.5" />
          즉시 적용됩니다
      </span>
    </div>

    {/* 시스템 메시지 */}
    {message && (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        {message}
      </div>
    )}

    {/* 기본 배송지 카드 */}
    {defaultAddress && (
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 text-white flex items-center justify-center">
              {/* <Home className="h-5 w-5" /> */}
              기본
            </div>
            <div>
              <div className="inline-flex items-center gap-2">
                <p className="text-base font-semibold text-neutral-900">기본 배송지</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-[2px] border border-violet-200 text-[11px] text-violet-700">
                  {/* <CheckCircle2 className="h-3.5 w-3.5" /> */}
                  대표
                </span>
              </div>
              <div className="mt-1 text-sm text-neutral-700">
                <span className="font-medium">{defaultAddress.recipient}</span>
                <span className="text-neutral-400"> · </span>
                <span>{defaultAddress.phone}</span>
              </div>
              <div className="mt-0.5 text-sm text-neutral-600">
                {defaultAddress.postcode} {defaultAddress.address1} {defaultAddress.address2}
              </div>
            </div>
          </div>
          {/* 기본 배송지는 액션 제거/비활성 처리 or 안내만 */}
          <div className="text-xs text-neutral-400">대표 배송지는 변경만 가능합니다.</div>
        </div>
      </div>
    )}

    {/* 기타 배송지 목록 */}
    <div className="space-y-3">
      {otherAddresses.map((addr) => (
        <div
          key={addr.address_id}
          className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-500 flex items-center justify-center">
                {/* <MapPin className="h-5 w-5" /> */}
                서브
              </div>
              <div>
                <div className="text-sm text-neutral-700">
                  <span className="font-medium text-neutral-900">{addr.recipient}</span>
                  <span className="text-neutral-400"> · </span>
                  <span>{addr.phone}</span>
                </div>
                <div className="mt-0.5 text-sm text-neutral-600">
                  {addr.postcode} {addr.address1} {addr.address2}
                </div>

                {/* 작은 뱃지 라인 (옵션) */}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-50 px-2 py-[2px] border border-neutral-200 text-[11px] text-neutral-600">
                    {/* <Star className="h-3 w-3" /> */}
                    자주 쓰는 주소
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => handleSetDefault(addr.address_id)}
                className="px-3.5 h-9 rounded-full text-xs font-medium text-white
                           bg-[linear-gradient(90deg,#7c3aed_0%,#ec4899_100%)]
                           shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition"
              >
                기본으로 설정
              </button>
              <button
                onClick={() => handleDelete(addr.address_id)}
                className="px-3.5 h-9 rounded-full text-xs font-medium border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition"
              >
                {/* <Trash2 className="mr-1 inline-block h-4 w-4" /> */}
                삭제
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* 아무 주소도 없을 때의 빈 상태 */}
      {!defaultAddress && otherAddresses.length === 0 && (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center">
            {/* <MapPin className="h-6 w-6" /> */}
            주소
          </div>
          <p className="mt-3 text-sm font-medium text-neutral-900">등록된 배송지가 없습니다</p>
          <p className="mt-1 text-sm text-neutral-600">아래에서 새 배송지를 추가해 주세요.</p>
        </div>
      )}
    </div>

    {/* 구분선 */}
    <div className="h-px w-full bg-neutral-200" />

    {/* 새 배송지 추가 */}
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-base sm:text-lg font-bold text-neutral-900">새 배송지 추가</h4>
        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-50 px-2.5 py-1 border border-neutral-200 text-[11px] text-neutral-600">
          {/* <Plus className="h-3.5 w-3.5" /> */}
          최대 5개 등록 가능
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs text-neutral-500">받는 사람</label>
          <input
            placeholder="홍길동"
            value={newRecipient}
            onChange={(e) => setNewRecipient(e.target.value)}
            className="w-full h-11 rounded-lg border border-neutral-300 px-3 text-sm focus:ring-2 focus:ring-violet-500 transition"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-neutral-500">연락처</label>
          <input
            placeholder="010-0000-0000"
            value={newPhoneNumber}
            onChange={(e) => setNewPhoneNumber(e.target.value)}
            className="w-full h-11 rounded-lg border border-neutral-300 px-3 text-sm focus:ring-2 focus:ring-violet-500 transition"
          />
        </div>

        {/* 우편번호 + 주소검색 */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs text-neutral-500">우편번호</label>
          <div className="flex gap-2">
            <input
              placeholder="우편번호"
              value={newZipCode}
              readOnly
              className="w-36 h-11 rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-500 cursor-not-allowed"
            />
            <button
              onClick={handleEmbedPostcode}
              type="button"
              className="px-4 h-11 rounded-lg text-sm font-semibold text-white
                         bg-[linear-gradient(90deg,#7c3aed_0%,#ec4899_100%)]
                         shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition"
            >
              {/* <Search className="inline-block h-4 w-4 mr-1" /> */}
              주소 검색
            </button>
          </div>
        </div>

        {/* 기본 주소 */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs text-neutral-500">기본 주소</label>
          <input
            placeholder="도로명 주소"
            value={newAddress}
            readOnly
            className="w-full h-11 rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-500 cursor-not-allowed"
          />
        </div>

        {/* 상세 주소 */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs text-neutral-500">상세 주소</label>
          <input
            id="newDetailedAddress"
            placeholder="동/호수 까지 정확히 입력"
            value={newDetailedAddress}
            onChange={(e) => setNewDetailedAddress(e.target.value)}
            className="w-full h-11 rounded-lg border border-neutral-300 px-3 text-sm focus:ring-2 focus:ring-violet-500 transition"
          />
        </div>

        {/* 기본 배송지 체크 + 추가 버튼 */}
        <div className="sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-neutral-800">
            <input
              type="checkbox"
              checked={isNewAddressDefault}
              onChange={(e) => setIsNewAddressDefault(e.target.checked)}
              className="h-4 w-4 text-violet-600 focus:ring-violet-500 rounded"
            />
            기본 배송지로 설정
          </label>

          <button
            onClick={handleAddAddress}
            type="button"
            className="px-6 h-11 rounded-full font-semibold text-white
                       bg-[linear-gradient(90deg,#7c3aed_0%,#ec4899_100%)]
                       shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition"
          >
            배송지 추가
          </button>
        </div>
      </div>
    </div>

    {/* 주소검색 모달 */}
    {showPostcodeModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={() => setShowPostcodeModal(false)} />
        <div className="relative w-full max-w-3xl h-[560px] bg-white rounded-2xl shadow-2xl border border-neutral-200 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h5 className="text-lg font-semibold">주소 검색</h5>
            <button
              className="text-neutral-400 hover:text-neutral-700 text-2xl leading-none"
              onClick={() => setShowPostcodeModal(false)}
              aria-label="모달 닫기"
            >
              &times;
            </button>
          </div>
          <div id="postcode-container" className="flex-grow min-h-0 rounded-lg border border-neutral-200 overflow-hidden" />
          <div className="mt-3 text-right">
            <button
              className="px-4 h-10 rounded-full border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-50 transition"
              onClick={() => setShowPostcodeModal(false)}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}