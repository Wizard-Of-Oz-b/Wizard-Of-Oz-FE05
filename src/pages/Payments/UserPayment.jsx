import { useEffect, useState } from "react";
import VirtualAccountEx from "../../components/features/payment/VirtualAccountEx";
import TossEx from "../../components/features/payment/TossEX";
import AddressModal from "../../components/features/payment/AddressModal";
import { useMyProfile } from "../../hooks/useUser";
import TossModal from "../../components/features/payment/TossModal";
import { useGetMyOrders, useGetPurchaseItems } from "../../hooks/payments/useOrderPayment";
import Ordercard from "../../components/features/payment/OrderCard";
import { filterOrders } from "../../utils/filterOrders";
import tempTotalPrice from "../../utils/tempTotalPrice";
import { useUpdateShippingAddress } from "../../hooks/cart/useOrder";
import CartLoadingSpin from "../../components/features/cart/CartLoadingSpin";

const SECTION_STYLE =
  "w-full border border-gray-200 rounded-2xl px-4 py-5 shadow-sm mb-2";
const SECTION_TITLE_STYLE = "text-xl font-bold";
const TEST_CUSTOMER_KEY = "YbX2HuSlsC9uVJW6NMRMj";

export default function UserPayment() {
  const { data: userProfile, isLoading: userLoading } = useMyProfile();
  const {
    data: userOrder,
    isLoading: orderLoading,
    isError: orderIsError,
    error,
    isFetching,
  } = useGetMyOrders(); // 주문서
  const purchaseId = userOrder?.results[0].purchase_id
  const {
    data: items,
    isLoading: areItemsLoading,
    isError: areItemError,
  } = useGetPurchaseItems(purchaseId);  // 주문 내용
  console.log(items)
  const { mutateAsync: updateAddress, isPending: isAddressUpdate } =
    useUpdateShippingAddress();

  console.log(userOrder, "주문");
  console.log(userProfile);
  const filterOrder = filterOrders(items?.results); //ready 상태만 가져옴
  const [testPaymentInfo, setTestPaymentInfo] = useState({
    amount: 0,
    customerKey: TEST_CUSTOMER_KEY,
    orderId: "",
    orderName: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    recipient: "", //주문자
    phone: "", //번호
    postCode: "", //우편 번호
    address1: "", //기본주소면 여기만 출력
    address2: "", //상세 주소
  });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payment, setPayment] = useState("");
  const [isDefaultAddress, setIsDefaultAddress] = useState(true);

  // 기본 유저 데이터 세팅
  useEffect(() => {
    // userProfile 데이터가 있고, 그 안에 주소 정보가 있다면
    if (userProfile?.address) {
      setShippingAddress({
        // postalCode: userProfile.address.postalCode || "",
        address1: userProfile.address || "",
        // address2: userProfile.address.address2 || "",
      });
    }
    if (userProfile?.name || userProfile?.nickname) {
      setShippingAddress((prev) => ({
        ...prev,
        recipient: userProfile.name || userProfile.nickname,
      }));
    }

    if (userProfile?.phone_number) {
      setShippingAddress((prev) => ({
        ...prev,
        phone: userProfile.phone_number,
      }));
    }
  }, [userProfile]);
  // 토스 전달 정보 삽입
  useEffect(() => {
    if (userOrder && items && filterOrder.length >= 1) {
      // const totalPrice = tempTotalPrice(filterOrder); // 임시 값 추후 제거

      const totalPrice = parseInt(userOrder.results[0].items_total);

      const orderId = userOrder.results[0]?.purchase_id;

      const customerKey = filterOrder[0]?.user;
      const orderName = `${filterOrder[1].product_name} ${
        filterOrder.length >= 2 && "외 " + (filterOrder.length - 1) + "건"
      }`;
      console.log(orderName);
      setTestPaymentInfo((prev) => ({
        ...prev,
        amount: totalPrice,
        orderId: orderId,
        customerKey: customerKey,
        orderName: orderName,
      }));
    }
  }, [items]);

  // 배송지 변경사항 저장
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
    if (isDefaultAddress) {
      setIsDefaultAddress(false);
    }
  };

  // 테스트용 구매 버튼 차후 제거
  const handlePurchase = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentBtn = (payment) => {
    console.log(payment);
    setPayment(payment);
  };
  // 주소 모달창
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  // 주소 변경
  const handleCompleteAddress = (addressData) => {
    console.log(addressData, "주소");
    setShippingAddress((prev) => ({
      ...prev,
      postCode: addressData.zoneCode,
      address1: addressData.address,
    }));
    // 기본주소 아님, 모달창 닫기
    setIsDefaultAddress(false);
    setIsModalOpen(false);
    // detailAddressRef.current?.focus(); 이후에 상세 주소에 포커싱 하기
  };

  // '원본' 데이터인 userProfile에서 값을 가져와 '현재' 상태를 덮어씁니다.
  // IsDefaultAddress를 true로 변경 한다.
  const handleResetToDefault = () => {
    if (userProfile?.address) {
      setShippingAddress((prev) => ({
        ...prev,
        recipient: userProfile.recipient || userProfile.nickname || "",
        phone: userProfile.phone_number || "",
        postCode: "",
        address1: userProfile.address || "",
        address2: "",
      }));
      setIsDefaultAddress(true);
    }
  };

  const handleSubmitPay = async (e) => {
    e.preventDefault(); // 결제중 새로고침 방지

    try {
      // 주소 추가 메소드 기본 주소면 안함
      // 기본 주소가 아니면,
      if (!isDefaultAddress) {
        // 주소추가
        await updateAddress({ address: shippingAddress });
        console.log("새로운 배송지로 진행");
        // 주소 추가 경고창 보내고, 바로 중단할것
      }

      // 현재 어떤 결제 방식 선택하는지 Toss선택하면 Toss 모달 화면 출력....
      if (payment === "toss") {
        setIsPaymentModalOpen(true);
      } else if (payment === "account") {
        console.log("무통장 입금"); // 현재 구현이 안되어 있어서 임시로 체크
      }
    } catch (error) {
      console.error(error, "결제 시도중 에러"); //나중에 모달 창으로 변경 할것
    }
  };
  console.log(shippingAddress);

  // 초기 기본값 로딩시 스켈레톤 출력
  const isLoadingData = userLoading || orderLoading;

  // 결제 버튼 눌렀을 때 로딩창출력
  const isPaymentProcessing = isAddressUpdate || false;

  return (
    <div className="flex w-full items-center justify-center">
      {isPaymentProcessing && <CartLoadingSpin />}
      <form
        onSubmit={handleSubmitPay}
        className="w-2/4 flex flex-col justify-center items-center"
      >
        {/* 배송지 섹션 */}
        <section className={SECTION_STYLE}>
          <div className="flex justify-between">
            <h2 className={SECTION_TITLE_STYLE}>배송지</h2>
            <button
              type="button"
              onClick={handleModalOpen}
              className="border border-gray-400 rounded-lg px-1"
            >
              배송지 검색
            </button>
          </div>
          <div className="flex flex-col mt-3">
            <span
              className={`text-sm text-gray-500 text-center border rounded-sm border-gray-300 px-0.5 w-[75px]
              ${isDefaultAddress && "bg-black text-white"}
              cursor-pointer select-none`}
              onClick={handleResetToDefault}
            >
              기본 배송지
            </span>
            <div className="flex mt-5">
              <label className="w-20">받는 분</label>
              <input
                className="w-full border border-gray-400 rounded-sm px-2 py-1"
                name="recipient"
                value={shippingAddress.recipient}
                onChange={handleInputChange}
                readOnly
                required
              />
            </div>

            <div className="flex mt-3">
              <label htmlFor="phone" className="w-20">
                연락처
              </label>
              <input
                name="phone"
                className="w-full border border-gray-400 rounded-sm px-2 py-1"
                value={shippingAddress.phone}
                onChange={handleInputChange}
                readOnly
                required
              />
            </div>

            <div className="flex mt-3">
              <label className="w-20">주소</label>
              <input
                name="address1"
                className="w-full border border-gray-400 rounded-sm px-2 py-1"
                value={shippingAddress.address1}
                onChange={handleInputChange}
                readOnly
                required
              />
            </div>
            {/* 기본 주소에서는 상세 주소, 우편번호를 출력하지 않는다. */}
            {!isDefaultAddress && (
              <>
                <div className="flex mt-3">
                  <label className="w-20">상세 주소</label>
                  <input
                    name="address2"
                    className="w-full border border-gray-400 rounded-sm px-2 py-1"
                    value={shippingAddress.address2}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex mt-3">
                  <label className="w-20">우편번호</label>
                  <input
                    name="postCode"
                    className="w-full border border-gray-400 rounded-sm px-2 py-1"
                    value={shippingAddress.postCode}
                    onChange={handleInputChange}
                    readOnly
                    required
                  />
                </div>
              </>
            )}
          </div>
        </section>
        {isModalOpen && (
          <AddressModal
            onClose={handleModalClose}
            onSearch={handleCompleteAddress}
          />
        )}

        {/* 주문 상품 섹션 */}
        <section className={SECTION_STYLE}>
          <h2 className={SECTION_TITLE_STYLE}>주문 상품</h2>
          {filterOrder.map((el) => (
            <Ordercard key={el.item_id} data={el} />
          ))}
        </section>

        {/* 총 주문 금액 섹션 */}
        <section className={SECTION_STYLE}>
          <h2 className={SECTION_TITLE_STYLE}>총 주문 금액</h2>
          <div>{testPaymentInfo.amount.toLocaleString()}원</div>
        </section>

        {/* 결제 수단 섹션 */}
        <section className={SECTION_STYLE}>
          <h2 className={SECTION_TITLE_STYLE}>결제 수단</h2>
          <div className="mt-2">
            <button
              type="button"
              value="account"
              className={`border border-gray-400 rounded-md px-2 mr-2 transition delay-75 ${
                payment === "account" && "bg-black text-white"
              }`}
              onClick={(e) => handlePaymentBtn(e.target.value)}
            >
              무통장 입금
            </button>

            <button
              type="button"
              value="toss"
              className={`border border-gray-400 rounded-md px-2 mr-2 transition delay-75 ${
                payment === "toss" && "bg-black text-white"
              }`}
              onClick={(e) => handlePaymentBtn(e.target.value)}
            >
              토스 페이
            </button>
          </div>
          {/* 무통장 입금 설명*/}
          <div className={`${payment !== "account" && "hidden"}`}>
            <VirtualAccountEx />
          </div>

          {/* 토스 페이 설명 */}
          <div className={`${payment !== "toss" && "hidden"}`}>
            <TossEx />
          </div>
        </section>

        {/* 개인 정보 수집 동의서 섹션 */}
        <section className={SECTION_STYLE}>
          <h2 className={SECTION_TITLE_STYLE}>약관</h2>
          <div>
            <span>[필수] 개인정보 수집 및 이용 동의</span>
            <input type="checkbox" name="" id="" className="ml-2" required />
          </div>
        </section>

        {/* 결제 버튼 == 결제폼 submit 버튼 */}
        <button
          type="submit" //실 적용시
          // type="button" //테스트
          className="w-100 border rounded-sm bg-black text-white py-1"
          // onClick={handlePurchase}
          disabled={isPaymentProcessing} // 결제 진행중에는 두번 요청 X
        >
          {testPaymentInfo.amount.toLocaleString()}원 결제
        </button>
      </form>
      <TossModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        paymentData={testPaymentInfo}
      />
    </div>
  );
}
