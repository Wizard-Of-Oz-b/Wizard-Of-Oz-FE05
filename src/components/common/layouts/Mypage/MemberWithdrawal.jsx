import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { deleteMyAccount, verifyPassword } from "../../api/Mypage/member";
import { useAuth } from "../../../../context/AuthContext";
import {
  ShieldAlert, ShieldCheck, KeyRound, AlertTriangle, CheckCircle2,
  ChevronRight, ChevronLeft
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const withdrawalReasons = [
  "개인정보 유출 우려",
  "서비스 불만족",
  "이용 빈도가 낮음",
  "상품 가격 불만족",
  "배송/CS 불만족",
  "기타 (직접입력)",
];

export default function MemberWithdrawal() {
  const { user } = useAuth();
  const [step, setStep] = useState(1); 
  const [currentPassword, setCurrentPassword] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [withdrawalMessage, setWithdrawalMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false); 
  
  const [isAgreed, setIsAgreed] = useState(false);
  const [agreementMessage, setAgreementMessage] = useState("");

  const navigate = useNavigate();


  const stepVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  useEffect(() => {
    if (step === 4) {
      const t = setTimeout(() => navigate("/", { replace: true }), 2000);
      return () => clearTimeout(t);
    }
  }, [step, navigate]);

  const handlePasswordSubmit = async () => {
    if (!currentPassword) return setPasswordMessage("비밀번호를 입력해주세요");
    try {
      await verifyPassword({ email: user?.email, password: currentPassword });
      setStep(2);
      setPasswordMessage("");
    } catch {
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

  const handleFinalWithdrawal = async () => {
    try {
      await deleteMyAccount({
        current_password: currentPassword,
        reason: selectedReason === "기타 (직접입력)" ? otherReason : selectedReason,
      });
      setWithdrawalMessage("회원 탈퇴가 완료되었습니다.");
      setStep(4);
    } catch (e) {
      const msg =
      e?.response?.data?.detail ||
      e?.response?.data?.message ||
      "회원 탈퇴에 실패했습니다. 비밀번호를 다시 확인해주세요.";
    setWithdrawalMessage(msg);
    setShowConfirm(false);
    }
  };

  const handleCancelWithdrawal = () => {
    setShowConfirm(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  
  // ───────────────── UI ─────────────────
  const Stepper = () => (
    <div className="w-full">
      <div className="h-1 w-full rounded bg-neutral-100 overflow-hidden mb-6">
        <div
          className="h-full bg-[linear-gradient(90deg,#7c3aed_0%,#ec4899_100%)] transition-all"
          style={{ width: `${(step - 1) * 33.33}%` }}
        />
      </div>
      <div className="grid grid-cols-3 gap-3 text-xs text-neutral-600">
        <div className={`flex items-center gap-2 ${step >= 1 ? "text-neutral-900" : ""}`}>
          <span className={`h-5 w-5 flex items-center justify-center rounded-full text-white text-[11px] 
            ${step >= 1 ? "bg-violet-600" : "bg-neutral-300"}`}>1</span>
          본인 확인
        </div>
        <div className={`flex items-center gap-2 ${step >= 2 ? "text-neutral-900" : ""}`}>
          <span className={`h-5 w-5 flex items-center justify-center rounded-full text-white text-[11px] 
            ${step >= 2 ? "bg-violet-600" : "bg-neutral-300"}`}>2</span>
          유의사항 동의
        </div>
        <div className={`flex items-center gap-2 ${step >= 3 ? "text-neutral-900" : ""}`}>
          <span className={`h-5 w-5 flex items-center justify-center rounded-full text-white text-[11px] 
            ${step >= 3 ? "bg-violet-600" : "bg-neutral-300"}`}>3</span>
          사유 선택
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">회원 탈퇴</h2>
          <p className="mt-1 text-sm text-neutral-600">
            탈퇴 전 안내를 꼭 확인해 주세요.
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-neutral-50 px-3 py-1 border border-neutral-200 text-[11px] text-neutral-600">
          <ShieldCheck className="h-3.5 w-3.5" />
          보안 절차 진행 중
        </span>
      </div>

      {/* 스텝퍼 */}
      <Stepper />

      <AnimatePresence mode="wait">
      {/* 스텝 1: 비밀번호 확인 */}
      {step === 1 && (
        <motion.div 
            key={1}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="h-5 w-5 text-neutral-500" />
            <h3 className="text-lg font-semibold">본인 확인</h3>
          </div>

          <p className="text-sm text-neutral-600 mb-4">
            보안을 위해 비밀번호를 다시 한 번 입력해주세요.
          </p>

          <div className="max-w-sm">
            <input
              type="password"
              className="w-full h-11 rounded-lg border border-neutral-300 px-3 text-sm focus:ring-2 focus:ring-violet-500 transition"
              placeholder="비밀번호"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {passwordMessage && (
              <p className="text-sm text-red-600 mt-2">{passwordMessage}</p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              className="px-5 h-10 rounded-full border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-50 transition inline-flex items-center gap-1.5"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
              돌아가기
            </button>
            <button
              className="px-6 h-10 rounded-full text-sm font-semibold text-white
                         bg-[linear-gradient(90deg,#7c3aed_0%,#ec4899_100%)]
                         shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition"
              onClick={handlePasswordSubmit}
            >
              다음 <ChevronRight className="inline-block ml-1 h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* 스텝 2: 유의사항 동의 */}
      {step === 2 && (
        <motion.div 
            key={2}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold text-red-600">회원 탈퇴 전 유의사항</h3>
          </div>

          <div className="border border-red-200 p-4 rounded-lg bg-red-50 space-y-3 text-sm text-neutral-700">
            <p className="font-semibold text-base text-red-700">
              탈퇴 시 모든 정보가 삭제되며, 복구가 불가능합니다.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>진행 중인 주문/취소/반품/교환 내역은 자동 삭제되지 않으니 탈퇴 전 확인해 주세요.</li>
              <li>재가입 시에도 탈퇴 전 정보(주문 내역 등)는 복구되지 않습니다.</li>
            </ul>
          </div>

          {agreementMessage && (
            <div className="mt-3 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
              {agreementMessage}
            </div>
          )}

          <label className="mt-5 flex items-start gap-3">
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={(e) => {
                setIsAgreed(e.target.checked);
                setAgreementMessage("");
              }}
              className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <span className="text-sm text-neutral-800">
              위 내용을 확인하였으며, 이에 동의합니다.
            </span>
          </label>

          <div className="mt-6 flex justify-end gap-2">
            <button
              className="px-5 h-10 rounded-full border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-50 transition"
              onClick={() => {
                setStep(1);
                setIsAgreed(false);
                setAgreementMessage("");
              }}
            >
              취소 (이전 단계)
            </button>
            <button
              className="px-6 h-10 rounded-full text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition"
              onClick={handleAgreementSubmit}
            >
              다음
            </button>
          </div>
        </motion.div>
      )}

      {/* 스텝 3: 사유 선택 & 확인 */}
      {step === 3 && (
        <motion.div 
            key={3}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          {!showConfirm && (
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-neutral-500" />
              <h3 className="text-lg font-semibold">탈퇴 사유를 선택해주세요</h3>
            </div>
          )}

          {withdrawalMessage && !showConfirm && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                withdrawalMessage.includes("완료")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {withdrawalMessage}
            </div>
          )}

          {/* 사유 선택 */}
          {!showConfirm && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {withdrawalReasons.map((reason) => {
                  const checked = selectedReason === reason;
                  return (
                    <label
                      key={reason}
                      htmlFor={reason}
                      className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition
                        ${checked ? "border-violet-300 bg-violet-50/60" : "border-neutral-200 hover:bg-neutral-50"}`}
                    >
                      <input
                        type="radio"
                        id={reason}
                        name="withdrawalReason"
                        value={reason}
                        checked={checked}
                        onChange={(e) => {
                          setSelectedReason(e.target.value);
                          setOtherReason("");
                          setWithdrawalMessage("");
                        }}
                        className="h-4 w-4 text-violet-600 focus:ring-violet-500"
                      />
                      <span className="text-sm text-neutral-800">{reason}</span>
                    </label>
                  );
                })}
              </div>

              {selectedReason === "기타 (직접입력)" && (
                <textarea
                  className="mt-3 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 transition"
                  rows={3}
                  placeholder="탈퇴 사유를 자세히 입력해주세요."
                  value={otherReason}
                  onChange={(e) => {
                    setOtherReason(e.target.value);
                    setWithdrawalMessage("");
                  }}
                />
              )}

              <div className="mt-6 flex justify-end gap-2">
                <button
                  className="px-5 h-10 rounded-full border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-50 transition"
                  onClick={() => setStep(2)}
                >
                  취소 (이전 단계)
                </button>
                <button
                  className="px-6 h-10 rounded-full text-sm font-semibold text-white
                             bg-[linear-gradient(90deg,#7c3aed_0%,#ec4899_100%)]
                             shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition"
                  onClick={handleConfirmWithdrawal}
                >
                  다음
                </button>
              </div>
            </>
          )}

          {/* 최종 확인 모달(패널) */}
          {showConfirm && (
            <div className="p-6 border border-red-300 bg-red-50 rounded-2xl">
              <p className="text-center font-medium text-red-700 mb-4">
                정말 탈퇴하시겠습니까?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  className="px-6 h-10 rounded-full text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition"
                  onClick={handleFinalWithdrawal}
                >
                  확인
                </button>
                <button
                  className="px-6 h-10 rounded-full border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-50 transition"
                  onClick={handleCancelWithdrawal}
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* 스텝 4: 성공 화면 */}
      {step === 4 && (
        <motion.div 
            key={4}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl shadow-sm border border-neutral-200">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
          <h3 className="text-2xl font-bold text-emerald-700 mb-2">
            회원 탈퇴가 완료되었습니다.
          </h3>
          <p className="text-sm text-neutral-600 mb-1">
            오즈의 이상한 상점을 이용해 주셔서 감사합니다.
          </p>
          <p className="text-xs text-neutral-400">잠시 후 메인 페이지로 이동합니다.</p>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}