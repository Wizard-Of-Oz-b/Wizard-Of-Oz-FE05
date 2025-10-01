import { useState } from "react";
import { updateMyProfile, verifyPassword } from "../../api/Mypage/member";
import { useAuth } from "../../../../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, CheckCircle2, ShieldCheck } from "lucide-react";


const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,16}$/;

export default function PasswordChange() {
  const { user } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [changeMessage, setChangeMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState("");

  const variants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeInOut" } },
    exit: { opacity: 0, y: -16, transition: { duration: 0.2, ease: "easeInOut" } },
  };

  const handlePasswordSubmit = async () => {
    if (!currentPassword) return setPasswordMessage("현재 비밀번호를 입력해주세요.");
    try {
      await verifyPassword({email: user?.email, password: currentPassword});
      setIsVerified(true);
      setPasswordMessage("");
    } catch (e) {
      setPasswordMessage("현재 비밀번호가 올바르지 않습니다.");
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmNewPassword) {
      setChangeMessage("새 비밀번호와 확인 비밀번호를 모두 입력해주세요.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setChangeMessage("변경할 비밀번호가 일치하지 않습니다.");
      return;
    }
    
    if (!PASSWORD_REGEX.test(newPassword)) {
      setChangeMessage("비밀번호는 대문자 또는 소문자, 그리고 특수문자를 포함한 8자 이상이어야 합니다.");
      return;
    }

    try {
      await updateMyProfile({
        current_password: currentPassword,
        new_password: newPassword,
    });
    setChangeMessage("비밀번호가 성공적으로 변경되었습니다.");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordStrength("");
    setConfirmPasswordMessage("");
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        "비밀번호 변경에 실패했습니다. 현재 비밀번호를 다시 확인해주세요.";
      setChangeMessage(msg);
    }
  };
  
  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength("");
      return;
    }
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score >= 5) setPasswordStrength("안전");
    else if (score >= 3) setPasswordStrength("보통");
    else setPasswordStrength("미흡");
  };
  
  const handleNewPasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    checkPasswordStrength(password);
    setChangeMessage("");
    setConfirmPasswordMessage(
      password && password === confirmNewPassword
        ? "비밀번호가 일치합니다."
        : "비밀번호가 일치하지 않습니다."
      );  
  };
  
  const checkConfirmPassword = (e) => {
    const confirmPassword = e.target.value;
    setConfirmNewPassword(confirmPassword);
    setConfirmPasswordMessage(
      newPassword && newPassword === confirmPassword
        ? "비밀번호가 일치합니다."
        : "비밀번호가 일치하지 않습니다."
    );
  };

  const handleCancel = () => {
    setIsVerified(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordMessage("");
    setChangeMessage("");
    setPasswordStrength("");
    setConfirmPasswordMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handlePasswordSubmit();
    }
  };
return (
  <div className="space-y-8">
    {/* 상단 타이틀 & 진행바 */}
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900">
          비밀번호 변경
        </h3>
        <p className="mt-1 text-sm text-neutral-600">
          계정 보안을 위해 안전한 비밀번호로 업데이트하세요.
        </p>
      </div>
      <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-neutral-50 px-3 py-1 border border-neutral-200 text-[11px] text-neutral-600">
        보안 절차 진행 중
      </span>
    </div>

    {/* 스텝퍼 */}
    <div>
      <div className="h-1 w-full rounded bg-neutral-100 overflow-hidden">
        <div
          className="h-full bg-[linear-gradient(90deg,#7c3aed_0%,#ec4899_100%)] transition-all"
          style={{ width: isVerified ? "100%" : "50%" }}
        />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-3 text-xs text-neutral-600">
        <div className={`flex items-center gap-2 ${!isVerified ? "text-neutral-900" : ""}`}>
          <span className={`h-5 w-5 flex items-center justify-center rounded-full text-white text-[11px] ${!isVerified ? "bg-violet-600" : "bg-neutral-300"}`}>1</span>
          본인 확인
        </div>
        <div className={`flex items-center gap-2 ${isVerified ? "text-neutral-900" : ""}`}>
          <span className={`h-5 w-5 flex items-center justify-center rounded-full text-white text-[11px] ${isVerified ? "bg-violet-600" : "bg-neutral-300"}`}>2</span>
          새 비밀번호 설정
        </div>
      </div>
    </div>

    <AnimatePresence mode="wait">
      {/* STEP 1: 본인확인 */}
      {!isVerified ? (
        <motion.div
          key="step1"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.25 } }}
          exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-5 max-w-md mx-auto">
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">현재 비밀번호</label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full h-11 rounded-lg border border-neutral-300 px-3 pr-10 text-sm focus:ring-2 focus:ring-violet-500 transition"
                  placeholder="현재 비밀번호를 입력하세요"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400">•••</span>
              </div>
              {passwordMessage && (
                <div className="mt-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {passwordMessage}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-5 h-10 rounded-full border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-50 transition"
                onClick={handleCancel}
              >
                취소
              </button>
              <button
                type="button"
                className="px-6 h-10 rounded-full text-sm font-semibold text-white
                           bg-[linear-gradient(90deg,#7c3aed_0%,#ec4899_100%)]
                           shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition"
                onClick={handlePasswordSubmit}
              >
                다음
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        /* STEP 2: 새 비밀번호 */
        <motion.div
          key="step2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.25 } }}
          exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-6 max-w-xl">
            {changeMessage && (
              <div
                className={`rounded-xl border px-4 py-3 text-sm ${
                  changeMessage.includes("성공")
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                {changeMessage}
              </div>
            )}

            {/* 새 비밀번호 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">새 비밀번호</label>
              <input
                type="password"
                className="w-full h-11 rounded-lg border border-neutral-300 px-3 text-sm focus:ring-2 focus:ring-violet-500 transition"
                value={newPassword}
                onChange={handleNewPasswordChange}
                placeholder="영문/숫자/특수문자 8자 이상"
              />

              {/* 강도 게이지 */}
              {newPassword?.length > 0 && (
                <div className="mt-1 space-y-1.5">
                  <div className="h-2 w-full bg-neutral-100 rounded">
                    <div
                      className={`h-2 rounded transition-all ${
                        passwordStrength === "안전"
                          ? "w-full bg-emerald-500"
                          : passwordStrength === "보통"
                          ? "w-2/3 bg-amber-400"
                          : "w-1/3 bg-rose-500"
                      }`}
                    />
                  </div>
                  <div className="text-xs font-medium text-neutral-600">
                    비밀번호 강도:{" "}
                    <span
                      className={
                        passwordStrength === "안전"
                          ? "text-emerald-600"
                          : passwordStrength === "보통"
                          ? "text-amber-600"
                          : "text-rose-600"
                      }
                    >
                      {passwordStrength || "측정 중"}
                    </span>
                  </div>
                </div>
              )}

              <ul className="mt-2 text-xs text-neutral-500 space-y-1">
                <li>대/소문자, 숫자, 특수문자를 조합해서 안전하게 변경해주세요.</li>
                <li>다른 사이트와 동일한 비밀번호 사용은 자제해 주세요.</li>
              </ul>
            </div>

            {/* 새 비밀번호 확인 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">새 비밀번호 확인</label>
              <input
                type="password"
                className="w-full h-11 rounded-lg border border-neutral-300 px-3 text-sm focus:ring-2 focus:ring-violet-500 transition"
                value={confirmNewPassword}
                onChange={checkConfirmPassword}
                placeholder="다시 한 번 입력"
              />
              {confirmNewPassword?.length > 0 && (
                <p
                  className={`text-sm ${
                    newPassword === confirmNewPassword ? "text-violet-600" : "text-rose-600"
                  }`}
                >
                  {confirmPasswordMessage}
                </p>
              )}
            </div>

            {/* 액션 */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="px-6 h-10 rounded-full border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-50 transition"
                onClick={handleCancel}
              >
                취소
              </button>
              <button
                type="button"
                className="px-6 h-10 rounded-full text-sm font-semibold text-white
                           bg-[linear-gradient(90deg,#7c3aed_0%,#ec4899_100%)]
                           shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition inline-flex items-center gap-1"
                onClick={handlePasswordChange}
              >
                확인
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
}