import { useState } from "react";
import { updateMyProfile } from "../../api/Mypage/member";

export default function PasswordChange() {
  const [isVerified, setIsVerified] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [changeMessage, setChangeMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState("");


  const handlePasswordSubmit = () => {
    if (!currentPassword) {
      setPasswordMessage("현재 비밀번호를 입력해주세요.");
      return;
    }
      setIsVerified(true);
      setPasswordMessage("");
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
    
    if (passwordStrength !== "안전") {
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
    if (password.length === 0) {
      setPasswordStrength("");
      return;
    }
    
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasBoth = hasLetter && hasSpecial;

    if (password.length >= 8 && hasBoth) {
      setPasswordStrength("안전");
    } else if (password.length >= 8 && (hasLetter || hasSpecial)) {
      setPasswordStrength("보통");
    } else {
      setPasswordStrength("미흡");
    }
  };
  
  const handleNewPasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    checkPasswordStrength(password);
    setChangeMessage("");
    if (password === confirmNewPassword) {
      setConfirmPasswordMessage("비밀번호가 일치합니다.");
    } else {
      setConfirmPasswordMessage("비밀번호가 일치하지 않습니다.");
    }
  };
  
  const checkConfirmPassword = (e) => {
    const confirmPassword = e.target.value;
    setConfirmNewPassword(confirmPassword);
    
    if (newPassword === confirmPassword) {
      setConfirmPasswordMessage("비밀번호가 일치합니다.");
    } else {
      setConfirmPasswordMessage("비밀번호가 일치하지 않습니다.");
    }
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

  if (!isVerified) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">비밀번호를 입력해주세요</h3>
        <input
          type="password"
          className="w-full max-w-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          placeholder="현재 비밀번호"
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

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow">
      <h3 className="text-2xl font-semibold"></h3>
      
      {changeMessage && (
        <div className={`p-3 rounded-lg ${changeMessage.includes("성공적으로 변경") ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {changeMessage}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-gray-600 font-medium">변경 비밀번호</label>
          <input
            type="password"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
          {newPassword.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-semibold ${passwordStrength === "안전" ? 'text-green-600' : passwordStrength === "보통" ? 'text-yellow-600' : 'text-red-600'}`}>
                비밀번호 강도: {passwordStrength}
              </span>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            비밀번호는 영문(대문자 또는 소문자)과 특수문자를 포함한 8자 이상이어야 합니다.
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-gray-600 font-medium">변경 비밀번호 확인</label>
          <input
            type="password"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={confirmNewPassword}
            onChange={checkConfirmPassword}
          />
          {confirmNewPassword.length > 0 && (
            <p className={`text-sm ${newPassword === confirmNewPassword ? 'text-blue-600' : 'text-red-600'}`}>
              {confirmPasswordMessage}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <button
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          onClick={handleCancel}
        >
          취소
        </button>
        <button
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          onClick={handlePasswordChange}
        >
          확인
        </button>
      </div>
    </div>
  );
}