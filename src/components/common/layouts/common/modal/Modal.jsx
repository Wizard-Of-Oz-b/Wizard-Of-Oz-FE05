import React, { useState } from "react";

function AlertModal({ type, onClose }) {
  const alertConfig = {
    warning: {
      title: "경고",
      message: "이 작업은 되돌릴 수 없습니다. 정말 진행하시겠습니까?",
      color: "text-red-600",
      btnColor: "bg-red-600 hover:bg-red-700",
      icon: "⚠",
    },
    loginRequired: {
      title: "로그인 필요",
      message: "이 서비스를 이용하려면 로그인이 필요합니다.",
      color: "text-black",
      btnColor: "bg-black hover:bg-gray-800",
      icon: "🔑",
    },
    paymentError: {
      title: "결제 오류",
      message: "결제 처리 중 문제가 발생했습니다. 다시 시도해주세요.",
      color: "text-red-600",
      btnColor: "bg-red-600 hover:bg-red-700",
      icon: "💳",
    },
    loginError: {
      title: "로그인 실패",
      message: "아이디 또는 비밀번호가 올바르지 않습니다.",
      color: "text-red-600",
      btnColor: "bg-red-600 hover:bg-red-700",
      icon: "❌",
    },
    quantityExceeded: {
      title: "회원가입 완료",
      message: "회원가입 완료, 로그인페이지로 넘어갑니다.",
      color: "text-black",
      btnColor: "bg-black hover:bg-gray-800",
      icon: "🔑",
    },
    outOfStock: {
      title: "비밀번호 변경 완료",
      message: "비밀번호가 성공적으로 변경되었습니다.",
      color: "text-black",
      btnColor: "bg-black hover:bg-gray-800",
      icon: "🔑",
    },
  };

  const { title, message, color, btnColor, icon } = alertConfig[type];

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <h2 className={`text-xl font-bold mb-4 ${color}`}>
          {icon} {title}
        </h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-white rounded-lg ${btnColor}`}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [modalType, setModalType] = useState(null);

  return (
    <div className="p-6 flex flex-col gap-3">
      {/* 모달 띄우는 버튼들 */}
      <button
        onClick={() => setModalType("warning")}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        경고
      </button>
      <button
        onClick={() => setModalType("loginRequired")}
        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
      >
        로그인 필요
      </button>
      <button
        onClick={() => setModalType("paymentError")}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        결제 에러
      </button>
      <button
        onClick={() => setModalType("loginError")}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        로그인 에러
      </button>
      <button
        onClick={() => setModalType("quantityExceeded")}
        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
      >
        회원가입 완료
      </button>
      <button
        onClick={() => setModalType("outOfStock")}
        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
      >
        비밀번호 변경 완료
      </button>

      {/* 모달 */}
      {modalType && (
        <AlertModal type={modalType} onClose={() => setModalType(null)} />
      )}
    </div>
  );
}