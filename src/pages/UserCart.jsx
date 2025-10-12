import { useEffect, useMemo, useState } from "react";
import CartCard from "../components/features/cart/CartCard";
import CartDays from "../components/features/cart/CartDays";
import CartToolbar from "../components/features/cart/CartToolbar";
import OrderSummary from "../components/features/cart/OrderSummary";
// import { productGroupCount } from "../utils/cart/productGroupCount";
import { useCart, useClearCart } from "../hooks/cart/useCart";
import CartSkeleton from "../components/skeletons/CartSkeleton";
import CartLoadingSpin from "../components/features/cart/CartLoadingSpin";
import { useCreatePurchase, useMergeOrder } from "../hooks/cart/useOrder";
import { useNavigate } from "react-router-dom";
import CartEmpty from "../components/features/cart/CartEmpty";
import CartError from "../components/features/cart/CartError";
import { useGetMyOrders } from "../hooks/payments/useOrderPayment";
import ConfirmModal from "../components/common/ConfirmModal";
import { useAlertModal } from "../components/common/layouts/common/modal/useAlertModal";
import { parseStockError } from "../utils/cart/parseStockError";
import formatOptionKey from "../utils/optionKey";

export default function UserCart() {
  const {
    data: cart,
    isLoading: isCartLoading,
    isError: isCartError,
    error,
    refetch,
  } = useCart();

  const {
    data: userOrder,
    isLoading: orderLoading,
    isError: orderIsError,
    error: orderError,
  } = useGetMyOrders();

  const purchaseMutation = useCreatePurchase();
  const mergeMutation = useMergeOrder();
  const clearCartMutation = useClearCart();
  const navigate = useNavigate();
  const { showModal, ModalComponent } = useAlertModal();

  console.log(cart, "카트");
  const cartList = useMemo(() => {
    if (!cart?.items) {
      return [];
    }
    return cart.items.sort((a, b) => a.id.localeCompare(b.id));
  }, [cart]);
  console.log(cartList, "정렬");
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  // const handlePurchaseClick = () => {
  //   console.log("결제하기 버튼 클릭! API 요청을 보냅니다.");
  //   purchaseMutation.mutate();
  // };

  const handlePurchaseClick = async () => {
    //전체 상품 주문
    if (userOrder?.results.length === 0) {
      try {
        await purchaseMutation.mutateAsync();
        navigate(`/payment`);
      } catch (error) {
        const parseError = parseStockError(error);
        console.log(parseError);
        if (parseError?.product) {
          const productName = cartList?.find(
            (el) =>
              el.product === parseError.product &&
              el.option_key === parseError.option
          );
          const option = formatOptionKey(parseError.option);

          showModal({
            type: "warning",
            title: "재고 부족",
            message: `${productName.product_name} ${option} 
            상품이 재고가 부족합니다.
           현재 보유: ${parseError.have}개 주문 시도: ${parseError.need}개`,
          });
        }
        console.error(
          "주문 처리 중 에러 발생:",
          parseStockError(error).product
        );
      }
    }
    // 기존 결제에 상품 추가
    else {
      try {
        const newOrder = await purchaseMutation.mutateAsync();

        const orderList = userOrder.results.map((el) => el.order_id);
        const mergePayload = { order_ids: [...orderList, newOrder.order_id] };
        console.log(mergePayload, "payload");
        await mergeMutation.mutateAsync(mergePayload);

        navigate(`/payment`);

        if (!newOrder) {
          throw new Error("주문 실패");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const OnClickShopping = () => {
    navigate(`/`);
  };

  const handleClearCart = () => {
    setIsClearAllModalOpen(true);
    // if (window.confirm("정말로 장바구니를 모두 비우시겠습니까?")) {
    //   clearCartMutation.mutate();
    // }
  };

  const handleConfrimClearCart = () => {
    clearCartMutation.mutate();
    setIsClearAllModalOpen(false);
  };

  useEffect(() => {
    if (cart && userOrder) {
      // 결제 중인 상품이 있으면 payment 로 이동한다.
      if (cart?.item_count === 0 && userOrder?.results.length >= 1) {
        navigate("/payment");
      }
    }
  }, [cart, userOrder]);

  const isLoading = isCartLoading || orderLoading;
  const isError = isCartError || orderIsError;

  //로딩중에는 장바구니 스켈레톤 출력
  if (isLoading) {
    return <CartSkeleton />;
  }

  // 장바구니 데이터 가져오다가 에러 발생시
  if (isError) {
    return <CartError onRetry={refetch} error={error + orderError} />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* 데스크톱  모바일 출력시 미출력*/}
      {isClearAllModalOpen && (
        <ConfirmModal
          isOpen={isClearAllModalOpen}
          onClose={() => setIsClearAllModalOpen(false)}
          onConfirm={handleConfrimClearCart}
          title="장바구니 비우기"
          message="정말로 장바구니를 비우시겠습니까?"
          confirmText="장바구니 비우기"
          cancelText="취소"
        />
      )}
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
        <div className="flex flex-col space-y-4">
          {cart &&
            cart.item_count > 0 &&
            cartList.map((item) => (
              <CartCard key={item.id} data={item} view="card" />
            ))}
          {cart?.item_count >= 1 && (
            <button
              onClick={handleClearCart}
              className="border border-gray-300 rounded-md px-5 py-1 cursor-pointer hover:bg-gray-100"
            >
              장바구니 비우기
            </button>
          )}
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
            {userOrder?.results.length === 0
              ? "전체 상품 주문"
              : "주문 상품에 추가"}
          </button>
        )}
      </div>
      {ModalComponent}
    </div>
  );
}
