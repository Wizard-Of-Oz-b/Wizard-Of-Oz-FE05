import { useState } from "react";
import { useAlertModal } from "../components/common/layouts/common/modal/useAlertModal"; // AlertModal 훅
import api from "../lib/axios";
import { loginUser, registerUser } from "../components/common/api/signup/auth";
import { useNavigate } from "react-router-dom";

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

  //   try {
  //     const res = await api.post(`/api/v1/auth/check-nickname?nickname=${nickname}`);
  //     if (!res.ok) throw new Error("닉네임 확인 실패");
  //     const data = await res.json();

  //     if (data.isDuplicate) {
  //       setNicknameMessage("❌ 이미 사용 중인 닉네임입니다.");
  //     } else {
  //       setNicknameMessage("✅ 사용 가능한 닉네임입니다.");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setNicknameMessage("⚠ 닉네임 확인 중 오류가 발생했습니다.");
  //   }
  // };

  // ✅ 회원가입 API
  // POST /api/v1/auth/
  // 요청 JSON:
  // {
  //   name, nickname, email, password,
  //   phone, telecom, address, detailAddress,
  //   defaultAddress
  // }
  // 예상 반환값: { success: boolean, message: string, userId: string 등 }

  const toRegisterPayload = (f) => {
    const phone_number = f.phone.replace(/[^\d]/g, ""); // 010-1234-5678 → 01012345678
    const address = f.detailAddress ? `${f.address} ${f.detailAddress}`.trim() : f.address;
    return {
      email: f.email,
      password: f.password,
      nickname: f.nickname || f.name || "", 
      phone_number,
      address,
    };
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const res = await fetch("/api/v1/auth/signup", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         name: formData.name,
  //         nickname: formData.nickname,
  //         email: formData.email,
  //         password: formData.password,
  //         phone: formData.phone,
  //         telecom: formData.telecom,
  //         address: formData.address,
  //         detailAddress: formData.detailAddress,
  //         defaultAddress: formData.defaultAddress,
  //       }),
  //     });

  //     if (!res.ok) throw new Error("회원가입 실패");

  //     const data = await res.json();
  //     console.log("회원가입 성공:", data);

  //     showModal({ type: "success", message: "회원가입이 성공했습니다!" });

  //     setFormData({
  //       name: "",
  //       nickname: "",
  //       email: "",
  //       password: "",
  //       confirmPassword: "",
  //       phone: "",
  //       telecom: "",
  //       address: "",
  //       detailAddress: "",
  //       terms: false,
  //       defaultAddress: false,
  //     });
  //     setPasswordStrength("");
  //     setNicknameMessage("");
  //   } catch (err) {
  //     console.error(err);
  //     showModal({
  //       type: "error",
  //       message: "회원가입에 실패했습니다. 다시 시도해주세요.",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

      const payload = toRegisterPayload(formData);
      await registerUser(payload);

      await loginUser({ email: formData.email, password: formData.password });

      showModal({ type: "success", message: "회원가입이 성공했습니다! 자동으로 로그인되었습니다." });

      setFormData({
        name: "", nickname: "", email: "", password: "", confirmPassword: "",
        phone: "", telecom: "", address: "", detailAddress: "",
        terms: false, defaultAddress: false,
      });
      setPasswordStrength(""); setNicknameMessage("");
      navigate("/wishlist");
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

  // ✅ 주소 검색 API (다음 우편번호 서비스)
  // const handleAddressSearch = () => {
  //   new window.daum.Postcode({
  //     oncomplete: function (data) {
  //       setFormData((prev) => ({
  //         ...prev,
  //         address: data.address, // 검색 결과 주소
  //       }));
  //     },
  //   }).open();
  // };

  // const isFormValid =
  //   formData.name &&
  //   formData.nickname &&
  //   formData.email &&
  //   formData.password &&
  //   formData.confirmPassword &&
  //   formData.password === formData.confirmPassword &&
  //   passwordStrength === "안전" &&
  //   formData.phone &&
  //   formData.telecom &&
  //   formData.address &&
  //   formData.detailAddress &&
  //   formData.terms;

  return (
    <div className="min-h-screen bg-white py-3 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center md:text-left">
          신규 회원가입
        </h1>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10"
          onSubmit={handleSubmit}
        >
          {/* 왼쪽 섹션: 기본 정보 */}
          <div className="space-y-6">
            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium mb-1">이름</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="홍길동"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-black text-sm"
              />
            </div>

            {/* 닉네임 */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-end sm:gap-2">
                <div className="flex-1 relative">
                  <label className="block text-sm font-medium mb-1">닉네임</label>
                  <input
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    type="text"
                    placeholder="닉네임을 입력하세요"
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-black text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleNicknameCheck} // 닉네임 중복 체크 API
                  className="mt-2 sm:mt-0 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition text-sm cursor-pointer"
                >
                  중복 확인
                </button>
              </div>
              {nicknameMessage && (
                <p
                  className={`mt-1 text-sm font-semibold ${
                    nicknameMessage.includes("✅")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {nicknameMessage}
                </p>
              )}
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium mb-1">이메일</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="example@gmail.com"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-black text-sm"
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-medium mb-1">
                비밀번호 <br />
                (8자리 이상, 대문자+숫자+특수문자 포함)
              </label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="비밀번호를 입력하세요."
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-black text-sm"
              />
              {formData.password && (
                <div className="mt-2 h-2 w-full bg-gray-200 rounded">
                  <div
                    className={`h-2 rounded ${
                      passwordStrength === "취약"
                        ? "w-1/3 bg-red-600"
                        : passwordStrength === "미흡"
                        ? "w-2/3 bg-yellow-500"
                        : "w-full bg-green-600"
                    } transition-all`}
                  ></div>
                </div>
              )}
              {formData.password && passwordStrength && (
                <p className="mt-1 text-sm font-semibold">{passwordStrength}</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-sm font-medium mb-1">비밀번호 확인</label>
              <input
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-black text-sm"
              />
              {formData.confirmPassword && (
                <p
                  className={`mt-1 text-sm font-semibold ${
                    formData.confirmPassword === formData.password
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formData.confirmPassword === formData.password
                    ? "비밀번호가 일치합니다."
                    : "비밀번호가 일치하지 않습니다."}
                </p>
              )}
            </div>
          </div>

          {/* 오른쪽 섹션: 추가 정보 */}
          <div className="space-y-6">
            {/* 전화번호 + 통신사 */}
            <div>
              <label className="block text-sm font-medium mb-1">전화번호</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  name="telecom"
                  value={formData.telecom}
                  onChange={handleChange}
                  className="w-full sm:w-40 border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-black text-sm h-12 bg-white appearance-none"
                >
                  <option value="" disabled hidden>
                    통신사
                  </option>
                  <option value="SKT">SKT</option>
                  <option value="KT">KT</option>
                  <option value="LGU+">LG U+</option>
                  <option value="SK MVNO">SK 알뜰폰</option>
                  <option value="KT MVNO">KT 알뜰폰</option>
                  <option value="LGU+ MVNO">LG U+ 알뜰폰</option>
                </select>

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="010-0000-0000"
                  className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-black h-12 text-sm"
                />
              </div>
            </div>

            {/* 주소 */}
            <div className="relative border border-gray-300 rounded-md p-3">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">주소</label>
                <div className="flex items-center">
                  <input
                    name="defaultAddress"
                    type="checkbox"
                    checked={formData.defaultAddress}
                    onChange={handleChange}
                    id="defaultAddress"
                    className="mr-1 h-4 w-4 border-gray-400 rounded focus:ring-black cursor-pointer"
                  />
                  <label
                    htmlFor="defaultAddress"
                    className="text-xs text-gray-700 cursor-pointer select-none"
                  >
                    이 주소를 기본 배송지로 합니다.
                  </label>
                </div>
              </div>

              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                type="text"
                placeholder="주소를 검색하세요"
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-black mb-2 text-sm"
                readOnly
              />
              <input
                name="detailAddress"
                value={formData.detailAddress}
                onChange={handleChange}
                type="text"
                placeholder="상세주소를 입력하세요(예: 101동 1004호)"
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-black text-sm"
              />

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleAddressSearch} // 다음 우편번호 API 호출
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition text-sm cursor-pointer"
                >
                  주소 검색
                </button>
              </div>
            </div>

            {/* 약관 */}
            <div className="flex items-start">
              <input
                name="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={handleChange}
                id="terms"
                className="mt-1 mr-2 h-4 w-4 border-gray-400 rounded focus:ring-black cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-700 cursor-pointer select-none"
              >
                회원가입을 위해 <span className="underline">개인정보 수집</span>에
                동의합니다.
              </label>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || submitting}
              className={`w-full py-3 rounded-full font-semibold transition text-sm ${
                isFormValid
                  ? "bg-black text-white hover:bg-gray-800 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {submitting ? "가입 중..." : "회원가입"} {/* 회원가입 API 호출 */}
            </button>
          </div>
        </form>

        {ModalComponent}
      </div>
    </div>
  );
}