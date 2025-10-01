import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAlertModal } from "../components/common/layouts/common/modal/useAlertModal";
import { useAuth } from "../context/AuthContext";
import api, { loginAndStore } from "../lib/axios";
import { FcGoogle } from "react-icons/fc";
import { SiNaver } from "react-icons/si";
import { RiKakaoTalkFill } from "react-icons/ri";


export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "", saveId: false });
  const [showPassword, setShowPassword] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showModal, ModalComponent } = useAlertModal();

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) setFormData((prev) => ({ ...prev, email: savedEmail, saveId: true }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.saveId) localStorage.setItem("savedEmail", formData.email);
    else localStorage.removeItem("savedEmail");

    try {
      setLoading(true);
      await loginAndStore({ email: formData.email, password: formData.password });
      const { data: me } = await api.get("/v1/users/me/");
      const bad = (v) => !v || v === "string";
      const displayName =
        [me.nickname, me.name, me.username, me.email && me.email.split("@")[0]].find((v) => !bad(v)) || "사용자";
      setUser({ ...me, displayName });

      showModal({ type: "success", message: "로그인에 성공했습니다!" });
      navigate("/");
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

  // ── 소셜 로그인: 백엔드가 프로바이더로 302 리다이렉트 ──
  const handleSocialLogin = (provider) => {
    sessionStorage.setItem("oauth_provider", provider); // 콜백에서 복구용
    const API = (api.defaults.baseURL || "").replace(/\/+$/, "");
    window.location.href = `${API}/v1/auth/social/${provider}/authorize/`;
  };

return (
  <div className="min-h-screen bg-white flex items-center justify-center px-3 sm:px-4 lg:px-6 py-2">
    <div className="w-full max-w-5xl bg-white border border-neutral-200 shadow-xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
      
     {/* 왼쪽: 브랜드/카피 */}
<div className="flex flex-col justify-center p-10 md:p-12 bg-gradient-to-br from-violet-50 to-pink-50">
  {/* 로고 */}
  <div className="flex items-center gap-3">
    <div className="h-12 w-12 flex items-center justify-center rounded-xl 
                    bg-gradient-to-br from-violet-500 to-pink-500 
                    shadow-[0_4px_14px_rgba(236,72,153,0.35)] 
                    text-white font-bold text-lg">
      OZ
    </div>
    <div>
      <h2 className="text-xl font-extrabold tracking-tight text-neutral-900">
        오즈의 이상한 상점
      </h2>
      <p className="text-xs text-neutral-500">
        평범한 일상에 작은 마법을 더하다
      </p>
    </div>
  </div>

  {/* 카피 */}
  <div className="mt-12">
    <h3 className="text-3xl md:text-4xl font-extrabold leading-snug text-neutral-900">
      “로그인하고 <br className="hidden sm:block" />
      <span className="relative">
        <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
          특별한 혜택
        </span>
        <span className="absolute left-0 -bottom-1 w-full h-2 bg-pink-200/40 -z-10 rounded-lg"></span>
      </span>
      을 누리세요”
    </h3>
    <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
      단순한 로그인 그 이상, 당신만의 특별한 쇼핑 경험이 시작됩니다.
    </p>
  </div>

  {/* 회원 혜택 리스트 */}
  <div className="mt-8 grid gap-3 text-sm text-neutral-700">
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
      신규 가입 시 <b>웰컴 쿠폰</b> & 무료배송
    </div>
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
      회원 전용 <b>시크릿 세일</b> & 프리오더
    </div>
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
      생일축하 기프트 & 리워드 적립
    </div>
  </div>
</div>

      {/* 오른쪽: 로그인 폼 */}
      <div className="p-10 md:p-12 flex flex-col justify-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center md:text-left">
          로그인
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium mb-1">
              이메일 주소(아이디)
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              autoComplete="username"
              placeholder="example@gmail.com"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-violet-500 text-sm"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-medium mb-1">비밀번호</label>
            <div className="relative flex items-center">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="********"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-violet-500 text-sm pr-10"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 cursor-pointer text-gray-500 flex items-center h-full"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>

          {/* 아이디 저장 + 비밀번호 찾기 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="saveId"
                checked={formData.saveId}
                onChange={handleChange}
                id="saveId"
                className="mr-2 h-4 w-4 border-gray-400 rounded focus:ring-violet-500 cursor-pointer"
              />
              <label
                htmlFor="saveId"
                className="text-sm text-gray-700 cursor-pointer select-none"
              >
                아이디 저장
              </label>
            </div>

            <p
              onClick={() => navigate("/reset-password")}
              className="text-violet-600 text-sm cursor-pointer hover:underline"
            >
              비밀번호를 잊으셨나요?
            </p>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={isDisabled || loading}
            className={`w-full py-3 rounded-full font-semibold text-white transition transform ${
              isDisabled || loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-violet-600 to-pink-500 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>

          {/* 구분선 */}
          <div className="flex items-center my-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">또는</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* 소셜 로그인 */}
          <div className="mt-4 space-y-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSocialLogin("kakao")}
              className="w-full py-3 rounded-full font-semibold bg-yellow-400 text-black flex items-center justify-center gap-2 shadow hover:shadow-md hover:scale-[1.01] active:scale-[0.98] transition cursor-pointer"
            >
              <RiKakaoTalkFill className="w-5 h-5" />
              카카오로 로그인하기
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleSocialLogin("google")}
              className="w-full py-3 rounded-full font-semibold bg-white border border-gray-300 text-gray-700 flex items-center justify-center gap-2 shadow hover:shadow-md hover:scale-[1.01] active:scale-[0.98] transition cursor-pointer"
            >
              <FcGoogle className="w-5 h-5" />
              구글로 로그인하기
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleSocialLogin("naver")}
              className="w-full py-3 rounded-full font-semibold bg-green-600 text-white flex items-center justify-center gap-2 shadow hover:shadow-md hover:scale-[1.01] active:scale-[0.98] transition cursor-pointer"
            >
              <SiNaver className="w-5 h-5" />
              네이버로 로그인하기
            </button>
          </div>

          {/* 회원가입 버튼 */}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className=" w-full py-3 rounded-full font-semibold border border-violet-200
                        bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:shadow-lg
                        transition-all duration-300 ease-in-out cursor-pointer"
            >
              회원가입하고 혜택받기
            </button>
          </form>
        </div>
      </div>

      {ModalComponent}
    </div>
  );
}
