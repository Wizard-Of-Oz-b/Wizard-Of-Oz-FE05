import { useState } from "react";

const existingNicknames = ["admin", "testuser", "개발자_새로운_닉네임"];

export default function MemberInfo() {
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [nickname, setNickname] = useState("아름다운_닉네임");
  const [emailLocalPart, setEmailLocalPart] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(true); 
  const [nicknameMessage, setNicknameMessage] = useState("현재 사용 중인 닉네임입니다.");
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const emailDomains = [
    "직접입력",
    "naver.com",
    "gmail.com",
    "daum.net",
    "hotmail.com",
    "nate.com",
  ];

  const handlePasswordSubmit = () => {
    if (password === "12345678") {
      setIsVerified(true);
      setPasswordMessage("");
    } else {
      setPasswordMessage("비밀번호가 틀렸습니다. 다시 입력해주세요.");
      setPassword("");
    }
  };

  const handleNicknameCheck = () => {
    setConfirmationMessage("");

    if (nickname.trim().length < 2) {
      setIsNicknameAvailable(false);
      setNicknameMessage("닉네임은 2자 이상이어야 합니다.");
      return;
    }
    
    if (nickname === "아름다운_닉네임") {
      setIsNicknameAvailable(true);
      setNicknameMessage("현재 사용 중인 닉네임입니다.");
      return;
    }
    
    setTimeout(() => {
      if (existingNicknames.includes(nickname)) {
        setIsNicknameAvailable(false);
        setNicknameMessage("이미 사용 중인 닉네임입니다.");
      } else {
        setIsNicknameAvailable(true);
        setNicknameMessage("사용 가능한 닉네임입니다!");
      }
    }, 500);
  };
  
  const handleConfirm = () => {
    if (!isNicknameAvailable) {
      alert("닉네임 중복 확인을 먼저 해주세요.");
      return;
    }

    setConfirmationMessage(`정보가 수정되었습니다! 새로운 닉네임: ${nickname}, 새로운 이메일: ${emailLocalPart}@${emailDomain}`);

  };

  const handleCancel = () => {
    setIsVerified(false);
    setConfirmationMessage("");
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
        {confirmationMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 w-full max-w-sm" role="alert">
                <span className="block sm:inline">{confirmationMessage}</span>
            </div>
        )}
        <input
          type="password"
          className="w-full max-w-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold"></h3>
      
      {confirmationMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{confirmationMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
        {/* 이름 */}
        <div className="flex flex-col space-y-2">
          <label className="text-gray-600 font-medium">이름</label>
          <input type="text" value="홍길동" readOnly disabled className="px-4 py-2 border rounded-lg bg-gray-100 text-gray-800 cursor-not-allowed" />
        </div>
        
        {/* 닉네임 */}
        <div className="flex flex-col space-y-2">
          <label className="text-gray-600 font-medium">닉네임</label>
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              value={nickname} 
              onChange={(e) => {
                setNickname(e.target.value);
                setIsNicknameAvailable(false); 
                setNicknameMessage("");
              }}
              className="px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <button
              className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition flex-shrink-0"
              onClick={handleNicknameCheck}
            >
              중복확인
            </button>
          </div>
          {nicknameMessage && (
            <p className={`text-sm ${isNicknameAvailable ? 'text-green-600' : 'text-red-600'}`}>
              {nicknameMessage}
            </p>
          )}
        </div>
        
        {/* 아이디 */}
        <div className="flex flex-col space-y-2">
          <label className="text-gray-600 font-medium">아이디</label>
          <input type="text" value="user123" readOnly disabled className="px-4 py-2 border rounded-lg bg-gray-100 text-gray-800 cursor-not-allowed" />
        </div>
        
        {/* 생년월일 */}
        <div className="flex flex-col space-y-2">
          <label className="text-gray-600 font-medium">생년월일</label>
          <div className="flex items-center space-x-2">
            <input type="text" value="2000" readOnly disabled className="px-2 py-2 w-16 text-center border rounded-lg bg-gray-100 text-gray-800 cursor-not-allowed" />
            <span className="text-sm text-gray-500">년</span>
            <input type="text" value="01" readOnly disabled className="px-2 py-2 w-12 text-center border rounded-lg bg-gray-100 text-gray-800 cursor-not-allowed" />
            <span className="text-sm text-gray-500">월</span>
            <input type="text" value="01" readOnly disabled className="px-2 py-2 w-12 text-center border rounded-lg bg-gray-100 text-gray-800 cursor-not-allowed" />
            <span className="text-sm text-gray-500">일</span>
          </div>
        </div>
        
        {/* 휴대폰 */}
        <div className="flex flex-col space-y-2">
          <label className="text-gray-600 font-medium">휴대폰</label>
          <div className="flex items-center space-x-2">
            <input type="text" value="SKT" readOnly disabled className="px-4 py-2 w-16 text-center border rounded-lg bg-gray-100 text-gray-800 cursor-not-allowed" />
            <input type="text" value="010" readOnly disabled className="px-4 py-2 w-20 text-center border rounded-lg bg-gray-100 text-gray-800 cursor-not-allowed" />
            <span>-</span>
            <input type="text" value="1234" readOnly disabled className="px-4 py-2 w-20 text-center border rounded-lg bg-gray-100 text-gray-800 cursor-not-allowed" />
            <span>-</span>
            <input type="text" value="5678" readOnly disabled className="px-4 py-2 w-20 text-center border rounded-lg bg-gray-100 text-gray-800 cursor-not-allowed" />
          </div>
        </div>
        
        {/* 이메일 */}
        <div className="flex flex-col space-y-2 col-span-1 md:col-span-2">
          <label className="text-gray-600 font-medium">이메일</label>
          <div className="flex items-center space-x-1">
            <input 
              type="text" 
              value={emailLocalPart} 
              onChange={(e) => setEmailLocalPart(e.target.value)}
              className="px-4 py-2 w-32 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <span>@</span>
            <input 
              type="text" 
              value={emailDomain} 
              onChange={(e) => setEmailDomain(e.target.value)}
              className="px-4 py-2 w-32 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              disabled={emailDomain === "직접입력"}
            />
            <select
              onChange={(e) => {
                setEmailDomain(e.target.value);
                if (e.target.value === "직접입력") {
                  setEmailDomain("");
                }
              }}
              className="px-2 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {emailDomains.map((domain, index) => (
                <option key={index} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* 취소/확인 버튼 */}
      <div className="flex justify-end space-x-4 pt-4">
        <button
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          onClick={handleCancel}
        >
          취소
        </button>
        <button
          className={`px-6 py-2 rounded-lg transition ${isNicknameAvailable ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
          onClick={handleConfirm}
          disabled={!isNicknameAvailable}
        >
          확인
        </button>
      </div>
    </div>
  );
}