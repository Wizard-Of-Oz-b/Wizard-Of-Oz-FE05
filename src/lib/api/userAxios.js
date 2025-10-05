import axios from "axios";
import { getAccessToken, removeAccessToken, setAccessToken } from "../../utils/cookie";

// 1. 유저 axios 인스턴스 생성
const userApi = axios.create({
  // baseURL: "/api/v1", // BASE_URL을 인스턴스 생성 시 설정
  baseURL: import.meta.env.VITE_API_BASE + "/v1",
});

// 2. 요청 인터셉터: 모든 요청에 Access Token을 헤더에 담아 보냄
userApi.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    // access 없으면 로그인으로
    if(!accessToken){
      window.location.href = '/login'
    }
    else if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;

    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. 응답 인터셉터: 401 에러 발생 시 Access Token을 재발급받고, 원래 요청을 다시 시도
userApi.interceptors.response.use(
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
          `${import.meta.env.VITE_API_BASE}/v1/auth/token/refresh/`,
          {},
          {
            withCredentials: true, // cross-origin 요청 시 쿠키 전송을 위해 필요
            headers: { Accept: "application/json" },
          }
        );

        const newAccessToken = data.accessToken;
        setAccessToken(newAccessToken); // 새로 받은 Access Token을 쿠키에 저장
        
        userApi.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        // 실패했던 원래 요청의 헤더에 새로운 토큰을 설정
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // 원래 요청을 다시 시도
        return userApi(originalRequest);

      } catch (refreshError) {
        // Refresh Token도 만료된 경우 (로그아웃 처리)
        // 로그인 화면 또는 메인 화면으로 리다이렉션 추가하기
        console.error("토큰 재발급 실패:", refreshError);

        //  실패하면 클라이언트 측의 인증 정보를 모두 삭제합니다.
        // logout();
        await axios.post(
          `${import.meta.env.VITE_API_BASE}/v1/auth/logout/`,
          {},
          {withCredentials: true}
        )
        if(getAccessToken()){
          removeAccessToken()
        }
        

        //  사용자에게 알리고, 로그인 페이지로 리다이렉트시킵니다.
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/login"; // 페이지를 새로고침하며 이동

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default userApi;
