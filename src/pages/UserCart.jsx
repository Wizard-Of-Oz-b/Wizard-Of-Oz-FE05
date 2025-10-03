import { useMemo } from "react";
import CartCard from "../components/features/cart/CartCard";
import CartDays from "../components/features/cart/CartDays";
import CartToolbar from "../components/features/cart/CartToolbar";
import OrderSummary from "../components/features/cart/OrderSummary";
// import { productGroupCount } from "../utils/cart/productGroupCount";
import { useCart, useClearCart } from "../hooks/cart/useCart";
import CartSkeleton from "../components/skeletons/CartSkeleton";
import CartLoadingSpin from "../components/features/cart/CartLoadingSpin";
import { useCreatePurchase } from "../hooks/cart/useOrder";
import { useNavigate } from "react-router-dom";
import CartEmpty from "../components/features/cart/CartEmpty";
import CartError from "../components/features/cart/CartError";
import { useGetMyOrders } from "../hooks/payments/useOrderPayment";

export default function UserCart() {
  const { data: cart, isLoading, isError, error, refetch } = useCart();

  // Todo 만약 장바구니가 비어있고 ready 중인 상품이 있다면?? 장바구니에서 -> 결제 페이지로 리다이렉션
  // Todo 만약 결제 중인(ready) 상품이 있는 상태에서 장바구니에 담은 상태면 장바구니 페이지에서 결제에 추가할건지 버튼으로 물어보기

  // const {
  //     data: userOrder,
  //     isLoading: orderLoading,
  //     isError: orderIsError,
  //     error: orderError,
  //   } = useGetMyOrders();

  const purchaseMutation = useCreatePurchase();
  const clearCartMutation = useClearCart();
  const nagivate = useNavigate();
  console.log(cart, "카트");
  const cartList = useMemo(() => {
    if (!cart?.items) {
      return [];
    }
    return cart.items.sort((a, b) => a.id.localeCompare(b.id));
  }, [cart]);
  console.log(cartList, "정렬");
  const handlePurchaseClick = () => {
    console.log("결제하기 버튼 클릭! API 요청을 보냅니다.");
    purchaseMutation.mutate();
  };
  const OnClickShopping = () => {
    nagivate(`/`);
  };

  const handleClearCart = () => {
    // 경고창 추후에 모달로 변경 하자..
    if (window.confirm("정말로 장바구니를 모두 비우시겠습니까?")) {
      clearCartMutation.mutate();
    }
  };

  //로딩중에는 장바구니 스켈레톤 출력
  if (isLoading) {
    return <CartSkeleton />;
  }

  // 장바구니 데이터 가져오다가 에러 발생시
  if (isError) {
    return <CartError onRetry={refetch} error={error} />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* 데스크톱  모바일 출력시 미출력*/}
      <div className="hidden lg:block">
        <table className="w-full border-collapse">
          <thead>
            <CartToolbar />
          </thead>
          <tbody>
            {cart?.item_count === 0 && <CartEmpty />}
            {cart &&
              cart.item_count > 0 &&
              cartList.map((el) => <CartCard key={el.id} data={el} />)}
            <tr>
              <td colSpan={5}>
                <div className="flex w-full justify-end mt-2">
                  {cart?.item_count >= 1 && (
                    <button
                      onClick={handleClearCart}
                      className="border border-gray-300 rounded-md px-5 py-1 cursor-pointer hover:bg-gray-100"
                    >
                      장바구니 비우기
                    </button>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td
                colSpan={5}
                className="bg-gray-200 border-y-8 border-transparent py-3"
              >
                <OrderSummary sumPrice={cart?.items_total} />
              </td>
            </tr>
            <tr>
              <td
                colSpan={5}
                className="bg-gray-200 border-y-8 border-transparent py-1"
              >
                <CartDays />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 모바일 */}
      <div className="block lg:hidden">
        {cart?.item_count === 0 && (
          <div className="text-center py-20 text-gray-500">
            장바구니에 담긴 상품이 없습니다.
          </div>
        )}
        <div className="space-y-4">
          {cart &&
            cart.item_count > 0 &&
            cartList.map((item) => (
              <CartCard key={item.id} data={item} view="card" />
            ))}
        </div>
        {cart?.item_count > 0 && (
          <div className="mt-4">
            <div className="bg-gray-200 border-y-8 border-transparent py-3">
              <OrderSummary sumPrice={cart?.items_total} />
            </div>
            <div className="bg-gray-200 border-y-8 border-transparent py-1">
              <CartDays />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center mt-6 space-y-2 sm:space-y-0 sm:space-x-4">
        <button
          className="w-full sm:w-auto border border-gray-400 text-lg px-8 py-2 rounded-md cursor-pointer hover:bg-gray-100"
          onClick={OnClickShopping}
        >
          쇼핑 계속하기
        </button>
        {cart?.item_count >= 1 && (
          <button
            className="w-full sm:w-auto border-none text-lg px-8 py-2 rounded-md bg-black text-white cursor-pointer hover:bg-gray-800 disabled:bg-gray-500"
            onClick={handlePurchaseClick}
            disabled={purchaseMutation.isPending}
          >
            전체 상품 주문
          </button>
        )}
      </div>
    </div>
  );
  // return (
  //   <div className="flex flex-col items-center">
  //     <table className="w-300">
  //       <thead>
  //         <CartToolbar />
  //       </thead>
  //       <tbody>
  //         {cart?.item_count === 0 ? <CartEmpty /> : null}
  //         {cart ? null : <CartEmpty script="잘못된 접근" />}
  //         {cartList.map((el) => (
  //           <CartCard key={el.id} data={el} />
  //         ))}
  //         <tr>
  //           <td colSpan={5}>
  //             <div className="flex w-full justify-end mt-2">
  //               {cart?.item_count >= 1 ? (
  //                 <button
  //                   onClick={handleClearCart}
  //                   className="border border-gray-300 px-5 py-1 cursor-pointer"
  //                 >
  //                   장바구니 비우기
  //                 </button>
  //               ) : (
  //                 ""
  //               )}
  //             </div>
  //           </td>
  //         </tr>
  //         <tr>
  //           <OrderSummary sumPrice={cart?.items_total} />
  //         </tr>
  //         <tr>
  //           <CartDays />
  //         </tr>
  //       </tbody>
  //     </table>

  //     <div className="flex items-center justify-center mt-3">
  //       {/* <button className="border border-gray-300 text-xl px-8 py-2 mx-2">선택 상품 주문</button> */}
  //       <button
  //         className="border border-gray-300 text-xl px-8 py-2 mx-2 cursor-pointer"
  //         onClick={OnClickShopping}
  //       >
  //         쇼핑 계속하기
  //       </button>
  //       {cart?.item_count >= 1 ? (
  //         <button
  //           className="border border-gray-300 text-xl px-8 py-2 mx-2 bg-black text-white cursor-pointer"
  //           onClick={handlePurchaseClick}
  //           disabled={purchaseMutation.isPending}
  //         >
  //           전체 상품 주문
  //         </button>
  //       ) : (
  //         ""
  //       )}
  //     </div>
  //   </div>
  // );
}
