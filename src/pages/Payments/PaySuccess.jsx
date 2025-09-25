import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaySuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const requestData = {
    orderId: searchParams.get("orderId"),
    amount: searchParams.get("amount"),
    paymentKey: searchParams.get("paymentKey"),
  };
  useEffect(() => {
    // 서버로 정보 전송
    console.log(requestData);
  }, []);

  const onClickMypage = () => {
    console.log("마이페이지 접속");
  };
  const onClickHompage = () => {
    console.log("홈페이지 접속");
    navigate('/')
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="border w-3/4 py-1 px-2">
        <h1 className="text-2xl mb-5">결제 요약</h1>
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
          onClick={onClickHompage}>쇼핑 계속하기</button>
      </div>
    </div>
  );
}
