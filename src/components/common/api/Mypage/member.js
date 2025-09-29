import api from "../../../../lib/axios";

// 내 프로필 조회
export const getMyProfile = () => api.get("/api/v1/users/me/");
// 프로필 수정 (이름/닉네임/전화번호/주소, 비밀번호 변경도 가능)
export const updateMyProfile = (data) => api.patch("/api/v1/users/me/", data);
// 계정 삭제 (소프트 삭제)
export const deleteMyAccount = () => api.delete("/api/v1/users/me/");