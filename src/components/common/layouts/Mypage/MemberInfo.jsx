import React, { useState, useEffect, useMemo } from "react";

const initialMemberData = {
  name: "홍길동",
  id: "user123@example.com", 
  nickname: "아름다운_닉네임",
  phone: "010-1234-5678",
  telecom: "SKT", 
  birth: "2000-01-01",
};

const existingNicknames = ["admin", "testuser", "개발자_새로운_닉네임", "중복닉네임"];
const existingEmails = ["admin@test.com", "testuser@example.com", "중복@gmail.com"]; 

const predefinedDomains = [
    "naver.com", "gmail.com", "daum.net", "hotmail.com", "nate.com",
];
const emailDomains = [...predefinedDomains, "직접입력"];
const telecomOptions = ["SKT", "KT", "LG U+", "알뜰폰"]; 

export default function MemberInfo() {
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [name] = useState(initialMemberData.name);
  const [nickname, setNickname] = useState(initialMemberData.nickname);
  const [phone] = useState(initialMemberData.phone);
  const [birth] = useState(initialMemberData.birth);
  
  const [currentEmail, setCurrentEmail] = useState(initialMemberData.id); 
  const [tempLocalPart, setTempLocalPart] = useState(""); 
  const [tempDomain, setTempDomain] = useState(""); 
  const [isEditingEmail, setIsEditingEmail] = useState(false); 
  const [isEmailAvailable, setIsEmailAvailable] = useState(true); 
  const [emailCheckMessage, setEmailCheckMessage] = useState(""); 
  
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(true); 
  const [nicknameMessage, setNicknameMessage] = useState(""); 
  const [confirmationMessage, setConfirmationMessage] = useState("");
  
  const [tempPhoneParts, setTempPhoneParts] = useState(initialMemberData.phone.split('-'));
  const [tempTelecom, setTempTelecom] = useState(initialMemberData.telecom);


  const tempEmail = useMemo(() => (tempLocalPart && tempDomain ? `${tempLocalPart}@${tempDomain}` : ""), [tempLocalPart, tempDomain]);
  const isManualDomainInput = useMemo(() => !predefinedDomains.includes(tempDomain), [tempDomain]);
  const selectedDropdownValue = useMemo(() => (predefinedDomains.includes(tempDomain) ? tempDomain : "직접입력"), [tempDomain]);

  useEffect(() => {
    const [local, domain] = currentEmail.split('@');
    setTempLocalPart(local || '');
    setTempDomain(domain || '');
  }, [currentEmail]);

  const [birthYear, birthMonth, birthDay] = birth.split('-');
  const [phoneParts] = useState(phone.split('-'));


  const handlePasswordSubmit = () => {
    if (password === "12345678") {
      setIsVerified(true);
      setPasswordMessage("");
    } else {
      setPasswordMessage("비밀번호가 틀렸습니다. 다시 입력해주세요.");
      setPassword("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handlePasswordSubmit();
    }
  };
  
  const handleNicknameCheck = () => {
    setConfirmationMessage("");
    setNicknameMessage("");

    if (nickname.trim().length < 2) {
      setIsNicknameAvailable(false);
      setNicknameMessage("닉네임은 2자 이상이어야 합니다.");
      return;
    }
    
    if (nickname === initialMemberData.nickname) {
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
  
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
    setIsNicknameAvailable(false); 
    setNicknameMessage(""); 
  }


  const handleEmailEditClick = () => {
    setIsEditingEmail(true);
    const [local, domain] = currentEmail.split('@');
    setTempLocalPart(local || '');
    setTempDomain(domain || '');
    setEmailCheckMessage("");
    setIsEmailAvailable(false);
  };

  const handleDomainChange = (e) => {
    const newSelection = e.target.value;
    setIsEmailAvailable(false);
    setEmailCheckMessage("");

    if (newSelection === "직접입력") {
      setTempDomain(""); 
    } else {
      setTempDomain(newSelection); 
    }
  };

  const handleEmailCheck = () => {
    setEmailCheckMessage("");
    
    if (!tempLocalPart || !tempDomain) { return; }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(tempEmail)) {
        setIsEmailAvailable(false);
        setEmailCheckMessage("유효한 이메일 형식이 아닙니다.");
        return;
    }

    if (tempEmail === currentEmail) {
        setIsEmailAvailable(true);
        setEmailCheckMessage("현재 사용 중인 이메일입니다.");
        return;
    }

    setTimeout(() => {
        if (existingEmails.includes(tempEmail)) {
            setIsEmailAvailable(false);
            setEmailCheckMessage("중복된 이메일입니다.");
        } else {
            setIsEmailAvailable(true);
            setEmailCheckMessage("사용 가능한 이메일입니다!");
        }
    }, 500);
  };
  
  const handlePhonePartChange = (index, value) => {
    const newParts = [...tempPhoneParts];
    newParts[index] = value.replace(/[^0-9]/g, ''); 
    setTempPhoneParts(newParts);
  };

  const handleTelecomChange = (e) => {
    setTempTelecom(e.target.value);
  };
  
  const handleConfirm = () => {
    setConfirmationMessage("");

    if (!isNicknameAvailable) {
      alert("닉네임 중복 확인을 먼저 해주세요.");
      return;
    }
    
    if (isEditingEmail && (!isEmailAvailable || tempEmail === currentEmail)) {
      alert("이메일 변경을 하려면 중복 확인을 완료해야 합니다. 현재 이메일 상태를 확인해주세요.");
      return;
    }

    if (tempPhoneParts.some(part => part.length === 0)) {
        alert("휴대폰번호를 올바르게 입력해주세요.");
        return;
    }

    if (isEditingEmail && isEmailAvailable && tempEmail !== currentEmail) {
        setCurrentEmail(tempEmail);
        setIsEditingEmail(false);
        initialMemberData.id = tempEmail;
    }
    
    const newPhone = tempPhoneParts.join('-');
    if (newPhone !== initialMemberData.phone || tempTelecom !== initialMemberData.telecom) {
        initialMemberData.phone = newPhone;
        initialMemberData.telecom = tempTelecom;
    }

    setConfirmationMessage("정보가 수정되었습니다!");
  };

  const handleCancel = () => {
    setIsVerified(false);
    setConfirmationMessage("");
    
    setNickname(initialMemberData.nickname);
    setIsNicknameAvailable(true);
    setNicknameMessage("");
    
    const [local, domain] = initialMemberData.id.split('@');
    setTempLocalPart(local || '');
    setTempDomain(domain || '');
    setCurrentEmail(initialMemberData.id);
    setIsEditingEmail(false);
    setIsEmailAvailable(true);
    setEmailCheckMessage("");
    
    setTempPhoneParts(initialMemberData.phone.split('-'));
    setTempTelecom(initialMemberData.telecom);
  };

  // -------------------------------------------------------------------
  // 초기 비밀번호 인증 화면
  // -------------------------------------------------------------------

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

  // -------------------------------------------------------------------
  // 회원 정보 수정 화면
  // -------------------------------------------------------------------

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">회원 정보 수정</h3>
      
      {confirmationMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{confirmationMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        
        {/* 1. 이메일 (아이디) */}
        <div className="flex flex-col space-y-2">
          <label className="text-gray-600 font-medium">이메일 (아이디)</label>
          <div className="flex items-start space-x-2 w-full">
            <div className="flex items-center space-x-1 flex-1">
                <input 
                    type="text" 
                    value={isEditingEmail ? tempLocalPart : currentEmail.split('@')[0]} 
                    onChange={(e) => {setTempLocalPart(e.target.value); setIsEmailAvailable(false); setEmailCheckMessage("");}}
                    readOnly={!isEditingEmail}
                    disabled={!isEditingEmail}
                    placeholder="아이디"
                    className={`px-4 py-2 w-2/5 border rounded-lg ${isEditingEmail ? 'bg-white focus:outline-none focus:ring-2 focus:ring-blue-500' : 'bg-gray-100 text-gray-800 cursor-not-allowed'}`}
                />
                <span>@</span>
                
                <div className="flex items-center space-x-1 flex-1">
                    {isEditingEmail ? (
                        <>
                            <input 
                                type="text" 
                                value={isManualDomainInput ? tempDomain : selectedDropdownValue} 
                                onChange={(e) => {setTempDomain(e.target.value); setIsEmailAvailable(false); setEmailCheckMessage("");}}
                                disabled={!isManualDomainInput}
                                placeholder="도메인 직접입력"
                                className={`px-4 py-2 w-1/2 border rounded-lg ${isManualDomainInput ? 'bg-white focus:outline-none focus:ring-2 focus:ring-blue-500' : 'bg-gray-100 text-gray-800 cursor-not-allowed'}`}
                            />
                            <select
                                onChange={handleDomainChange}
                                value={selectedDropdownValue}
                                className="px-2 py-2 w-1/2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                            >
                                {emailDomains.map((domain, index) => (
                                    <option key={index} value={domain}>{domain}</option>
                                ))}
                            </select>
                        </>
                    ) : (
                        <input 
                            type="text" 
                            value={currentEmail.split('@')[1] || ''}
                            readOnly disabled
                            placeholder="도메인"
                            className="px-4 py-2 w-full border rounded-lg bg-gray-100 text-gray-800 cursor-not-allowed"
                        />
                    )}
                </div>
            </div>
            
            {!isEditingEmail ? (
                <button
                    className="px-4 py-2 text-sm text-white bg-black rounded-lg hover:bg-gray-800 transition flex-shrink-0"
                    onClick={handleEmailEditClick}
                >
                    수정
                </button>
            ) : (
                <button
                    className={`px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition flex-shrink-0`}
                    onClick={handleEmailCheck}
                >
                    중복확인
                </button>
            )}
          </div>
          
          {emailCheckMessage && isEditingEmail && (
              <p className={`text-sm mt-1 ${isEmailAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  {emailCheckMessage}
              </p>
          )}
        </div>
        
        {/* 빈 칸 */}
        <div className="hidden md:block"></div> 

        {/* 2. 이름 */}
        <div className="flex flex-col space-y-2">
          <label className="text-gray-600 font-medium">이름</label>
          <input 
            type="text" 
            value={name} 
            readOnly 
            disabled 
            className="px-4 py-2 border rounded-lg bg-gray-100 text-gray-800 cursor-not-allowed max-w-xs" 
          />
        </div>
        
        {/* 3. 닉네임 */}
        <div className="flex flex-col space-y-2">
          <label className="text-gray-600 font-medium">닉네임</label>
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              value={nickname} 
              onChange={handleNicknameChange} 
              className="px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-xs" 
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

        {/* 4. 생년월일 */}
        <div className="flex flex-col space-y-2">
          <label className="text-gray-600 font-medium">생년월일</label>
          <div className="flex items-center space-x-2">
            <input type="text" value={birthYear} readOnly disabled className="px-2 py-2 w-16 text-center border rounded-lg bg-gray-100 text-gray-800 cursor-not-allowed" />
            <span className="text-sm text-gray-500">년</span>
            <input type="text" value={birthMonth} readOnly disabled className="px-2 py-2 w-12 text-center border rounded-lg bg-gray-100 text-gray-800 cursor-not-allowed" />
            <span className="text-sm text-gray-500">월</span>
            <input type="text" value={birthDay} readOnly disabled className="px-2 py-2 w-12 text-center border rounded-lg bg-gray-100 text-gray-800 cursor-not-allowed" />
            <span className="text-sm text-gray-500">일</span>
          </div>
        </div>
        
        {/* 5. 휴대폰번호 (상시 수정 가능) */}
        <div className="flex flex-col space-y-2">
          <label className="text-gray-600 font-medium">휴대폰번호</label> 
          <div className="flex items-center space-x-2 w-full">
            
            <select
              value={tempTelecom}
              onChange={handleTelecomChange}
              className={`px-2 py-2 w-20 text-center border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {telecomOptions.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            
            <input 
              type="text" 
              value={tempPhoneParts[0]}
              onChange={(e) => handlePhonePartChange(0, e.target.value)}
              maxLength="3"
              className={`px-4 py-2 w-20 text-center border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <span>-</span>
            <input 
              type="text" 
              value={tempPhoneParts[1]}
              onChange={(e) => handlePhonePartChange(1, e.target.value)}
              maxLength="4"
              className={`px-4 py-2 w-20 text-center border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <span>-</span>
            <input 
              type="text" 
              value={tempPhoneParts[2]}
              onChange={(e) => handlePhonePartChange(2, e.target.value)}
              maxLength="4"
              className={`px-4 py-2 w-20 text-center border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            
          </div>
        </div>
      </div>
      
      {/* 최종 취소/확인 버튼 */}
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