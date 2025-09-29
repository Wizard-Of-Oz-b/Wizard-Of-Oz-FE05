export default function VirtualAccountEx() {
  return (
    <ul className={`text-sm bg-gray-200 py-2 px-2 mt-2`}>
      <li>
        * 입금 계좌: 주문 완료 페이지 및 주문 확인 메시지에서 확인하실 수
        있습니다.
      </li>
      <li>
        * 필수 확인: 입금하실 때 받는 사람과 입금액이 주문 정보와 정확히
        일치하는지 반드시 확인해 주세요.
      </li>
      <li>* 입금 기한: 주문일로부터 3일 (미입금 시 자동 주문 취소)</li>
      <li>
        * 환불 안내: 입금 후 취소 시, 환불받으실 계좌를 알려주시면 해당 계좌로
        입금해 드립니다.
      </li>
    </ul>
  );
}
