
// 주문 예상 금액
export default function OrderSummary({sumPrice}){
  if(sumPrice === 0){
    return;
  }
  const delive_fee = sumPrice >= 50000 ? 0 : 3000;

  return(
    <div className="flex justify-center items-center border border-gray-200 bg-gray-200 w-full mt-2 py-6">
      <div className="flex flex-col mx-5 items-center">
        <span className="text-sm">총 상품금액</span>
        <span className="text-2xl">{Math.floor(sumPrice.toLocaleString())}</span>
      </div>
      <span>+</span>
      <div className="flex flex-col items-center mx-5 ">
        <span className="text-sm">총 배송비</span>
        <span className="text-2xl">{delive_fee.toLocaleString()}</span>
      </div>
      <span>=</span>
      <div className="flex flex-col items-center mx-5">
        <span className="text-sm">결제예정금액</span>
        <span className="text-2xl">{Math.floor((sumPrice+delive_fee).toLocaleString())}</span>
      </div>
    </div>
  )
}