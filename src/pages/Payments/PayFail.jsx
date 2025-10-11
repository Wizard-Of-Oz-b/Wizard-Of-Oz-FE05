import { useNavigate, useSearchParams } from "react-router-dom";
import PaymentIndicator from "../../components/features/payment/PaymentIndicator";

export default function PayFail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");
  const orderId = searchParams.get("orderId");
  const onClickHomeBtn = () => {
    navigate("/");
  };
  const onClickpayment = () => {
    navigate("/payment");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center border border-neutral-300 shadow-xl w-150 py-10 px-2">
        <PaymentIndicator status={"fail"} />
        {/* {confirmPaymentMutation.isPending && <PaymentResultSkeleton />} */}
        <>
          <h1 className="text-2xl mb-5">토스 결제 실패</h1>
          <p>
            토스 결제에 실패 했습니다. 문제가 지속될 경우 고객센터로
            문의해주세요.
          </p>
          <div className="bg-neutral-100 px-14 py-8">
            <p>{`주문 번호: ${orderId}`}</p>
            <p>{`실패 코드: ${errorCode}`}</p>
            <p>{`실패 사유: ${errorMessage}`}</p>
          </div>
          <div className="mt-10 flex justify-between gap-1.5 w-full ">
            <button
              className="border flex-1 h-8 border-gray-400 px-1 rounded cursor-pointer"
              onClick={onClickHomeBtn}
            >
              메인 화면으로 돌아가기
            </button>
            <button
              className="border flex-1 h-8 border-gray-400 px-1 text-white rounded  bg-red-500 cursor-pointer"
              onClick={onClickpayment}
            >
              결제로 돌아가기
            </button>
          </div>
        </>
      </div>
    </div>
  );
}
