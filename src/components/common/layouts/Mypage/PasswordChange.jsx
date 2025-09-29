import React, { useState } from "react";
import { updateMyProfile } from "../../api/Mypage/member";

export default function PasswordChange() {
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmNewPassword, setConfirmNewPassword] = useState("");
const [message, setMessage] = useState("");

const handlePasswordChange = async () => {
if (newPassword !== confirmNewPassword) {
setMessage("변경할 비밀번호가 일치하지 않습니다.");
return;
}
try {
await updateMyProfile({
current_password: currentPassword,
new_password: newPassword,
});
setMessage("비밀번호가 성공적으로 변경되었습니다.");
} catch {
setMessage("비밀번호 변경 실패");
}
};

return ( <div className="p-6 bg-white rounded-xl shadow"> <h3 className="text-2xl font-semibold mb-4">비밀번호 변경</h3> <div className="space-y-4">
<input
type="password"
placeholder="현재 비밀번호"
value={currentPassword}
onChange={(e) => setCurrentPassword(e.target.value)}
className="border p-2 rounded w-full"
/>
<input
type="password"
placeholder="새 비밀번호"
value={newPassword}
onChange={(e) => setNewPassword(e.target.value)}
className="border p-2 rounded w-full"
/>
<input
type="password"
placeholder="새 비밀번호 확인"
value={confirmNewPassword}
onChange={(e) => setConfirmNewPassword(e.target.value)}
className="border p-2 rounded w-full"
/> <button
       onClick={handlePasswordChange}
       className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
     >
변경하기 </button>
{message && <p className="text-sm text-red-600 mt-2">{message}</p>} </div> </div>
);
}
