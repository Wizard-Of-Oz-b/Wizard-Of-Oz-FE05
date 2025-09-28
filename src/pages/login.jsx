import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;// 예: "https://api.example.com" (없으면 동일 오리진)

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    saveId: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ 로컬 스토리지에 저장된 이메일 불러오기
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail, saveId: true }));
    }
  }, []);

  // ✅ OAuth 콜백 처리 (쿼리스트링 or 해시)
  useEffect(() => {
    // 백엔드가 /login 으로 돌려보낼 때 ?accessToken=... 또는 #access_token=... 로 붙여줄 것을 가정
    const search = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));

    const accessToken =
      search.get("accessToken") || search.get("token") || hash.get("access_token");
    const refreshToken =
      search.get("refreshToken") || hash.get("refresh_token") || null;
    const provider = search.get("provider") || hash.get("provider") || null;
    const error = search.get("error") || hash.get("error") || null;

    if (error) {
      // 에러 메시지를 사용자에게 표시
      console.error("OAuth error:", error);
      alert("소셜 로그인 중 오류가 발생했습니다. 다시 시도해 주세요.");
      // URL 정리
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (accessToken) {
      // ✅ 토큰 저장
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      if (provider) localStorage.setItem("lastOAuthProvider", provider);

      // ✅ URL 정리 (민감정보 제거)
      window.history.replaceState({}, document.title, window.location.pathname);

      // ✅ 원래 가려던 곳으로 이동
      const redirectTo = localStorage.getItem("postLoginRedirect") || "/";
      localStorage.removeItem("postLoginRedirect");
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, location.key]);

  // ✅ input 상태 변경 처리
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ 일반 로그인 API 호출 (POST /api/v1/auth/login)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.saveId) localStorage.setItem("savedEmail", formData.email);
    else localStorage.removeItem("savedEmail");

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 필요 시: 쿠키 기반 세션 사용한다면
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        // 백엔드가 메시지를 내려주면 표시
        let msg = "로그인 실패";
        try {
          const err = await res.json();
          if (err?.message) msg = err.message;
        } catch {}
        throw new Error(msg);
      }

      const data = await res.json();
      // 예상: { accessToken, ... }
      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }
      navigate("/"); // 홈으로 이동
    } catch (err) {
      console.error(err);
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !(formData.email && formData.password);

  // ✅ 소셜 로그인 시작 (백엔드 OAuth 엔드포인트로 이동)
  // GET /api/v1/auth/social/{provider}/login
  // 필요 시 redirect_uri 쿼리로 현재 페이지(or 원하는 콜백)를 명시
  const handleSocialLogin = (provider) => {
    // 돌아올 위치 기억 (예: 로그인 전에 보던 페이지가 있으면 거기로)
    const currentPath =
      (location.state && location.state.from) ||
      sessionStorage.getItem("lastVisitedPath") ||
      "/";
    localStorage.setItem("postLoginRedirect", currentPath);

    // 백엔드가 redirect_uri를 지원한다면 아래처럼 명시(없으면 자동으로 서버 설정 사용)
    const redirectUri = window.location.origin + "/login"; // 이 컴포넌트가 마운트되는 경로
    const url = new URL(
      `${API_BASE}/api/v1/auth/social/${provider}/login`,
      window.location.origin
    );
    // 선택: 서버가 허용한다면 redirect_uri 전달
    url.searchParams.set("redirect_uri", redirectUri);

    window.location.href = url.toString();
  };

  return (
    <div className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
          로그인
        </h1>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10"
          onSubmit={handleSubmit}
        >
          {/* 좌측 로그인 폼 */}
          <div className="flex flex-col space-y-4">
            <label className="block text-sm font-medium">이메일 주소(아이디)</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              autoComplete="username"
              placeholder="example@gmail.com"
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-black"
              required
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
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-500 h-full flex items-center"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
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

        {/* 소셜 로그인 선택 모달 */}
        {showSocialModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
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
      </div>
    </div>
  );
}