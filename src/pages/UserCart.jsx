import CartCard from "../components/features/cart/CartCard";
import CartDays from "../components/features/cart/CartDays";
import CartToolbar from "../components/features/cart/CartToolbar";
import OrderSummary from "../components/features/cart/OrderSummary";

export default function UserCart(){
  
  //accessToken 추가필요(API 설정 할때 설정해주셔야 합니다.

  return(

    <div className="flex w-full  justify-center">
      <div className="flex flex-col w-full items-center justify-center border-x-gray-600 mt-30 pb-20">
          <p className="text-4xl mb-3">장바구니</p>
        <div>

          <CartToolbar />

        </div>
        <div className="flex flex-col mt-3">
          <div className="flex flex-col mr-4">
            <CartCard />
            <CartCard />
          </div>
          

          <div className="flex justify-between mt-2">
            <button className="border border-gray-300 px-2 py-0.5">선택상품 삭제</button>
            <button className="border border-gray-300 px-2 py-0.5">장바구니 비우기</button>
          </div>

          <OrderSummary />
          <CartDays />
        </div>
        <div className="flex items-center justify-center mt-3">
          <button className="border border-gray-300 text-xl px-8 py-2 mx-2">선택 상품 주문</button>
          <button className="border border-gray-300 text-xl px-8 py-2 mx-2">쇼핑 계속하기</button>
          <button className="border border-gray-300 text-xl px-8 py-2 mx-2 bg-black text-white">
            전체 상품 주문</button>
        </div>
      </div>
    </div>

  )
}