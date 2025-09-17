
// 주문 예상 금액
export default function OrderSummary(){


  return(
    <div className="flex flex-col border border-gray-200 w-[250px]">
      <div>
        <span>주문 예상 금액</span> 
      </div>
      <div className="flex flex-wrap">
        <div className="flex justify-between w-100">
          <span>총 상품 가격</span> <span>46,400원</span> 
        </div>
        <div className="flex justify-between w-100">
          <span>총 배송비</span> <span>+0원</span>
        </div>
      </div >
      <div className="w-[99%] my-1 border-[1px] border-gray-300"></div>
      <div className="flex justify-end">
        <span>46,400원</span>
      </div>
      <button className="border w-4/5">주문하기</button>
    </div>
  )
}