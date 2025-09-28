import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAlertModal } from "../components/common/layouts/common/modal/useAlertModal"; // ✅ 모달 훅
import { useAuth } from "../context/AuthContext";
import api, { loginAndStore } from "../lib/axios";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    saveId: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { showModal, ModalComponent } = useAlertModal(); // ✅ 모달

  // ✅ 로컬 스토리지에 저장된 이메일 불러오기
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail, saveId: true }));
    }
  }, []);

  // ✅ input 상태 변경 처리
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ 일반 로그인 API 호출
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.saveId) localStorage.setItem("savedEmail", formData.email);
    else localStorage.removeItem("savedEmail");

    try {
      setLoading(true);
      const data = await loginAndStore({
        email: formData.email,
        password: formData.password,
      });

      // // 로그인 성공 시 accessToken 저장
      // localStorage.setItem("accessToken", data.accessToken);

      const { data: me } = await api.get("/v1/users/me/");
      setUser({ ...me, displayName: (u => {
        const bad = v => !v || v === "string";
        const cand = [u.nickname, u.name, u.username, (u.email && u.email.split("@")[0])];
        return (cand.find(v => !bad(v))) || "사용자";
        })(me) });

      showModal({ type: "success", message: "로그인에 성공했습니다!" });
      navigate("/"); // 홈으로 이동
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "아이디 또는 비밀번호가 올바르지 않습니다.";
      showModal({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !(formData.email && formData.password);

  // ✅ 소셜 로그인 API 호출 → 백엔드에서 OAuth 리다이렉트 처리
  const handleSocialLogin = (provider) => {
   const API = (api.defaults.baseURL || "").replace(/\/+$/,"");
   const SITE = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/+$/,"");
   const CB = import.meta.env.VITE_OAUTH_CALLBACK_PATH || "/auth/callback";
   const redirectUri = `${SITE}${CB}/${provider}`;
   window.location.href = `${API}/v1/auth/social/${provider}/authorize/?redirect_uri=${encodeURIComponent(redirectUri)}`;
  };


  return (
    <div className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
          로그인
        </h1>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10"
          onSubmit={handleSubmit} // ✅ 일반 로그인 API 호출
        >
          {/* 좌측 로그인 폼 */}
          <div className="flex flex-col space-y-4">
            <label className="block text-sm font-medium">
              이메일 주소(아이디)
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              autoComplete="username"
              placeholder="example@gmail.com"
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-black"
            />

            <label className="block text-sm font-medium mt-4">비밀번호</label>
            <div className="relative flex items-center">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="********"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-black pr-10"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 cursor-pointer text-gray-500 flex items-center h-full"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                name="saveId"
                checked={formData.saveId}
                onChange={handleChange}
                id="saveId"
                className="mr-2 h-4 w-4 border-gray-400 rounded focus:ring-black cursor-pointer"
              />
              <label
                htmlFor="saveId"
                className="text-sm text-gray-700 cursor-pointer select-none"
              >
                아이디 저장
              </label>
            </div>

            <button
              type="submit"
              disabled={isDisabled || loading}
              className={`mt-6 w-full py-3 rounded-full font-semibold transition ${
                isDisabled || loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800 cursor-pointer"
              }`}
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>

            <p
              onClick={() => navigate("/reset-password")}
              className="mt-4 text-violet-600 text-sm cursor-pointer hover:underline"
            >
              비밀번호를 잊으셨나요?
            </p>
          </div>

          {/* 우측 버튼 그룹 */}
          <div className="flex flex-col justify-start items-stretch space-y-3">
            <div className="flex flex-col w-full space-y-3">
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="w-full py-3 rounded-full bg-white border border-black text-black font-medium hover:bg-gray-100 transition cursor-pointer"
              >
                신규 회원가입
              </button>

              <button
                type="button"
                onClick={() => setShowSocialModal(true)}
                className="w-full py-3 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 transition cursor-pointer"
              >
                소셜 계정으로 로그인
              </button>
            </div>

            <p className="text-sm text-gray-600 text-center mt-6 leading-relaxed">
              온라인 스토어 이용을 위해 회원가입이 필요합니다.
              <br />
              오즈의 이상한 상점 회원이 되어 다양한 혜택을 누립시다!
            </p>
          </div>
        </form>

        {/* ✅ 소셜 로그인 선택 모달 */}
        {showSocialModal && (
          <div className="fixed inset-0 bg-opacity-40 backdrop-blur-md flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
              <h2 className="text-lg font-semibold mb-4 text-center">
                소셜 계정을 선택하세요
              </h2>
              <div className="flex flex-col space-y-3">
                <button
                  disabled={loading}
                  onClick={() => handleSocialLogin("kakao")}
                  className="w-full py-3 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
                >
                  카카오 로그인
                </button>
                <button
                  disabled={loading}
                  onClick={() => handleSocialLogin("google")}
                  className="w-full py-3 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                >
                  구글 로그인
                </button>
                <button
                  disabled={loading}
                  onClick={() => handleSocialLogin("naver")}
                  className="w-full py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                >
                  네이버 로그인
                </button>
              </div>
              <button
                onClick={() => setShowSocialModal(false)}
                className="mt-5 w-full py-2 text-sm text-gray-600 hover:text-black"
              >
                닫기
              </button>
            </div>
          </div>
        )}

        {/* ✅ 모달 컴포넌트 */}
        {ModalComponent}
      </div>
    </div>
  );
}
