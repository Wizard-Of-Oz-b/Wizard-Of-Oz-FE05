import { useGetMyAllOrders } from "../../../../hooks/payments/useOrderPayment";
import OrderEmpty from "../../../features/mypage-order/OrderEmpty";
import OrderCard from "../../../features/mypage-order/OrderCard";
import ProductPagination from "../../product/ProductPagination";
import { useSearchParams } from "react-router-dom";

export default function OrderList() {
  // orderId 가져오기 => userOrderList
  // orderId 별로 상품가져오기  => 이거 카드에서 직접 조회
  // orderId로 배송 조회 이건 카드에서 직접 조회 하기
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = 5;
  //
  const {
    data: userOrderList,
    isLoading: orderLoading,
    isError: orderIsError,
    error: orderError,
  } = useGetMyAllOrders({ page: currentPage, size: pageSize });

  const totalPage = userOrderList?.count / pageSize || 0;
  const handleChangePage = (newPage) => {
    setSearchParams({ page: newPage });
    console.log(newPage, "xptmx");
  };
  console.log(userOrderList, "리스트");
  if (orderLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        주문 내역을 불러오는 중입니다...
      </div>
    );
  }
  if (orderIsError) {
    return (
      <div>
        에러 발생
        {orderError}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 표시할 데이터가 없으면 빈화면 안내 출력*/}
      {userOrderList?.results.length === 0 ? (
        <OrderEmpty />
      ) : (
        <div>
          <div className="flex flex-col gap-2 justify-center items-center mb-2">
            <div className="flex flex-col w-full justify-center mb-3">
              <h2 className="text-xl font-extrabold">주문 내역 조회</h2>
              <p className="mt-1 text-sm text-neutral-600">
                최근 주문 내역을 확인해보세요.
              </p>
            </div>

            {userOrderList.results.map((el) => (
              <OrderCard key={el.purchase_id} order={el} />
            ))}
          </div>
          <ProductPagination
            currentPage={currentPage}
            totalPage={Math.ceil(totalPage)}
            onPageChange={handleChangePage}
          />
        </div>
      )}

      {/* todo */}
      {/* userOrderList를 map을 사용해서 id는 purchase_id 오더카드로 출력 */}
      {/* 오더카드에서는 purchase_id를 넘겨 받는다. */}
      {/* 오더카드에서는 상품 요약 사진 출력 */}
      {/* 각 상품 상태값 사용 */}
      {/* pagination 추가 */}
      {/* 상품 카드 일정길이 이상이면 모달창 추가 */}
    </div>
  );
}
