import { useState } from "react";
import OrderHistory from "../components/Mypage/OrderHistory";
import MemberInfo from "../components/Mypage/MemberInfo";
import ShippingAddressManager from "../components/Mypage/ShippingAddressManager";
import PasswordChange from "../components/Mypage/PasswordChange";
import MemberWithdrawal from "../components/Mypage/MemberWithdrawal";
import MyReviews from "../components/Mypage/MyReviews";

const menuItems = [
  "주문내역",
  "회원정보 관리",
  "배송지 관리",
  "비밀번호 변경",
  "회원 탈퇴",
  "내가 작성한 리뷰",
];

export default function Mypage() {
  const [selectedMenu, setSelectedMenu] = useState(menuItems[0]);

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-gray-50 pt-20">
      {/* 사이드바 */}
      <aside className="w-full md:w-64 bg-white shadow-md p-4 md:min-h-screen">
        <h2 className="text-xl font-bold mb-6">마이페이지</h2>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li
              key={item}
              className={`cursor-pointer p-3 rounded-lg text-sm md:text-base transition ${
                selectedMenu === item
                  ? "bg-gray-300 text-black shadow"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedMenu(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-2xl font-semibold mb-4">{selectedMenu}</h3>
          <div className="text-gray-600">
            {selectedMenu === "주문내역" && <OrderHistory />}
            {selectedMenu === "회원정보 관리" && <MemberInfo />}
            {selectedMenu === "배송지 관리" && <ShippingAddressManager />}
            {selectedMenu === "비밀번호 변경" && <PasswordChange />}
            {selectedMenu === "회원 탈퇴" && <MemberWithdrawal />}
            {selectedMenu === "내가 작성한 리뷰" && <MyReviews />}
          </div>
        </div>
      </main>
    </div>
  );
}