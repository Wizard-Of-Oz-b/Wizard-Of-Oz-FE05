
import React, { useState, useEffect } from "react";
import { getMyProfile, updateMyProfile } from "../../api/Mypage/member";
import { useAuth } from "../../../../context/AuthContext";
import { clean } from "../../../../utils/mypage/sanitize";

export default function MemberInfo() {
  const { user, setUser, bootstrapping} = useAuth();
  
  const [name, setName] = useState(""); // 이름
  const [nickname, setNickname] = useState(""); // 닉네임
  const [email, setEmail] = useState(""); // 이메일
  const [carrier, setCarrier] = useState("SK"); // 통신사 드롭다운
  const [phoneMiddle, setPhoneMiddle] = useState(""); // 전화번호 중간
  const [phoneLast, setPhoneLast] = useState(""); // 전화번호 끝
  const [address, setAddress] = useState(""); // 주소
  const [confirmationMessage, setConfirmationMessage] = useState(""); // 확인 메시지

  const carrierOptions = ["SK", "KT", "LG", "알뜰폰"];

  useEffect(() => {
    if (user) {
      setName(clean(user.name));
      setNickname(clean(user.nickname));
      setEmail(clean(user.email));
      setAddress(clean(user.address));
      const pn = clean(user.phone_number);
      if (pn && pn.includes("-")) {
        const [, mid = "", last = ""] = pn.split("-");
        setPhoneMiddle(mid);
        setPhoneLast(last);
      }
      setCarrier(clean(user.carrier) || "SK");
      return;
    }

    (async () => {
      try{
        const { data } = await getMyProfile();
        setName(clean(data.name));
        setNickname(clean(data.nickname));
        setEmail(clean(data.email));
        setAddress(clean(data.address));
        const pn = clean(data.phone_number);
        if (pn && pn.includes("-")) {
          const [, mid = "", last = ""] = pn.split("-");
          setPhoneMiddle(mid);
          setPhoneLast(last);
        }
        setCarrier(clean(data.carrier) || "SK");
      } catch (err) {
        console.error("내 정보 조회에 실패하였습니다", err);
      }
    })();
  }, [user]);

  const handleConfirm = async () => {
    try {
      const { data: updated } = await updateMyProfile({
        name,
        nickname,
        phone_number: `010-${phoneMiddle}-${phoneLast}`, // 010 고정
        address,
        carrier, // 통신사 정보도 전송 가능
      });
      setConfirmationMessage("정보가 수정되었습니다!");

      const makeDisplayName = (me = {}) => {
        const isBad = (v) => !v || v === "string";
        const order = [
          me.nickname,
          me.name,
          me.username,
          (me.email && me.email.split("@")[0]) || null,
        ];
        const picked = order.find((v) => !isBad(v));
        return picked || "사용자";
      };
      setUser((prev) => ({
        ...prev,
        ...updated,
        displayName: makeDisplayName(updated),
      }));
    } catch {
      setConfirmationMessage("정보 수정 실패");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h3 className="text-2xl font-semibold mb-4">내 정보</h3>
      <div className="space-y-4">

        {/* 이름 */}
        <div>
          <label className="block font-medium">이름</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* 닉네임 */}
        <div>
          <label className="block font-medium">닉네임</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* 이메일 */}
        <div>
          <label className="block font-medium">이메일</label>
          <input
            value={email}
            readOnly
            className="border p-2 rounded w-full bg-gray-100"
          />
        </div>

        {/* 전화번호 */}
        <div>
          <label className="block font-medium">전화번호</label>
          <div className="flex space-x-2 items-center">
            {/* 통신사 드롭다운 (맨 처음) */}
            <select
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className="border p-2 rounded"
            >
              {carrierOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* 앞자리 010 고정 */}
            <input
              value="010"
              readOnly
              className="border p-2 rounded w-16 bg-gray-100 text-center"
            />

            {/* 중간 번호 */}
            <input
              value={phoneMiddle}
              onChange={(e) => setPhoneMiddle(e.target.value)}
              className="border p-2 rounded w-20"
            />

            {/* 마지막 번호 */}
            <input
              value={phoneLast}
              onChange={(e) => setPhoneLast(e.target.value)}
              className="border p-2 rounded w-20"
            />
          </div>
        </div>

        {/* 주소 */}
        <div>
          <label className="block font-medium">주소</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* 수정 버튼 */}
        <button
          onClick={handleConfirm}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          수정하기
        </button>

        {/* 확인 메시지 */}
        {confirmationMessage && (
          <p className="text-sm text-green-600 mt-2">{confirmationMessage}</p>
        )}
      </div>
    </div>
  );
}
