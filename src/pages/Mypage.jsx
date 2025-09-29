import { Outlet, NavLink } from "react-router-dom";

const menuItems = [
  { name: "주문내역", path: "orderhistory" },
  { name: "회원정보 관리", path: "memberinfo" },
  { name: "배송지 관리", path: "shipping" },
  { name: "비밀번호 변경", path: "password" },
  { name: "회원 탈퇴", path: "withdrawal" },
  { name: "내가 작성한 리뷰", path: "reviews" },
];

export default function Mypage() {
  return (
    <div className="min-h-screen bg-gray-50 text-neutral-900">
      <div className="mx-auto w-full max-w-7xl px-6 flex flex-col md:flex-row">
        {/* 사이드바 */}
        <aside className="w-full md:w-64 bg-white shadow-md p-4 md:min-h-screen">
          <h2 className="text-xl font-bold mb-6">마이페이지</h2>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block p-3 rounded-lg text-sm md:text-base transition ${
                      isActive
                        ? "bg-gray-300 text-black shadow"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}