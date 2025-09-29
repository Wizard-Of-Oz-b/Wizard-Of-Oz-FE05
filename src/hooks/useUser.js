import { useQuery } from "@tanstack/react-query";
import userApi from "../lib/api/userAxios";

/**
 * 내 프로필 정보를 가져오는 API 함수
 */
const getMyProfileAPI = async () => {
  const response = await userApi.get("/users/me/");
  return response.data;
};

/**
 * 내 프로필 정보를 가져오는 useQuery 훅
 * @param {object} options - useQuery에 전달할 추가 옵션 (예: enabled)
 */
export const useMyProfile = (options) => {
  return useQuery({
    queryKey: ["myProfile"],
    queryFn: getMyProfileAPI,

    // 훅을 사용하는 곳에서 enabled, staleTime 등의 옵션을 주입할 수 있도록 설정
    ...options,
  });
};
