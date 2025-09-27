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
  
  const [isAgreed, setIsAgreed] = useState(false);
  const [agreementMessage, setAgreementMessage] = useState("");

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
  
  const handleAgreementSubmit = () => {
    if (isAgreed) {
      setStep(3); 
      setAgreementMessage("");
    } else {
      setAgreementMessage("탈퇴 유의사항에 동의해야 다음 단계로 진행할 수 있습니다.");
    }
  };

  const handleConfirmWithdrawal = () => {
    if (selectedReason && (selectedReason !== "기타 (직접입력)" || otherReason.trim())) {
        setWithdrawalMessage(""); 
        setShowConfirm(true);
    } else if (selectedReason === "기타 (직접입력)" && !otherReason.trim()) {
        setWithdrawalMessage("기타 사유를 입력해주세요.");
        setShowConfirm(false); 
    } else {
        setWithdrawalMessage("탈퇴 사유를 선택해주세요.");
        setShowConfirm(false);
    }
  };

  const handleFinalWithdrawal = () => {
    setStep(4);
  };

  const handleCancelWithdrawal = () => {
    setShowConfirm(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

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
  
  if (step === 2) {
      return (
          <div className="space-y-6 p-6 bg-white rounded-xl shadow">
              <h3 className="text-2xl font-semibold mb-4 text-red-600">회원 탈퇴 전 유의사항</h3>
              
              <div className="border border-red-200 p-4 rounded-lg bg-red-50 space-y-3 text-sm text-gray-700">
                  <p className="font-semibold text-base text-red-700">탈퇴 시 모든 정보가 삭제되며, 복구가 불가능합니다.</p>
                  <ul className="list-disc list-inside space-y-1">
                      <li>진행 중인 주문/취소/반품/교환 내역은 자동 삭제되지 않으니, 탈퇴 전 확인해 주세요.</li>
                      <li>재가입 시에도 탈퇴 전 정보(주문 내역 등)는 복구되지 않습니다.</li>
                  </ul>
              </div>
              
              {agreementMessage && (
                <div className="p-3 rounded-lg bg-red-100 text-red-700">
                    {agreementMessage}
                </div>
              )}
              
              <div className="flex items-center space-x-2 pt-4">
                  <input 
                      type="checkbox"
                      id="agreementCheck"
                      checked={isAgreed}
                      onChange={(e) => {
                        setIsAgreed(e.target.checked);
                        setAgreementMessage("");
                      }}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <label htmlFor="agreementCheck" className="text-lg font-medium">위 내용을 확인하였으며, 이에 동의합니다.</label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                  <button
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                      onClick={() => {
                          setStep(1); 
                          setIsAgreed(false);
                          setAgreementMessage("");
                      }}
                  >
                      취소 (이전 단계)
                  </button>
                  <button
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                      onClick={handleAgreementSubmit}
                  >
                      다음
                  </button>
              </div>
          </div>
      );
  }

  if (step === 3) {
      return (
        <div className="space-y-6 p-6 bg-white rounded-xl shadow">
          
          {!showConfirm && (
              <h3 className="text-2xl font-semibold mb-4">탈퇴 사유를 선택해주세요</h3>
          )}
          
          {withdrawalMessage && !showConfirm && ( 
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
                      setWithdrawalMessage("");
                    }}
                  />
                )}
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                  onClick={() => setStep(2)} 
                >
                  취소 (이전 단계)
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
  
  if (step === 4) {
      setTimeout(() => {
          navigate("/");
      }, 2000); 

      return (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow h-64">
              <svg className="w-12 h-12 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <h3 className="text-2xl font-bold text-green-700 mb-2">회원 탈퇴가 완료되었습니다.</h3>
              <p className="text-lg text-gray-600 mb-4">오즈의 이상한 상점을 이용해 주셔서 감사합니다.</p>
              <p className="text-sm text-gray-400">잠시 후 메인 페이지로 자동 이동합니다.</p>
          </div>
      );
  }
}