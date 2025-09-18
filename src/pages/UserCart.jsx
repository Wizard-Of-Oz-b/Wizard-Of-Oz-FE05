import { useState } from "react";
import CartCard from "../components/features/cart/CartCard";
import CartDays from "../components/features/cart/CartDays";
import CartToolbar from "../components/features/cart/CartToolbar";
import OrderSummary from "../components/features/cart/OrderSummary";
import { productGroupCount } from "../utils/cart/productGroupCount";
import { useCart, usePatchCart } from "../hooks/cart/useCart";

export default function UserCart(){
  
  //accessToken 추가필요(API 설정 할때 설정해주셔야 합니다.

  //items 배열의 예시이다. 동일한건을 여러번 카트에 추가하면 동일한 요소를가진 객체가 그 갯수만큼 증가함
  const data = [
    {id: 1, product: 1, product_name: '[내추럴코튼] 멀티 스트라이프 긴팔티_SPLSF49C01' 
      ,options: 'NAVY/XL', unit_price: 333},
    {id: 1, product: 1 , product_name: '[내추럴코튼] 멀티 스트라이프 긴팔티_SPLSF49C01' 
      ,options: 'NAVY/XL', unit_price: 333},
    {id: 1, product: 3 , product_name: '[내추럴코튼] 멀티 스트라이프 긴팔티_SPLSF49C01' 
      ,options: 'NAVY/XL', unit_price: 777},
    {id: 1, product: 4 , product_name: '[내추럴코튼] 멀티 스트라이프 긴팔티_SPLSF49C01' 
      ,options: 'NAVY/XL', unit_price: 777}
  ];

  const cartGroup = productGroupCount(data);
  console.log(cartGroup)

  // const [cartGroup, setCartGroup] = useState([])
  // 카드 체크 예시
  const [cardChecked, setCardChecked] = useState([]);
  // console.log(cardChecked.length)

  // setCartGroup(productGroupCount(data))

  const handleSingleCheck = (checked, id) =>{
    if(checked){
      setCardChecked(prev => [...prev, id])
    }else{
      setCardChecked(cardChecked.filter((el) => el !== id))
    }
  }

  const handleAllCheck = (checked) => {
    if(checked){
      const productArray = [];
      cartGroup.forEach((el) => productArray.push(el.product));
      setCardChecked(productArray)
    }else{
      setCardChecked([])
    }
  }

  const handleStepper = () =>{

  }
  const { data: cart, isLoading, isError, error } = useCart();
  const updateCartQuantity = usePatchCart()

  console.log(cart)

  const onClickPatch = (itemId,newQuantity) =>{
    console.log(updateCartQuantity)
    updateCartQuantity.mutate({id: itemId,
      updatedData:{ quantity: newQuantity } })
  }

  return(

    <div className="flex w-full  justify-center">
      <div className="flex flex-col w-full items-center justify-center border-x-gray-600 mt-30 pb-20">
          <p className="text-4xl mb-3">장바구니</p>
        <div>
          {/* 테스트 버튼 */}
          <button onClick={() => onClickPatch(1,3)}>테스트 버튼</button>
          <CartToolbar 
          checkItemLength={cardChecked.length}
          dataLength ={cartGroup.length}
          onChangeCheckbox ={handleAllCheck}
          />

        </div>
        <div className="flex flex-col mt-3">
          <div className="flex flex-col mr-4">
            {/* 나중에 상품 없음 컴포넌트 추가 할것 */}
            {cartGroup.length === 0 ? '상품없음': null}
            {cartGroup.map(el =>
              <CartCard
              key={el.product} 
              data={el}
              checkItems={cardChecked}
              onChangeSelect={handleSingleCheck}
              />
            )}
          </div>
          

          <div className="flex justify-between mt-2">
            <button className="border border-gray-300 px-5 py-1">선택상품 삭제</button>
            <button className="border border-gray-300 px-5 py-1">장바구니 비우기</button>
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