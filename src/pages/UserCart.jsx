import { useMemo, useState } from "react";
import CartCard from "../components/features/cart/CartCard";
import CartDays from "../components/features/cart/CartDays";
import CartToolbar from "../components/features/cart/CartToolbar";
import OrderSummary from "../components/features/cart/OrderSummary";
import { productGroupCount } from "../utils/cart/productGroupCount";
import {
  useCart,
} from "../hooks/cart/useCart";
import CartSkeleton from "../components/skeletons/CartSkeleton";
import CartLoadingSpin from "../components/features/cart/CartLoadingSpin";

export default function UserCart() {
  //accessToken 추가필요(API 설정 할때 설정해주셔야 합니다.

  // 카드 체크 예시
  // const [cardChecked, setCardChecked] = useState([]);
  const { data: cart, isLoading, isError, error } = useCart();
  // const {mutate: updateCartQuantity, isPending} = usePatchCart();
  
  // 카트리스트 정렬
  // const cartList = cart ? productGroupCount(cart.items).sort((a,b)=> a.product.localeCompare(b.product)) : [];
  const cartList = useMemo(() => {
    if (!cart?.items) {
      return [];
    }

    return productGroupCount(cart.items).sort(
      (a, b) =>
        a.product.localeCompare(b.product) ||
        a.option_key.localeCompare(b.option_key)
    );
  }, [cart]);
  //총 액수 합산
  const sumPrice = useMemo(() => {
    if (!cartList) {
      return 0;
    }

    return cartList.reduce((acc, item) => {
      acc += item.unit_price * item.count;
      return acc;
    }, 0);
  }, [cartList]);
  // console.log(cartList);
  // 체크 비활
  // const handleSingleCheck = (checked, id) =>{
  //   if(checked){
  //     setCardChecked(prev => [...prev, id])
  //   }else{
  //     setCardChecked(cardChecked.filter((el) => el !== id))
  //   }
  // }

  // const handleAllCheck = (checked) => {
  //   if(checked){
  //     const productArray = [];
  //     cartList.forEach((el) => productArray.push(el.product));
  //     setCardChecked(productArray)
  //   }else{
  //     setCardChecked([])
  //   }
  // }

  // const onClickPatch = (itemId, option, newQuantity) => {
  //   console.log(updateCartQuantity);
  //   updateCartQuantity({
  //     id: itemId,
  //     updatedData: {
  //       quantity: newQuantity,
  //       option_key: option,
  //     },
  //   });
  // };

  if (isLoading) {
    return <CartSkeleton />;
  }

  return (
    <div className="flex w-full  justify-center">
      <div className="flex flex-col w-full items-center justify-center border-x-gray-600 mt-30 pb-20">
        <p className="text-4xl mb-3">장바구니</p>
        <div>
          <CartToolbar
            // checkItemLength={cardChecked.length}
            // dataLength={cartList.length}
            // onChangeCheckbox ={handleAllCheck}
          />
        </div>
        <div className="flex flex-col mt-3">
          <div className="flex flex-col mr-4">
            {/* 나중에 상품 없음 컴포넌트 추가 할것 중요! */}
            {cartList.length === 0 ? "상품없음" : null}
            {cartList.map((el) => (
              <CartCard
                key={el.product + el.option_key}
                data={el}
                // checkItems={cardChecked}
                // setItemCount={onClickPatch}
                // onChangeSelect={handleSingleCheck}
              />
            ))}
          </div>

          {/* <div className="flex w-full justify-between mt-2">
            <button className="border border-gray-300 px-5 py-1">선택상품 삭제</button>
            <button className="border border-gray-300 px-5 py-1">장바구니 비우기</button>
          </div> */}
          <span className="text-sm mt-1">
            ※ {(50000).toLocaleString()}원 이상 구매시 배송비 무료{" "}
          </span>
          <OrderSummary sumPrice={sumPrice} />
          <CartDays />
        </div>
        <div className="flex items-center justify-center mt-3">
          {/* <button className="border border-gray-300 text-xl px-8 py-2 mx-2">선택 상품 주문</button> */}
          <button className="border border-gray-300 text-xl px-8 py-2 mx-2">
            쇼핑 계속하기
          </button>
          <button className="border border-gray-300 text-xl px-8 py-2 mx-2 bg-black text-white">
            전체 상품 주문
          </button>
        </div>
      </div>
    </div>
  );

  // return(
  //   <div className="flex w-full  justify-center">
  //     <table className="mt-30">
  //       <CartToolbar
  //         checkItemLength={cardChecked.length}
  //         dataLength ={cartList.length}
  //         onChangeCheckbox ={handleAllCheck}
  //         />
  //     </table>
  //   </div>
  // )
}
