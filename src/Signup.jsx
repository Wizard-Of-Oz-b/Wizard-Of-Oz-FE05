import { useState } from "react";

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

  const [modal, setModal] = useState({ type: "", message: "" });
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

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
    } else if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)) {
      setPasswordStrength("안전");
    } else if (password.length >= 6) {
      setPasswordStrength("미흡");
    } else {
      setPasswordStrength("취약");
    }
  };

  const handleNicknameCheck = () => {
    const nickname = formData.nickname.trim();
    if (!nickname) {
      setNicknameMessage("⚠ 닉네임을 입력해주세요.");
      return;
    }
    const isDuplicate = Math.random() > 0.5; // 시뮬레이션
    if (isDuplicate) {
      setNicknameMessage("❌ 이미 사용 중인 닉네임입니다.");
    } else {
      setNicknameMessage("✅ 사용 가능한 닉네임입니다.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, nickname, email, password, confirmPassword, phone, telecom, address, detailAddress, terms } = formData;

    if (!name || !nickname || !email || !password || !confirmPassword || !phone || !telecom || !address || !detailAddress) {
      setModal({ type: "warning", message: "모든 항목을 입력해주세요." });
      return;
    }

    if (passwordStrength !== "안전") {
      setModal({
        type: "warning",
        message: "비밀번호는 안전등급 이상이어야 가입할 수 있습니다.",
      });
      return;
    }

    if (!terms) {
      setModal({ type: "warning", message: "약관에 동의해야 합니다." });
      return;
    }

    const isSuccess = Math.random() > 0.3;
    if (isSuccess) {
      setModal({ type: "success", message: "회원가입이 성공했습니다!" });
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
    } else {
      setModal({ type: "error", message: "회원가입에 실패했습니다. 다시 시도해주세요." });
    }
  };

  const closeModal = () => setModal({ type: "", message: "" });

  // 카카오 주소 API 호출
  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setFormData((prev) => ({
          ...prev,
          address: data.address,
        }));
      },
    }).open();
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-6">
        <div className="flex items-center mb-6">
          <div className="bg-violet-600 text-white font-bold text-xl px-3 py-3 rounded-sm mr-4">OZ</div>
          <h1 className="text-2xl font-bold">신규 회원가입</h1>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium mb-1">이름</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              placeholder="도로시"
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* 닉네임 */}
          <div>
            <div className="flex items-center">
              <div className="flex-1 relative">
                <label className="block text-sm font-medium mb-1">닉네임</label>
                <input
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  type="text"
                  placeholder="닉네임을 입력하세요"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-violet-500 pr-24"
                />
              </div>
              <button
                type="button"
                onClick={handleNicknameCheck}
                className="ml-2 mt-5 px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition"
              >
                중복 확인
              </button>
            </div>
            {nicknameMessage && (
              <p
                className={`mt-1 text-sm font-semibold ${
                  nicknameMessage.includes("✅") ? "text-green-600" : "text-red-600"
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
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-medium mb-1">비밀번호</label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="비밀번호를 입력하세요."
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-violet-500"
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
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-violet-500"
            />
            {formData.confirmPassword && (
              <p
                className={`mt-1 text-sm font-semibold ${
                  formData.confirmPassword === formData.password ? "text-green-600" : "text-red-600"
                }`}
              >
                {formData.confirmPassword === formData.password ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다."}
              </p>
            )}
          </div>

          {/* 전화번호 + 통신사 */}
          <div>
            <label className="block text-sm font-medium mb-1">전화번호</label>
            <div className="flex gap-2">
              <select
                name="telecom"
                value={formData.telecom}
                onChange={handleChange}
                className="w-32 min-w-[128px] max-w-[128px] border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-violet-500 text-base h-12 bg-white shadow-sm appearance-none"
              >
                <option value="" disabled selected hidden>
                  통신사
                </option>
                <option value="SKT">SKT</option>
                <option value="KT">KT</option>
                <option value="LGU+">LG U+</option>
                <option value="MVNO">알뜰폰</option>
              </select>


              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                placeholder="010-0000-0000"
                className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-violet-500 h-12"
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
        className="mr-1 h-4 w-4 border-gray-400 rounded focus:ring-violet-500 cursor-pointer"
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
    className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-violet-500 mb-2"
    readOnly
  />
  <input
    name="detailAddress"
    value={formData.detailAddress}
    onChange={handleChange}
    type="text"
    placeholder="상세주소를 입력하세요"
    className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-violet-500"
  />

  {/* 버튼을 오른쪽 아래로 이동 */}
  <div className="flex justify-end mt-2">
    <button
      type="button"
      onClick={handleAddressSearch}
      className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition"
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
              className="mt-1 mr-2 h-4 w-4 border-gray-400 rounded focus:ring-violet-500 cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="text-sm text-gray-700 cursor-pointer select-none"
            >
              회원가입을 위해 <span className="underline">개인정보 수집</span>에 동의합니다.
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-full font-semibold cursor-pointer hover:bg-violet-600 transition"
          >
            회원가입
          </button>
        </form>
      </div>

      {/* 일반 모달 */}
      {modal.type && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-md"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl p-8 w-11/12 max-w-lg shadow-xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className={`text-2xl font-bold mb-6 ${
                modal.type === "success"
                  ? "text-green-600"
                  : modal.type === "warning"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {modal.type === "success" ? "성공" : modal.type === "warning" ? "경고" : "오류"}
            </h2>
            <p className="mb-6 text-lg">{modal.message}</p>
            <button
              onClick={closeModal}
              className="px-6 py-3 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition cursor-pointer"
            >
              알겠습니다.
            </button>
          </div>
        </div>
      )}
    </div>
  );
}