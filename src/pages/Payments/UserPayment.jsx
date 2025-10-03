import { useEffect, useState } from "react";
import VirtualAccountEx from "../../components/features/payment/VirtualAccountEx";
import TossEx from "../../components/features/payment/TossEX";
import AddressModal from "../../components/features/payment/AddressModal";
import { useMyProfile } from "../../hooks/useUser";
import TossModal from "../../components/features/payment/TossModal";
import {
  useGetMyOrders,
  useGetPurchaseItems,
} from "../../hooks/payments/useOrderPayment";
import Ordercard from "../../components/features/payment/OrderCard";
import { filterOrders } from "../../utils/filterOrders";
import { useUpdateShippingAddress } from "../../hooks/cart/useOrder";
import CartLoadingSpin from "../../components/features/cart/CartLoadingSpin";
import EmptyPayment from "../../components/features/payment/EmptyPayment";
import PaymentSkeleton from "../../components/skeletons/PaymentSkeleton";
import { useGetMyAddresses } from "../../hooks/payments/useAddress";
import UserAddressModal from "../../components/features/payment/UserAddressModal";
import TermsModal from "../../components/features/payment/TermsModal";

const SECTION_STYLE =
  "w-full border border-gray-200 rounded-2xl px-4 py-5 shadow-sm mb-2";
const SECTION_TITLE_STYLE = "text-xl font-bold";
// const TEST_CUSTOMER_KEY = "YbX2HuSlsC9uVJW6NMRMj";

export default function UserPayment() {
  // const { data: userProfile, isLoading: userLoading } = useMyProfile();
  const {
    data: userOrder,
    isLoading: orderLoading,
    isError: orderIsError,
    error: orderError,
  } = useGetMyOrders(); // 주문서
  const purchaseId = userOrder?.results[0]?.purchase_id;
  console.log(userOrder?.results.length, "길이");
  const {
    data: items,
    isLoading: areItemsLoading,
    isError: areItemError,
    error: itemError,
  } = useGetPurchaseItems(purchaseId); // 주문 내용
  console.log(items);
  const { mutateAsync: updateAddress, isPending: isAddressUpdate } =
    useUpdateShippingAddress();

  // 주소 목록 가져오기
  const {
    data: myAddress,
    isLoading: areMyAddressLoading,
    isError: areMyAddressError,
    error: MyAddressError,
  } = useGetMyAddresses();

  console.log(userOrder, "주문");
  console.log(myAddress);
  const filterOrder = filterOrders(items?.results); //ready 상태만 가져옴
  const [testPaymentInfo, setTestPaymentInfo] = useState({
    amount: 0,
    customerKey: "",
    orderId: "",
    orderName: "",
  });

  // Todo : 현재 주소 지정 기본 주소 하나만 가져옴 => 기본 주소 리스트 가져와서 선택 할 수 있을것, 기본주소 선택해도 주소변경 전달 할것
  const [shippingAddress, setShippingAddress] = useState({
    recipient: "", //주문자
    phone: "", //번호
    postcode: "", //우편 번호
    address1: "", //기본주소면 여기만 출력
    address2: "", //상세 주소
  });
  const [addressId, setAddressId] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // 주소 검색 모달
  const [isAddressListModalOpen, setIsAddressListModalOpen] = useState(false); // 사용자 주소 리스트 모달
  const [payment, setPayment] = useState("");
  const [isDefaultAddress, setIsDefaultAddress] = useState(true);
  const [isTermsOpen, setTermsOpen] = useState(false);
  const [termsAgree, setTermsAgree] = useState(false);

  // useEffect #1: 기본 유저 데이터 세팅
  // useEffect(() => {
  //   // userProfile 데이터가 있고, 그 안에 주소 정보가 있다면
  //   if (userProfile?.address) {
  //     setShippingAddress({
  //       // postalCode: userProfile.address.postalCode || "",
  //       address1: userProfile.address || "",
  //       // address2: userProfile.address.address2 || "",
  //     });
  //   }
  //   if (userProfile?.name || userProfile?.nickname) {
  //     setShippingAddress((prev) => ({
  //       ...prev,
  //       recipient: userProfile.name || userProfile.nickname,
  //     }));
  //   }

  //   if (userProfile?.phone_number) {
  //     setShippingAddress((prev) => ({
  //       ...prev,
  //       phone: userProfile.phone_number
  //         .replace(/[^0-9]/g, "")
  //         .replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3"),
  //     }));
  //   }
  // }, [userProfile]);

  // useEffect #2: 토스 전달 정보 삽입
  useEffect(() => {
    if (userOrder && items && filterOrder.length >= 1) {
      // const totalPrice = tempTotalPrice(filterOrder); // 임시 값 추후 제거

      const totalPrice = parseInt(userOrder.results[0].items_total);

      const orderId = userOrder.results[0]?.purchase_id;

      const customerKey = filterOrder[0]?.user;
      const orderName = `${filterOrder[0].product_name} ${
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

  // useEffect #3: 사용자 기본 배송지 가져오기
  useEffect(() => {
    if (myAddress && myAddress.length > 0) {
      const defaultAddress =
        myAddress.find((addr) => addr.is_default) || myAddress[0];
      setShippingAddress(() => ({
        recipient: defaultAddress?.recipient,
        phone: defaultAddress?.phone,
        postcode: defaultAddress?.postcode,
        address1: defaultAddress?.address1,
        address2: defaultAddress?.address2,
      }));
      setAddressId(defaultAddress?.address_id);
      // 하이픈 추가,, 추후에 폼에서 입력 할때는 제거
      if (defaultAddress?.phone) {
        setShippingAddress((prev) => ({
          ...prev,
          phone: defaultAddress?.phone
            .replace(/[^0-9]/g, "")
            .replace(
              /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,
              "$1-$2-$3"
            ),
        }));
      }
    }
  }, [myAddress]);

  // 배송지 변경사항 저장
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // name이 'phone'일 경우에만 포맷팅 로직을 적용
    if (name === "phone") {
      const formattedValue = value
        .replace(/[^0-9]/g, "")
        .replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");
      setShippingAddress((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setShippingAddress((prev) => ({ ...prev, [name]: value }));
    }

    if (isDefaultAddress) {
      setIsDefaultAddress(false);
    }
  };

  // // 테스트용 구매 버튼 차후 제거
  // const handlePurchase = () => {
  //   setIsPaymentModalOpen(true);
  // };

  const handlePaymentBtn = (payment) => {
    console.log(payment);
    setPayment(payment);
  };
  // 주소 모달창
  const handleModalOpen = () => {
    // Todo: 이후에 만약에 기본 주소가 없으면 모달을 출력 하도록 하자..
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // 사용자 주소 모달 리스트 창 열고 닫기
  const handleAddressListModalOpen = () => {
    setIsAddressListModalOpen(true);
  };
  const handleAddressListModalClose = () => {
    setIsAddressListModalOpen(false);
  };

  // 주소 변경
  const handleCompleteAddress = (addressData) => {
    console.log(addressData, "주소");
    setShippingAddress((prev) => ({
      ...prev,
      postcode: addressData.zoneCode,
      address1: addressData.address,
      address2: "",
    }));
    // 기본주소 아님, 모달창 닫기, 주소 id 제거 하기,
    setAddressId(null);
    setIsDefaultAddress(false);
    setIsModalOpen(false);
    // detailAddressRef.current?.focus(); 이후에 상세 주소에 포커싱 하기
  };

  // 기본 주소 리스트 선택값 상태에 할당
  const handleSelectAddressList = (addressData) => {
    console.log(addressData, "주소");
    setShippingAddress(() => ({
      recipient: addressData?.recipient || "",
      phone: addressData?.phone || 0,
      postcode: addressData?.postcode || "",
      address1: addressData?.address1 || "",
      address2: addressData?.address2 || "",
    }));
    setAddressId(addressData?.address_id);
    // 사용자 기본주소
    setIsDefaultAddress(true);
    setIsAddressListModalOpen(false);
    // detailAddressRef.current?.focus(); 이후에 상세 주소에 포커싱 하기
  };

  // 약관 클릭
  const handleCheckboxChange = (e) => {
    //이미 동의중일때 누르면 false
    if(e.target.value){
      setTermsAgree(false)
    }else{
    console.log('작동 테스트' ,termsAgree)
      setTermsAgree(false)
      setTermsAgree(true)
    }
  }

  // 약관 모달 닫기
  const handleTermsClose = () => {
    setTermsOpen(false);
  };
  // 라벨 클릭
  const handleLabelClick = (e) => {
    e.preventDefault();
    setTermsOpen(true);

  }

  const handleSubmitPay = async (e) => {
    e.preventDefault(); // 결제중 새로고침 방지

    try {
      // 주소 추가 메소드 기본 주소면 안함
      // 기본 주소가 아니면,

      // 하이픈 제거
      setShippingAddress((prev) => ({
        ...prev,
        phone: prev?.phone.replaceAll("-", ""),
      }));
      await updateAddress({ address: shippingAddress });
      console.log("새로운 배송지로 진행");
      // 주소 추가 경고창 보내고, 바로 중단할것

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
  const isLoadingData = areMyAddressLoading || orderLoading || areItemsLoading;

  // 결제 버튼 눌렀을 때 로딩창출력
  const isPaymentProcessing = isAddressUpdate || false;

  // 주문서 에러
  const isLoadFail = orderIsError || areItemError;

  console.log(orderError, itemError, "에러 테스트");
  if (isLoadingData) {
    return <PaymentSkeleton />;
  }

  //에러 출력
  if (isLoadFail) {
    return (
      <EmptyPayment script={orderError?.message || areItemError?.message} />
    );
  }

  // 불러올 정보가 없다면 빈페이지 출력
  if (userOrder?.results.length === 0) {
    return <EmptyPayment />;
  }

  return (
    <div className="flex w-full items-center justify-center">
      {isPaymentProcessing && <CartLoadingSpin />}
      <form
        onSubmit={handleSubmitPay}
        className="w-[800px] flex flex-col justify-center items-center"
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
              새로운 배송지 검색
            </button>
          </div>
          <div className="flex flex-col mt-3">
            <button
              type="button"
              className={`text-sm text-gray-500 text-center border rounded-sm border-gray-300 px-0.5 w-[75px]
              cursor-pointer select-none`}
              onClick={handleAddressListModalOpen}
            >
              {/* 기본 배송지 */}
              배송지 선택
            </button>
            <table className="w-full table-fixed border-spacing-y-3 border-separate">
              <tbody>
                {/* 받는 분 */}
                <tr>
                  <th className="w-20 p-2 text-left font-semibold">
                    <label htmlFor="recipient">
                      받는 분 <span className="text-xs text-violet-800">※</span>
                    </label>
                  </th>
                  <td className="p-2">
                    <input
                      id="recipient"
                      className="w-full border border-gray-400 rounded-sm px-2 py-1"
                      name="recipient"
                      value={shippingAddress.recipient}
                      onChange={handleInputChange}
                      readOnly={isDefaultAddress}
                      required
                    />
                  </td>
                </tr>

                {/* 연락처 */}
                <tr>
                  <th className="w-20 p-2 text-left font-semibold">
                    <label htmlFor="phone">
                      연락처 <span className="text-xs text-violet-800">※</span>
                    </label>
                  </th>
                  <td className="p-2">
                    <input
                      name="phone"
                      id="phone"
                      className="w-full border border-gray-400 rounded-sm px-2 py-1"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      maxLength={13}
                      readOnly={isDefaultAddress}
                      required
                    />
                  </td>
                </tr>

                {/* 주소 */}
                <tr>
                  <th className="w-20 p-2 text-left font-semibold">
                    <label htmlFor="address1">
                      주소 <span className="text-xs text-violet-800">※</span>
                    </label>
                  </th>
                  <td className="p-2" colSpan={3}>
                    <input
                      id="address1"
                      name="address1"
                      className="w-full border border-gray-400 rounded-sm px-2 py-1"
                      value={shippingAddress.address1}
                      onChange={handleInputChange}
                      readOnly
                      required
                    />
                  </td>
                </tr>

                {/* 상세 주소 */}
                <tr>
                  <th className="w-20 p-2 text-left font-semibold">
                    <label htmlFor="address2" className="whitespace-nowrap">
                      상세 주소{" "}
                      <span className="text-xs text-violet-800">※</span>
                    </label>
                  </th>
                  <td className="p-2" colSpan={2}>
                    <input
                      id="address2"
                      name="address2"
                      className="w-full border border-gray-400 rounded-sm px-2 py-1"
                      value={shippingAddress.address2}
                      onChange={handleInputChange}
                      readOnly={isDefaultAddress}
                      required
                    />
                  </td>
                </tr>

                {/* 우편번호 */}
                <tr>
                  <th className="w-20 p-2 text-left font-semibold">
                    <label htmlFor="postcode" className="whitespace-nowrap">
                      우편 번호{" "}
                      <span className="text-xs text-violet-800">※</span>
                    </label>
                  </th>
                  <td className="p-2">
                    <input
                      id="postcode"
                      name="postcode"
                      className="w-full border border-gray-400 rounded-sm px-2 py-1"
                      value={shippingAddress.postcode}
                      onChange={handleInputChange}
                      readOnly
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        {/* 새로운 배송지 검색 */}
        {isModalOpen && (
          <AddressModal
            onClose={handleModalClose}
            onSearch={handleCompleteAddress}
          />
        )}

        {/* 주문자 배송지 목록 출력 */}
        {isAddressListModalOpen && (
          <UserAddressModal
            isOpen={isAddressListModalOpen}
            addressList={myAddress}
            checkAddress={handleSelectAddressList}
            onClose={handleAddressListModalClose}
            currentAddressId={addressId}
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
            <label htmlFor="agree-chk" onClick={handleLabelClick} className="select-none cursor-pointer">
              [필수] 개인정보 수집 및 이용 동의
            </label>
            <input
              type="checkbox"
              id="agree-chk"
              onChange={handleCheckboxChange}
              checked={termsAgree}
              className="ml-2"
              required
            />
          </div>
        </section>
        
        {/* 결제 버튼 == 결제폼 submit 버튼 */}
        <button
          type="submit" //실 적용시
          // type="button" //테스트
          className="w-100 border rounded-sm bg-black text-white py-1 cursor-pointer transition delay-75 hover:text-black hover:bg-white"
          // onClick={handlePurchase}
          disabled={isPaymentProcessing} // 결제 진행중에는 두번 요청 X
        >
          {testPaymentInfo.amount.toLocaleString()}원 결제
        </button>
      </form>
    {isTermsOpen && <TermsModal onClose={handleTermsClose} isAgree={termsAgree} setAgree={setTermsAgree} />}

      <TossModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        paymentData={testPaymentInfo}
      />
    </div>
  );
}
