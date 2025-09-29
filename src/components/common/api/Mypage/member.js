import api from "../../../../lib/axios";

// 내 프로필 조회
export const getMyProfile = () => api.get("/v1/users/me/");
// 프로필 수정 (이름/닉네임/전화번호/주소, 비밀번호 변경도 가능)
export const updateMyProfile = (data) => api.patch("/v1/users/me/", data);
// 계정 삭제 (소프트 삭제) -> 2025.09.29 경복 수정
export const deleteMyAccount = (body) => 
    api.delete("/v1/users/me/", {data: body});
// 현재 내 비밀번호 검증하기 -> 2025.09.29 경복 추가
export const verifyPassword = ({ email, password }) =>
    api.post("/v1/auth/login/", {email, password }, {noAuth: true});