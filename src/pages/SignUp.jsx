import { useState } from "react";
import { useAlertModal } from "../components/common/layouts/common/modal/useAlertModal"; // AlertModal 훅
import { useNavigate } from "react-router-dom";
import { loginAndStore, registerUser } from "../lib/axios";
import { Sparkles, CheckCircle2, User, AtSign, Lock, Phone, MapPin, Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    telecom: "",
    address: "",
    detailAddress: "",
    terms: false,
    defaultAddress: false,
  });

  const [nicknameMessage, setNicknameMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const { showModal, ModalComponent } = useAlertModal(); // 모달 훅
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "password") checkPasswordStrength(value);
  };

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength("");
    } else if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*]/.test(password)
    ) {
      setPasswordStrength("안전");
    } else if (password.length >= 6) {
      setPasswordStrength("미흡");
    } else {
      setPasswordStrength("취약");
    }
  };

    // ✅ 닉네임 중복 확인 API
  // GET /api/v1/auth/
  // 요청: URL 파라미터로 nickname 전달
  // 예상 반환 값: { isDuplicate: boolean } -> 이미 사용 중인지 여부
  const handleNicknameCheck = async () => {
    const nickname = formData.nickname.trim();
    if (!nickname) 
      return setNicknameMessage("⚠ 닉네임을 입력해주세요.");
      
    const isDuplicate = Math.random() > 0.5;

setNicknameMessage(isDuplicate ? "❌ 이미 사용 중인 닉네임입니다." : "✅ 사용 가능한 닉네임입니다.");
  };

  const toRegisterPayload = (f) => {
    const phone_number = f.phone.replace(/[^\d]/g, ""); // 010-1234-5678 → 01012345678
    const address = f.detailAddress ? `${f.address} ${f.detailAddress}`.trim() : f.address;
    return {
      email: f.email,
      username: f.name || f.nickname, // 내용 추가, 필수요소 빠져있었음 - 25.09.30 복
      password: f.password,
      nickname: f.nickname || f.name || "", 
      phone_number,
      address,
    };
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("비밀번호가 일치하지 않습니다.");
      }
      if (passwordStrength !== "안전") {
        throw new Error("비밀번호 보안 수준을 '안전'으로 맞춰주세요.");
      }
      if (!formData.terms) {
        throw new Error("개인정보 수집 동의가 필요합니다.");
      }
      // 회원가입 요청
      const payload = toRegisterPayload(formData);
      await registerUser(payload);
      // 자동으로 로그인하기
      await loginAndStore({
        email: formData.email,
        password: formData.password,
      });

    showModal({ type: "success", message: "회원가입이 성공했습니다! 자동으로 로그인되었습니다." });

      setFormData({
        name: "",
        nickname: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        telecom: "",
        address: "",
        detailAddress: "",
        terms: false,
        defaultAddress: false,
      });
      setPasswordStrength("");
      setNicknameMessage("");
      navigate("/mypage");    // 25.09.30 경복, 리다이렉트 위시리스트 -> 마이페이지로 이동
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "회원가입에 실패했습니다. 다시 시도해주세요.";
      showModal({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setFormData((prev) => ({ ...prev, address: data.address }));
      },
    }).open();
  };

  const isFormValid =
    formData.name &&
    formData.nickname &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    passwordStrength === "안전" &&
    formData.phone &&
    formData.telecom &&
    formData.address &&
    formData.detailAddress &&
    formData.terms;

return (
  <div className="min-h-screen bg-white">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="p-[1px] bg-gradient-to-br from-violet-300/40 via-fuchsia-200/30 to-pink-300/40 rounded-lg shadow-[0_12px_40px_rgba(16,24,40,0.08)]">
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="h-1 w-full bg-[linear-gradient(90deg,#7c3aed_0%,#ec4899_100%)]" />
          {/* 좌(5)/우(7) 비율 */}
          <div className="grid grid-cols-12">
            {/* LEFT: 브랜드 패널 */}
            <div className="col-span-12 md:col-span-5 bg-gradient-to-br from-violet-50 to-pink-50">
              <div className="p-8 md:p-10 lg:p-12 h-full flex flex-col">
                {/* 로고/브랜드명 */}
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 shadow-[0_4px_14px_rgba(236,72,153,0.35)]" />
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight text-neutral-900">
                      오즈의 이상한 상점
                    </h2>
                    <p className="text-xs text-neutral-500">평범한 일상에 마법을 더하다</p>
                  </div>
                </div>

                {/* 카피 */}
                <div className="mt-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 border border-neutral-200 text-[11px] text-neutral-600">
                    <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                    지금 가입하면 웰컴 쿠폰 + 무료배송
                  </div>
                  <h3 className="mt-4 text-2xl md:text-3xl font-extrabold leading-snug text-neutral-900">
                    <span className="relative inline-block">
                      <span className="absolute -inset-1 -skew-y-1 bg-gradient-to-r from-violet-500/10 to-pink-500/10 rounded-lg" />
                      <span className="relative z-10">
                        당신만의
                        <br className="hidden sm:block" />
                        <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
                          스타일은{" "}
                      </span>
                      디테일에서 시작됩니다.
                    </span>
                  </span>
                    
                  </h3>
                  <p className="mt-3 text-sm text-neutral-600">
                    매일 공개되는 프리미엄 컬렉션과 단독 드롭을 가장 먼저 경험하세요.
                  </p>
                </div>

                {/* 브랜드 이미지 - 추후 수정 */}
                <div className="mt-8">
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-md border border-neutral-200 bg-[url('/images/32.jpg')] bg-cover bg-center shadow-[0_12px_30px_rgba(17,24,39,0.08)]" />
                </div>

                {/* 혜택 리스트 */}
                <ul className="mt-8 space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <span className="text-sm text-neutral-700">오즈 회원만의 시크릿 세일 & 프리오더</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <span className="text-sm text-neutral-700">첫 구매 고객에게 웰컴 쿠폰 + 무료배송</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <span className="text-sm text-neutral-700">생일엔 스페셜 기프트 & 리워드 포인트</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* RIGHT: 회원가입 폼 */}
            <div className="col-span-12 md:col-span-7 bg-white">
              <div className="p-6 md:p-10">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-neutral-900">
                    신규 회원가입
                  </h1>
                  <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] md:text-xs font-medium 
                                  rounded-full bg-violet-50 text-violet-700 px-3 py-1 border border-violet-200">
                    <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                    회원 전용 혜택 제공
                  </span>
                </div>
                <p className="mt-2 text-sm text-neutral-500">
                  1분 만에 가입하고, 오늘 바로 적립 혜택을 받아보세요.
                </p>

                <hr className="mt-6 border-neutral-200" />

                {/* 폼 */}
                <form className="grid grid-cols-1 gap-5 mt-4" onSubmit={handleSubmit}>
                  {/* 이름 */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">이름</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={(e)=> (e.target.value = e.target.value.trim())}
                        type="text"
                        placeholder="홍길동"
                        className="w-full h-12 pl-10 pr-3 rounded-md border border-neutral-300 bg-white text-sm text-neutral-900 placeholder:text-neutral-400
                                   outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>
                  </div>

                  {/* 닉네임 + 중복확인 */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">닉네임</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                          name="nickname"
                          value={formData.nickname}
                          onChange={handleChange}
                          onBlur={(e)=> (e.target.value = e.target.value.trim())}
                          type="text"
                          placeholder="닉네임을 입력하세요"
                          className="w-full h-12 pl-10 pr-3 rounded-md border border-neutral-300 bg-white text-sm text-neutral-900 placeholder:text-neutral-400
                                     outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleNicknameCheck}
                        className="h-12 px-4 rounded-md whitespace-nowrap min-w-[112px]
                                   bg-neutral-900 text-white text-sm font-semibold
                                   hover:bg-neutral-800 active:bg-black transition shadow-sm"
                      >
                        중복 확인
                      </button>
                    </div>
                    {nicknameMessage && (
                      <p className={`mt-1 text-xs font-medium ${
                        nicknameMessage.includes("✅") ? "text-emerald-600" : "text-rose-600"
                      }`}>{nicknameMessage}</p>
                    )}
                  </div>

                  {/* 이메일 */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">이메일</label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={(e)=> (e.target.value = e.target.value.trim())}
                        type="email"
                        placeholder="example@gmail.com"
                        className="w-full h-12 pl-10 pr-3 rounded-md border border-neutral-300 bg-white text-sm text-neutral-900 placeholder:text-neutral-400
                                   outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>
                  </div>

                  {/* 통신사 + 전화번호 */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">전화번호</label>
                    <div className="flex gap-2">
                      <select
                        name="telecom"
                        value={formData.telecom}
                        onChange={handleChange}
                        className="w-40 h-12 rounded-md border border-neutral-300 bg-white text-sm text-neutral-900
                                   px-3 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 appearance-none"
                      >
                        <option value="" disabled hidden>통신사</option>
                        <option value="SKT">SKT</option>
                        <option value="KT">KT</option>
                        <option value="LGU+">LG U+</option>
                        <option value="SK MVNO">SK 알뜰폰</option>
                        <option value="KT MVNO">KT 알뜰폰</option>
                        <option value="LGU+ MVNO">LG U+ 알뜰폰</option>
                      </select>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          type="tel"
                          placeholder="010-0000-0000"
                          className="w-full h-12 pl-10 pr-3 rounded-md border border-neutral-300 bg-white text-sm text-neutral-900 placeholder:text-neutral-400
                                     outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 비밀번호 */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      비밀번호 <span className="text-neutral-400">(8자리 이상, 대문자+숫자+특수문자)</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                      <input
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type={showPassword ? "text" : "password"}
                        placeholder="비밀번호를 입력하세요."
                        className="w-full h-12 pl-10 pr-3 rounded-md border border-neutral-300 bg-white text-sm text-neutral-900 placeholder:text-neutral-400
                                   outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {formData.password && (
                      <>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-200 overflow-hidden">
                          <div className={`h-full transition-all ${
                            passwordStrength === "취약" ? "w-1/3 bg-rose-500" :
                            passwordStrength === "미흡" ? "w-2/3 bg-amber-500" :
                            passwordStrength === "안전" ? "w-full bg-emerald-600" : "w-0"
                          }`} />
                        </div>
                        {passwordStrength && (
                          <p className="mt-1 text-xs font-medium text-neutral-600">{passwordStrength}</p>
                        )}
                      </>
                    )}
                  </div>

                  {/* 비밀번호 확인 */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">비밀번호 확인</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                      <input
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        type={showPassword ? "text" : "password"}
                        placeholder="비밀번호를 다시 입력하세요"
                        className="w-full h-12 pl-10 pr-3 rounded-md border border-neutral-300 bg-white text-sm text-neutral-900 placeholder:text-neutral-400
                                   outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>
                    {formData.confirmPassword && (
                      <p className={`mt-1 text-xs font-medium ${
                        formData.confirmPassword === formData.password ? "text-emerald-600" : "text-rose-600"
                      }`}>
                        {formData.confirmPassword === formData.password
                          ? "비밀번호가 일치합니다."
                          : "비밀번호가 일치하지 않습니다."}
                      </p>
                    )}
                  </div>

                  {/* 주소 블록 */}
                  <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-neutral-700">주소</label>
                      <div className="flex items-center">
                        <input
                          name="defaultAddress"
                          type="checkbox"
                          checked={formData.defaultAddress}
                          onChange={handleChange}
                          id="defaultAddress"
                          className="mr-2 h-4 w-4 border-neutral-300 rounded focus:ring-violet-500 cursor-pointer"
                        />
                        <label htmlFor="defaultAddress" className="text-xs text-neutral-600 cursor-pointer select-none">
                          이 주소를 기본 배송지로 합니다.
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="relative md:col-span-2">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          type="text"
                          readOnly
                          placeholder="주소를 검색하세요"
                          className="w-full h-12 pl-10 pr-3 rounded-md border border-neutral-300 bg-white text-sm text-neutral-900 placeholder:text-neutral-400
                                     outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 mb-2 md:mb-0"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddressSearch}
                        className="h-12 px-4 rounded-md bg-neutral-900 text-white text-sm font-semibold
                                   hover:bg-neutral-800 active:bg-black transition shadow-sm whitespace-nowrap"
                      >
                        주소 검색
                      </button>
                    </div>

                    <input
                      name="detailAddress"
                      value={formData.detailAddress}
                      onChange={handleChange}
                      type="text"
                      placeholder="상세주소를 입력하세요(예: 101동 1004호)"
                      className="mt-2 w-full h-12 rounded-md border border-neutral-300 bg-white text-sm text-neutral-900 placeholder:text-neutral-400
                                 px-3 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>

                  {/* 약관 */}
                  <div className="flex items-start">
                    <input
                      name="terms"
                      id="terms"
                      type="checkbox"
                      checked={formData.terms}
                      onChange={handleChange}
                      className="mt-1 mr-2 h-4 w-4 border-neutral-300 rounded focus:ring-violet-500 cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-sm text-neutral-700 cursor-pointer select-none">
                      회원가입을 위해 <span className="underline">개인정보 수집</span>에 동의합니다.
                    </label>
                  </div>

                  {/* CTA */}
                  <div>
                    <button
                      type="submit"
                      disabled={!isFormValid || submitting}
                      className={`w-full h-12 rounded-md text-sm font-semibold transition
                        shadow-[0_10px_28px_rgba(236,72,153,0.28)]
                        ${isFormValid && !submitting
                          ? "bg-[linear-gradient(135deg,#7c3aed_0%,#ec4899_100%)] text-white hover:brightness-105 active:brightness-95"
                          : "bg-neutral-200 text-neutral-500 cursor-not-allowed shadow-none"}`}
                    >
                      <span className="whitespace-nowrap">{submitting ? "가입 중..." : "회원가입"}</span>
                    </button>
                    <p className="text-[11px] text-neutral-500 text-center mt-2">
                      결제정보는 안전하게 암호화되어 저장됩니다.
                    </p>
                  </div>
                </form>

                {ModalComponent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);


}