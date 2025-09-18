import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const withdrawalReasons = [
  "개인정보 유출 우려",
  "서비스 불만족",
  "이용 빈도가 낮음",
  "상품 가격 불만족",
  "배송/CS 불만족",
  "기타 (직접입력)",
];

export default function MemberWithdrawal() {
  const [step, setStep] = useState(1);
  const [currentPassword, setCurrentPassword] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [withdrawalMessage, setWithdrawalMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false); 

  const defaultPassword = "12345678";
  const navigate = useNavigate();

  const handlePasswordSubmit = () => {
    if (currentPassword === defaultPassword) {
      setStep(2);
      setPasswordMessage("");
    } else {
      setPasswordMessage("비밀번호가 틀렸습니다. 다시 입력해주세요.");
      setCurrentPassword("");
    }
  };

  const handleConfirmWithdrawal = () => {
    if (!selectedReason && !otherReason) {
      setWithdrawalMessage("탈퇴 사유를 선택하거나 입력해주세요.");
      return;
    }
    
    setWithdrawalMessage("");
    setShowConfirm(true);
  };

  const handleFinalWithdrawal = () => {
    setWithdrawalMessage("탈퇴되었습니다.");
    setTimeout(() => {
      navigate("/");
    }, 1500); 
  };

  const handleCancelWithdrawal = () => {
    setShowConfirm(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  // 1단계: 비밀번호 입력 화면
  if (step === 1) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">비밀번호를 입력해주세요</h3>
        <input
          type="password"
          className="w-full max-w-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          placeholder="비밀번호"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {passwordMessage && (
          <p className="text-sm text-red-600 mb-4">{passwordMessage}</p>
        )}
        <button
          className="w-full max-w-sm px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          onClick={handlePasswordSubmit}
        >
          입력
        </button>
      </div>
    );
  }

  // 2단계: 탈퇴 사유 선택 화면
  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow">
      <h3 className="text-2xl font-semibold mb-4">회원 탈퇴 사유를 선택해주세요</h3>
      
      {withdrawalMessage && (
        <div className={`p-3 rounded-lg ${withdrawalMessage.includes("탈퇴되었습니다") ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {withdrawalMessage}
        </div>
      )}

      {showConfirm ? (
        <div className="p-6 border border-red-300 bg-red-50 rounded-lg">
          <p className="text-center font-medium mb-4">정말 탈퇴하시겠습니까?</p>
          <div className="flex justify-center space-x-4">
            <button
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              onClick={handleFinalWithdrawal}
            >
              확인
            </button>
            <button
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              onClick={handleCancelWithdrawal}
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {withdrawalReasons.map((reason) => (
              <div key={reason} className="flex items-center space-x-2">
                <input 
                  type="radio"
                  id={reason}
                  name="withdrawalReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => {
                    setSelectedReason(e.target.value);
                    setOtherReason("");
                    setWithdrawalMessage(""); 
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor={reason} className="text-gray-600">{reason}</label>
              </div>
            ))}
            {selectedReason === "기타 (직접입력)" && (
              <textarea
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                rows="3"
                placeholder="탈퇴 사유를 자세히 입력해주세요."
                value={otherReason}
                onChange={(e) => {
                  setOtherReason(e.target.value);
                  setWithdrawalMessage(""); // Clear message when user types
                }}
              />
            )}
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <button
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              onClick={() => setStep(1)}
            >
              취소
            </button>
            <button
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              onClick={handleConfirmWithdrawal}
            >
              확인
            </button>
          </div>
        </>
      )}
    </div>
  );
}