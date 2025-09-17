import CartCard from "../components/features/cart/CartCard";
import OrderSummary from "../components/features/cart/OrderSummary";

export default function UserCart(){
  
  //accessToken 추가필요(API 설정 할때 설정해주셔야 합니다.

  return(
  <div className="flex flex-col items-center justify-center mt-30 ">
      <p className="text-4xl">장바구니</p>
    <div className="flex mt-3">
      <div className="flex flex-col mr-4">
        <CartCard />
        <CartCard />
      </div>
      <OrderSummary />
      
    </div>
  </div>
  )
}