import React from "react";

export default function AlertModal({ title, message, color, btnColor, icon, onClose }) {
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
