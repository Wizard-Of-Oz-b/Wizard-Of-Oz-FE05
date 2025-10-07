import { Outlet, NavLink } from "react-router-dom";
import {
  Package, UserCog, MapPin, Lock, UserX, Star, ChevronRight,
  ChevronDown, Headphones, Gift, BadgeCheck, Award, LayoutGrid,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

// 조미현멘토님 피드백 반영, 회원탈퇴를 회원정보 관리 내 자그마하게 ...
const menuItems = [
  { name: "대시보드", path: "/mypage", icon: LayoutGrid, end: true },
  { name: "주문내역", path: "orderlist", icon: Package },
  { name: "회원정보 관리", path: "memberinfo", icon: UserCog },
  { name: "배송지 관리", path: "shipping", icon: MapPin },
  { name: "비밀번호 변경", path: "password", icon: Lock },
  { name: "내가 작성한 리뷰", path: "reviews", icon: Star },
  { name: "회원 등급 안내", path: "members", icon: Award },
];

export default function Mypage() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const displayName = user?.nickname || user?.name || (user?.email?.split("@")[0] ?? "회원");
  const avatarLetter = displayName[0]?.toUpperCase();

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="h-1 w-full bg-[linear-gradient(90deg,#7c3aed_0%,#ec4899_100%)]" />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* 헤더 / 브레드크럼 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span className="hover:text-neutral-700 cursor-default">홈</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-neutral-800 font-medium">마이페이지</span>
          </div>

          {/* 모바일 사이드바 토글 */}
          <button
            onClick={() => setOpen(v => !v)}
            className="md:hidden inline-flex items-center gap-1 text-sm px-3 py-2 rounded-md border border-neutral-200 hover:bg-neutral-50"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
            메뉴
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* 사이드바 */}
          <aside className={`col-span-12 md:col-span-4 lg:col-span-3 space-y-6 ${open ? "" : "hidden md:block"}`}>
            {/* 프로필 카드 */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-white flex items-center justify-center font-bold">
                  {avatarLetter}
                </div>
                <div>
                  <div className="text-sm text-neutral-500">어서오세요,</div>
                  <div className="text-lg font-semibold">{displayName}님</div>
                  <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-violet-50 text-violet-700 text-[11px] px-2.5 py-1 border border-violet-200">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    VIP MEMBER
                  </div>
                </div>
              </div>

              {/* 혜택/리워드 요약 */}
              <div className="mt-4 grid grid-cols-2 divide-x divide-neutral-200 rounded-lg border border-neutral-200 overflow-hidden text-center">
                <div className="px-3 py-3">
                  <div className="text-[11px] text-neutral-500">포인트</div>
                  <div className="mt-0.5 text-sm font-semibold">12,300P</div>
                </div>
                <div className="px-3 py-3">
                  <div className="text-[11px] text-neutral-500">쿠폰</div>
                  <div className="mt-0.5 text-sm font-semibold">3장</div>
                </div>
              </div>
            </div>

            {/* 네비게이션 */}
            <nav className="rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm">
              <ul className="space-y-1">
                {menuItems.map(({ name, path, icon: Icon, end }) => (
                  <li key={path}>
                    <NavLink
                      to={path}
                      end={end}
                      className={({ isActive }) =>
                        [
                          "group flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition",
                          isActive
                            ? "bg-neutral-900 text-white shadow-sm"
                            : "text-neutral-700 hover:bg-neutral-50"
                        ].join(" ")
                      }
                    >
                      <span
                        className={
                          "flex h-8 w-8 items-center justify-center rounded-lg border " +
                          "transition " +
                          "group-[.bg-neutral-900]:border-neutral-800 group-[.bg-neutral-900]:bg-neutral-800 " +
                          "group-[.bg-neutral-900]:text-white " +
                          "border-neutral-200 bg-white text-neutral-700 group-hover:border-neutral-300"
                        }
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <span className="flex-1">{name}</span>
                      <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-80" />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* 메인 콘텐츠 */}
          <main className="col-span-12 md:col-span-8 lg:col-span-9">
            {/* 상단 타이틀 카드 */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">마이페이지</h1>
                  <p className="mt-1 text-sm text-neutral-600">
                    주문 확인부터 회원정보 변경까지, 이곳에서 한 번에 관리하세요.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 border border-violet-200 text-[11px] text-violet-700">
                    <Star className="h-3.5 w-3.5" />
                    회원 전용 혜택 진행 중
                  </span>
                </div>
              </div>
            </div>

            {/* 라우팅 처리되는 부분 */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}


