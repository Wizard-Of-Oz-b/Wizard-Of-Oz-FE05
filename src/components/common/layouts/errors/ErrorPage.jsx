import { STATUS_PRESETS } from "./statusPresets";
import {
  ShoppingCart,
  Home,
  ArrowLeft,
  LockKeyhole,
  Headset,
  WifiOff,
  Search,
} from "lucide-react";

import ActionLink from "./component/ActionLink";
import ActionButton from "./component/ActionButton";
import { pickIcon } from "./component/pickIcon";
import StatusPill from "./component/StatusPill";
import { useNavigate } from "react-router-dom";
import { buildSearchURL } from "../../../../utils/searchUrl";
import { useState } from "react";

export default function ErrorPage({
  status = 500,
  title,
  message,
  actions,
  onSearch,
  hint,
}) {
  const [q, setQ] = useState("");
  const navigate =  useNavigate();

  const preset = STATUS_PRESETS[status] || STATUS_PRESETS[500];
  const theTitle = title || preset.title;
  const theMsg = message || preset.message;
  const theActions = actions || preset.actions || ["home"];

  const Icon = pickIcon(status);

  const goSearch = (query) => {
    const keyword = String(query || "").trim();
    if (!keyword) return;

    if (onSearch) {
      onSearch(keyword);
    } else {
      const qs = new URLSearchParams({ q: keyword, page: "1", sort: "created_at"});
      navigate(`/results/test?${qs.toString()}`);
    }
  };

  const handlekeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goSearch(q);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-gray-900 via-gray-800 to-violet-600 p-6">
      <div className="w-full max-w-3xl">
        {/* Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl border border-gray-100">
          {/* Hero stripe */}
        <div className="h-[1px] bg-gray-200 shadow" />
          <div className="p-8 md:p-10">
            {/* Badge + Icon */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-violet-700 text-xs font-semibold">
                <ShoppingCart className="size-4" /> 오즈의 이상한 상점
              </span>
              <StatusPill status={status} label="오류" /> {/* ⬅️ 변경 */}
            </div>

            <div className="mt-5 flex items-start gap-4">
              <div className="shrink-0 rounded-2xl bg-violet-100 p-3 text-violet-700">
                <Icon className="size-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
                  {theTitle}
                </h1>
                <p className="mt-2 text-gray-600 leading-relaxed whitespace-pre-line">
                  {theMsg}
                </p>
                {hint && <p className="mt-2 text-xs text-gray-500">{hint}</p>}
              </div>
            </div>

            {/* Search for 404 */}
            {theActions.includes("search") && (
              <div className="mt-6">
                <label className="sr-only" htmlFor="error-search">
                  검색
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      id="error-search"
                      type="search"
                      placeholder="상품 검색: 모던 셔츠, 데님, 기본티 …"
                      className="w-full rounded-xl bg-gray-50 pl-9 pr-3 h-11 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      onKeyDown={handlekeydown}
                    />
                  </div>
                  <button
                    className="h-11 rounded-xl bg-violet-600 px-4 text-sm font-medium text-white hover:bg-violet-700"
                    onClick={() => goSearch(q)}
                  >
                    검색
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-2">
              {theActions.includes("home") && (
                <ActionLink href="/" icon={<Home className="size-4" />}>
                  홈으로
                </ActionLink>
              )}
              {theActions.includes("back") && (
                <ActionButton
                  onClick={() => window.history.back()}
                  icon={<ArrowLeft className="size-4" />}
                >
                  이전으로
                </ActionButton>
              )}
              {theActions.includes("login") && (
                <ActionLink
                  href="/auth/login"
                  icon={<LockKeyhole className="size-4" />}
                >
                  로그인
                </ActionLink>
              )}
              {theActions.includes("support") && (
                <ActionLink
                  href="/support"
                  icon={<Headset className="size-4" />}
                >
                  고객센터
                </ActionLink>
              )}
              {theActions.includes("status") && (
                <ActionLink
                  href="/status"
                  icon={<WifiOff className="size-4" />}
                >
                  서비스 상태
                </ActionLink>
              )}
            </div>
          </div>
        </div>

        {/* 하단 가이드 */}
        <ul className="mt-6 grid gap-3 text-sm text-gray-200">
          {status === 401 && (
            <li>• 회원가입을 완료하면 장바구니와 마이페이지 기능을 이용할 수 있습니다.</li>
          )}
          {status === 403 && (
            <li>• 관리자 권한이 필요한 페이지입니다. 다른 계정으로 로그인해 보세요.</li>
          )}
          {status === 404 && (
            <li>• 주소를 다시 확인하거나 상단의 검색 기능을 이용해 보세요.</li>
          )}
          {status === 429 && (
            <li>• 새로고침을 반복하기보다 잠시 기다렸다가 다시 시도해 주세요.</li>
          )}
          {[500, 502, 503, 504].includes(status) && (
            <li>• 문제가 계속된다면 오류 발생 시간과 함께 고객센터로 문의해 주세요.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
