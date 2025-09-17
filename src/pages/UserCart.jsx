import CartCard from "../components/features/cart/CartCard";
import OrderSummary from "../components/features/cart/OrderSummary";

export default function UserCart(){
  
  //accessToken 추가필요(API 설정 할때 설정해주셔야 합니다.

  return(

  <div className="flex items-center justify-center">
    <div className="flex flex-col w-[1200px] items-center justify-center border-x-gray-600 mt-30 pb-20">
        <p className="text-4xl">장바구니</p>
      <div>

        <sapn>상품정보</sapn>
        <sapn>수량</sapn>
        <sapn>배송구분</sapn>
        <sapn>합계</sapn>
        <sapn>선택</sapn>


      </div>
      <div className="flex mt-3">
        <div className="flex flex-col mr-4">
          <CartCard />
          <CartCard />
        </div>
        <OrderSummary />
        
      </div>
    </div>
  </div>
  )
}