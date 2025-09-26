import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAccessToken } from "../../utils/cookie";

const BASE_URL = "/api/v1";

const orderApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE + "/v1", // 차후 실제 연결 할때 사용
  // baseURL: BASE_URL,
});
orderApi.interceptors.request.use(
  (config) => {
    // 쿠키에서 accessToken을 가져옵니다.
    const accessToken = getAccessToken();

    // 토큰이 존재하면 Authorization 헤더에 추가합니다.
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    // 요청 에러 처리
    return Promise.reject(error);
  }
);
// ▲
// 백엔드의 주문 생성 API를 호출하는 함수
const createPurchaseAPI = async () => {
  const response = await orderApi.post("/orders/checkout/");
  return response.data;
};

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createPurchaseAPI,

    onSuccess: (data) => {
      // API 호출이 성공하면 실행됩니다.
      console.log("주문 생성 성공:", data);

      // 예시: 성공 후 장바구니 데이터를 새로고침
      queryClient.invalidateQueries({ queryKey: ["userCart"] });
      // 성공 하면 결제선택창으로 이동한다.
      navigate(`/payment`);
    },

    onError: (error) => {
      // Axios 에러 객체에서 실제 서버 응답 데이터에 접근
      const errorData = error.response?.data;

      // 서버가 보낸 다양한 형태의 에러 메시지를 순차적으로 확인
      const errorMessage =
        errorData?.message || // { "message": "인증이 필요합니다." }
        errorData?.detail || // { "detail": "자격 증명이..." }
        "알 수 없는 오류가 발생했습니다."; // 그 외의 경우

      console.error("주문 실패:", errorData);
      alert(errorMessage); // 사용자에게 에러 메시지 나중에 모달창을 교체

      // 인증 에러(401)인 경우, 로그인 페이지로 보내는 등의 추가 처리도 가능
      if (error.response?.status === 401) {
        //로그인 으로 이동
        //차후 모달 창 추가 하기
        navigate("/login");
      }
    },
  });
};
