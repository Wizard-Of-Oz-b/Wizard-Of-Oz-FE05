// 주문 예상 금액
export default function OrderSummary({ sumPrice }) {

  if (Number(sumPrice) === 0 ) {
    return;
  }
  // const deliveFee = sumPrice >= 50000 ? 0 : 3000;
  // const displaySumPrice = Math.floor(sumPrice)
  const displayFinalPrice = Math.floor(sumPrice);

  return (
      <div className="flex flex-col items-center mx-5">
        <span className="text-sm">결제 예정 금액</span>
        <span className="text-2xl">{displayFinalPrice.toLocaleString()} 원</span>
      </div>
  );

  // return (
  //   <div className="flex justify-center items-center border border-gray-200 bg-gray-200 w-full mt-2 py-6">
  //     <div className="flex flex-col mx-5 items-center">
  //       <span className="text-sm">총 상품금액</span>
  //       <span className="text-2xl">{displaySumPrice.toLocaleString()}</span>
  //     </div>
  //     <span>+</span>
  //     <div className="flex flex-col items-center mx-5 ">
  //       <span className="text-sm">총 배송비</span>
  //       <span className="text-2xl">{deliveFee.toLocaleString()}</span>
  //     </div>
  //     <span>=</span>
  //     <div className="flex flex-col items-center mx-5">
  //       <span className="text-sm">결제예정금액</span>
  //       <span className="text-2xl">{displayFinalPrice.toLocaleString()}</span>
  //     </div>
  //   </div>
  // );
}
