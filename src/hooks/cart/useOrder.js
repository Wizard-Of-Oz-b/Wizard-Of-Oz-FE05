import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken } from "../../utils/cookie";
import userApi from "../../lib/api/userAxios";

// const BASE_URL = "/api/v1";

// const orderApi = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE + "/v1", // 차후 실제 연결 할때 사용
//   // baseURL: BASE_URL,
// });
// orderApi.interceptors.request.use(
//   (config) => {
//     // 쿠키에서 accessToken을 가져옵니다.
//     const accessToken = getAccessToken();

//     // 토큰이 존재하면 Authorization 헤더에 추가합니다.
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }

//     return config;
//   },
//   (error) => {
//     // 요청 에러 처리
//     return Promise.reject(error);
//   }
// );

// 백엔드의 주문 생성 API를 호출하는 함수
const createPurchaseAPI = async () => {
  const response = await userApi.post("/orders/checkout/");
  return response.data;
};


// 주문 요청 합치기

const mergeOrderAPI = async (payload) => {
  const response = await userApi.post('/orders/merge/', payload);
  return response.data;
}

/**
 * '배송 준비중' 상태인 모든 주문의 배송지를 일괄 업데이트하는 API 함수
 * @param {object} payload - 요청 본문에 담길 데이터
 * @param {object} payload.address - 새로운 주소 정보 객체
 */
const updateAllReadyShippingAddressAPI = async (payload) => {
  const response = await userApi.patch(
    "/orders/purchases/update-all-ready-shipping-address/",
    payload
  );
  return response.data;
};

// 기본 배송지 변경 아님
export const useUpdateShippingAddress = () => {
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAllReadyShippingAddressAPI,

    onSuccess: (data) => {
      console.log("배송지 일괄 수정 성공:", data);
    },

    onError: (error) => {
      const errorData = error.response?.data;
      const errorMessage =
        errorData?.message ||
        errorData?.detail ||
        "배송지 변경 중 오류가 발생했습니다.";
      console.error("배송지 수정 실패:", errorData);
      alert(errorMessage);
    },
  });
};

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPurchaseAPI,

    onSuccess: (data) => {
      // API 호출이 성공하면 실행됩니다.
      console.log("주문 생성 성공:", data);

      // 예시: 성공 후 장바구니 데이터를 새로고침
      queryClient.invalidateQueries({ queryKey: ["userCart"] });
    },

    onError: (error) => {
      // Axios 에러 객체에서 실제 서버 응답 데이터에 접근
      const errorData = error.response?.data;

      // 서버가 보낸 다양한 형태의 에러 메시지를 순차적으로 확인
      const errorMessage =
        errorData?.message || // { "message": "인증이 필요합니다." }
        errorData?.detail || // { "detail": "자격 증명이..." }
        errorData?.stock || // { "detail": "재고 부족..." }
        "알 수 없는 오류가 발생했습니다."; // 그 외의 경우
        console.error("주문 실패:", errorData);
        throw errorMessage
      // alert(errorMessage); // 사용자에게 에러 메시지 나중에 모달창을 교체

      // // 인증 에러(401)인 경우, 로그인 페이지로 보내는 등의 추가 처리도 가능
      // if (error.response?.status === 401) {
      //   //로그인 으로 이동
      //   //차후 모달 창 추가 하기
      //   navigate("/login");
      // }
    },
  });
};

// 주문 merge
export const useMergeOrder = () =>{
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: mergeOrderAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCart'] });
    },
    onError: (error) => {
      console.error("주문 머지 실패:", error);
    }
  })

}
