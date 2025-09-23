import axios from "axios";
import { getAccessToken, setAccessToken } from "../../utils/cookie";

// 1. 우리만의 axios 인스턴스 생성
const api = axios.create({
  baseURL: "/api/v1", // BASE_URL을 인스턴스 생성 시 설정
});

// 2. 요청 인터셉터: 모든 요청에 Access Token을 헤더에 담아 보냄
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. 응답 인터셉터: 401 에러 발생 시 Access Token을 재발급받고, 원래 요청을 다시 시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고, 재시도한 요청이 아닐 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 재시도 플래그 설정

      try {
        // Refresh Token(HttpOnly 쿠키)을 이용해 새로운 Access Token을 요청
        // 브라우저가 자동으로 HttpOnly 쿠키를 담아 보내므로, 요청 본문은 비워둡니다.
        const { data } = await axios.post(
          "/api/auth/refresh",
          {},
          {
            withCredentials: true, // cross-origin 요청 시 쿠키 전송을 위해 필요
          }
        );

        const newAccessToken = data.accessToken;
        setAccessToken(newAccessToken); // 새로 받은 Access Token을 쿠키에 저장

        // 실패했던 원래 요청의 헤더에 새로운 토큰을 설정
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // 원래 요청을 다시 시도
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh Token도 만료된 경우 (로그아웃 처리)
        console.error("토큰 재발급 실패:", refreshError);
        // 예: 로그아웃 처리 함수 호출
        // logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
