import { useState } from "react";
import VirtualAccountEx from "../components/features/payment/VirtualAccountEx";
import TossEx from "../components/features/payment/TossEX";
import AddressModal from "../components/features/payment/AddressModal";

const SECTION_STYLE = 'w-full border border-gray-200 rounded-2xl px-4 py-5 shadow-sm mb-2';
const SECTION_TITLE_STYLE = "text-xl font-bold";

export default function UserPayment() {
  // 주문자, 배송지 선택시 사용자 기본 정보 가져와야한다. /api/v1/users/me
  // 배송지 설정시, 주소 API 가져오기
  // 상품 정보가져오기 (장바구니 가져오면됨)
  // 최종 결제 금액 계산(이거 여기서 하는거 맞나)
  // 결제 수단
  // 약관 동의
  // 결제 버튼

  // 설명란 활성화
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payment, setPayment] = useState('')
  const [isDefaultAddress, setIsDefaultAddress] = useState(true)
  const [address, setAddress] = useState('')
  const [zoneCode, setZoneCode] = useState('')

  const handlePaymentBtn = (payment) =>{
    console.log(payment)
    setPayment(payment)
  }
  const handleModalOpen = () =>{
    setIsModalOpen(true)
  }
  const handleModalClose = () =>{
    setIsModalOpen(false)
  }
  const handleCompleteAddress = (addressData) =>{
    setAddress(addressData.address)
    setZoneCode(addressData.zoneCode)
    setIsDefaultAddress(false)
    setIsModalOpen(false);
    // detailAddressRef.current?.focus(); 이후에 상세 주소에 포커싱
  }
  const handleDefaultAddress = (data) =>{
    setAddress('기본 배송지')
    setZoneCode('기본 우편번호')
    setIsDefaultAddress(true)

  }

  return(
    <div className="mt-30 flex w-full items-center justify-center">
      <form className="w-2/4 flex flex-col justify-center items-center">
        <section className={SECTION_STYLE}>
          <div className="flex justify-between">
            <h2 className={SECTION_TITLE_STYLE}>배송지</h2>
            <button 
            type="button"
            onClick={handleModalOpen}
            className="border border-gray-400 rounded-lg px-1">배송지 변경</button>
          </div>
          <div  className="flex flex-col mt-3">
            <span className={`text-sm text-gray-500 text-center border rounded-sm border-gray-300 px-0.5 w-[75px]
              ${isDefaultAddress && 'bg-black text-white'}
              cursor-pointer select-none`}
              onClick={handleDefaultAddress}
              >
              기본 배송지
            </span>
            <span className="font-semibold">홍길동</span>
            <div className="flex flex-col">
              <span>{address}</span>
              <span>{zoneCode}</span>
              <input type="text" placeholder="상세 주소 입력"/>
            </div>
            {/* <span>ㅇㅇㅇ도 ㅇㅇ시 ㅇㅇ구 ㅇㅇ로 00빌라 000호 (000)</span> */}
            <span>전화번호: 000-0000-0000</span>
          </div>
        </section>
        {isModalOpen && <AddressModal onClose={handleModalClose} onSearch={handleCompleteAddress} />}

        <section className={SECTION_STYLE}>
          <h2 className={SECTION_TITLE_STYLE}>주문 상품</h2>
          <div className="flex mt-2">
            <img src={`https://picsum.photos/id/1/50/70`} 
            className="w-[70px] h-[90px]"/>
            <div className="flex flex-col ml-3">
              <span>[데일리지] 트윌 코튼 와이드 팬츠_SPTCF49G01</span>
              <span className="text-gray-500">[옵션] 색상:BEIGE/사이즈:XL</span>
              <span className="mt-3">{(30000).toLocaleString()}원</span>
            </div>
          </div>
          <div className="flex mt-2">
            <img src={`https://picsum.photos/id/2/50/70`} 
            className="w-[70px] h-[90px]"/>
            <div className="flex flex-col ml-3">
              <span>[데일리지] 트윌 코튼 와이드 팬츠_SPTCF49G01</span>
              <span className="text-gray-500">[옵션] 색상:BEIGE/사이즈:XL</span>
              <span className="mt-3">{(30000).toLocaleString()}원</span>
            </div>
          </div>
        </section>

        <section className={SECTION_STYLE}>
          <h2 className={SECTION_TITLE_STYLE}>총 주문 금액</h2>
          <div>
            60,000원
          </div>
        </section>

        <section className={SECTION_STYLE}>
          <h2 className={SECTION_TITLE_STYLE}>결제 수단</h2>
          <div className="mt-2">
            <button 
              type="button"
              value='account'
              className={`border border-gray-400 rounded-md px-2 mr-2 transition delay-75 ${payment === 'account' && ('bg-black text-white')}`}
              onClick={(e)=> handlePaymentBtn(e.target.value)}
            >무통장 입금</button>

            <button 
              type="button"
              value='toss'
              className={`border border-gray-400 rounded-md px-2 mr-2 transition delay-75 ${payment === 'toss' && ('bg-black text-white')}`}
              onClick={(e)=> handlePaymentBtn(e.target.value)}
            >토스 페이</button>
          </div>
            {/* 무통장 입금 설명*/}
            <div className={`${payment!=='account' && 'hidden'}`}>
              <VirtualAccountEx />
            </div>

            {/* 토스 페이 설명 */}
            <div className={`${payment!=='toss' && 'hidden'}`}>
              <TossEx />
            </div>

        </section>

        <section className={SECTION_STYLE}>
          <h2 className={SECTION_TITLE_STYLE}>약관</h2>
          <div>
            <span>[필수] 개인정보 수집 및 이용 동의</span>
            <input type="checkbox" name="" id="" className="ml-2" />
          </div>
        </section>

        <button type="submit" 
        className="w-100 border rounded-sm bg-black text-white py-1">
          60,000원 결제하기
        </button>
      </form>
    </div>
  )
}