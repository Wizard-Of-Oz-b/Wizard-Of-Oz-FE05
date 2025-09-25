import { useMemo, useState } from "react";
import CartCard from "../components/features/cart/CartCard";
import CartDays from "../components/features/cart/CartDays";
import CartToolbar from "../components/features/cart/CartToolbar";
import OrderSummary from "../components/features/cart/OrderSummary";
import { productGroupCount } from "../utils/cart/productGroupCount";
import { useCart } from "../hooks/cart/useCart";
import CartSkeleton from "../components/skeletons/CartSkeleton";
import CartLoadingSpin from "../components/features/cart/CartLoadingSpin";
import { useCreatePurchase } from "../hooks/cart/useOrder";
import { useNavigate } from "react-router-dom";

export default function UserCart() {

  const { data: cart, isLoading, isError, error } = useCart();
  const purchaseMutation = useCreatePurchase();
  const nagivate = useNavigate()
  console.log(cart , '카트')
  const cartList = useMemo(() => {
    if (!cart?.items) {
      return [];
    }

    return productGroupCount(cart.items).sort(
      (a, b) =>
        a.product.localeCompare(b.id) ||
        a.option_key.localeCompare(b.option_key)
    );
  }, [cart]);

  const handlePurchaseClick = () => {
    console.log("결제하기 버튼 클릭! API 요청을 보냅니다.");
    purchaseMutation.mutate();
  };
  const OnClickShopping = () =>{
    nagivate(`/`)
  }

  if (isLoading) {
    return <CartSkeleton />;
  }

  return (
    <div className="flex w-full  justify-center">
      <div className="flex flex-col w-full items-center justify-center border-x-gray-600 mt-30 pb-20">
        <p className="text-4xl mb-3">장바구니</p>
        <div>
          <CartToolbar
          />
        </div>
        <div className="flex flex-col mt-3">
          <div className="flex flex-col mr-4">
            {/* 나중에 상품 없음 컴포넌트 추가 할것 중요! */}
            {/* {cartList.length === 0 ? "상품없음" : null}
            {cartList.map((el) => (
              <CartCard
                key={el.id}
                data={el}
              />
            ))} */}
            {
              cart?.items.lengnth === 0 ? "상품없음" : null
            }
            {cart.items.map(el => (
              <CartCard
              key={el.id}
              data={el} 
              />
            ))}
          </div>

          <div className="flex w-full justify-end mt-2">
            {/* <button className="border border-gray-300 px-5 py-1">선택상품 삭제</button> */}
            <button className="border border-gray-300 px-5 py-1">장바구니 비우기</button>
          </div>
          <span className="text-sm mt-1">
            ※ {(50000).toLocaleString()}원 이상 구매시 배송비 무료{" "}
          </span>
          <OrderSummary sumPrice={cart.items_total} />
          <CartDays />
        </div>
        <div className="flex items-center justify-center mt-3">
          {/* <button className="border border-gray-300 text-xl px-8 py-2 mx-2">선택 상품 주문</button> */}
          <button className="border border-gray-300 text-xl px-8 py-2 mx-2"
            onClick={OnClickShopping}>
            쇼핑 계속하기
          </button>

          <button className="border border-gray-300 text-xl px-8 py-2 mx-2 bg-black text-white"
            onClick={handlePurchaseClick}
            disabled={purchaseMutation.isPending}
          >
            전체 상품 주문
          </button>
        </div>
      </div>
    </div>
  );

}
