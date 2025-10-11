
import React, { useState, useEffect, useMemo } from "react";
import { getMyProfile, updateMyProfile } from "../../api/Mypage/member";
import { useAuth } from "../../../../context/AuthContext";
import { clean } from "../../../../utils/mypage/sanitize";
import { UserRound, AtSign, Phone, Sparkles, ShieldCheck, Smartphone, ArrowLeft } from "lucide-react";
import { FiCheckCircle } from "react-icons/fi"
import { useNavigate } from "react-router-dom";
import CartLoadingSpin from "../../../features/cart/CartLoadingSpin";

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
  const navigate = useNavigate(""); // 회원 탈퇴페이지로 이동 = 1001 복
  const [loading, setLoading] = useState(false);
  // 소셜 관련 추가
  const [profileAuthProvider, setProfileAuthProvider] = useState(null);
  const [profileSocialProviders, setProfileSocialProviders] = useState([]);

  const carrierOptions = ["SK", "KT", "LG", "알뜰폰SK", "알뜰폰KT", "알뜰폰LG"];

  const isSocial = (prov) => prov && prov !== "email" && prov !== "local";
  const isSocialMember = useMemo(() => {
    const uList = Array.isArray(user?.social_providers) ? user.social_providers : [];
    const pList = Array.isArray(profileSocialProviders) ? profileSocialProviders : [];
    return (
      uList.length > 0 ||
      pList.length > 0 ||
      isSocial(user?.auth_provider) ||
      isSocial(profileAuthProvider)
    );
  }, [user, profileAuthProvider, profileSocialProviders]);

  useEffect(() => {
    if (user) {
      setName(clean(user.name));
      setNickname(clean(user.nickname));
      setEmail(clean(user.email));
      setAddress(clean(user.address));
      setProfileAuthProvider(clean(user.auth_provider));
      setProfileSocialProviders(
        Array.isArray(user.social_providers) ? user.social_providers : []
      );
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
        setLoading(true);
        const { data } = await getMyProfile();
        setName(clean(data.name));
        setNickname(clean(data.nickname));
        setEmail(clean(data.email));
        setAddress(clean(data.address));
        setProfileAuthProvider(clean(data.auth_provider));
        setProfileSocialProviders(
          Array.isArray(data.social_providers) ? data.social_providers : []
        );
        const pn = clean(data.phone_number);
        if (pn && pn.includes("-")) {
          const [, mid = "", last = ""] = pn.split("-");
          setPhoneMiddle(mid);
          setPhoneLast(last);
        }
        setCarrier(clean(data.carrier) || "SK");
      } catch (err) {
        console.error("내 정보 조회에 실패하였습니다", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleConfirm = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
<section className="space-y-7">
  {/* 헤더 */}
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-neutral-900">
        내 정보 관리
      </h2>
      <p className="mt-1 text-sm text-neutral-600">프로필 정보를 최신 상태로 유지하세요.</p>
    </div>
    <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-neutral-50 px-3 py-1 border border-neutral-200 text-[11px] text-neutral-600">
      <ShieldCheck className="h-3.5 w-3.5" />
      암호화 저장
    </span>
  </div>

  {/* 얇은 구분선 */}
  <hr className="border-neutral-200" />

  {/* 안내 배지 */}
  <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 border border-violet-200 text-[11px] text-violet-700">
    <Sparkles className="h-3.5 w-3.5" />
    수정하면 바로 적용돼요
  </div>

  {/* 폼 패널 */}
  <div className="rounded-xl border border-neutral-200 bg-white/80 backdrop-blur p-5 sm:p-6 shadow-sm">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* 이름 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-800 mb-1">
          <UserRound className="h-4 w-4 text-neutral-400" />
          이름
        </label>
        <div className="relative">
          <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-300" />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            className="w-full h-11 pl-10 pr-3 rounded-lg border border-neutral-300 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
          />
        </div>
      </div>

      {/* 닉네임 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-800 mb-1">
          <Sparkles className="h-4 w-4 text-neutral-400" />
          닉네임
        </label>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="코코볼"
          className="w-full h-11 rounded-lg border border-neutral-300 px-3 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
        />
      </div>

      {/* 이메일 (읽기 전용) */}
      <div className="md:col-span-2">
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-800 mb-1">
          <AtSign className="h-4 w-4 text-neutral-400" />
          이메일
        </label>
        <div className="relative">
          <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-300" />
          <input
            value={email}
            readOnly
            className="w-full h-11 pl-10 pr-3 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-500 cursor-not-allowed"
          />
        </div>
      </div>

      {/* 전화번호 */}
      <div className="md:col-span-2">
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-800 mb-1">
          <Phone className="h-4 w-4 text-neutral-400" />
          전화번호
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Phone className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-300" />
            <select
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className="h-11 pl-7 pr-8 rounded-lg border border-neutral-300 text-sm focus:ring-2 focus:ring-violet-500"
            >
              {carrierOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <input
            value="010"
            readOnly
            className="w-20 h-11 rounded-lg border border-neutral-200 px-3 text-center text-sm bg-neutral-50"
          />
          <input
            value={phoneMiddle}
            onChange={(e) => setPhoneMiddle(e.target.value)}
            placeholder="1234"
            className="w-24 h-11 rounded-lg border border-neutral-300 px-3 text-sm focus:ring-2 focus:ring-violet-500"
          />
          <input
            value={phoneLast}
            onChange={(e) => setPhoneLast(e.target.value)}
            placeholder="5678"
            className="w-24 h-11 rounded-lg border border-neutral-300 px-3 text-sm focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <p className="mt-1 text-xs text-neutral-500">숫자만 입력해주세요.</p>
      </div>
    </div>

    {/* 하단 액션 바 */}
    <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
        <FiCheckCircle className="text-emerald-500" />
        변경사항 저장 시 즉시 적용됩니다.
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 h-10 rounded-full border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-50 transition inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          돌아가기
        </button>

        {/* 메인 CTA */}
        <button
          onClick={handleConfirm}
          className="px-6 h-10 rounded-full text-sm font-semibold text-white
                     bg-[linear-gradient(90deg,#7c3aed_0%,#ec4899_100%)]
                     shadow-[0_6px_16px_rgba(124,58,237,0.28)]
                     hover:shadow-[0_8px_20px_rgba(124,58,237,0.35)]
                     hover:-translate-y-0.5 active:translate-y-0
                     transition"
        >
          수정하기
        </button>
      </div>
    </div>
    {/* 회원정보 관리 본문 끝부분 */}
    <div className="mt-8 border-t border-neutral-200 pt-6">
    {isSocialMember ? (
      <button
        onClick={() => navigate("/mypage/social-unlink")}
        className="text-xs text-neutral-400 hover:text-violet-600 hover:underline transition"
      >
        소셜 연동 해제
      </button>
    ) : (
      <button
        onClick={() => navigate("/mypage/withdrawal")}
        className="text-xs text-neutral-400 hover:text-red-500 hover:underline transition"
      >
        회원 탈퇴
      </button>
    )}
    </div>


    {/* 저장 메시지 */}
    {confirmationMessage && (
      <div className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
        <FiCheckCircle className="text-emerald-500" />
        {confirmationMessage}
      </div>
    )}
    {loading && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
        <CartLoadingSpin />
      </div>
    )}
  </div>
</section>


  );
}
