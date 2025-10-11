import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useConfirmTossPayment } from "../../hooks/payments/usePayment";
import CartLoadingSpin from "../../components/features/cart/CartLoadingSpin";
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";
import PaymentIndicator from "../../components/features/payment/PaymentIndicator";
import PaymentResultSkeleton from "../../components/skeletons/PaymentResultSkeleton";

export default function PaySuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const confirmPaymentMutation = useConfirmTossPayment();
  const requestData = {
    orderId: searchParams.get("orderId"),
    amount: searchParams.get("amount"),
    paymentKey: searchParams.get("paymentKey"),
  };

  const handleConfirmToss = () => {
    confirmPaymentMutation.mutate({
      paymentKey: requestData.paymentKey,
      orderId: requestData.orderId,
      amount: requestData.amount,
    });
  };

  useEffect(() => {
    // 서버로 정보 전송
    if (
      !requestData.paymentKey ||
      !requestData.orderId ||
      !requestData.amount
    ) {
      // alert("잘못된 접근입니다. 홈으로 이동합니다.");
      navigate("/");
    } else {
      // 성공 데이터 서버로 전송
      handleConfirmToss();
    }

    console.log(requestData);
  }, []);

  // 결고 상태 저장 하기
  useEffect(() => {
    if (confirmPaymentMutation.isPending) {
      setStatus("loading");
    } else if (confirmPaymentMutation.isError) {
      setStatus("fail");
    } else if (confirmPaymentMutation.isSuccess) {
      setStatus("success");
    }
  }, [confirmPaymentMutation]);

  const onClickMypage = () => {
    console.log("마이페이지 접속");
    navigate("/Mypage");
  };
  const onClickHompage = () => {
    console.log("홈페이지 접속");
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center border border-neutral-300 shadow-xl w-150 py-10 px-2">
        {/* <FaCheckCircle size={60} color="black" /> */}
        <PaymentIndicator status={status} />
        {confirmPaymentMutation.isPending && <PaymentResultSkeleton />}
        {!confirmPaymentMutation.isPending && 
          <>
            <h1 className="text-2xl mb-5">
              {status === "success"
                ? "결제가 완료 되었습니다."
                : "결제 승인 실패"}
            </h1>
            <p>
              {status === "fail"
                ? "주문이 처리되지 않아 결제가 완료되지 않았습니다."
                : "주문이 정상적으로 처리되었습니다."}
            </p>
            <div className="bg-neutral-100 px-14 py-8">
              <p>{`주문 번호: ${searchParams.get("orderId")}`}</p>

              <p>{`결제 금액: ${Number(
                searchParams.get("amount")
              ).toLocaleString()}원`}</p>
            </div>
            <div className="mt-10 flex justify-between gap-1.5 w-full ">
              <button
                className="border flex-1 h-8 border-gray-400 px-1 rounded cursor-pointer"
                onClick={onClickMypage}
              >
                마이페이지
              </button>
              {status === "success" ? (
                <button
                  className="border flex-1 h-8 border-gray-400 px-1 text-white rounded  bg-admintheme-violet cursor-pointer"
                  onClick={onClickHompage}
                >
                  쇼핑 계속하기
                </button>
              ) : (
                <button
                  className="border flex-1 h-8 border-gray-400 px-1 text-white rounded  bg-red-500 cursor-pointer"
                  onClick={handleConfirmToss}
                >
                  다시 시도하기
                </button>
              )}
            </div>
          </>
        
        }
      </div>
    </div>
  );

  // 로딩
  // if (confirmPaymentMutation.isPending) {
  //   return (
  //     <div>
  //       <CartLoadingSpin />
  //       <p className="text-center mt-[20px]">
  //         결제를 최종 확인하고 있습니다...
  //       </p>
  //     </div>
  //   );
  // }

  // // 결제 에러 발생!
  // if (confirmPaymentMutation.isError) {
  //   console.log(confirmPaymentMutation.error);
  //   return (
  //     <div className="flex flex-col items-center justify-center">
  //       <div className="flex flex-col items-center border w-150 py-10 px-2">
  //         <MdError size={60} color="black" />
  //         <h1 className="text-2xl mb-5">결제 승인 실패</h1>
  //         <p>
  //           결제 처리 중 오류가 발생했습니다. 지속적으로 문제가 발생하면
  //           고객센터로 문의 주세요.
  //         </p>
  //       </div>
  //       <button
  //         className="border border-gray-400 px-1 rounded mr-3"
  //         onClick={() => navigate("/")}
  //       >
  //         홈으로 돌아가기
  //       </button>
  //     </div>
  //   );
  // }
}
