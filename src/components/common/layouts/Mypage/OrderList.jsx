import { useState } from "react"


export default function OrderList() {

  // orderId 가져오기 => userOrderList 상태값으로 사용
  // orderId 별로 상품가져오기  => 이거 카드에서 직접 조회
  // orderId로 배송 조회 이건 카드에서 직접 조회 하기
  
  const [userOrderList, setUserOrderList] = useState(null);

  

  return(
  <div>

    {/* userOrderList를 map을 사용해서 id는 purchase_id 오더카드로 출력 */}
    {/* 오더카드에서는 purchase_id를 넘겨 받는다. */}
    {/* 오더카드에서는 상품 요약 사진 출력 */}
    {/* 각 상품 상태값 사용 */}


  </div>)
}