import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";

// 공식 예제 코드의 로직을 Modal 컴포넌트 안에 재구성합니다.
export default function PaymentModal({ isOpen, onClose, paymentData }) {
  const [widgets, setWidgets] = useState(null);
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: 30000,
  });
  const [ready, setReady] = useState(false);

  // useEffect #1: 위젯 인스턴스 생성
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
    const customerKey = paymentData.customerKey || ANONYMOUS;

    async function initializeWidgets() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const widgetInstance = tossPayments.widgets({ customerKey });
        setWidgets(widgetInstance);
      } catch (error) {
        console.error("TossPayments 초기화 중 에러 발생:", error);
        alert("결제 시스템을 불러오는 데 실패했습니다.");
        onClose();
      }
    }

    initializeWidgets();
  }, [isOpen, paymentData.customerKey]);

  // useEffect #2: 위젯 UI 렌더링
  useEffect(() => {
    if (widgets == null || !paymentData?.amount) {
      return;
    }

    async function renderWidgets() {
      try {
        const newAmount = {
          currency: "KRW",
          value: Number(paymentData?.amount),
        };
        console.log('위젯 값', newAmount)
        await widgets.setAmount(newAmount);
        setAmount(newAmount);

        await widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        });
        await widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        });
        setReady(true);
      } catch (error) {
        console.error("위젯 렌더링 중 에러 발생:", error);
        alert("결제 UI를 렌더링하는 중 문제가 발생했습니다.");
        onClose();
      }
    }

    renderWidgets();
  }, [widgets]);

  // useEffect #3: 금액 변경 시 위젯 업데이트
  useEffect(() => {
    if (widgets == null || !paymentData?.amount) {
      return;
    }
    const newAmountValue = Number(paymentData.amount);
    if (amount.value !== newAmountValue) {
      setAmount({ currency: "KRW", value: newAmountValue });
      console.log(newAmountValue ,'테스트 금액 변경');
      widgets.setAmount(amount);
    }
  }, [widgets, paymentData?.amount]);

  // 결제하기 버튼 클릭 핸들러
  const handlePayment = async () => {
    if (!widgets || !ready) {
      alert("결제 위젯이 아직 준비되지 않았습니다.");
      return;
    }

    try {
      await widgets.requestPayment({
        orderId: paymentData.orderId,
        orderName: paymentData.orderName,
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
        customerEmail: paymentData.customerEmail,
        customerName: paymentData.customerName,
      });
    } catch (error) {
      console.error("결제 요청 중 에러 발생:", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex justify-center items-center z-50">
      {/* 모달 닫기 기능이 필요하다면 이 div에 onClick={onClose}를 추가할 수 있습니다. */}
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6">주문서</h2>

        <div id="payment-method" className="w-full"></div>
        <div id="agreement" className="w-full mt-4"></div>

        <button
          onClick={handlePayment}
          disabled={!ready}
          className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded mt-8 disabled:bg-gray-400"
        >
          {console.log(amount, '테스트')}
          {ready
            ? `${paymentData.amount.toLocaleString()}원 결제하기`
            : "결제 정보 로딩 중..."}
        </button>
      </div>
    </div>
  );
}
