import { useEffect, useState } from "react";
import VirtualAccountEx from "../../components/features/payment/VirtualAccountEx";
import TossEx from "../../components/features/payment/TossEX";
import AddressModal from "../../components/features/payment/AddressModal";
import { useMyProfile } from "../../hooks/useUser";
import TossModal from "../../components/features/payment/TossModal";
import { useGetMyOrders } from "../../hooks/payments/useOrderPayment";
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
    isError,
    error,
    isFetching,
  } = useGetMyOrders(1, 50); //임시
  const {mutateAsync: updateAddress, isPending: isAddressUpdate} = useUpdateShippingAddress();


  console.log(userOrder, "주문");
  console.log(userProfile);
  const filterOrder = filterOrders(userOrder?.results, "ready"); //ready 상태만 가져옴
  const [testPaymentInfo, setTestPaymentInfo] = useState({
    method: "CARD",
    amount: 0,
    customerKey: TEST_CUSTOMER_KEY,
    orderId: `order_${new Date().getTime()}`,
    orderName: "베이직 티셔츠 외 1건",
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

  useEffect(() => {
    if (userOrder) {
      const totalPrice = tempTotalPrice(filterOrder); // 임시 값 추후 제거
      setTestPaymentInfo((prev) => ({ ...prev, amount: totalPrice }));
    }
  }, []);

  // 배송지 변경사항 저장
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
    if (isDefaultAddress) {
      setIsDefaultAddress(false);
    }
  };

  const handlePurchase = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentBtn = (payment) => {
    console.log(payment);
    setPayment(payment);
  };
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleCompleteAddress = (addressData) => {
    setShippingAddress(prev =>({
      ...prev,
      postCode: addressData.zonecode,
      address1: addressData.address,
    })
  );
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
        await updateAddress({ shippingAddress });
        console.log("새로운 배송지로 진행");
        // 주소 추가 경고창 보내고, 바로 중단할것
      }
      // 현재 어떤 결제 방식 선택하는지 Toss선택하면 Toss 모달 화면 출력....
      setIsPaymentModalOpen(true);
    } catch (error) {
      console.error(error, '결제 시도중 에러')    //나중에 모달 창으로 변경 할것
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
        // onSubmit={handleSubmitPay} 
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
            <div>
              <label>받는 분</label>
              <input
                className="font-semibold"
                name="recipient"
                value={shippingAddress.recipient}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="phone">연락처</label>
              <input
                name="phone"
                value={shippingAddress.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label>주소</label>
              <input
                name="address1"
                value={shippingAddress.address1}
                onChange={handleInputChange}
                required
              />
            </div>
            {/* 기본 주소에서는 상세 주소, 우편번호를 출력하지 않는다. */}
            {!isDefaultAddress && (
              <>
                <div>
                  <label>상세 주소</label>
                  <input
                    name="address2"
                    value={shippingAddress.address2}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>우편번호</label>
                  <input
                    name="postCode"
                    value={shippingAddress.postCode}
                    onChange={handleInputChange}
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
            <Ordercard key={el.product} data={el} />
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
          // type="submit" //실 적용시
          type="button" //테스트
          className="w-100 border rounded-sm bg-black text-white py-1"
          onClick={handlePurchase}
          disabled={isPaymentProcessing}  // 결제 진행중에는 두번 요청 X
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
