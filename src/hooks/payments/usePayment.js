import { useMutation } from "@tanstack/react-query";
import userApi from "../../lib/api/userAxios";

/**
 * 백엔드에 토스 결제 승인을 요청하는 API 함수
 * @param {object} paymentData
 * @param {string} paymentData.paymentKey - 토스에서 받은 결제 키
 * @param {string} paymentData.orderId - 우리 시스템의 주문 ID
 * @param {string | number} paymentData.amount - 검증할 결제 금액
 */
const confirmTossPaymentAPI = async (paymentData) => {
  try {
    const response = await userApi.post("/payments/toss/confirm/", paymentData);
    return response.data;
  } catch (error) {
    //중복 요청시(사용자가 새로고침등 다양한 원인에의해 두번 요청된 경우
    if (error?.response?.data?.detail === "already confirmed") {
      console.log("이미 처리된 요청이므로, 에러 메시지를 무시합니다.");
      return { status: "ALREADY_CONFIRMED" };   // 차후 status를 이용해서 모달창 출력할 수 있으면 할것
    }

    throw error;
  }
};

export const useConfirmTossPayment = () => {
  return useMutation({
    mutationFn: confirmTossPaymentAPI,

    onSuccess: (data) => {
      // 최종 승인 성공 시 실행
      console.log("결제 최종 승인 성공:", data);
      alert("결제가 성공적으로 완료되었습니다.");
      // 여기서 추가적으로 필요한 로직을 실행할 수 있습니다.
      // 예: queryClient.invalidateQueries(...)
    },

    onError: (error) => {
      // 최종 승인 실패 시 실행
      const errorData = error.response?.data;
      const errorMessage =
        errorData?.message ||
        errorData?.detail ||
        "결제 승인 중 오류가 발생했습니다.";

      console.error("결제 최종 승인 실패:", errorData);
      //추후에 공용 모달창으로 변경 해야 한다.
      alert(errorMessage);
    },
  });
};
