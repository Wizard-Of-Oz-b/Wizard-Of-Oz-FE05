import React, { useEffect } from "react";

export default function AlertModal({ type = "info", title, message, onClose }) {
  const alertConfig = {
    success: {
      color: "text-green-600",
      btnColor: "bg-green-600 hover:bg-green-700",
      icon: "✅",
      defaultTitle: "성공",
    },
    warning: {
      color: "text-yellow-600",
      btnColor: "bg-yellow-600 hover:bg-yellow-700",
      icon: "⚠️",
      defaultTitle: "경고",
    },
    error: {
      color: "text-red-600",
      btnColor: "bg-red-600 hover:bg-red-700",
      icon: "❌",
      defaultTitle: "오류",
    },
    info: {
      color: "text-blue-600",
      btnColor: "bg-blue-600 hover:bg-blue-700",
      icon: "ℹ️",
      defaultTitle: "알림",
    },
  };

  const { color, btnColor, icon, defaultTitle } =
    alertConfig[type] || alertConfig.info;

  // ESC 키 닫기 이벤트 등록
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose} // 배경 클릭 시 닫기
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()} // 내부 클릭은 닫히지 않게 막기
      >
        <h2 className={`text-xl font-bold mb-4 ${color}`}>
          {icon} {title || defaultTitle}
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
