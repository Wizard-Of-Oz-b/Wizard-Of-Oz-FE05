import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useConfirmTossPayment } from "../../hooks/payments/usePayment";
import CartLoadingSpin from "../../components/features/cart/CartLoadingSpin";

export default function PaySuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const confirmPaymentMutation = useConfirmTossPayment();

  useEffect(() => {
    const requestData = {
      orderId: searchParams.get("orderId"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),
    };
    // 서버로 정보 전송
    if (
      !requestData.paymentKey ||
      !requestData.orderId ||
      !requestData.amount
    ) {
      alert("잘못된 접근입니다. 홈으로 이동합니다.");
      navigate("/");
    }
    // else{
    //   confirmPaymentMutation.mutate({
    //     paymentKey: requestData.paymentKey,
    //     orderId : requestData.orderId,
    //     amount: requestData.amount
    //   })
    // }

    console.log(requestData);
  }, []);

  if (confirmPaymentMutation.isPending) {
    return (
      <div>
        <CartLoadingSpin />
        <p className = 'text-center mt-[20px]'>
          결제를 최종 확인하고 있습니다...
        </p>
      </div>
    );
  }

  if (confirmPaymentMutation.isError) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1>결제 승인 실패</h1>
        <p>
          결제 처리 중 오류가 발생했습니다. 문제가 지속될 경우 고객센터로
          문의해주세요.
        </p>
        <button onClick={() => navigate("/")}>홈으로 돌아가기</button>
      </div>
    );
  }

  const onClickMypage = () => {
    console.log("마이페이지 접속");
  };
  const onClickHompage = () => {
    console.log("홈페이지 접속");
    navigate("/");
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="border w-3/4 py-1 px-2">
        <h1 className="text-2xl mb-5">결제가 완료 되었습니다.</h1>
        <p>{`주문번호: ${searchParams.get("orderId")}`}</p>
        <p>{`결제 금액: ${Number(
          searchParams.get("amount")
        ).toLocaleString()}원`}</p>
      </div>
      <div className="mt-10">
        <button
          className="border border-gray-400 px-1 rounded mr-3"
          onClick={onClickMypage}
        >
          마이페이지
        </button>
        <button
          className="border border-gray-400 px-1 rounded mr-3"
          onClick={onClickHompage}
        >
          쇼핑 계속하기
        </button>
      </div>
    </div>
  );
}
